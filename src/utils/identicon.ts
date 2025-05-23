import { create } from 'ethereum-blockies';

export const generateIdenticon = (address: string): string | null => {
  try {
    // Create a canvas element
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    
    // Generate the identicon
    create({
      seed: address.toLowerCase(),
      size: 8,
      scale: 8,
      spotcolor: '#22d3ee',
      bgcolor: '#1f2937',
      color: '#ffffff'
    }).render(canvas);
    
    // Convert to data URL
    return canvas.toDataURL();
  } catch (error) {
    console.error('Error generating identicon:', error);
    return null;
  }
}; 