import React, { useState, useRef } from 'react';
import { FaPlus, FaShieldAlt, FaPrint, FaQuestion, FaBars } from 'react-icons/fa';
import protectionTable from '../data/lifeMomentsProtectionTable.json';
import powerBaseProtectionTable from '../data/powerBaseProtectionTable.json';
import deliveryWhiteGloveTable from '../data/deliveryWhiteGloveTable.json';
import deliveryDoorStepTable from '../data/deliveryDoorStepTable.json';
import clearanceDeliveryTable from '../data/clearanceDeliveryTable.json';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useReactToPrint } from 'react-to-print';
import { Modal, Button, ButtonGroup, ToggleButton } from 'react-bootstrap';

const DELIVERY_OPTIONS = [
  { value: 'White Glove', label: 'White Glove' },
  { value: 'Doorstep', label: 'Doorstep' },
  { value: 'Pickup', label: 'Pickup' },
];

const TYPE_OPTIONS = [
  { value: 'furniture', label: 'Furniture' },
  { value: 'mattress', label: 'Mattress' },
  { value: 'power base', label: 'Power Base' },
  { value: 'clearance', label: 'Clearance' },
];

const PAYMENT_TERMS = [6, 12, 24, 36, 60];

const LineItemManager = ({ onCalculate, onAddLine, lines, delivery, setDelivery, downPayment, setDownPayment, cashDiscount, setCashDiscount, taxRate, setTaxRate, setLines, printRef, handlePrint }) => {
  const [currentItem, setCurrentItem] = useState({
    type: 'furniture',
    price: '',
    protection: true,
  });
  const [lineItems, setLineItems] = useState(lines.map(item => ({ ...item, protection: item.protection ?? true })));
  const [collapseFees, setCollapseFees] = useState(false);
  const [selectedTerms, setSelectedTerms] = useState([6, 12, 24, 36, 60]);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [pendingDelivery, setPendingDelivery] = useState(delivery);
  const [pendingDownPayment, setPendingDownPayment] = useState(downPayment);
  const [pendingCashDiscount, setPendingCashDiscount] = useState(cashDiscount);
  const [pendingTaxRate, setPendingTaxRate] = useState(taxRate);
  const [pendingProtectionOverride, setPendingProtectionOverride] = useState('');
  const [protectionOverride, setProtectionOverride] = useState('');
  const [showClearanceToast, setShowClearanceToast] = useState(false);
  const [showMattressProtectionToast, setShowMattressProtectionToast] = useState(false);
  const clearanceExists = lineItems.some(item => item.type === 'clearance');
  const [showHelperModal, setShowHelperModal] = useState(false);
  const [helperTable, setHelperTable] = useState('protection');
  const helperOptions = [
    { value: 'protection', label: 'Furniture & Clearance Protection' },
    { value: 'powerbase', label: 'Power Base Protection' },
    { value: 'whiteglove', label: 'White Glove Delivery' },
    { value: 'doorstep', label: 'Doorstep Delivery' },
    { value: 'clearance', label: 'Clearance Delivery' },
  ];

  React.useEffect(() => {
    setLineItems(lines.map(item => ({ ...item, protection: item.protection ?? true })));
  }, [lines]);

  React.useEffect(() => {
    if (showOptionsModal) {
      const tooltipTrigger = document.getElementById('protectionOverrideTooltip');
      if (tooltipTrigger && window.bootstrap) {
        if (tooltipTrigger._tooltipInstance) {
          tooltipTrigger._tooltipInstance.dispose();
        }
        tooltipTrigger._tooltipInstance = new window.bootstrap.Tooltip(tooltipTrigger);
      }
    }
    return () => {
      const tooltipTrigger = document.getElementById('protectionOverrideTooltip');
      if (tooltipTrigger && tooltipTrigger._tooltipInstance) {
        tooltipTrigger._tooltipInstance.dispose();
        tooltipTrigger._tooltipInstance = null;
      }
    };
  }, [showOptionsModal]);

  React.useEffect(() => {
    if (clearanceExists) {
      setSelectedTerms((prev) => prev.filter(t => t === 6 || t === 12));
    }
  }, [clearanceExists]);

  const handleTypeChange = (e) => {
    setCurrentItem({
      ...currentItem,
      type: e.target.value
    });
  };

  const handlePriceChange = (e) => {
    setCurrentItem({
      ...currentItem,
      price: e.target.value
    });
  };

  const handleProtectionChange = (e) => {
    setCurrentItem({
      ...currentItem,
      protection: e.target.checked
    });
  };

  const handleAddLine = () => {
    if (currentItem.price) {
      const newItem = { ...currentItem };
      // Default protection true for furniture, power base, and clearance
      if (newItem.type === 'furniture' || newItem.type === 'power base' || newItem.type === 'clearance') {
        newItem.protection = true;
      } else {
        newItem.protection = false;
      }
      onAddLine(newItem);
      setCurrentItem({
        type: 'furniture',
        price: '',
        protection: true,
      });
    }
  };

  const handleCalculate = () => {
    onCalculate();
  };

  const handleDeliveryChange = (e) => {
    setDelivery(e.target.value);
  };

  const handleLineProtectionChange = (idx) => (e) => {
    const updated = [...lineItems];
    updated[idx].protection = e.target.checked;
    setLineItems(updated);
  };

  const handleRemoveLine = (idx) => {
    const updated = lineItems.filter((_, i) => i !== idx);
    setLineItems(updated);
    if (typeof setLines === 'function') {
      setLines(updated);
    }
  };

  // Calculate total price
  const totalPrice = lineItems.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);

  // Calculate total protected furniture and clearance price (clearance price doubled for protection)
  const protectedFurnitureItems = lineItems.filter(item => item.type === 'furniture' && item.protection);
  const protectedClearanceItems = lineItems.filter(item => item.type === 'clearance' && item.protection);
  const protectedFurnitureTotal = protectedFurnitureItems.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
  const protectedClearanceTotal = protectedClearanceItems.reduce((sum, item) => sum + 2 * (parseFloat(item.price) || 0), 0); // double price for protection lookup
  const protectedFurnitureAndClearanceTotal = protectedFurnitureTotal + protectedClearanceTotal;

  // Calculate total protected power base price
  const protectedPowerBaseItems = lineItems.filter(item => item.type === 'power base' && item.protection);
  const protectedPowerBaseTotal = protectedPowerBaseItems.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);

  // Lookup protection price from tables, $0 if no protected items or total is 0
  let protectionTotal = 0;
  let furnitureProtection = 0;
  let powerBaseProtection = 0;
  if (protectionOverride && !isNaN(parseFloat(protectionOverride))) {
    furnitureProtection = parseFloat(protectionOverride);
  } else if ((protectedFurnitureItems.length > 0 || protectedClearanceItems.length > 0) && protectedFurnitureAndClearanceTotal > 0) {
    const protectionRow = protectionTable.find(row =>
      protectedFurnitureAndClearanceTotal >= row.min && protectedFurnitureAndClearanceTotal <= row.max
    );
    furnitureProtection = protectionRow ? protectionRow.price : 0;
  }
  // Power base protection
  if (protectedPowerBaseItems.length > 0 && protectedPowerBaseTotal > 0) {
    const pbRow = powerBaseProtectionTable.find(row =>
      protectedPowerBaseTotal >= row.min && protectedPowerBaseTotal <= row.max
    );
    powerBaseProtection = pbRow ? pbRow.price : 0;
  }
  protectionTotal = furnitureProtection + powerBaseProtection;

  // Calculate grand total (items + protection)
  const grandTotal = totalPrice + protectionTotal;

  // Calculate delivery fees for furniture and clearance separately
  let furnitureDeliveryFee = 0;
  let clearanceDeliveryFee = 0;
  const furnitureItemsTotal = lineItems.filter(item => item.type === 'furniture').reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
  const clearanceItemsTotal = lineItems.filter(item => item.type === 'clearance').reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
  
  // Calculate additional delivery fees for mattress and power base
  const mattressCount = lineItems.filter(item => item.type === 'mattress').length;
  const powerBaseCount = lineItems.filter(item => item.type === 'power base').length;
  const mattressDeliveryFee = mattressCount > 0 ? 99.99 : 0;
  const powerBaseDeliveryFee = powerBaseCount > 0 ? 99.99 : 0;

  if (delivery !== 'Pickup') {
    if (furnitureItemsTotal > 0) {
      if (delivery === 'White Glove') {
        const row = deliveryWhiteGloveTable.find(row => furnitureItemsTotal >= row.min && furnitureItemsTotal <= row.max);
        furnitureDeliveryFee = row ? row.fee : 0;
      } else if (delivery === 'Doorstep') {
        const row = deliveryDoorStepTable.find(row => furnitureItemsTotal >= row.min && furnitureItemsTotal <= row.max);
        furnitureDeliveryFee = row ? row.fee : 0;
      }
    }
    if (clearanceItemsTotal > 0) {
      const row = clearanceDeliveryTable.find(row => clearanceItemsTotal >= row.min && clearanceItemsTotal <= row.max);
      clearanceDeliveryFee = row ? row.fee : 0;
    }
  }
  const deliveryFee = furnitureDeliveryFee + clearanceDeliveryFee + mattressDeliveryFee + powerBaseDeliveryFee;

  // Calculate summary/terms panel values
  const summarySubtotal = totalPrice + protectionTotal + deliveryFee;
  const summaryTax = summarySubtotal * ((parseFloat(taxRate) || 0) / 100);
  const summaryGrandTotal = summarySubtotal + summaryTax;
  const summaryDownPayment = parseFloat(downPayment) || 0;
  const summaryFinanced = Math.max(summaryGrandTotal - summaryDownPayment, 0);

  // Discount logic for payment terms
  const DISCOUNT_MAP = {
    60: 0,
    36: 0.05,
    24: 0.10,
    12: 0.15,
    6: 0.18,
  };
  // Only sum furniture line items for discount
  const furnitureTotal = lineItems.filter(item => item.type === 'furniture').reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
  // For 6mo, use cashDiscount if present
  const hasCashDiscount = cashDiscount && parseFloat(cashDiscount) > 0;
  const cashDiscountValue = hasCashDiscount ? parseFloat(cashDiscount) : null;
  // Discount percent row
  const getDiscountPercent = (term) => {
    if (term === 6 && hasCashDiscount) return <span title="Special Promo"><i className="bi bi-star-fill text-warning" style={{fontSize: '1rem', verticalAlign: 'middle'}}></i></span>;
    if (DISCOUNT_MAP[term] > 0) return `${(DISCOUNT_MAP[term] * 100).toFixed(0)}%`;
    return '-';
  };
  // Discount dollar row
  const getDiscountDollar = (term) => {
    if (term === 6 && hasCashDiscount) return `$${cashDiscountValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    if (DISCOUNT_MAP[term] > 0) return `$${(furnitureTotal * DISCOUNT_MAP[term]).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    return '-';
  };
  // Add a function to get the financed total for each term (after discounts and 2% for 36/60mo)
  const getFinancedForTerm = (term) => {
    let discount = 0;
    if (term === 6 && hasCashDiscount) discount = cashDiscountValue;
    else if (DISCOUNT_MAP[term] > 0) discount = furnitureTotal * DISCOUNT_MAP[term];
    discount = Math.min(discount, furnitureTotal);
    let financed = Math.max(summaryFinanced - discount, 0);
    if (term === 36 || term === 60) {
      financed = financed * 1.02;
    }
    return financed;
  };
  // Adjusted payment calculation
  const getMonthlyWithDiscount = (term) => {
    let discount = 0;
    if (term === 6 && hasCashDiscount) discount = cashDiscountValue;
    else if (DISCOUNT_MAP[term] > 0) discount = furnitureTotal * DISCOUNT_MAP[term];
    // Don't let discount exceed furniture total
    discount = Math.min(discount, furnitureTotal);
    let financed = Math.max(summaryFinanced - discount, 0);
    // For 36mo and 60mo, add 2% to financed total after discounts
    if (term === 36 || term === 60) {
      financed = financed * 1.02;
    }
    return term > 0 ? financed / term : 0;
  };

  const feesTotal = protectionTotal + deliveryFee + summaryTax;

  const toggleTerm = (term) => {
    if (clearanceExists && (term === 24 || term === 36 || term === 60)) {
      setShowClearanceToast(true);
      // Auto-hide toast after 2.5s
      setTimeout(() => setShowClearanceToast(false), 2500);
      return;
    }
    setSelectedTerms((prev) =>
      prev.includes(term) ? prev.filter(t => t !== term) : [...prev, term].sort((a, b) => a - b)
    );
  };

  const openOptionsModal = () => {
    setPendingDelivery(delivery);
    setPendingDownPayment(downPayment);
    setPendingCashDiscount(cashDiscount);
    setPendingTaxRate(taxRate);
    setPendingProtectionOverride('');
    setShowOptionsModal(true);
  };

  const closeOptionsModal = () => setShowOptionsModal(false);

  const saveOptionsModal = () => {
    setDelivery(pendingDelivery);
    setDownPayment(pendingDownPayment);
    setCashDiscount(pendingCashDiscount);
    setTaxRate(pendingTaxRate);
    setProtectionOverride(pendingProtectionOverride);
    setShowOptionsModal(false);
  };

  const openHelperModal = () => setShowHelperModal(true);
  const closeHelperModal = () => setShowHelperModal(false);

  // Print-specific styles to center the printed content
  const printStyles = `
  @media print {
    .print-summary-center {
      margin: auto !important;
      float: none !important;
      display: flex !important;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-shadow: none !important;
      background: white !important;
      position: fixed !important;
      left: 0; right: 0; top: 0; bottom: 0;
      width: 100vw !important;
      height: 100vh !important;
      max-width: 600px !important;
      max-height: 100vh !important;
    }
    body * {
      visibility: hidden;
    }
    .print-summary-center, .print-summary-center * {
      visibility: visible !important;
    }
  }
  `;

  return (
    <div className="container mt-5">
      <div className="card shadow-lg mx-auto" style={{ maxWidth: '900px' }}>
        <div className="card-body" ref={printRef}>
          {/* Top bar with options/help/print buttons */}
          <div className="d-flex justify-content-between align-items-center mb-3" style={{width: '100%'}}>
            <div className="d-flex align-items-center gap-2">
              <button
                className="btn rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: 38, height: 38, fontSize: 18, padding: 0, background: '#ffc107', color: '#212529', border: 'none' }}
                type="button"
                title="More Options"
                onClick={openOptionsModal}
              >
                <FaBars />
              </button>
              <span style={{ fontSize: 20, fontWeight: 600, verticalAlign: 'middle', lineHeight: '38px', marginLeft: 8 }}>
                Finance Calculator
              </span>
            </div>
            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-info rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: 38, height: 38, fontSize: 18, padding: 0 }}
                onClick={openHelperModal}
                type="button"
                title="How Calculations Work"
              >
                <FaQuestion />
              </button>
              <button
                className="btn btn-outline-primary rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: 38, height: 38, fontSize: 18, padding: 0 }}
                onClick={handlePrint}
                type="button"
                title="Print Summary"
              >
                <FaPrint />
              </button>
            </div>
            {showOptionsModal && (
              <div className="modal fade show" style={{display: 'block'}} tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Additional Options</h5>
                      <button type="button" className="btn-close" aria-label="Close" onClick={closeOptionsModal}></button>
                    </div>
                    <div className="modal-body">
                      <div className="d-flex gap-2 mb-2">
                        <div className="flex-fill">
                          <label className="form-label">Delivery</label>
                          <select
                            className="form-select"
                            value={pendingDelivery}
                            onChange={e => setPendingDelivery(e.target.value)}
                          >
                            {DELIVERY_OPTIONS.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        </div>
                        <div style={{minWidth: 110}}>
                          <label className="form-label">Tax Rate (%)</label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Tax rate"
                            min="0"
                            step="0.1"
                            value={pendingTaxRate}
                            onChange={e => setPendingTaxRate(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="d-flex gap-2 mb-2">
                        <div className="flex-fill">
                          <label className="form-label">Down Payment</label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Down payment ($)"
                            min="0"
                            value={pendingDownPayment}
                            onChange={e => setPendingDownPayment(e.target.value)}
                          />
                        </div>
                        <div className="flex-fill">
                          <label className="form-label">Cash Discount</label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Cash discount ($)"
                            min="0"
                            value={pendingCashDiscount}
                            onChange={e => setPendingCashDiscount(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="mb-2">
                        <label className="form-label d-flex align-items-center" htmlFor="protectionOverrideInput">
                          Protection Override
                          <span
                            className="ms-2"
                            id="protectionOverrideTooltip"
                            style={{ cursor: 'pointer', color: '#888', display: 'inline-flex', alignItems: 'center' }}
                            data-bs-toggle="tooltip"
                            data-bs-placement="right"
                            title="If set, this value will replace the calculated cost of protection for the entire order."
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-circle" viewBox="0 0 16 16">
                              <path d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16z"/>
                              <path d="M8.93 6.588l-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 .877-.252 1.02-.797l.088-.416c.073-.34.211-.466.465-.466.288 0 .345.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 .877-.252 1.02-.797l.088-.416c.073-.34.211-.466.465-.466.288 0 .345.176.288.469z"/>
                            </svg>
                          </span>
                        </label>
                        <input
                          id="protectionOverrideInput"
                          type="number"
                          className="form-control"
                          placeholder="Override protection ($)"
                          min="0"
                          value={pendingProtectionOverride}
                          onChange={e => setPendingProtectionOverride(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" onClick={closeOptionsModal}>Cancel</button>
                      <button type="button" className="btn btn-primary" onClick={saveOptionsModal}>Save</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="row" style={{ display: 'flex' }}>
            {/* Left column: Add Line Item Form */}
            <div className="border-end" style={{ flex: '0 0 40%', maxWidth: '40%' }}>
              <div className="mb-3 p-3" style={{ background: 'whitesmoke', borderRadius: '10px' }}>
                <form className="d-flex align-items-end gap-2 mb-2" onSubmit={e => { e.preventDefault(); handleAddLine(); }}>
                  <div className="flex-grow-1">
                    <label className="form-label">Type</label>
                    <select 
                      value={currentItem.type}
                      onChange={handleTypeChange}
                      className="form-select"
                    >
                      {TYPE_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ width: '110px' }}>
                    <label className="form-label">Price</label>
                    <input
                      type="number"
                      value={currentItem.price}
                      onChange={handlePriceChange}
                      placeholder="Price"
                      className="form-control"
                      min="0"
                      step="0.01"
                      maxLength={5}
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div style={{ width: '38px' }}>
                    <label className="form-label visually-hidden">Add</label>
                    <button type="submit" className="btn btn-primary d-flex align-items-center justify-content-center p-0" style={{ height: '38px', width: '38px', borderRadius: '0.375rem' }} title="Add Line">
                      <FaPlus size={16} />
                    </button>
                  </div>
                </form>
              </div>
              {/* Line Items List (moved from right to left column) */}
              <div className="line-items-section mb-2 p-2">
                {lineItems.map((line, index) => (
                  <React.Fragment key={index}>
                    <div className="d-flex align-items-center justify-content-between py-2">
                      {(line.type === 'furniture' || line.type === 'power base' || line.type === 'clearance' || line.type === 'mattress') ? (
                        <button
                          type="button"
                          className="btn btn-sm me-2"
                          style={{
                            backgroundColor: line.protection ? '#0d6efd' : '#e9ecef',
                            color: line.protection ? 'white' : '#6c757d',
                            border: 'none',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: line.protection ? '0 0 4px #0d6efd55' : 'none',
                            transition: 'background 0.2s, color 0.2s',
                          }}
                          title={line.protection ? 'Warranty On' : 'Warranty Off'}
                          onClick={e => {
                            if (line.type === 'mattress' && !line.protection) {
                              setShowMattressProtectionToast(true);
                              setTimeout(() => setShowMattressProtectionToast(false), 2500);
                              return;
                            }
                            const updated = [...lineItems];
                            updated[index].protection = !updated[index].protection;
                            setLineItems(updated);
                            if (typeof setLines === 'function') {
                              setLines(updated);
                            }
                          }}
                        >
                          <FaShieldAlt size={18} />
                        </button>
                      ) : (
                        <span className="me-2" style={{ width: '32px', height: '32px', display: 'inline-block' }}></span>
                      )}
                      <span className="text-capitalize fw-medium" style={{width: '40%'}}>{line.type}</span>
                      <span className="fw-bold text-end" style={{marginRight: 8}}>${line.price}</span>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm rounded-circle d-flex align-items-center justify-content-center"
                        title="Remove Line"
                        style={{ minWidth: '28px', minHeight: '28px', width: '28px', height: '28px', fontSize: '1.1rem', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onClick={() => handleRemoveLine(index)}
                      >
                        <span style={{lineHeight: 1, fontWeight: 'bold'}}>&times;</span>
                      </button>
                    </div>
                    {lineItems.length > 1 && index < lineItems.length - 1 && (
                      <hr style={{margin: '0 0 0.5rem 0', borderColor: '#bfc5ce', borderWidth: 2}} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
            {/* Right column: Line Items List or Summary/Terms */}
            <style>{printStyles}</style>
            <div className="d-flex flex-column align-items-center print-summary-center" style={{ minHeight: 500, flex: '0 0 60%', maxWidth: '60%' }} ref={printRef}>
              <div className="w-100" style={{overflowY: 'auto', maxHeight: 520}}>
                <div className="summary-section bg-light shadow-sm mb-3 px-3 pt-2 pb-1">
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center my-2">
                      <span className="fw-semibold">Total Retail Price</span>
                      <span className="fw-bold">${totalPrice.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="fw-semibold" style={{cursor: 'pointer'}} onClick={() => setCollapseFees(v => !v)}>
                        Fulfillment
                        <span style={{marginLeft: 8, fontWeight: 'bold', fontSize: '1.1em'}}>
                          {collapseFees ? '-' : '+'}
                        </span>
                      </span>
                      <span className="fw-bold">${feesTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                    </div>
                    {collapseFees && (
                      <div className="ps-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="fw-semibold">Warranty</span>
                          <span className="fw-bold">${protectionTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                        </div>
                        {furnitureDeliveryFee > 0 && (
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="fw-semibold">Furniture Delivery</span>
                            <span className="fw-bold">${furnitureDeliveryFee.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                          </div>
                        )}
                        {clearanceDeliveryFee > 0 && (
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="fw-semibold">Clearance Delivery</span>
                            <span className="fw-bold">${clearanceDeliveryFee.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                          </div>
                        )}
                        {mattressDeliveryFee > 0 && (
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="fw-semibold">Mattress Delivery</span>
                            <span className="fw-bold">${mattressDeliveryFee.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                          </div>
                        )}
                        {powerBaseDeliveryFee > 0 && (
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="fw-semibold">Power Base Delivery</span>
                            <span className="fw-bold">${powerBaseDeliveryFee.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                          </div>
                        )}
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="fw-semibold">Tax ({(parseFloat(taxRate) || 0).toFixed(1)}%)</span>
                          <span className="fw-bold">${summaryTax.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                        </div>
                      </div>
                    )}
                    <div className="d-flex justify-content-between align-items-center mb-2 mt-3" style={{fontSize: '1.1rem'}}>
                      <span className="fw-bold">Grand Total</span>
                      <span className="fw-bold">${summaryGrandTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="fw-semibold">Down Payment</span>
                      <span className="fw-bold">${summaryDownPayment.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center" style={{fontSize: '1.1rem'}}>
                      <span className="fw-bold">Total Financed</span>
                      <span className="fw-bold">${summaryFinanced.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                    </div>
                  </div>
                </div>
                <div className="terms-section p-2 mb-3">
                  <table className="table table-sm table-bordered mb-0 text-center align-middle">
                    <thead>
                      <tr>
                        {selectedTerms.map(term => (
                          <th key={term} className="text-center align-middle bg-light">{term} mo</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {selectedTerms.map(term => (
                          <td key={term} className="text-center align-middle">{getDiscountPercent(term)}</td>
                        ))}
                      </tr>
                      <tr>
                        {selectedTerms.map(term => (
                          <td key={term} className="text-center align-middle">{getDiscountDollar(term)}</td>
                        ))}
                      </tr>
                      <tr>
                        {selectedTerms.map(term => (
                          <td key={term} className="text-center align-middle fw-semibold text-primary">${getFinancedForTerm(term).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                        ))}
                      </tr>
                      <tr>
                        {selectedTerms.map(term => (
                          <td key={term} className="fw-bold text-center align-middle">${getMonthlyWithDiscount(term).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                  <div className="d-flex justify-content-end gap-2 mt-2">
                    {PAYMENT_TERMS.map(term => (
                      <button
                        key={term}
                        type="button"
                        className={`btn btn-sm ${selectedTerms.includes(term) ? 'btn-primary' : 'btn-outline-secondary'}`}
                        style={{minWidth: 48, fontWeight: 600}}
                        onClick={() => toggleTerm(term)}
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Bootstrap Toast for clearance financing restriction */}
      <div
        className="toast-container position-fixed bottom-0 end-0 p-3"
        style={{ zIndex: 9999 }}
      >
        <div
          className={`toast align-items-center text-bg-danger border-0 ${showClearanceToast ? 'show' : ''}`}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="d-flex">
            <div className="toast-body">
              Clearance items cannot be financed for more than 12 months.
            </div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              data-bs-dismiss="toast"
              aria-label="Close"
              onClick={() => setShowClearanceToast(false)}
            ></button>
          </div>
        </div>
        <div
          className={`toast align-items-center text-bg-warning border-0 ${showMattressProtectionToast ? 'show' : ''}`}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="d-flex">
            <div className="toast-body">
              Extended warranty is not available for mattresses.
            </div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              data-bs-dismiss="toast"
              aria-label="Close"
              onClick={() => setShowMattressProtectionToast(false)}
            ></button>
          </div>
        </div>
      </div>
      {/* Helper Modal for Calculation Tables */}
      <Modal show={showHelperModal} onHide={closeHelperModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>How Delivery & Protection Are Calculated</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ButtonGroup className="mb-4 w-100">
            {helperOptions.map(opt => (
              <ToggleButton
                key={opt.value}
                id={`helper-table-${opt.value}`}
                type="radio"
                variant="outline-primary"
                name="helper-table-group"
                value={opt.value}
                checked={helperTable === opt.value}
                onChange={() => setHelperTable(opt.value)}
                style={{ fontWeight: 500 }}
              >
                {opt.label}
              </ToggleButton>
            ))}
          </ButtonGroup>
          {helperTable === 'protection' && (
            <>
              <h5>Furniture & Clearance Protection Table</h5>
              <div className="table-responsive mb-2">
                <table className="table table-bordered table-sm">
                  <thead><tr><th>Min</th><th>Max</th><th>Price</th></tr></thead>
                  <tbody>
                    {protectionTable.map((row, i) => (
                      <tr key={i}><td>${row.min}</td><td>${row.max}</td><td>${row.price}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
          {helperTable === 'powerbase' && (
            <>
              <h5>Power Base Protection Table</h5>
              <div className="table-responsive mb-2">
                <table className="table table-bordered table-sm">
                  <thead><tr><th>Min</th><th>Max</th><th>Price</th></tr></thead>
                  <tbody>
                    {powerBaseProtectionTable.map((row, i) => (
                      <tr key={i}><td>${row.min}</td><td>${row.max}</td><td>${row.price}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
          {helperTable === 'whiteglove' && (
            <>
              <h5>White Glove Delivery Table</h5>
              <div className="table-responsive mb-2">
                <table className="table table-bordered table-sm">
                  <thead><tr><th>Min</th><th>Max</th><th>Fee</th></tr></thead>
                  <tbody>
                    {deliveryWhiteGloveTable.map((row, i) => (
                      <tr key={i}><td>${row.min}</td><td>${row.max}</td><td>${row.fee}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
          {helperTable === 'doorstep' && (
            <>
              <h5>Doorstep Delivery Table</h5>
              <div className="table-responsive mb-2">
                <table className="table table-bordered table-sm">
                  <thead><tr><th>Min</th><th>Max</th><th>Fee</th></tr></thead>
                  <tbody>
                    {deliveryDoorStepTable.map((row, i) => (
                      <tr key={i}><td>${row.min}</td><td>${row.max}</td><td>${row.fee}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
          {helperTable === 'clearance' && (
            <>
              <h5>Clearance Delivery Table</h5>
              <div className="table-responsive mb-2">
                <table className="table table-bordered table-sm">
                  <thead><tr><th>Min</th><th>Max</th><th>Fee</th></tr></thead>
                  <tbody>
                    {clearanceDeliveryTable.map((row, i) => (
                      <tr key={i}><td>${row.min}</td><td>${row.max}</td><td>${row.fee}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeHelperModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LineItemManager; 