// import React from 'react';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';

// // Layout
// import AppLayout from './components/Layout/AppLayout';

// // Pages
// import HomePage from './pages/HomePage';
// import WalletPage from './pages/WalletPage';
// import CreateExpensePage from './pages/CreateExpensePage';
// import ParticipantsPage from './pages/ParticipantsPage';
// import NotFoundPage from './pages/NotFoundPage';

// // Context
// import { WalletProvider } from './context/WalletContext';

// function App() {
//   return (
//     <WalletProvider>
//       <BrowserRouter>
//         <Routes>
//           <Route path="/" element={<AppLayout />}>
//             <Route index element={<HomePage />} />
//             <Route path="wallet" element={<WalletPage />} />
//             <Route path="create-expense" element={<CreateExpensePage />} />
//             <Route path="participants" element={<ParticipantsPage />} />
//             <Route path="*" element={<NotFoundPage />} />
//           </Route>
//         </Routes>
//       </BrowserRouter>
//     </WalletProvider>
//   );
// }

// export default App;


// import { useState, useEffect } from 'react';
// import './index.css'; // If you have a CSS file for styling

// // Define types for the API responses
// interface TestResponse {
//   message: string;
// }

// interface SuiObjectResponse {
//   data?: {
//     objectId: string;
//     content?: {
//       fields?: Record<string, any>;
//     };
//   };
//   error?: string;
// }

// const App: React.FC = () => {
//   const [backendMessage, setBackendMessage] = useState<string>('');
//   const [objectData, setObjectData] = useState<SuiObjectResponse | null>(null);
//   const [objectId, setObjectId] = useState<string>(''); // Replace with your Sui object ID
//   const [error, setError] = useState<string>('');

//   // Test backend connection on component mount
//   useEffect(() => {
//     const fetchTest = async () => {
//       try {
//         const response = await fetch('/api/test'); // ✅ Updated
//         const data: TestResponse = await response.json();
//         setBackendMessage(data.message);
//       } catch (err) {
//         setError('Failed to connect to backend: ' + (err as Error).message);
//       }
//     };

//     fetchTest();
//   }, []);

//   // Function to fetch Sui object data
//   const fetchObjectData = async () => {
//     if (!objectId) {
//       setError('Please enter a valid Object ID');
//       return;
//     }

//     try {
//       setError('');
//       setObjectData(null);
//       const response = await fetch(`/api/object/${objectId}`); // ✅ Updated
//       const data: SuiObjectResponse = await response.json();
//       if (data.error) {
//         throw new Error(data.error);
//       }
//       setObjectData(data);
//     } catch (err) {
//       setError('Failed to fetch object: ' + (err as Error).message);
//     }
//   };

//   return (
//     <div className="App">
//       <h1>SuiSplit</h1>

//       {/* Display backend connection status */}
//       {backendMessage ? (
//         <p>{backendMessage}</p>
//       ) : (
//         <p>Connecting to backend...</p>
//       )}

//       {/* Input to fetch Sui object */}
//       <div>
//         <h2>Fetch Sui Object</h2>
//         <input
//           type="text"
//           placeholder="Enter Sui Object ID"
//           value={objectId}
//           onChange={(e) => setObjectId(e.target.value)}
//           style={{ padding: '5px', marginRight: '10px', width: '300px' }}
//         />
//         <button onClick={fetchObjectData} style={{ padding: '5px 10px' }}>
//           Fetch Object
//         </button>
//       </div>

//       {/* Display object data or error */}
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       {objectData && (
//         <div>
//           <h3>Object Data:</h3>
//           <pre style={{ textAlign: 'left', background: '#f0f0f0', padding: '10px' }}>
//             {JSON.stringify(objectData, null, 2)}
//           </pre>
//         </div>
//       )}
//     </div>
//   );
// };

// export default App;

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WalletKitProvider } from '@mysten/wallet-kit';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout
import AppLayout from './components/Layout/AppLayout';

// Pages
import HomePage from './pages/HomePage';
import WalletPage from './pages/WalletPage';
import CreateExpensePage from './pages/CreateExpensePage';
import ParticipantsPage from './pages/ParticipantsPage';
import NotFoundPage from './pages/NotFoundPage';

// Context
import { WalletProvider } from './context/WalletContext';

function App() {
  return (
    <WalletKitProvider>
      <WalletProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<HomePage />} />
              <Route path="wallet" element={<WalletPage />} />
              <Route path="create-expense" element={<CreateExpensePage />} />
              <Route path="participants" element={<ParticipantsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      </WalletProvider>
    </WalletKitProvider>
  );
}

export default App;