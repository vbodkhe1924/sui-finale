// Utility functions for generating unique, deterministic avatars

interface AvatarConfig {
  primaryColor: string;
  secondaryColor: string;
  pattern: string;
  initials: string;
}

// Generate a deterministic HSL color from a string
const generateHSLColor = (str: string, saturation: number, lightness: number): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

// Get initials from a string or wallet address
const getInitials = (str: string): string => {
  if (str.startsWith('0x')) {
    // For wallet addresses, use first and last characters after 0x
    return str.slice(2, 4).toUpperCase();
  }
  return str
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Generate a deterministic pattern based on the wallet address
const generatePattern = (address: string): string => {
  const patterns = [
    'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
    'linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.1) 75%)',
    'repeating-linear-gradient(45deg, rgba(255,255,255,0.1) 0, rgba(255,255,255,0.1) 1px, transparent 1px, transparent 4px)',
    'radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 60%)',
  ];
  
  const patternIndex = Math.abs(
    address.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  ) % patterns.length;
  
  return patterns[patternIndex];
};

export const generateAvatar = (address: string, name?: string): AvatarConfig => {
  try {
    // Generate primary color with high saturation and medium lightness
    const primaryColor = generateHSLColor(address, 85, 45);
    
    // Generate a complementary color by shifting the hue by 180 degrees
    const hash = address.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const secondaryColor = generateHSLColor(String(hash), 75, 55);
    
    // Get initials from name if provided, otherwise from address
    const initials = getInitials(name || address);
    
    // Get pattern
    const pattern = generatePattern(address);
    
    return {
      primaryColor,
      secondaryColor,
      pattern,
      initials
    };
  } catch (error) {
    console.error('Error generating avatar:', error);
    return {
      primaryColor: 'hsl(190, 85%, 45%)',
      secondaryColor: 'hsl(210, 75%, 55%)',
      pattern: 'radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 60%)',
      initials: '##'
    };
  }
}; 