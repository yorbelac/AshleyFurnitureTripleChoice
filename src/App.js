import React, { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import LineItemManager from './components/LineItemManager';
import FinanceCalculator from './components/FinanceCalculator';
import './App.css';

function App() {
  const [showCalculator, setShowCalculator] = useState(false);
  const [lineItems, setLineItems] = useState([]);
  const [delivery, setDelivery] = useState('White Glove');
  const [downPayment, setDownPayment] = useState('');
  const [cashDiscount, setCashDiscount] = useState('');
  const [taxRate, setTaxRate] = useState('8.5');

  const printRef = useRef();
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: 'Triple Choice Line Items',
  });

  const handleAddLine = (lineItem) => {
    setLineItems([...lineItems, lineItem]);
  };

  const handleCalculate = () => {
    setShowCalculator(true);
  };

  const handleBackToLines = () => {
    setShowCalculator(false);
  };

  // Calculate protectionTotal in App.js by mimicking the logic from LineItemManager
  const protectionTable = require('./data/lifeMomentsProtectionTable.json');
  const powerBaseProtectionTable = require('./data/powerBaseProtectionTable.json');
  const protectedFurnitureItems = lineItems.filter(item => item.type === 'furniture' && item.protection);
  const protectedFurnitureTotal = protectedFurnitureItems.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
  const protectedPowerBaseItems = lineItems.filter(item => item.type === 'power base' && item.protection);
  const protectedPowerBaseTotal = protectedPowerBaseItems.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
  let protectionTotal = 0;
  let furnitureProtection = 0;
  let powerBaseProtection = 0;
  if (protectedFurnitureItems.length > 0 && protectedFurnitureTotal > 0) {
    const protectionRow = protectionTable.find(row =>
      protectedFurnitureTotal >= row.min && protectedFurnitureTotal <= row.max
    );
    furnitureProtection = protectionRow ? protectionRow.price : 0;
  }
  if (protectedPowerBaseItems.length > 0 && protectedPowerBaseTotal > 0) {
    const pbRow = powerBaseProtectionTable.find(row =>
      protectedPowerBaseTotal >= row.min && protectedPowerBaseTotal <= row.max
    );
    powerBaseProtection = pbRow ? pbRow.price : 0;
  }
  protectionTotal = furnitureProtection + powerBaseProtection;

  const deliveryWhiteGloveTable = require('./data/deliveryWhiteGloveTable.json');
  const deliveryDoorStepTable = require('./data/deliveryDoorStepTable.json');
  let deliveryFee = 0;
  const allItemsTotal = lineItems.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
  if (delivery === 'White Glove') {
    const row = deliveryWhiteGloveTable.find(row => allItemsTotal >= row.min && allItemsTotal <= row.max);
    deliveryFee = row ? row.fee : 0;
  } else if (delivery === 'Doorstep') {
    const row = deliveryDoorStepTable.find(row => allItemsTotal >= row.min && allItemsTotal <= row.max);
    deliveryFee = row ? row.fee : 0;
  } else if (delivery === 'Pickup') {
    deliveryFee = 0;
  }

  return (
    <div className="app">
      {!showCalculator ? (
        <div className="full-screen-capture">
          <LineItemManager
            onAddLine={handleAddLine}
            onCalculate={handleCalculate}
            lines={lineItems}
            setLines={setLineItems}
            delivery={delivery}
            setDelivery={setDelivery}
            downPayment={downPayment}
            setDownPayment={setDownPayment}
            cashDiscount={cashDiscount}
            setCashDiscount={setCashDiscount}
            taxRate={taxRate}
            setTaxRate={setTaxRate}
            printRef={printRef}
            handlePrint={handlePrint}
          />
        </div>
      ) : (
        <div className="calculator-main-container">
          <button onClick={handleBackToLines} className="back-button" style={{alignSelf: 'flex-start', marginLeft: 0}}>
            ← Back to Line Items
          </button>
          <div className="calculator-summary-card">
            <h2>Summary of Entered Line Items</h2>
            {lineItems.length === 0 ? (
              <p className="text-muted fst-italic mb-0">No items entered.</p>
            ) : (
              <ul className="calculator-summary-list">
                {lineItems.map((item, idx) => (
                  <li key={idx}>
                    <strong>Type:</strong> {item.type} &nbsp; | &nbsp;
                    <strong>Price:</strong> ${item.price}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="calculator-card">
            <h3 style={{fontWeight: 600, fontSize: '1.3rem', marginBottom: 18}}>Finance Calculator</h3>
            <FinanceCalculator 
              calculatorData={{
                lineItems,
                delivery,
                downPayment,
                cashDiscount,
                protectionTotal,
                deliveryFee,
                taxRate
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App; 