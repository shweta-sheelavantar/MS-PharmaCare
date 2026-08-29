import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ecommerceApi } from '../api/ecommerceApi';
import { useCart } from '../context/CartContext';
import { Loader2 } from 'lucide-react';

export default function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { fetchCart } = useCart();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [refunding, setRefunding] = useState({});

  useEffect(() => {
    if (!token) return;
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const data = await ecommerceApi.getOrderById(orderId, token);
        setOrder(data);
      } catch (err) {
        setError('Failed to fetch order details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [orderId, token]);

  const handleCancelOrder = async () => {
    const reason = window.prompt("Why are you cancelling this order? (e.g. wrong product, product missing)");
    if (reason === null) return;
    try {
      setCancelling(true);
      await ecommerceApi.cancelOrder(orderId, token, reason);
      setOrder({ ...order, orderStatus: 'CANCELLED', cancelReason: reason });
      alert("Order cancelled successfully");
    } catch (err) {
      alert("Failed to cancel order: " + (err.response?.data?.message || err.message));
    } finally {
      setCancelling(false);
    }
  };

  const handleRequestRefund = async (itemId) => {
    const reason = window.prompt("Why are you requesting a refund? (e.g. wrong product, product missing)");
    if (reason === null || !reason.trim()) return;
    try {
      setRefunding(prev => ({ ...prev, [itemId]: true }));
      await ecommerceApi.requestRefund(orderId, itemId, reason, token);
      const updatedProducts = order.products.map(p => 
        p.orderItemId === itemId ? { ...p, itemStatus: 'REFUND_REQUESTED', refundReason: reason } : p
      );
      setOrder({ ...order, products: updatedProducts });
      alert("Refund requested successfully");
    } catch (err) {
      alert("Failed to request refund: " + (err.response?.data?.message || err.message));
    } finally {
      setRefunding(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const handleDownloadInvoice = async () => {
    try {
      setDownloading(true);
      const blob = await ecommerceApi.downloadInvoice(orderId, token);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice_${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Failed to download invoice");
      console.error(err);
    } finally {
      setDownloading(false);
    }
  };

  const handleBuyAgain = async () => {
    if (!order || !order.products) return;
    try {
      for (const item of order.products) {
        await ecommerceApi.addToCart(item.productId, item.quantity, token);
      }
      await fetchCart();
      navigate('/cart');
    } catch (err) {
      alert("Failed to add items to cart");
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="animate-spin text-[#2F5245]" size={48} />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Order Not Found</h2>
        <p style={{ color: '#748177', marginBottom: '24px' }}>{error || "The order you are looking for does not exist."}</p>
        <Link to="/orders" style={{ color: '#2F5245', fontWeight: 700, textDecoration: 'underline' }}>Back to My Orders</Link>
      </div>
    );
  }

  const isCancellable = ['PENDING', 'CONFIRMED', 'PROCESSING'].includes(order.orderStatus?.toUpperCase());
  
  const orderDate = new Date(order.orderDate);
  const deliveryDate = new Date(orderDate);
  deliveryDate.setDate(orderDate.getDate() + 3);

  const getStepClass = (stepName) => {
    const status = order.orderStatus?.toUpperCase() || '';
    const steps = ['PLACED', 'CONFIRMED', 'PACKED', 'SHIPPED', 'DELIVERED'];
    
    if (status === 'CANCELLED' || status === 'FAILED') return '';
    
    // Map backend statuses to our UI steps
    let currentStepIdx = 0; // PLACED
    if (status === 'PROCESSING') currentStepIdx = 1;
    else if (status === 'CONFIRMED') currentStepIdx = 1;
    else if (status === 'PACKED') currentStepIdx = 2; // Assuming you might add this to backend later
    else if (status === 'SHIPPED') currentStepIdx = 3;
    else if (status === 'DELIVERED' || status === 'PAID') currentStepIdx = 4;

    const targetIdx = steps.indexOf(stepName);
    
    if (targetIdx < currentStepIdx) return 'done';
    if (targetIdx === currentStepIdx) return 'current';
    return '';
  };

  return (
    <div style={{ padding: '0 40px 60px', fontFamily: "'Manrope', sans-serif" }}>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Manrope:wght@400;500;600;700;800&display=swap');
        
        .order-details-wrap { max-width: 1280px; margin: 0 auto; animation: rise .55s ease forwards; }
        @keyframes rise{ from{opacity:0; transform:translateY(8px);} to{opacity:1; transform:translateY(0);} }

        .back-link { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 700; color: var(--text-muted); text-decoration: none; margin-bottom: 16px; transition: color .18s ease; }
        .back-link:hover { color: var(--primary); }
        .back-link svg { width: 15px; height: 15px; stroke: currentColor; }

        .order-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
        .order-title { font-family: 'Fraunces', serif; font-size: 28px; font-weight: 600; letter-spacing: -0.01em; display: flex; align-items: center; gap: 12px; flex-wrap: wrap; color: var(--text); }
        .order-date { font-size: 13px; color: var(--text-muted); margin-top: 6px; }
        .invoice-btn { display: flex; align-items: center; gap: 8px; background: var(--surface); border: 1px solid var(--border); padding: 11px 20px; border-radius: 999px; font-size: 13px; font-weight: 700; cursor: pointer; white-space: nowrap; transition: border-color .18s ease, background .18s ease; color: var(--text); }
        .invoice-btn:hover:not(:disabled) { border-color: var(--primary); background: var(--primary-light); }
        .invoice-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .invoice-btn svg { width: 15px; height: 15px; stroke: currentColor; }

        .tracking-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 26px 30px; margin-bottom: 20px; }
        .tracking-title { font-family: 'Fraunces', serif; font-size: 16px; font-weight: 600; margin-bottom: 24px; color: var(--text); }
        .stepper { display: flex; align-items: flex-start; position: relative; }
        .step { flex: 1; display: flex; flex-direction: column; align-items: center; text-align: center; position: relative; min-width: 0; }
        .step-line { position: absolute; top: 19px; left: -50%; width: 100%; height: 2px; background: var(--border); z-index: 0; }
        .step:first-child .step-line { display: none; }
        .step.done .step-line { background: var(--primary); }
        .step-dot { width: 38px; height: 38px; border-radius: 50%; background: var(--surface); border: 2px solid var(--border); display: flex; align-items: center; justify-content: center; z-index: 1; transition: background .2s ease, border-color .2s ease; }
        .step-dot svg { width: 16px; height: 16px; stroke: var(--text-faint); }
        .step.done .step-dot { background: var(--primary); border-color: var(--primary); }
        .step.done .step-dot svg { stroke: #fff; }
        .step.current .step-dot { background: var(--primary); border-color: var(--primary); box-shadow: 0 0 0 4px var(--primary-light); }
        .step.current .step-dot svg { stroke: #fff; }
        .step-label { font-size: 11.5px; font-weight: 700; margin-top: 10px; color: var(--text-faint); }
        .step.done .step-label, .step.current .step-label { color: var(--text); }

        .layout { display: grid; grid-template-columns: 1.5fr 1fr; gap: 20px; align-items: start; }
        .panel { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 24px 26px; min-width: 0; }
        .panel + .panel { margin-top: 16px; }
        .panel-title { font-family: 'Fraunces', serif; font-size: 17px; font-weight: 600; margin-bottom: 18px; color: var(--text); }

        .item-card { display: flex; gap: 16px; padding-bottom: 18px; }
        .item-thumb { width: 88px; height: 88px; border-radius: 14px; background: var(--danger-light); display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden; }
        .item-thumb img { width: 100%; height: 100%; object-fit: contain; }
        .item-thumb svg { width: 30px; height: 30px; stroke: var(--danger); }
        .item-info { flex: 1; min-width: 0; }
        .item-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }
        .item-name { font-size: 15px; font-weight: 700; color: var(--text); }
        .item-price { font-family: 'Fraunces', serif; font-size: 16px; font-weight: 600; white-space: nowrap; color: var(--text); }
        .item-desc { font-size: 12.5px; color: var(--text-muted); margin-top: 5px; line-height: 1.5; }
        .item-meta { display: flex; align-items: center; gap: 10px; margin-top: 10px; flex-wrap: wrap; }
        .item-tag { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.03em; color: var(--primary); background: var(--primary-light); padding: 4px 10px; border-radius: 999px; }
        .item-qty { font-size: 12px; color: var(--text-faint); font-weight: 700; }

        .order-actions { display: flex; align-items: center; gap: 12px; padding-top: 18px; border-top: 1px solid var(--border); flex-wrap: wrap; }
        .btn { display: flex; align-items: center; gap: 8px; padding: 11px 20px; border-radius: 999px; font-size: 13px; font-weight: 700; cursor: pointer; border: none; transition: background .18s ease, border-color .18s ease, color .18s ease; }
        .btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn svg { width: 15px; height: 15px; stroke: currentColor; }
        .btn-danger-outline { background: none; border: 1.5px solid var(--danger-light); color: var(--danger); }
        .btn-danger-outline:hover:not(:disabled) { background: var(--danger-light); }
        .btn-primary { background: var(--primary); color: #fff; }
        .btn-primary:hover:not(:disabled) { background: var(--primary-dark); }
        .btn-sm { padding: 6px 12px; font-size: 11px; }

        .sum-row { display: flex; align-items: center; justify-content: space-between; padding: 9px 0; font-size: 13.5px; }
        .sum-row .label { color: var(--text-muted); font-weight: 600; }
        .sum-row .val { font-weight: 700; color: var(--text); }
        .sum-total { display: flex; align-items: center; justify-content: space-between; background: var(--primary-light); border-radius: 12px; padding: 13px 16px; margin-top: 10px; }
        .sum-total .label { color: var(--primary-dark); font-weight: 700; font-size: 13.5px; }
        .sum-total .val { font-family: 'Fraunces', serif; color: var(--primary-dark); font-size: 18px; font-weight: 600; }

        .detail-block { display: flex; align-items: flex-start; gap: 12px; }
        .detail-block + .detail-block { margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border); }
        .detail-icon { width: 36px; height: 36px; border-radius: 11px; background: var(--secondary-light); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .detail-icon svg { width: 16px; height: 16px; stroke: var(--secondary); }
        .detail-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; color: var(--text-faint); }
        .detail-value { font-size: 13.5px; font-weight: 700; margin-top: 3px; color: var(--text); }
        .detail-sub { font-size: 12.5px; color: var(--text-muted); margin-top: 3px; }
        .status-chip { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700; padding: 4px 11px; border-radius: 999px; background: var(--accent-light); color: #9C6510; margin-top: 6px; }
        .status-chip.paid { background: var(--primary-light); color: var(--primary-dark); }
        .status-chip.failed { background: var(--danger-light); color: var(--danger); }

        @media (max-width:980px){
          .layout { grid-template-columns: 1fr; }
          .stepper { overflow-x: auto; padding-bottom: 10px; }
        }
      `}} />

      <div className="order-details-wrap">
        <Link to="/orders" className="back-link">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back to My Orders
        </Link>
        
        <div className="order-head">
          <div>
            <div className="order-title">Order #{order.orderId}</div>
            <div className="order-date">Placed on {orderDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} at {orderDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
          </div>
          <button 
            className="invoice-btn"
            onClick={handleDownloadInvoice}
            disabled={downloading}
          >
            {downloading ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12m0 0-4-4m4 4 4-4"/><path d="M4 17v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/></svg>
            )}
            Invoice
          </button>
        </div>

        <div className="tracking-card">
          <div className="tracking-title">Tracking Information</div>
          {order.orderStatus?.toUpperCase() === 'CANCELLED' ? (
            <div style={{ color: 'var(--danger)', fontWeight: 700, fontSize: '15px' }}>
              This order has been cancelled.
              {order.cancelReason && <div style={{ fontSize: '13px', marginTop: '5px', fontWeight: 500 }}>Reason: {order.cancelReason}</div>}
            </div>
          ) : (
            <div className="stepper">
              <div className={`step ${getStepClass('PLACED')}`}>
                <span className="step-line"></span>
                <div className="step-dot"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg></div>
                <div className="step-label">Placed</div>
              </div>
              <div className={`step ${getStepClass('CONFIRMED')}`}>
                <span className="step-line"></span>
                <div className="step-dot"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg></div>
                <div className="step-label">Confirmed</div>
              </div>
              <div className={`step ${getStepClass('PACKED')}`}>
                <span className="step-line"></span>
                <div className="step-dot"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8l-9-5-9 5 9 5 9-5Z"/><path d="M3 8v8l9 5 9-5V8"/></svg></div>
                <div className="step-label">Packed</div>
              </div>
              <div className={`step ${getStepClass('SHIPPED')}`}>
                <span className="step-line"></span>
                <div className="step-dot"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8Z"/><circle cx="5.5" cy="18.5" r="1.5"/><circle cx="18.5" cy="18.5" r="1.5"/></svg></div>
                <div className="step-label">Shipped</div>
              </div>
              <div className={`step ${getStepClass('DELIVERED')}`}>
                <span className="step-line"></span>
                <div className="step-dot"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="m9 12 2 2 4-4"/></svg></div>
                <div className="step-label">Delivered</div>
              </div>
            </div>
          )}
        </div>

        <div className="layout">
          <div>
            <div className="panel">
              <div className="panel-title">Items Ordered</div>
              
              {order.products?.map((item) => (
                <div key={item.productId} className="item-card">
                  <div className="item-thumb">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} />
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>
                    )}
                  </div>
                  <div className="item-info">
                    <div className="item-top">
                      <div className="item-name">{item.name}</div>
                      <div className="item-price">₹{item.totalPrice}</div>
                    </div>
                    <div className="item-desc">{item.description}</div>
                    <div className="item-meta">
                      {item.category && <span className="item-tag">{item.category}</span>}
                      <span className="item-qty">Qty: {item.quantity}</span>
                      {order.orderStatus?.toUpperCase() === 'DELIVERED' && item.itemStatus === 'REFUND_REQUESTED' && (
                        <span className="item-tag" style={{ background: 'var(--warning-light)', color: 'var(--warning)' }}>Refund Requested</span>
                      )}
                      {order.orderStatus?.toUpperCase() === 'DELIVERED' && item.itemStatus === 'REFUNDED' && (
                        <span className="item-tag" style={{ background: 'var(--danger-light)', color: 'var(--danger)' }}>Refunded</span>
                      )}
                    </div>
                    {order.orderStatus?.toUpperCase() === 'DELIVERED' && (!item.itemStatus || item.itemStatus === 'NONE') && (
                      <button 
                        className="btn btn-danger-outline btn-sm" 
                        style={{ marginTop: '10px' }}
                        onClick={() => handleRequestRefund(item.orderItemId)}
                        disabled={refunding[item.orderItemId]}
                      >
                        {refunding[item.orderItemId] ? 'Requesting...' : 'Request Refund'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
              <div className="order-actions">
                {isCancellable && (
                  <button 
                    className="btn btn-danger-outline" 
                    onClick={handleCancelOrder}
                    disabled={cancelling}
                  >
                    {cancelling ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="m15 9-6 6M9 9l6 6"/></svg>
                    )}
                    Cancel Order
                  </button>
                )}
                <button className="btn btn-primary" onClick={handleBuyAgain}>
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 2.6-6.3"/><path d="M3 4v5h5"/></svg>
                  Buy Again
                </button>
              </div>
            </div>
          </div>

          <div>
            <div className="panel">
              <div className="panel-title">Order Summary</div>
              <div className="sum-row"><span className="label">Subtotal</span><span className="val">₹{(order.totalAmount - (order.deliveryCharge || 0) - (order.gst || 0) - (order.platformFee || 0) + (order.discount || 0)).toFixed(2)}</span></div>
              {(order.discount > 0) && (
                <div className="sum-row"><span className="label">Discount</span><span className="val" style={{ color: '#6c9834' }}>-₹{order.discount.toFixed(2)}</span></div>
              )}
              <div className="sum-row"><span className="label">GST</span><span className="val">₹{(order.gst || 0).toFixed(2)}</span></div>
              <div className="sum-row"><span className="label">Delivery Charge</span><span className="val">₹{(order.deliveryCharge || 0).toFixed(2)}</span></div>
              <div className="sum-total"><span className="label">Grand Total</span><span className="val">₹{order.totalAmount?.toFixed(2)}</span></div>
            </div>

            <div className="panel">
              <div className="panel-title">Delivery Details</div>
              <div className="detail-block">
                <div className="detail-icon"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8Z"/><circle cx="5.5" cy="18.5" r="1.5"/><circle cx="18.5" cy="18.5" r="1.5"/></svg></div>
                <div>
                  <div className="detail-label">Expected Delivery</div>
                  <div className="detail-value">{deliveryDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
                </div>
              </div>
              <div className="detail-block">
                <div className="detail-icon"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.4 10.5c0 6-8.4 11-8.4 11s-8.4-5-8.4-11a8.4 8.4 0 0 1 16.8 0Z"/><circle cx="12" cy="10.5" r="2.5"/></svg></div>
                <div>
                  <div className="detail-label">Shipping Address</div>
                  <div className="detail-value" style={{ fontWeight: 500, fontSize: '13px' }}>{order.deliveryAddress}</div>
                </div>
              </div>
            </div>

            <div className="panel">
              <div className="panel-title">Payment Details</div>
              <div className="detail-block">
                <div className="detail-icon"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg></div>
                <div>
                  <div className="detail-label">Payment Method</div>
                  <div className="detail-value">{order.paymentMethod === 'RAZORPAY' ? 'Paid Online' : order.paymentMethod}</div>
                  <div className={`status-chip ${order.paymentStatus === 'PAID' ? 'paid' : order.paymentStatus === 'FAILED' ? 'failed' : ''}`}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }}></span>
                    {order.paymentStatus === 'PAID' ? 'Payment Successful' : order.paymentStatus === 'FAILED' ? 'Payment Failed' : 'Payment Pending'}
                  </div>
                  {order.paymentId && (
                    <div style={{ marginTop: '10px' }}>
                      <div className="detail-label">Transaction ID</div>
                      <div className="detail-value" style={{ fontWeight: 500, fontSize: '12px', fontFamily: 'monospace' }}>{order.paymentId}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
