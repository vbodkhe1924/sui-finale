/**
 * Formats a Sui amount from base units to SUI
 * @param amount - Amount in base units (1 SUI = 1,000,000,000 units)
 * @returns Formatted string with SUI amount
 */
export const formatSuiAmount = (amount: string | number): string => {
    if (!amount) return '0';
    
    const numAmount = typeof amount === 'string' ? Number(amount) : amount;
    const suiAmount = numAmount / 1_000_000_000; // Convert from base units to SUI
    
    // Format with commas and fixed decimal places
    return suiAmount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 6
    });
}; 