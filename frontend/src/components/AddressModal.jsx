import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, MapPin, Building, Phone, User, Home, Briefcase, Map } from 'lucide-react';



const AddressModal = ({ isOpen, onClose, onSave, existingAddress }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        mobileNumber: '',
        pinCode: '',
        houseNo: '',
        areaStreet: '',
        landmark: '',
        city: '',
        state: '',
        addressType: 'Home',
        isDefault: false
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [fetchingPin, setFetchingPin] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsClosing(false);
            if (existingAddress) {
                setFormData({
                    ...existingAddress,
                    addressType: existingAddress.addressType || 'Home'
                });
            } else {
                setFormData({
                    fullName: '',
                    mobileNumber: '',
                    pinCode: '',
                    houseNo: '',
                    areaStreet: '',
                    landmark: '',
                    city: '',
                    state: '',
                    addressType: 'Home',
                    isDefault: false
                });
            }
            setErrors({});
        }
    }, [existingAddress, isOpen]);

    // Handle closing animation
    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
            setIsClosing(false);
        }, 300); // Matches transition duration
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        // Validation logic on change
        if (name === 'mobileNumber' && value && !/^\d{0,10}$/.test(value)) return;
        if (name === 'pinCode' && value && !/^\d{0,6}$/.test(value)) return;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        
        // Clear specific error
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }

        // Auto-fetch city/state when PIN code is 6 digits
        if (name === 'pinCode' && value.length === 6) {
            fetchCityState(value);
        }
    };

    const fetchCityState = async (pin) => {
        setFetchingPin(true);
        try {
            const res = await axios.get(`https://api.postalpincode.in/pincode/${pin}`);
            if (res.data && res.data[0].Status === 'Success') {
                const postOffice = res.data[0].PostOffice[0];
                setFormData(prev => ({
                    ...prev,
                    city: postOffice.District,
                    state: postOffice.State
                }));
                setErrors(prev => ({ ...prev, pinCode: null }));
            } else {
                setErrors(prev => ({ ...prev, pinCode: 'Invalid PIN Code' }));
            }
        } catch (err) {
            console.error('Error fetching PIN details:', err);
        } finally {
            setFetchingPin(false);
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
        if (!formData.mobileNumber || formData.mobileNumber.length !== 10) newErrors.mobileNumber = 'Valid 10-digit Mobile Number is required';
        if (!formData.pinCode || formData.pinCode.length !== 6) newErrors.pinCode = 'Valid 6-digit PIN Code is required';
        if (!formData.houseNo.trim()) newErrors.houseNo = 'House No / Flat is required';
        if (!formData.areaStreet.trim()) newErrors.areaStreet = 'Area / Street is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.state.trim()) newErrors.state = 'State is required';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const renderInput = (Icon, label, name, placeholder, required = false, maxLength = undefined, type = "text") => {
        const value = formData[name] || '';
        const error = errors[name];
        return (
            <div className="pch-am-field">
                <label className={`pch-am-label ${required ? 'required' : ''}`}>
                    {label}
                </label>
                <div className="pch-am-input-wrap">
                    <div className="pch-am-input-icon">
                        <Icon size={18} strokeWidth={2.5} />
                    </div>
                    <input
                        type={type}
                        name={name}
                        id={name}
                        value={value}
                        onChange={handleChange}
                        placeholder={placeholder}
                        maxLength={maxLength}
                        className={`pch-am-input ${error ? 'error' : ''}`}
                    />
                </div>
                {error && <p className="pch-am-error">{error}</p>}
            </div>
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            let response;
            if (existingAddress?.id) {
                response = await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/addresses/${existingAddress.id}`, formData, config);
            } else {
                response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/addresses`, formData, config);
            }
            onSave(response.data);
            handleClose();
        } catch (error) {
            console.error("Error saving address:", error);
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                alert("Your session has expired. Please log in again.");
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
                return;
            }
            // Show alert or handle error message more gracefully
            alert("Failed to save address. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen && !isClosing) return null;

    return (
        <div className={`pch-address-modal-overlay ${isClosing ? 'closing' : ''}`} onClick={handleClose}>
            <style>{`
                .pch-address-modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(37,51,46,0.6); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 20px; opacity: 1; transition: opacity 0.3s ease; }
                .pch-address-modal-overlay.closing { opacity: 0; }
                .pch-am-container { background: var(--surface); width: 100%; max-width: 760px; max-height: 90vh; border-radius: var(--radius-lg); display: flex; flex-direction: column; overflow: hidden; box-shadow: var(--shadow-lift); transform: translateY(0) scale(1); transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
                .pch-address-modal-overlay.closing .pch-am-container { transform: translateY(20px) scale(0.95); }
                
                .pch-am-header { padding: 20px 24px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; background: var(--surface); z-index: 10; flex-shrink: 0; }
                .pch-am-title-area { display: flex; align-items: center; gap: 16px; }
                .pch-am-icon-box { width: 48px; height: 48px; border-radius: 14px; background: var(--primary-light); color: var(--primary); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
                .pch-am-title { font-family: var(--font-display); font-size: 24px; font-weight: 600; color: var(--text); margin: 0 0 4px 0; }
                .pch-am-subtitle { font-family: var(--font-body); font-size: 14px; color: var(--text-muted); margin: 0; }
                .pch-am-close { background: none; border: none; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--text-muted); cursor: pointer; transition: all 0.2s; }
                .pch-am-close:hover { background: var(--secondary-light); color: var(--text); }
                
                .pch-am-body { flex: 1; overflow-y: auto; padding: 24px; }
                .pch-am-form { display: flex; flex-direction: column; gap: 24px; }
                .pch-am-section { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 20px; }
                .pch-am-section-title { font-family: var(--font-display); font-size: 18px; font-weight: 600; color: var(--text); margin: 0 0 16px 0; padding-bottom: 12px; border-bottom: 1px dashed var(--border); }
                .pch-am-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                .pch-am-grid.full { grid-template-columns: 1fr; }
                @media(max-width: 600px) { .pch-am-grid { grid-template-columns: 1fr; } }
                
                .pch-am-field { display: flex; flex-direction: column; gap: 8px; position: relative; }
                .pch-am-label { font-size: 14px; font-weight: 700; color: var(--text); display: flex; align-items: center; gap: 4px; font-family: var(--font-body); }
                .pch-am-label.required::after { content: "*"; color: var(--danger); }
                .pch-am-input-wrap { position: relative; display: flex; align-items: center; }
                .pch-am-input-icon { position: absolute; left: 14px; color: var(--text-faint); pointer-events: none; }
                .pch-am-input { width: 100%; height: 48px; padding: 0 16px 0 44px; background: var(--surface); border: 2px solid var(--border); border-radius: var(--radius-sm); font-family: var(--font-body); font-size: 15px; color: var(--text); font-weight: 500; transition: all 0.2s; outline: none; box-sizing: border-box; }
                .pch-am-input:focus { border-color: var(--primary); box-shadow: 0 0 0 4px var(--primary-light); }
                .pch-am-input.error { border-color: var(--danger); }
                .pch-am-input.error:focus { box-shadow: 0 0 0 4px var(--danger-light); }
                .pch-am-error { font-size: 12px; color: var(--danger); font-weight: 600; margin-top: 4px; font-family: var(--font-body); }
                
                .pch-am-type-btns { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 20px; }
                .pch-am-type-btn { display: flex; align-items: center; gap: 8px; padding: 10px 16px; border: 2px solid var(--border); border-radius: var(--radius-sm); background: var(--surface); color: var(--text-muted); font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s; font-family: var(--font-body); }
                .pch-am-type-btn:hover { border-color: var(--secondary); color: var(--text); }
                .pch-am-type-btn.active { border-color: var(--primary); background: var(--primary-light); color: var(--primary-dark); }
                
                .pch-am-default { display: flex; align-items: center; gap: 12px; padding: 16px; border: 2px solid var(--border); border-radius: var(--radius-sm); background: var(--surface-alt); cursor: pointer; transition: all 0.2s; font-family: var(--font-body); }
                .pch-am-default:hover { border-color: var(--primary); }
                .pch-am-default-check { width: 20px; height: 20px; accent-color: var(--primary); cursor: pointer; }
                .pch-am-default-text h4 { margin: 0 0 2px 0; font-size: 14px; font-weight: 700; color: var(--text); }
                .pch-am-default-text p { margin: 0; font-size: 12px; color: var(--text-muted); font-weight: 500; }
                
                .pch-am-footer { padding: 20px 24px; border-top: 1px solid var(--border); background: var(--surface); display: flex; justify-content: flex-end; gap: 16px; flex-shrink: 0; }
                .pch-am-btn-cancel { height: 48px; padding: 0 24px; background: none; border: 2px solid var(--border); border-radius: var(--radius-sm); font-family: var(--font-body); font-size: 15px; font-weight: 700; color: var(--text); cursor: pointer; transition: all 0.2s; }
                .pch-am-btn-cancel:hover { background: var(--surface-alt); border-color: var(--text-faint); }
                .pch-am-btn-save { height: 48px; padding: 0 32px; background: var(--primary); border: none; border-radius: var(--radius-sm); font-family: var(--font-body); font-size: 15px; font-weight: 700; color: white; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; min-width: 160px; box-shadow: 0 4px 12px rgba(47, 82, 69, 0.2); }
                .pch-am-btn-save:hover { background: var(--primary-dark); transform: translateY(-1px); box-shadow: 0 6px 16px rgba(47, 82, 69, 0.3); }
                .pch-am-btn-save:disabled { opacity: 0.7; cursor: not-allowed; transform: none; box-shadow: none; }
                
                .pch-am-spinner { width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: pch-spin 0.8s linear infinite; }
                @keyframes pch-spin { to { transform: rotate(360deg); } }
                
                .pch-am-pin-loader { position: absolute; right: 14px; width: 16px; height: 16px; border: 2px solid var(--primary-light); border-top-color: var(--primary); border-radius: 50%; animation: pch-spin 0.8s linear infinite; }
            `}</style>
            
            <div className="pch-am-container" onClick={e => e.stopPropagation()}>
                
                {/* Header */}
                <div className="pch-am-header">
                    <div className="pch-am-title-area">
                        <div className="pch-am-icon-box">
                            <MapPin size={24} strokeWidth={2} />
                        </div>
                        <div>
                            <h2 className="pch-am-title">
                                {existingAddress ? 'Edit Address' : 'Add New Address'}
                            </h2>
                            <p className="pch-am-subtitle">Enter your delivery details below</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleClose}
                        className="pch-am-close"
                        aria-label="Close"
                    >
                        <X size={24} strokeWidth={2.5} />
                    </button>
                </div>

                {/* Scrollable Form Content */}
                <div className="pch-am-body">
                    <form id="addressForm" onSubmit={handleSubmit} className="pch-am-form">
                        
                        <div className="pch-am-section">
                            <h3 className="pch-am-section-title">Contact Details</h3>
                            <div className="pch-am-grid">
                                {renderInput(User, "Full Name", "fullName", "Enter your full name", true)}
                                {renderInput(Phone, "Mobile Number", "mobileNumber", "10-digit mobile number", true, 10)}
                            </div>
                        </div>

                        <div className="pch-am-section">
                            <h3 className="pch-am-section-title">Address Details</h3>
                            <div className="pch-am-grid">
                                <div style={{ position: 'relative' }}>
                                    {renderInput(MapPin, "PIN Code", "pinCode", "6-digit PIN code", true, 6)}
                                    {fetchingPin && <div className="pch-am-pin-loader" style={{ top: '38px' }}></div>}
                                </div>
                                {renderInput(Building, "Flat, House no., Building", "houseNo", "Enter flat/house number", true)}
                            </div>
                            <div className="pch-am-grid full" style={{ marginTop: '20px' }}>
                                {renderInput(Map, "Area, Street, Sector, Village", "areaStreet", "Enter full street address", true)}
                            </div>
                            <div className="pch-am-grid" style={{ marginTop: '20px' }}>
                                {renderInput(MapPin, "Landmark", "landmark", "e.g. Near Apollo Hospital", false)}
                                {renderInput(MapPin, "City / District", "city", "Auto-filled or enter city", true)}
                                {renderInput(MapPin, "State", "state", "Auto-filled or enter state", true)}
                            </div>
                        </div>

                        <div className="pch-am-section">
                            <h3 className="pch-am-section-title">Preferences</h3>
                            
                            <label className="pch-am-label" style={{ marginBottom: '12px', display: 'block' }}>Address Type</label>
                            <div className="pch-am-type-btns">
                                {['Home', 'Work', 'Other'].map(type => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, addressType: type }))}
                                        className={`pch-am-type-btn ${formData.addressType === type ? 'active' : ''}`}
                                    >
                                        {type === 'Home' && <Home size={18} strokeWidth={2.5} />}
                                        {type === 'Work' && <Briefcase size={18} strokeWidth={2.5} />}
                                        {type === 'Other' && <MapPin size={18} strokeWidth={2.5} />}
                                        {type}
                                    </button>
                                ))}
                            </div>

                            <label className="pch-am-default">
                                <input
                                    type="checkbox"
                                    name="isDefault"
                                    checked={formData.isDefault}
                                    onChange={handleChange}
                                    className="pch-am-default-check"
                                />
                                <div className="pch-am-default-text">
                                    <h4>Make this my default address</h4>
                                    <p>We'll auto-select this for future orders</p>
                                </div>
                            </label>
                        </div>
                        
                    </form>
                </div>

                {/* Sticky Footer */}
                <div className="pch-am-footer">
                    <button 
                        type="button" 
                        onClick={handleClose}
                        disabled={loading}
                        className="pch-am-btn-cancel"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        form="addressForm"
                        disabled={loading}
                        className="pch-am-btn-save"
                    >
                        {loading ? (
                            <div className="pch-am-spinner"></div>
                        ) : (
                            'Save Address'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddressModal;
