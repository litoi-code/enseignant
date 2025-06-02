/**
 * Admin Code Generator for French Teacher Classroom Management System
 * Generate unique unlock codes for customers
 * © 2024 Litoi Code
 */

// Simple Node.js script to generate unique codes
class CodeGenerator {
  
  /**
   * Generate a unique unlock code
   * @param {string} customerInfo - Customer identifier (phone, name, etc.)
   * @param {number} maxDevices - Number of devices allowed (default: 1)
   * @returns {string} Unique unlock code
   */
  static generateUniqueCode(customerInfo = '', maxDevices = 1) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    const customerHash = this.hashCustomerInfo(customerInfo);
    
    // Format: PREFIX_TIMESTAMP_CUSTOMER_RANDOM
    const code = `TEACH_${timestamp}_${customerHash}_${random}`;
    
    console.log(`Generated code: ${code}`);
    console.log(`Customer: ${customerInfo}`);
    console.log(`Max devices: ${maxDevices}`);
    console.log(`Generated at: ${new Date().toLocaleString()}`);
    console.log('---');
    
    return code;
  }

  /**
   * Generate multiple codes at once
   * @param {Array} customers - Array of customer info
   * @returns {Array} Array of generated codes
   */
  static generateBulkCodes(customers) {
    const codes = [];
    
    customers.forEach((customer, index) => {
      const code = this.generateUniqueCode(customer.info || `Customer_${index + 1}`, customer.maxDevices || 1);
      codes.push({
        customer: customer.info || `Customer_${index + 1}`,
        phone: customer.phone || '',
        code: code,
        maxDevices: customer.maxDevices || 1,
        generatedAt: new Date().toISOString()
      });
    });
    
    return codes;
  }

  /**
   * Create a simple hash from customer info
   * @param {string} info - Customer information
   * @returns {string} Short hash
   */
  static hashCustomerInfo(info) {
    if (!info) return 'GEN';
    
    let hash = 0;
    for (let i = 0; i < info.length; i++) {
      const char = info.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString(36).substring(0, 3).toUpperCase();
  }

  /**
   * Generate code with specific pattern
   * @param {string} pattern - Code pattern (COFFEE, SCHOOL, TEACHER, etc.)
   * @param {string} customerInfo - Customer identifier
   * @returns {string} Formatted code
   */
  static generatePatternCode(pattern, customerInfo = '') {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const customerHash = this.hashCustomerInfo(customerInfo);
    
    return `${pattern}_${customerHash}_${timestamp}_${random}`;
  }

  /**
   * Validate code format
   * @param {string} code - Code to validate
   * @returns {boolean} Is valid format
   */
  static isValidCodeFormat(code) {
    // Check if code matches expected pattern
    const pattern = /^[A-Z]+_[A-Z0-9]+_[A-Z0-9]+_[A-Z0-9]+$/;
    return pattern.test(code) && code.length >= 15 && code.length <= 30;
  }
}

// Example usage:
console.log('=== French Teacher App - Code Generator ===\n');

// Generate single code
console.log('1. Single Code Generation:');
const singleCode = CodeGenerator.generateUniqueCode('+237674667234');

// Generate multiple codes
console.log('\n2. Bulk Code Generation:');
const customers = [
  { info: '+237674667234', phone: '+237674667234', maxDevices: 1 },
  { info: '+237698765432', phone: '+237698765432', maxDevices: 1 },
  { info: 'Lycee_Douala', phone: '+237612345678', maxDevices: 5 }
];

const bulkCodes = CodeGenerator.generateBulkCodes(customers);
console.log('Generated codes:', bulkCodes);

// Generate pattern codes
console.log('\n3. Pattern Code Generation:');
const coffeeCode = CodeGenerator.generatePatternCode('COFFEE', '+237674667234');
const schoolCode = CodeGenerator.generatePatternCode('SCHOOL', 'Lycee_Yaounde');
const teacherCode = CodeGenerator.generatePatternCode('TEACHER', 'Marie_Dupont');

console.log(`Coffee code: ${coffeeCode}`);
console.log(`School code: ${schoolCode}`);
console.log(`Teacher code: ${teacherCode}`);

// Validation
console.log('\n4. Code Validation:');
console.log(`${singleCode} is valid: ${CodeGenerator.isValidCodeFormat(singleCode)}`);
console.log(`INVALID_CODE is valid: ${CodeGenerator.isValidCodeFormat('INVALID_CODE')}`);

module.exports = CodeGenerator;
