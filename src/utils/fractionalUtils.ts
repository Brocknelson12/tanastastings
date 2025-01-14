// utils/fractionUtils.ts

/**
 * Converts a decimal to a fraction string (e.g., 1.5 -> "1 1/2")
 */
export function decimalToFraction(decimal: number): string {
    if (decimal === 0) return '0';
    if (Number.isInteger(decimal)) return decimal.toString();
  
    const wholeNumber = Math.floor(decimal);
    let decimal_part = decimal - wholeNumber;
  
    // Convert to fraction with tolerance of 0.0001
    const tolerance = 0.0001;
    const h = [0, 1];
    const k = [1, 0];
    let a = Math.floor(decimal_part);
    let b = decimal_part - a;
    let aux: number;
  
    let i = 0;
    while (i < 100 && Math.abs(decimal_part - h[1] / k[1]) > tolerance) {
      i++;
      aux = h[1];
      h[1] = h[1] * a + h[0];
      h[0] = aux;
      
      aux = k[1];
      k[1] = k[1] * a + k[0];
      k[0] = aux;
      
      if (b === 0) break;
      decimal_part = 1 / b;
      a = Math.floor(decimal_part);
      b = decimal_part - a;
    }
  
    // Simplify fraction
    const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a;
    const divisor = gcd(h[1], k[1]);
    const numerator = h[1] / divisor;
    const denominator = k[1] / divisor;
  
    if (wholeNumber === 0) {
      return `${numerator}/${denominator}`;
    }
    return `${wholeNumber} ${numerator}/${denominator}`;
  }
  
  /**
   * Converts a fraction string to decimal (e.g., "1 1/2" -> 1.5)
   */
  export function fractionToDecimal(fraction: string): number {
    if (!fraction.trim()) return 0;
    
    // Check if it's a simple number
    if (!isNaN(Number(fraction))) {
      return Number(fraction);
    }
  
    // Handle mixed numbers (e.g., "1 1/2")
    const parts = fraction.trim().split(' ');
    let wholeNumber = 0;
    let fractionPart = '';
  
    if (parts.length === 2) {
      wholeNumber = parseInt(parts[0]);
      fractionPart = parts[1];
    } else {
      fractionPart = parts[0];
    }
  
    // Convert fraction part
    if (fractionPart.includes('/')) {
      const [numerator, denominator] = fractionPart.split('/').map(Number);
      return wholeNumber + (numerator / denominator);
    }
  
    return wholeNumber;
  }
  
  /**
   * Validates if a string is a valid fraction format
   */
  export function isValidFraction(value: string): boolean {
    if (!value.trim()) return false;
    
    // Allow simple numbers
    if (!isNaN(Number(value))) return true;
  
    // Check for valid fraction format: "1/2" or "1 1/2"
    const fractionRegex = /^\d*\.?\d+$|^\d*\s?\d+\/\d+$/;
    return fractionRegex.test(value.trim());
  }
  
  /**
   * Common fractions mapping for better UX
   */
  export const commonFractions: { [key: number]: string } = {
    0.25: '1/4',
    0.33: '1/3',
    0.5: '1/2',
    0.67: '2/3',
    0.75: '3/4',
    1.25: '1 1/4',
    1.33: '1 1/3',
    1.5: '1 1/2',
    1.67: '1 2/3',
    1.75: '1 3/4',
    2.25: '2 1/4',
    2.33: '2 1/3',
    2.5: '2 1/2',
    2.67: '2 2/3',
    2.75: '2 3/4',
  };