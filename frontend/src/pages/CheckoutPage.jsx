import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ecommerceApi } from '../api/ecommerceApi';
import axios from 'axios';
import { ShieldCheck, Truck, CreditCard, ChevronLeft, Lock, Plus, MapPin, Building } from 'lucide-react';
import AddressModal from '../components/AddressModal';
import Breadcrumbs from '../components/Breadcrumbs';

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { clearCart } = useCart();
  
  const state = location.state || {};
  const { items = [], totalAmount = 0, isBuyNow = false } = state;

  const [isProcessing, setIsProcessing] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("RAZORPAY");
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  useEffect(() => {
    fetchAddresses();
  }, [token]);

  const fetchAddresses = async () => {
    if (!token) return;
    try {
        setLoadingAddresses(true);
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/addresses`, config);
        setAddresses(response.data);
        if (response.data.length > 0) {
            setSelectedAddressId(response.data[0].id);
        }
    } catch (error) {
        console.error("Failed to fetch addresses", error);
    } finally {
        setLoadingAddresses(false);
    }
  };

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart', { replace: true });
    }
  }, [items, navigate]);

  if (items.length === 0) {
    return null;
  }

  // Price Calculation Logic
  const subtotal = totalAmount;
  const deliveryCharge = 0; // Free delivery
  const platformFee = 2;
  const discount = 0; // Can be linked to coupons later
  const gst = Math.round(subtotal * 0.02); // 2% GST
  const finalTotal = subtotal + deliveryCharge + platformFee + gst - discount;

  const getSelectedAddressFormatted = () => {
      const addr = addresses.find(a => a.id === selectedAddressId);
      if (!addr) return "123 Default Street";
      return `${addr.fullName}, ${addr.houseNo}, ${addr.areaStreet}, ${addr.city}, ${addr.state} - ${addr.pinCode}. Ph: ${addr.mobileNumber}`;
  };

  const handleConfirmOrder = async () => {
    if (!token) {
      alert("Please login to place an order.");
      navigate('/login');
      return;
    }

    if (!selectedAddressId) {
      alert("Please add and select a shipping address.");
      return;
    }

    try {
      setIsProcessing(true);
      const orderData = {
        totalAmount: finalTotal,
        discount: discount,
        gst: gst,
        deliveryCharge: deliveryCharge,
        platformFee: platformFee,
        shippingAddress: getSelectedAddressFormatted(),
        paymentMethod: paymentMethod,
        items: items.map(item => ({
          productId: item.id || item.productId,
          quantity: item.quantity,
          price: item.price
        }))
      };
      
      const response = await ecommerceApi.createOrder(orderData, token);
      console.log('=== CREATE ORDER RESPONSE ===');
      console.log('orderId:', response.orderId);
      console.log('razorpayOrderId:', response.razorpayOrderId);
      console.log('paymentMethod:', response.paymentMethod);
      
      if (paymentMethod === 'RAZORPAY') {
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || "your_razorpay_key_id",
          amount: Math.round(finalTotal * 100),
          currency: "INR",
          name: "MS PharmCare",
          description: "Pharmacy Order",
          order_id: response.razorpayOrderId, 
          handler: async function (responseFromRazorpay) {
            try {
              console.log('=== RAZORPAY PAYMENT SUCCESS ===');
              console.log('razorpay_payment_id:', responseFromRazorpay.razorpay_payment_id);
              console.log('razorpay_order_id:', responseFromRazorpay.razorpay_order_id);
              console.log('razorpay_signature present:', !!responseFromRazorpay.razorpay_signature);
              console.log('App orderId:', response.orderId);

              const verifyPayload = {
                orderId: response.orderId,
                razorpayPaymentId: responseFromRazorpay.razorpay_payment_id,
                razorpayOrderId: responseFromRazorpay.razorpay_order_id,
                razorpaySignature: responseFromRazorpay.razorpay_signature
              };
              console.log('Sending verify payload:', JSON.stringify(verifyPayload));

              const verifyResp = await ecommerceApi.verifyPayment(verifyPayload, token);
              console.log('Verify response:', verifyResp);
              
              if (!isBuyNow) {
                  clearCart();
              }
              setIsProcessing(false);
              navigate(`/order-success/${response.orderId}`);
            } catch (err) {
              console.error('Payment verification failed:', err);
              console.error('Error response data:', err.response?.data);
              console.error('Error response status:', err.response?.status);
              setIsProcessing(false);
              alert("Payment verification failed. Your order is pending.");
              navigate('/orders');
            }
          },
          prefill: {
            name: addresses.find(a => a.id === selectedAddressId)?.fullName || "Customer",
            contact: addresses.find(a => a.id === selectedAddressId)?.mobileNumber || ""
          },
          theme: { color: "#059669" },
          modal: {
            ondismiss: function() {
              alert("Payment cancelled. Order remains pending.");
              setIsProcessing(false);
              navigate('/orders');
            }
          }
        };
        if (response.razorpayOrderId && response.razorpayOrderId.startsWith('order_mock_')) {
          console.log("Mocking Razorpay payment success for demo...");
          const verifyPayload = {
            orderId: response.orderId,
            razorpayPaymentId: "pay_mock_" + Date.now(),
            razorpayOrderId: response.razorpayOrderId,
            razorpaySignature: "mock_signature"
          };
          try {
            await ecommerceApi.verifyPayment(verifyPayload, token);
            if (!isBuyNow) clearCart();
            setIsProcessing(false);
            navigate(`/order-success/${response.orderId}`);
          } catch (err) {
            console.error('Mock verification failed:', err);
            setIsProcessing(false);
            alert("Payment verification failed.");
            navigate('/orders');
          }
          return;
        }

        const rzp1 = new window.Razorpay(options);
        rzp1.on('payment.failed', function (response) {
          alert("Payment failed: " + response.error.description);
          setIsProcessing(false);
        });
        rzp1.open();
      } else {
        if (!isBuyNow) clearCart();
        navigate(`/order-success/${response.orderId}`);
      }
    } catch (error) {
      console.error('Checkout failed:', error);
      alert(error.response?.data?.message || "Failed to place order. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="pch-checkout-page">
      <style>{`
         .pch-checkout-page { font-family: var(--font-body); color: var(--text); padding: 20px; max-width: 1100px; margin: 0 auto; width: 100%; }
         .pch-co-title { font-family: var(--font-display); font-size: 32px; font-weight: 600; margin-bottom: 24px; color: var(--text); }
         .pch-co-grid { display: grid; grid-template-columns: 1fr 380px; gap: 32px; align-items: start; }
         @media(max-width: 900px) { .pch-co-grid { grid-template-columns: 1fr; } }
         
         .pch-co-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 24px; margin-bottom: 24px; box-shadow: var(--shadow-soft); }
         .pch-co-card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
         .pch-co-card-title { display: flex; align-items: center; gap: 12px; font-family: var(--font-display); font-size: 20px; font-weight: 600; }
         .pch-co-card-icon { width: 40px; height: 40px; border-radius: 12px; background: var(--primary-light); display: flex; align-items: center; justify-content: center; color: var(--primary); flex-shrink: 0; }
         .pch-co-add-btn { background: none; border: none; color: var(--primary); font-weight: 700; font-size: 14px; cursor: pointer; display: flex; align-items: center; gap: 6px; }
         .pch-co-add-btn:hover { color: var(--primary-dark); }
         
         .pch-address-list { display: flex; flex-direction: column; gap: 16px; }
         .pch-address-item { display: flex; gap: 16px; padding: 16px; border: 2px solid var(--border); border-radius: var(--radius-md); cursor: pointer; transition: all 0.2s ease; }
         .pch-address-item.active { border-color: var(--primary); background: rgba(47, 82, 69, 0.05); }
         .pch-address-radio { margin-top: 4px; accent-color: var(--primary); width: 16px; height: 16px; }
         .pch-address-content { flex: 1; }
         .pch-address-name { display: flex; justify-content: space-between; font-weight: 700; font-size: 15px; margin-bottom: 4px; color: var(--text); }
         .pch-address-tag { font-size: 11px; background: var(--secondary-light); color: var(--secondary); padding: 2px 8px; border-radius: 999px; font-weight: 800; text-transform: uppercase; }
         .pch-address-text { font-size: 14px; color: var(--text-muted); line-height: 1.5; }
         .pch-address-mobile { font-size: 14px; font-weight: 600; color: var(--text); margin-top: 8px; }
         
         .pch-payment-list { display: flex; flex-direction: column; gap: 16px; }
         .pch-payment-item { border: 2px solid var(--border); border-radius: var(--radius-md); padding: 16px; cursor: pointer; transition: all 0.2s ease; }
         .pch-payment-item.active { border-color: var(--primary); background: rgba(47, 82, 69, 0.05); }
         .pch-payment-header { display: flex; align-items: flex-start; gap: 16px; }
         .pch-payment-title { font-weight: 700; font-size: 16px; display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 4px; color: var(--text); }
         .pch-payment-desc { font-size: 13.5px; color: var(--text-muted); }
         .pch-payment-methods { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
         .pch-payment-method { display: flex; align-items: center; gap: 6px; padding: 6px 10px; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; font-size: 12px; font-weight: 700; color: var(--text-muted); box-shadow: 0 1px 2px rgba(0,0,0,0.03); }
         .pch-payment-method img { height: 14px; }
         
         .pch-payment-notice { margin-top: 16px; padding: 12px; background: var(--primary-light); border: 1px solid rgba(47, 82, 69, 0.2); border-radius: 8px; color: var(--primary); font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 8px; }
         
         .pch-summary { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 24px; position: sticky; top: 24px; box-shadow: var(--shadow-soft); }
         .pch-summary-title { font-family: var(--font-display); font-size: 20px; font-weight: 600; margin-bottom: 20px; }
         .pch-summary-row { display: flex; justify-content: space-between; font-size: 14px; color: var(--text-muted); margin-bottom: 12px; }
         .pch-summary-row span:last-child { font-weight: 600; color: var(--text); }
         .pch-summary-row.total { border-top: 1px dashed var(--border); padding-top: 16px; margin-top: 4px; margin-bottom: 20px; font-size: 18px; font-weight: 700; color: var(--text); }
         .pch-summary-row.total span:last-child { color: var(--primary); font-size: 22px; }
         .pch-summary-savings { background: var(--primary-light); color: var(--primary-dark); text-align: center; padding: 8px; border-radius: 8px; font-size: 12px; font-weight: 700; margin-bottom: 20px; }
         
         .pch-checkout-btn { width: 100%; background: var(--primary); color: #fff; border: none; border-radius: var(--radius-md); padding: 16px; font-size: 16px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; transition: background 0.2s; }
         .pch-checkout-btn:hover { background: var(--primary-dark); }
         .pch-checkout-btn:disabled { opacity: 0.6; cursor: not-allowed; }
         
         .pch-checkout-secure { display: flex; justify-content: center; align-items: center; gap: 6px; font-size: 12px; color: var(--text-faint); margin-top: 16px; font-weight: 600; }
      `}</style>
      
      <div style={{ marginBottom: '24px' }}>
        <Breadcrumbs items={[{ path: '/cart', label: 'Cart' }, { label: 'Checkout' }]} />
      </div>

      <h1 className="pch-co-title">Checkout</h1>

      <div className="pch-co-grid">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          
          {/* Shipping Address */}
          <div className="pch-co-card">
            <div className="pch-co-card-header">
              <div className="pch-co-card-title">
                <div className="pch-co-card-icon">
                  <MapPin size={20} />
                </div>
                Delivery Address
              </div>
              <button onClick={() => { setEditingAddress(null); setIsAddressModalOpen(true); }} className="pch-co-add-btn">
                <Plus size={16} /> Add New
              </button>
            </div>
            
            {loadingAddresses ? (
                <div style={{ opacity: 0.5 }}>Loading addresses...</div>
            ) : addresses.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', border: '2px dashed var(--border)', borderRadius: 'var(--radius-md)' }}>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>No saved addresses found.</p>
                    <button onClick={() => { setEditingAddress(null); setIsAddressModalOpen(true); }} className="pch-co-add-btn" style={{ margin: '0 auto' }}>Add an address now</button>
                </div>
            ) : (
                <div className="pch-address-list">
                    {addresses.map(addr => (
                        <label key={addr.id} className={`pch-address-item ${selectedAddressId === addr.id ? 'active' : ''}`}>
                            <div>
                                <input type="radio" name="address" checked={selectedAddressId === addr.id} onChange={() => setSelectedAddressId(addr.id)} className="pch-address-radio" />
                            </div>
                            <div className="pch-address-content">
                                <div className="pch-address-name">
                                    <span>{addr.fullName}</span>
                                    {addr.isDefault && <span className="pch-address-tag">Default</span>}
                                </div>
                                <p className="pch-address-text">{addr.houseNo}, {addr.areaStreet}</p>
                                <p className="pch-address-text">{addr.city}, {addr.state} - {addr.pinCode}</p>
                                <p className="pch-address-mobile">Mobile: {addr.mobileNumber}</p>
                            </div>
                        </label>
                    ))}
                </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="pch-co-card">
            <div className="pch-co-card-header">
              <div className="pch-co-card-title">
                <div className="pch-co-card-icon">
                  <CreditCard size={20} />
                </div>
                Payment Options
              </div>
            </div>
            
            <div className="pch-payment-list">
              {/* Pay Online Option */}
              <label className={`pch-payment-item ${paymentMethod === 'RAZORPAY' ? 'active' : ''}`}>
                <div className="pch-payment-header">
                    <div>
                        <input type="radio" name="payment" value="RAZORPAY" checked={paymentMethod === 'RAZORPAY'} onChange={(e) => setPaymentMethod(e.target.value)} className="pch-address-radio" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <div className="pch-payment-title">
                            <span>Pay Online</span>
                            <img src="https://razorpay.com/assets/razorpay-logo.svg" alt="Razorpay" style={{ height: '16px', opacity: 0.7, filter: 'grayscale(100%)' }} />
                        </div>
                        <span className="pch-payment-desc">Pay securely using your preferred payment method</span>
                        
                        <div className="pch-payment-methods">
                            <div className="pch-payment-method">
                                <img src="https://cdn.razorpay.com/static/assets/upi/upi-logo.svg" alt="UPI" /> UPI
                            </div>
                            <div className="pch-payment-method">
                                <img src="https://cdn.razorpay.com/static/assets/paytm/paytm-logo.svg" alt="Paytm" /> Wallets
                            </div>
                            <div className="pch-payment-method">
                                <CreditCard size={14} /> Cards
                            </div>
                            <div className="pch-payment-method">
                                <Building size={14} /> NetBanking
                            </div>
                        </div>
                        
                        {paymentMethod === 'RAZORPAY' && (
                            <div className="pch-payment-notice">
                                <ShieldCheck size={16} />
                                You will be redirected to Razorpay to complete your payment securely.
                            </div>
                        )}
                    </div>
                </div>
              </label>

              {/* COD Option */}
              <label className={`pch-payment-item ${paymentMethod === 'COD' ? 'active' : ''}`}>
                <div className="pch-payment-header">
                    <div>
                        <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={(e) => setPaymentMethod(e.target.value)} className="pch-address-radio" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <div className="pch-payment-title">Cash on Delivery</div>
                        <span className="pch-payment-desc">Pay at your doorstep with cash or UPI</span>
                    </div>
                </div>
              </label>
            </div>
          </div>

        </div>

        {/* Order Summary */}
        <div>
          <div className="pch-summary">
            <h2 className="pch-summary-title">Price Details</h2>
            
            <div style={{ marginBottom: '24px' }}>
                <div className="pch-summary-row">
                    <span>Subtotal ({items.length} items)</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                </div>
                  <div className="pch-summary-row">
                    <span>GST (2%)</span>
                    <span>₹{gst.toFixed(2)}</span>
                  </div>
                <div className="pch-summary-row">
                    <span>Platform Fee</span>
                    <span>₹{platformFee.toFixed(2)}</span>
                </div>
                <div className="pch-summary-row">
                    <span>Delivery Charge</span>
                    <span style={{ color: deliveryCharge === 0 ? 'var(--primary)' : 'inherit' }}>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge.toFixed(2)}`}</span>
                </div>
                <div className="pch-summary-row total">
                    <span>Total Amount</span>
                    <span>₹{finalTotal.toFixed(2)}</span>
                </div>
                <div className="pch-summary-savings">
                    You will save ₹{deliveryCharge === 0 ? '50.00' : '0.00'} on this order!
                </div>
            </div>

            <button
              onClick={handleConfirmOrder}
              disabled={isProcessing || !selectedAddressId}
              className="pch-checkout-btn"
            >
              {isProcessing ? 'Processing...' : (
                <>
                  <Lock size={18} />
                  Place Order
                </>
              )}
            </button>
            
            <p className="pch-checkout-secure">
              <ShieldCheck size={14} /> Safe and secure payments. 100% Authentic products.
            </p>
          </div>
        </div>
      </div>
      
      <AddressModal 
        isOpen={isAddressModalOpen} 
        onClose={() => setIsAddressModalOpen(false)} 
        onSave={(newAddr) => { fetchAddresses(); setSelectedAddressId(newAddr.id); }}
        existingAddress={editingAddress} 
      />
    </div>
  );
}
