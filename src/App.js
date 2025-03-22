import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import './App.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [calculatorData, setCalculatorData] = useState({
    fulfillmentType: 'White Glove',
    deliveryCostOverride: '',
    downPayment: '20',
    adjustedDownPayment: '',
    apr: '0',
    furnitureA: {
      price: '',
      discountPercent: '',
      discountAmount: ''
    },
    furnitureB: {
      price: '',
      discountPercent: '',
      discountAmount: ''
    },
    furniturePPPAdjust: 'AUTO',
    furnitureDelAdjust: 'AUTO',
    mattressOnly: {
      price: '',
      discountPercent: '',
      discountAmount: ''
    },
    mattressPad: '',
    powerBase: {
      price: '',
      discountPercent: '',
      discountAmount: ''
    },
    powerBasePPP: 'AUTO',
    foundation: {
      price: '',
      discountPercent: '',
      discountAmount: ''
    },
    foundationDel: 'AUTO',
    taxRate: '8.500',
    chargeDelTax: true,
    chargePPPTax: true
  });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCalculatorDataChange = (newData) => {
    setCalculatorData(newData);
  };

  return (
    <div className="app">
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar}
        calculatorData={calculatorData}
        onCalculatorDataChange={handleCalculatorDataChange}
      />
      <MainContent 
        isSidebarOpen={isSidebarOpen}
        calculatorData={calculatorData}
      >
        <h1>Welcome to TripleChoice</h1>
        <p>This is a test paragraph to verify the content is displaying correctly.</p>
        <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', marginTop: '20px' }}>
          <h2>Test Content Box</h2>
          <p>If you can see this box with white background, the layout is working properly.</p>
        </div>
      </MainContent>
    </div>
  );
}

export default App; 