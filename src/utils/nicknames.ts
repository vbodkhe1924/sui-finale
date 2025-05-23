// Key for localStorage
const NICKNAME_STORAGE_KEY = 'participant_nicknames';

// Interface for nickname storage
interface NicknameMap {
  [address: string]: string;
}

// Get all stored nicknames
export const getNicknames = (): NicknameMap => {
  try {
    const stored = localStorage.getItem(NICKNAME_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error loading nicknames:', error);
    return {};
  }
};

// Set nickname for an address
export const setNickname = (address: string, nickname: string): void => {
  try {
    const nicknames = getNicknames();
    nicknames[address] = nickname;
    localStorage.setItem(NICKNAME_STORAGE_KEY, JSON.stringify(nicknames));
  } catch (error) {
    console.error('Error saving nickname:', error);
  }
};

// Get nickname for an address
export const getNickname = (address: string): string | null => {
  const nicknames = getNicknames();
  return nicknames[address] || null;
};

// Remove nickname for an address
export const removeNickname = (address: string): void => {
  try {
    const nicknames = getNicknames();
    delete nicknames[address];
    localStorage.setItem(NICKNAME_STORAGE_KEY, JSON.stringify(nicknames));
  } catch (error) {
    console.error('Error removing nickname:', error);
  }
}; 