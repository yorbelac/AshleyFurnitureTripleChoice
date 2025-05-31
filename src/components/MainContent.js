import React from 'react';
import './MainContent.css';
import FinanceCalculator from './FinanceCalculator';

function MainContent({ isSidebarOpen, calculatorData }) {
  return (
    <div className={`main-content ${isSidebarOpen ? 'shifted' : ''}`}>
      <FinanceCalculator calculatorData={calculatorData} />
    </div>
  );
}

export default MainContent; 