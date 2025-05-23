// import React from 'react';
// import Dashboard from '../components/Dashboard/Dashboard';

// const HomePage: React.FC = () => {
//   return (
//     <>
//       <div style={{ color: 'red', fontSize: 32, textAlign: 'center', margin: 32 }}>HOME TEST - If you see this, HomePage is rendering!</div>
//       <Dashboard />
//     </>
//   );
// };

// export default HomePage; 

import { useEffect, useState } from 'react';

interface TestResponse {
  message: string;
}

interface SuiObjectResponse {
  data?: {
    objectId: string;
    content?: {
      fields?: Record<string, any>;
    };
  };
  error?: string;
}

const HomePage: React.FC = () => {
  const [backendMessage, setBackendMessage] = useState<string>('');
  const [objectData, setObjectData] = useState<SuiObjectResponse | null>(null);
  const [objectId, setObjectId] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/test');
        const data: TestResponse = await response.json();
        setBackendMessage(data.message);
      } catch (err) {
        setError('Failed to connect to backend: ' + (err as Error).message);
      }
    };

    fetchTest();
  }, []);

  const fetchObjectData = async () => {
    if (!objectId) {
      setError('Please enter a valid Object ID');
      return;
    }

    try {
      setError('');
      setObjectData(null);
      const response = await fetch(`http://localhost:5000/api/object/${objectId}`);
      const data: SuiObjectResponse = await response.json();
      if (data.error) throw new Error(data.error);
      setObjectData(data);
    } catch (err) {
      setError('Failed to fetch object: ' + (err as Error).message);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>SuiSplit</h1>

      {backendMessage ? (
        <p>{backendMessage}</p>
      ) : (
        <p>Connecting to backend...</p>
      )}

      <div>
        <h2>Fetch Sui Object</h2>
        <input
          type="text"
          placeholder="Enter Sui Object ID"
          value={objectId}
          onChange={(e) => setObjectId(e.target.value)}
          style={{ padding: '5px', marginRight: '10px', width: '300px' }}
        />
        <button onClick={fetchObjectData} style={{ padding: '5px 10px' }}>
          Fetch Object
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {objectData && (
        <div>
          <h3>Object Data:</h3>
          <pre style={{ textAlign: 'left', background: '#f0f0f0', padding: '10px' }}>
            {JSON.stringify(objectData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default HomePage;
