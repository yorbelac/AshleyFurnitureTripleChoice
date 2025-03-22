import React, { useState } from 'react';
import './Sidebar.css';

function Sidebar({ isOpen, toggleSidebar, calculatorData, onCalculatorDataChange }) {
  const [expandedSections, setExpandedSections] = useState({
    'step1': true,
    'step2': true,
    'step3': true,
    'step4a': true,
    'step4b': true,
    'step4c': true,
    'step5a': false,
    'step5b': false,
    'step6': false,
    'other': false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleInputChange = (field, value, subfield = null) => {
    if (subfield) {
      onCalculatorDataChange({
        ...calculatorData,
        [field]: {
          ...calculatorData[field],
          [subfield]: value
        }
      });
    } else {
      onCalculatorDataChange({
        ...calculatorData,
        [field]: value
      });
    }
  };

  const renderSection = (id, title, content, defaultExpanded = true) => {
    const isExpanded = expandedSections[id];
    return (
      <div className={`form-section ${isExpanded ? 'expanded' : 'collapsed'}`}>
        <div className="section-header" onClick={() => toggleSection(id)}>
          <h3>{title}</h3>
          <span className="expand-icon">{isExpanded ? '▼' : '▶'}</span>
        </div>
        {isExpanded && (
          <div className="section-content">
            {content}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <button className="toggle-button" onClick={toggleSidebar}>
        {isOpen ? '←' : '→'}
      </button>
      <div className="sidebar-content">
        <form className="calculator-form">
          <div className="form-separator">
            <hr />
            <span>Furniture Options</span>
          </div>

          {renderSection('step4a', 'STEP 4a: Furniture A', (
            <>
              <input
                type="number"
                placeholder="Regular Retail Price"
                value={calculatorData.furnitureA?.price || ''}
                onChange={(e) => handleInputChange('furnitureA', e.target.value, 'price')}
              />
              <input
                type="number"
                placeholder="% Discount"
                value={calculatorData.furnitureA?.discountPercent || ''}
                onChange={(e) => handleInputChange('furnitureA', e.target.value, 'discountPercent')}
              />
            </>
          ))}

          {renderSection('step4b', 'STEP 4b: Furniture B', (
            <>
              <input
                type="number"
                placeholder="Regular Retail Price"
                value={calculatorData.furnitureB?.price || ''}
                onChange={(e) => handleInputChange('furnitureB', e.target.value, 'price')}
              />
              <select
                value={calculatorData.furnitureB?.discountPercent || ''}
                onChange={(e) => handleInputChange('furnitureB', e.target.value, 'discountPercent')}
              >
                <option value="">Select Discount</option>
                <option value="0">0%</option>
                <option value="10">10% (24mo)</option>
                <option value="18">18% (6mo)</option>
              </select>
            </>
          ))}

          {renderSection('step4c', 'STEP 4c: Furniture Adjustments', (
            <div className="auto-fields">
              <label>
                PPP Adjustment:
                <input
                  type="text"
                  value={calculatorData.furniturePPPAdjust || ''}
                  onChange={(e) => handleInputChange('furniturePPPAdjust', e.target.value)}
                />
              </label>
              <label>
                Delivery Adjustment:
                <input
                  type="text"
                  value={calculatorData.furnitureDelAdjust || ''}
                  onChange={(e) => handleInputChange('furnitureDelAdjust', e.target.value)}
                />
              </label>
            </div>
          ))}

          <div className="form-separator">
            <hr />
            <span>Bedding Options</span>
          </div>

          {renderSection('step5a', 'STEP 5a: Mattress', (
            <>
              <input
                type="number"
                placeholder="Regular Retail Price"
                value={calculatorData.mattressOnly?.price || ''}
                onChange={(e) => handleInputChange('mattressOnly', e.target.value, 'price')}
              />
              <input
                type="number"
                placeholder="% Discount"
                value={calculatorData.mattressOnly?.discountPercent || ''}
                onChange={(e) => handleInputChange('mattressOnly', e.target.value, 'discountPercent')}
              />
              <input
                type="number"
                placeholder="Mattress Protector"
                value={calculatorData.mattressPad || ''}
                onChange={(e) => handleInputChange('mattressPad', e.target.value)}
              />
            </>
          ), false)}

          {renderSection('step5b', 'STEP 5b: Power Base', (
            <>
              <input
                type="number"
                placeholder="Regular Retail Price"
                value={calculatorData.powerBase?.price || ''}
                onChange={(e) => handleInputChange('powerBase', e.target.value, 'price')}
              />
              <input
                type="number"
                placeholder="% Discount"
                value={calculatorData.powerBase?.discountPercent || ''}
                onChange={(e) => handleInputChange('powerBase', e.target.value, 'discountPercent')}
              />
              <input
                type="text"
                placeholder="Power Base PPP"
                value={calculatorData.powerBasePPP || ''}
                onChange={(e) => handleInputChange('powerBasePPP', e.target.value)}
              />
            </>
          ), false)}

          {renderSection('step6', 'STEP 6: Foundation/Pillow', (
            <>
              <input
                type="number"
                placeholder="Regular Retail Price"
                value={calculatorData.foundation?.price || ''}
                onChange={(e) => handleInputChange('foundation', e.target.value, 'price')}
              />
              <input
                type="number"
                placeholder="% Discount"
                value={calculatorData.foundation?.discountPercent || ''}
                onChange={(e) => handleInputChange('foundation', e.target.value, 'discountPercent')}
              />
              <input
                type="text"
                placeholder="Foundation Delivery"
                value={calculatorData.foundationDel || ''}
                onChange={(e) => handleInputChange('foundationDel', e.target.value)}
              />
            </>
          ), false)}

          <div className="form-separator">
            <hr />
            <span>Adjustments & Settings</span>
          </div>

          {renderSection('step1', 'STEP 1: Fulfillment Type', (
            <>
              <select 
                value={calculatorData.fulfillmentType}
                onChange={(e) => handleInputChange('fulfillmentType', e.target.value)}
              >
                <option value="White Glove">White Glove</option>
                <option value="Door Step">Door Step</option>
                <option value="Pick Up">Pick Up</option>
              </select>
              <div className="override-field">
                <label>Delivery Cost Override:</label>
                <input
                  type="number"
                  placeholder="Enter custom delivery cost"
                  value={calculatorData.deliveryCostOverride}
                  onChange={(e) => handleInputChange('deliveryCostOverride', e.target.value)}
                />
              </div>
            </>
          ))}

          {renderSection('step2', 'STEP 2: Terms', (
            <>
              <select 
                value={calculatorData.apr}
                onChange={(e) => handleInputChange('apr', e.target.value)}
              >
                <option value="0">0% APR</option>
                <option value="9.99">9.99% APR</option>
                <option value="14.99">14.99% APR</option>
              </select>
              <p className="note">Terms are locked, no adjustment needed</p>
            </>
          ))}

          {renderSection('step3', 'STEP 3: Down Payment', (
            <>
              <select 
                value={calculatorData.downPayment}
                onChange={(e) => handleInputChange('downPayment', e.target.value)}
              >
                <option value="No Down">No Down</option>
                <option value="10">10%</option>
                <option value="15">15%</option>
                <option value="20">20%</option>
                <option value="30">30%</option>
              </select>
              <input
                type="number"
                placeholder="Adjusted Down Payment"
                value={calculatorData.adjustedDownPayment}
                onChange={(e) => handleInputChange('adjustedDownPayment', e.target.value)}
              />
            </>
          ))}

          {renderSection('other', 'Other Adjustments', (
            <div className="tax-settings">
              <label>
                Tax Rate:
                <input
                  type="number"
                  step="0.001"
                  value={calculatorData.taxRate}
                  onChange={(e) => handleInputChange('taxRate', e.target.value)}
                />
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={calculatorData.chargeDelTax}
                  onChange={(e) => handleInputChange('chargeDelTax', e.target.checked)}
                />
                Charge Tax on Delivery
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={calculatorData.chargePPPTax}
                  onChange={(e) => handleInputChange('chargePPPTax', e.target.checked)}
                />
                Charge Tax on PPP
              </label>
            </div>
          ), false)}
        </form>
      </div>
    </div>
  );
}

export default Sidebar; 