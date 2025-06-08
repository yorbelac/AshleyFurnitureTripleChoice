import React from 'react';
import './FinanceCalculator.css';

const FinanceCalculator = ({ calculatorData = {} }) => {
  // Defensive defaults for all expected properties
  const {
    furnitureA = {},
    furnitureB = {},
    mattressOnly = {},
    powerBase = {},
    foundation = {},
    fulfillmentType = 'White Glove',
    downPayment = '20',
    adjustedDownPayment = '',
    furniturePPPAdjust = 'AUTO',
    furnitureDelAdjust = 'AUTO',
    mattressPad = '',
    powerBasePPP = 'AUTO',
    foundationDel = 'AUTO',
    taxRate: passedTaxRate,
    chargeDelTax = true,
    chargePPPTax = true,
    lineItems = [],
    delivery = '',
    cashDiscount = '',
    protectionTotal: passedProtectionTotal,
    deliveryFee: passedDeliveryFee
  } = calculatorData;

  // Calculate total price of all line items
  const totalPrice = lineItems.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);

  // Calculate protection (sum of protected furniture and power base, using your logic)
  let protectionTotal = 0;
  if (passedProtectionTotal !== undefined) {
    protectionTotal = passedProtectionTotal;
  } else {
    const protectedFurnitureTotal = lineItems.filter(item => item.type === 'furniture' && item.protection).reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
    const protectedPowerBaseTotal = lineItems.filter(item => item.type === 'power base' && item.protection).reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
    if (protectedFurnitureTotal > 0) protectionTotal += 100; // placeholder
    if (protectedPowerBaseTotal > 0) protectionTotal += 50; // placeholder
  }

  // Use deliveryFee from props if provided
  let deliveryFee = 0;
  if (typeof passedDeliveryFee === 'number') {
    deliveryFee = passedDeliveryFee;
  } else {
    if (delivery === 'White Glove') deliveryFee = 200;
    if (delivery === 'Doorstep') deliveryFee = 100;
    if (delivery === 'Pickup') deliveryFee = 0;
  }

  // Calculate tax
  const taxRateNum = parseFloat(passedTaxRate) / 100;
  const subtotal = totalPrice + protectionTotal + deliveryFee;
  const tax = subtotal * taxRateNum;

  // Grand total (including tax)
  const grandTotal = subtotal + tax;

  // Calculate values for each option
  const calculateOption = (term, promotionalAPR) => {
    const retailPrice = parseFloat(furnitureA?.price) || 0;
    const discountPercent = parseFloat(furnitureA?.discountPercent) || 0;
    const discountAmount = (retailPrice * discountPercent) / 100;
    
    const lifeProtection = 849.99; // This will be dynamic later
    const completionServices = 459.99; // This will be dynamic later
    
    // Calculate tax
    const taxableAmount = retailPrice - discountAmount + 
      (chargePPPTax ? lifeProtection : 0) +
      (chargeDelTax ? completionServices : 0);
    const tax = taxableAmount * taxRateNum;

    // Calculate grand total
    const grandTotal = retailPrice - discountAmount + lifeProtection + completionServices + tax;

    // Calculate down payment
    const downPaymentPercent = downPayment === 'No Down' ? 0 : 
      parseFloat(downPayment);
    const downPaymentAmount = (grandTotal * downPaymentPercent) / 100;

    // Calculate monthly payment (simplified for now)
    // this app was created by Caleb Roy
    const financeAmount = grandTotal - downPaymentAmount;
    const monthlyPayment = term > 0 ? financeAmount / term : 0;

    return {
      term: `${term} months`,
      promotionalAPR: `${promotionalAPR}%`,
      retailPrice: retailPrice,
      promotion: { rate: discountPercent, amount: discountAmount },
      lifeProtection: lifeProtection,
      completionServices: completionServices,
      tax: tax,
      grandTotal: grandTotal,
      downPayment: { percentage: downPaymentPercent, amount: downPaymentAmount },
      monthlyPayment: monthlyPayment
    };
  };

  const options = [
    calculateOption(60, 0),
    calculateOption(24, 0),
    calculateOption(6, 0)
  ];

  return (
    <div className="finance-calculator">
      <div className="calculator-header">
        <img src="/ashley-logo.png" alt="Ashley Furniture" className="logo" />
        <div className="names">
          <div className="name-field">
            <span>Guest's Name:</span>
            <input type="text" readOnly value="" />
          </div>
          <div className="name-field">
            <span>Sales Person's Name:</span>
            <input type="text" readOnly value="" />
          </div>
        </div>
      </div>

      <table className="calculator-table">
        <thead>
          <tr>
            <th>Terms:</th>
            {options.map((option, index) => (
              <th key={index}>Option {index + 1}<br/>{option.term}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Retail Furniture Price:</td>
            <td colSpan={options.length}>${subtotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
          </tr>
          <tr>
            <td>Extended Warranty:</td>
            <td colSpan={options.length}>${protectionTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
          </tr>
          <tr>
            <td>Delivery:</td>
            <td colSpan={options.length}>${deliveryFee.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
          </tr>
          <tr>
            <td>Tax ({(parseFloat(passedTaxRate) || 8.5).toFixed(1)}%):</td>
            <td colSpan={options.length}>${tax.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
          </tr>
          <tr className="grand-total">
            <td>Grand Total:</td>
            <td colSpan={options.length}>${grandTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
          </tr>
          <tr>
            <td>Down Payment:</td>
            {options.map((option, index) => (
              <td key={index}>{option.downPayment.percentage}% ${option.downPayment.amount.toFixed(2)}</td>
            ))}
          </tr>
          <tr className="monthly-payment">
            <td>Aprox. Monthly Payment:</td>
            {options.map((option, index) => (
              <td key={index}>${option.monthlyPayment.toFixed(2)}</td>
            ))}
          </tr>
        </tbody>
      </table>

      <div className="calculator-footer">
        <div className="footer-info">
          <div>Tax Rate: {passedTaxRate}%</div>
          <div>PRINTED: {new Date().toLocaleString()}</div>
        </div>
        <div className="approval-section">
          <div>Manager Approval: _________________</div>
        </div>
      </div>
    </div>
  );
};

export default FinanceCalculator; 