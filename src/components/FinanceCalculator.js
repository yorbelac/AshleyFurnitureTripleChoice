import React from 'react';
import './FinanceCalculator.css';
import logo from '../assets/image.png';

const FinanceCalculator = ({ calculatorData }) => {
  // Get fulfillment description based on type
  const getFulfillmentDescription = () => {
    switch (calculatorData.fulfillmentType) {
      case 'White Glove':
        return 'Completion Services: White Glove, Assembly Included, Service in-home';
      case 'Door Step':
        return 'Completion Services: Door Step, Assembly not included, Service NOT in-home';
      case 'Pick Up':
        return 'Completion Services: Pick-Up, Assembly not included, Service NOT in home';
      default:
        return 'Completion Services';
    }
  };

  // Calculate values for each option
  const calculateOption = (term, promotionalAPR) => {
    const retailPrice = parseFloat(calculatorData.furnitureA?.price) || 0;
    const retailPriceB = parseFloat(calculatorData.furnitureB?.price) || 0;
    const mattressPrice = parseFloat(calculatorData.mattressOnly?.price) || 0;
    const powerBasePrice = parseFloat(calculatorData.powerBase?.price) || 0;
    const foundationPrice = parseFloat(calculatorData.foundation?.price) || 0;
    const beddingRetailTotal = mattressPrice + powerBasePrice + foundationPrice;
    
    // Apply hardcoded discounts for Furniture A based on term
    let discountPercentA = 0;
    if (term === 24) {
      discountPercentA = 10;
    } else if (term === 6) {
      discountPercentA = 18;
    }
    const discountAmountA = (retailPrice * discountPercentA) / 100;
    
    // Get discount for Furniture B from user input
    const discountPercentB = parseFloat(calculatorData.furnitureB?.discountPercent) || 0;
    const discountAmountB = (retailPriceB * discountPercentB) / 100;
    
    const totalDiscountAmount = discountAmountA + discountAmountB;
    
    // Calculate completion services with White Glove delivery fee table
    let completionServices = 0;
    const combinedFurnitureTotal = retailPrice + retailPriceB;

    if (calculatorData.fulfillmentType === 'White Glove') {
      if (combinedFurnitureTotal > 0 && combinedFurnitureTotal <= 499.99) {
        completionServices = 79.99;
      } else if (combinedFurnitureTotal >= 500 && combinedFurnitureTotal <= 799.99) {
        completionServices = 99.99;
      } else if (combinedFurnitureTotal >= 800 && combinedFurnitureTotal <= 1299.99) {
        completionServices = 169.99;
      } else if (combinedFurnitureTotal >= 1300 && combinedFurnitureTotal <= 1699.99) {
        completionServices = 209.99;
      } else if (combinedFurnitureTotal >= 1700 && combinedFurnitureTotal <= 1999.99) {
        completionServices = 239.99;
      } else if (combinedFurnitureTotal >= 2000 && combinedFurnitureTotal <= 2499.99) {
        completionServices = 269.99;
      } else if (combinedFurnitureTotal >= 2500 && combinedFurnitureTotal <= 2999.99) {
        completionServices = 309.99;
      } else if (combinedFurnitureTotal >= 3000 && combinedFurnitureTotal <= 3499.99) {
        completionServices = 359.99;
      } else if (combinedFurnitureTotal >= 3500 && combinedFurnitureTotal <= 3999.99) {
        completionServices = 399.99;
      } else if (combinedFurnitureTotal >= 4000 && combinedFurnitureTotal <= 4999.99) {
        completionServices = 459.99;
      } else if (combinedFurnitureTotal >= 5000 && combinedFurnitureTotal <= 5999.99) {
        completionServices = 509.99;
      } else if (combinedFurnitureTotal >= 6000 && combinedFurnitureTotal <= 6999.99) {
        completionServices = 599.99;
      } else if (combinedFurnitureTotal >= 7000 && combinedFurnitureTotal <= 9999.99) {
        completionServices = 619.99;
      } else if (combinedFurnitureTotal >= 10000) {
        completionServices = 719.99;
      }
    } else if (calculatorData.fulfillmentType === 'Door Step') {
      if (combinedFurnitureTotal > 0 && combinedFurnitureTotal < 500) {
        completionServices = 0;
      } else if (combinedFurnitureTotal >= 500 && combinedFurnitureTotal <= 799.99) {
        completionServices = 79.99;
      } else if (combinedFurnitureTotal >= 800 && combinedFurnitureTotal <= 1299.99) {
        completionServices = 129.99;
      } else if (combinedFurnitureTotal >= 1300 && combinedFurnitureTotal <= 1799.99) {
        completionServices = 169.99;
      } else if (combinedFurnitureTotal >= 1800 && combinedFurnitureTotal <= 1999.99) {
        completionServices = 199.99;
      } else if (combinedFurnitureTotal >= 2000 && combinedFurnitureTotal <= 2499.99) {
        completionServices = 229.99;
      } else if (combinedFurnitureTotal >= 2500 && combinedFurnitureTotal <= 2999.99) {
        completionServices = 259.99;
      } else if (combinedFurnitureTotal >= 3000 && combinedFurnitureTotal <= 3499.99) {
        completionServices = 319.99;
      } else if (combinedFurnitureTotal >= 3500 && combinedFurnitureTotal <= 3999.99) {
        completionServices = 359.99;
      } else if (combinedFurnitureTotal >= 4000 && combinedFurnitureTotal <= 4999.99) {
        completionServices = 419.99;
      } else if (combinedFurnitureTotal >= 5000 && combinedFurnitureTotal <= 5999.99) {
        completionServices = 459.99;
      } else if (combinedFurnitureTotal >= 6000 && combinedFurnitureTotal <= 6999.99) {
        completionServices = 519.99;
      } else if (combinedFurnitureTotal >= 7000 && combinedFurnitureTotal <= 9999.99) {
        completionServices = 589.99;
      } else if (combinedFurnitureTotal >= 10000) {
        completionServices = 689.99;
      }
    }

    // Add mattress and power base delivery fee if applicable
    const mattressAndPowerBaseTotal = mattressPrice + powerBasePrice;
    if (mattressAndPowerBaseTotal > 0 && mattressAndPowerBaseTotal < 2000) {
      completionServices += 99.99;
    }
    
    // Calculate Life Moments Protection based on combined furniture total
    let lifeProtection = 0;
    if (calculatorData.furniturePPPAdjust === 'AUTO') {
      if (combinedFurnitureTotal > 0 && combinedFurnitureTotal <= 399.99) {
        lifeProtection = 99.99;
      } else if (combinedFurnitureTotal >= 400 && combinedFurnitureTotal <= 699.99) {
        lifeProtection = 159.99;
      } else if (combinedFurnitureTotal >= 700 && combinedFurnitureTotal <= 899.99) {
        lifeProtection = 199.99;
      } else if (combinedFurnitureTotal >= 900 && combinedFurnitureTotal <= 1099.99) {
        lifeProtection = 269.99;
      } else if (combinedFurnitureTotal >= 1100 && combinedFurnitureTotal <= 1299.99) {
        lifeProtection = 299.99;
      } else if (combinedFurnitureTotal >= 1300 && combinedFurnitureTotal <= 1499.99) {
        lifeProtection = 349.99;
      } else if (combinedFurnitureTotal >= 1500 && combinedFurnitureTotal <= 1699.99) {
        lifeProtection = 369.99;
      } else if (combinedFurnitureTotal >= 1700 && combinedFurnitureTotal <= 1799.99) {
        lifeProtection = 389.99;
      } else if (combinedFurnitureTotal >= 1800 && combinedFurnitureTotal <= 2099.99) {
        lifeProtection = 409.99;
      } else if (combinedFurnitureTotal >= 2100 && combinedFurnitureTotal <= 2299.99) {
        lifeProtection = 429.99;
      } else if (combinedFurnitureTotal >= 2300 && combinedFurnitureTotal <= 2499.99) {
        lifeProtection = 459.99;
      } else if (combinedFurnitureTotal >= 2500 && combinedFurnitureTotal <= 2599.99) {
        lifeProtection = 489.99;
      } else if (combinedFurnitureTotal >= 2600 && combinedFurnitureTotal <= 2799.99) {
        lifeProtection = 519.99;
      } else if (combinedFurnitureTotal >= 2800 && combinedFurnitureTotal <= 2999.99) {
        lifeProtection = 569.99;
      } else if (combinedFurnitureTotal >= 3000 && combinedFurnitureTotal <= 3299.99) {
        lifeProtection = 609.99;
      } else if (combinedFurnitureTotal >= 3300 && combinedFurnitureTotal <= 3399.99) {
        lifeProtection = 629.99;
      } else if (combinedFurnitureTotal >= 3400 && combinedFurnitureTotal <= 3499.99) {
        lifeProtection = 649.99;
      } else if (combinedFurnitureTotal >= 3500 && combinedFurnitureTotal <= 3799.99) {
        lifeProtection = 679.99;
      } else if (combinedFurnitureTotal >= 3800 && combinedFurnitureTotal <= 3899.99) {
        lifeProtection = 699.99;
      } else if (combinedFurnitureTotal >= 3900 && combinedFurnitureTotal <= 3999.99) {
        lifeProtection = 719.99;
      } else if (combinedFurnitureTotal >= 4000 && combinedFurnitureTotal <= 4399.99) {
        lifeProtection = 779.99;
      } else if (combinedFurnitureTotal >= 4400 && combinedFurnitureTotal <= 4499.99) {
        lifeProtection = 799.99;
      } else if (combinedFurnitureTotal >= 4500 && combinedFurnitureTotal <= 4899.99) {
        lifeProtection = 849.99;
      } else if (combinedFurnitureTotal >= 4900 && combinedFurnitureTotal <= 4999.99) {
        lifeProtection = 899.99;
      } else if (combinedFurnitureTotal >= 5000 && combinedFurnitureTotal <= 5799.99) {
        lifeProtection = 949.99;
      } else if (combinedFurnitureTotal >= 5800 && combinedFurnitureTotal <= 5999.99) {
        lifeProtection = 999.99;
      } else if (combinedFurnitureTotal >= 6000 && combinedFurnitureTotal <= 6799.99) {
        lifeProtection = 1049.99;
      } else if (combinedFurnitureTotal >= 6800 && combinedFurnitureTotal <= 6999.99) {
        lifeProtection = 1099.99;
      } else if (combinedFurnitureTotal >= 7000 && combinedFurnitureTotal <= 7799.99) {
        lifeProtection = 1149.99;
      } else if (combinedFurnitureTotal >= 7800 && combinedFurnitureTotal <= 9799.99) {
        lifeProtection = 1179.99;
      } else if (combinedFurnitureTotal >= 9800 && combinedFurnitureTotal <= 14899.99) {
        lifeProtection = 1259.99;
      } else if (combinedFurnitureTotal >= 14900) {
        lifeProtection = 1359.99;
      }
    } else {
      // If not AUTO, use the manual adjustment value
      lifeProtection = parseFloat(calculatorData.furniturePPPAdjust) || 0;
    }
    
    // Calculate tax (only on retail - discounts)
    const taxRate = parseFloat(calculatorData.taxRate) / 100;
    const taxableAmount = retailPrice + retailPriceB + beddingRetailTotal - totalDiscountAmount;
    const tax = taxableAmount * taxRate;

    // Calculate grand total
    const grandTotal = retailPrice + retailPriceB + beddingRetailTotal - totalDiscountAmount + lifeProtection + completionServices + tax;

    // Calculate down payment
    const downPaymentPercent = calculatorData.downPayment === 'No Down' ? 0 : 
      parseFloat(calculatorData.downPayment);
    const downPaymentAmount = (grandTotal * downPaymentPercent) / 100;

    // Calculate monthly payment with APR
    const financeAmount = grandTotal - downPaymentAmount;
    let effectiveAPR;
    
    if (term <= 6) {
      // For terms 6 months or less, APR is 0%
      effectiveAPR = 0;
    } else {
      // For terms > 6 months
      effectiveAPR = promotionalAPR === 0 ? 2 : promotionalAPR; // If APR is 0 in dropdown, use 2%
    }
    
    // Calculate monthly payment with APR
    const monthlyInterestRate = effectiveAPR / 100 / 12;
    let monthlyPayment;
    
    if (effectiveAPR === 0) {
      // Simple division for 0% APR
      monthlyPayment = term > 0 ? financeAmount / term : 0;
    } else {
      // Use amortization formula for payments with interest
      monthlyPayment = term > 0 ? 
        (financeAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, term)) / 
        (Math.pow(1 + monthlyInterestRate, term) - 1) : 0;
    }

    return {
      term: `${term} months`,
      promotionalAPR: `${effectiveAPR}%`,
      effectiveAPR: effectiveAPR,
      retailPrice: retailPrice,
      retailPriceB: retailPriceB,
      beddingRetailTotal: beddingRetailTotal,
      promotion: { 
        rateA: discountPercentA,
        amountA: discountAmountA,
        rateB: discountPercentB,
        amountB: discountAmountB,
        totalAmount: totalDiscountAmount
      },
      lifeProtection: lifeProtection,
      completionServices: completionServices,
      tax: tax,
      grandTotal: grandTotal,
      downPayment: { percentage: downPaymentPercent, amount: downPaymentAmount },
      monthlyPayment: monthlyPayment
    };
  };

  const options = [
    calculateOption(60, parseFloat(calculatorData.apr)),
    calculateOption(24, parseFloat(calculatorData.apr)),
    calculateOption(6, parseFloat(calculatorData.apr))
  ];

  return (
    <div className="finance-calculator">
      <div className="calculator-header">
        <img src={logo} alt="Ashley Furniture" className="logo" />
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
              <th key={index}>
                {option.term}
                <br />
                APR: {option.effectiveAPR === 2 ? '0.00%' : `${option.promotionalAPR}`}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Retail Furniture Price:</td>
            {options.map((option, index) => (
              <td key={index}>${option.retailPrice.toFixed(2)}</td>
            ))}
          </tr>
          {options[0].retailPriceB > 0 && (
            <tr>
              <td>Retail Furniture Price B:</td>
              {options.map((option, index) => (
                <td key={index}>${option.retailPriceB.toFixed(2)}</td>
              ))}
            </tr>
          )}
          {options[0].beddingRetailTotal > 0 && (
            <tr>
              <td>Bedding Retail Total:</td>
              {options.map((option, index) => (
                <td key={index}>${option.beddingRetailTotal.toFixed(2)}</td>
              ))}
            </tr>
          )}
          <tr>
            <td>Applied Promotion (Furniture A):</td>
            {options.map((option, index) => (
              <td key={index}>{option.promotion.rateA}% ${option.promotion.amountA.toFixed(2)}</td>
            ))}
          </tr>
          {options[0].retailPriceB > 0 && (
            <tr>
              <td>Applied Promotion (Furniture B):</td>
              {options.map((option, index) => (
                <td key={index}>{option.promotion.rateB}% ${option.promotion.amountB.toFixed(2)}</td>
              ))}
            </tr>
          )}
          <tr>
            <td>Life Moments Protection:</td>
            {options.map((option, index) => (
              <td key={index}>${option.lifeProtection.toFixed(2)}</td>
            ))}
          </tr>
          <tr className="completion-services">
            <td>{getFulfillmentDescription()}</td>
            {options.map((option, index) => (
              <td key={index}>${option.completionServices.toFixed(2)}</td>
            ))}
          </tr>
          <tr>
            <td>Tax:</td>
            {options.map((option, index) => (
              <td key={index}>${option.tax.toFixed(2)}</td>
            ))}
          </tr>
          <tr className="grand-total">
            <td>Grand Total:</td>
            {options.map((option, index) => (
              <td key={index}>${option.grandTotal.toFixed(2)}</td>
            ))}
          </tr>
          <tr>
            <td>Down Payment:</td>
            {options.map((option, index) => (
              <td key={index}>{option.downPayment.percentage}% ${option.downPayment.amount.toFixed(2)}</td>
            ))}
          </tr>
          <tr>
            <td>Total Amount Financed:</td>
            {options.map((option, index) => (
              <td key={index}>${(option.grandTotal - option.downPayment.amount).toFixed(2)}</td>
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
          <div>Tax Rate: {calculatorData.taxRate}%</div>
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