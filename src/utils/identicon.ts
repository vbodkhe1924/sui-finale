// Function to generate a deterministic color from a string
const stringToColor = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Generate HSL values
  const h = Math.abs(hash % 360);  // Hue
  const s = 70 + (hash % 20);      // Saturation between 70-90%
  const l = 45 + (hash % 10);      // Lightness between 45-55%
  
  return `hsl(${h}, ${s}%, ${l}%)`;
};

// Function to get initials from a string
const getInitials = (str: string): string => {
  return str
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const generateIdenticon = (address: string): { color: string; initials: string } => {
  try {
    const color = stringToColor(address);
    const initials = getInitials(address.slice(2, 6)); // Use part of the address as "name"
    
    return { color, initials };
  } catch (error) {
    console.error('Error generating avatar:', error);
    return { color: '#22d3ee', initials: '##' };
  }
}; 