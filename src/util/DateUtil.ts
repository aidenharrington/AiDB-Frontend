/**
 * Utility functions for formatting dates in the application
 */

/**
 * Formats epoch milliseconds to YYYY-MM-DD string format
 * @param epochMillis - Epoch time in milliseconds
 * @returns Formatted date string in YYYY-MM-DD format, or "-" if invalid/null
 */
export const formatDate = (epochMillis: number | string | null | undefined): string => {
  // Handle null/undefined values
  if (epochMillis === null || epochMillis === undefined) {
    return '-';
  }

  // Convert to number if it's a string
  const numericValue = typeof epochMillis === 'string' ? Number(epochMillis) : epochMillis;
  
  // Check if it's a valid number
  if (isNaN(numericValue) || !isFinite(numericValue)) {
    return '-';
  }

  // Check if the number looks like epoch milliseconds (reasonable range)
  // Epoch milliseconds should be between 1970 and 2100 (roughly)
  const minEpoch = 0; // Jan 1, 1970
  const maxEpoch = 4102444800000; // Jan 1, 2100
  
  if (numericValue < minEpoch || numericValue > maxEpoch) {
    return '-';
  }

  try {
    const date = new Date(numericValue);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return '-';
    }

    // Format as YYYY-MM-DD using local timezone
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.warn('Failed to format date:', epochMillis, error);
    return '-';
  }
};
