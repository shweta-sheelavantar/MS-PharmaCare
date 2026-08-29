import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ecommerceApi } from '../api/ecommerceApi';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingOrderId, setDownloadingOrderId] = useState(null);
  const [activeTab, setActiveTab] = useState('All Orders');
  const { token } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const data = await ecommerceApi.getUserOrders(token);
        setOrders(data.orders || []);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  const handleDownloadInvoice = async (orderId) => {
    try {
      setDownloadingOrderId(orderId);
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
      setDownloadingOrderId(null);
    }
  };

  const getStatusClass = (status) => {
    if (!status) return '';
    const s = status.toUpperCase();
    if (['DELIVERED', 'PAID', 'CONFIRMED', 'SHIPPED'].includes(s)) return 'confirmed';
    if (['PENDING', 'PROCESSING'].includes(s)) return 'pending';
    if (['CANCELLED', 'FAILED'].includes(s)) return 'cancelled';
    return '';
  };
  
  const getStatusLabel = (status) => {
    if (!status) return '';
    const s = status.toUpperCase();
    if (['DELIVERED', 'PAID', 'CONFIRMED', 'SHIPPED'].includes(s)) return 'CONFIRMED';
    if (['PENDING', 'PROCESSING'].includes(s)) return 'PENDING';
    if (['CANCELLED', 'FAILED'].includes(s)) return 'CANCELLED';
    return status.toUpperCase();
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'All Orders') return true;
    if (activeTab === 'Confirmed') return ['DELIVERED', 'PAID', 'CONFIRMED', 'SHIPPED'].includes(order.orderStatus?.toUpperCase());
    if (activeTab === 'Pending') return ['PENDING', 'PROCESSING'].includes(order.orderStatus?.toUpperCase());
    if (activeTab === 'Cancelled') return ['CANCELLED', 'FAILED'].includes(order.orderStatus?.toUpperCase());
    return true;
  });

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="animate-spin text-[#2F5245]" size={48} />
      </div>
    );
  }

  return (
    <div style={{ padding: '0 40px 60px', fontFamily: "'Manrope', sans-serif" }}>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Manrope:wght@400;500;600;700;800&display=swap');

        .orders-wrap { max-width: 1160px; margin: 0 auto; animation: rise 0.55s ease forwards; }
        @keyframes rise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .breadcrumb { font-size: 12.5px; color: var(--text-faint); font-weight: 600; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }
        .breadcrumb b { color: var(--text); font-weight: 700; }
        .breadcrumb svg { width: 13px; height: 13px; stroke: var(--text-faint); }
        
        .page-title { font-family: 'Fraunces', serif; font-size: 30px; font-weight: 600; letter-spacing: -0.01em; margin-bottom: 4px; color: var(--text); }
        .page-sub { font-size: 13.5px; color: var(--text-muted); margin-bottom: 24px; }
        
        .tabs { display: flex; gap: 8px; margin-bottom: 24px; flex-wrap: wrap; }
        .tab { padding: 8px 16px; border-radius: 20px; font-size: 12.5px; font-weight: 700; cursor: pointer; border: 1px solid var(--border); background: var(--surface); color: var(--text-muted); transition: 0.2s; outline: none; }
        .tab.active { background: var(--primary); color: #fff; border-color: var(--primary); }
        .tab:hover:not(.active) { border-color: var(--primary-light); background: var(--primary-light); color: var(--text); }
        
        .order-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); margin-bottom: 16px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.02); transition: 0.2s; }
        .order-card:hover { box-shadow: var(--shadow-soft); }
        .order-header { padding: 20px 24px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: flex-start; background: var(--surface-alt); }
        .order-id { font-size: 15px; font-weight: 700; color: var(--text); display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .order-status { font-size: 10px; font-weight: 800; letter-spacing: 0.04em; text-transform: uppercase; padding: 4px 10px; border-radius: 999px; }
        .order-status.confirmed { background: var(--primary-light); color: var(--primary-dark); }
        .order-status.pending { background: var(--accent-light); color: #B57A2F; }
        .order-status.cancelled { background: var(--danger-light); color: var(--danger); }
        .order-date { font-size: 12px; color: var(--text-faint); margin-top: 6px; }
        .order-total-label { font-size: 11px; color: var(--text-faint); font-weight: 700; text-align: right; }
        .order-total { font-family: 'Fraunces', serif; font-size: 19px; font-weight: 600; color: var(--text); margin-top: 2px; text-align: right; }
        
        .order-items { padding: 8px 24px; }
        .order-item { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--border); }
        .order-item:last-child { border-bottom: none; }
        .item-left { display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0; }
        .item-qty { font-size: 11.5px; font-weight: 800; color: var(--primary); background: var(--primary-light); padding: 4px 10px; border-radius: 999px; flex-shrink: 0; }
        .item-name { font-size: 13.5px; font-weight: 600; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .item-price { font-size: 13.5px; font-weight: 700; color: var(--text-muted); }
        
        .order-footer { padding: 16px 24px; border-top: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
        .order-action { display: flex; align-items: center; gap: 6px; font-size: 12.5px; font-weight: 700; color: var(--text-muted); text-decoration: none; transition: color 0.2s; background: none; border: none; cursor: pointer; padding: 0; }
        .order-action:hover:not(:disabled) { color: var(--primary); }
        .order-action:disabled { opacity: 0.5; cursor: not-allowed; }
        .order-action svg { width: 14px; height: 14px; stroke: currentColor; }
        .order-details-link { display: flex; align-items: center; gap: 6px; font-size: 12.5px; font-weight: 700; color: var(--text); text-decoration: none; transition: color 0.2s; cursor: pointer; }
        .order-details-link:hover { color: var(--primary); }
        .order-details-link svg { width: 14px; height: 14px; stroke: currentColor; transition: transform 0.2s; }
        .order-details-link:hover svg { transform: translateX(3px); }
        
        .empty-orders { text-align: center; padding: 60px 0; }
        .empty-icon { width: 80px; height: 80px; background: var(--surface); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.02); border: 1px solid var(--border); }
        .empty-title { font-family: 'Fraunces', serif; font-size: 24px; font-weight: 600; margin-bottom: 8px; color: var(--text); }
        .empty-sub { color: var(--text-muted); font-size: 14px; margin-bottom: 24px; }
        .empty-btn { background: var(--primary); color: #fff; padding: 12px 24px; border-radius: 999px; font-size: 14px; font-weight: 700; text-decoration: none; display: inline-block; transition: background 0.2s; border: none; cursor: pointer; }
        .empty-btn:hover { background: var(--primary-dark); }
      `}} />
      
      <div className="orders-wrap">
        <div className="breadcrumb">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5 12 3l9 6.5V21a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5Z"/></svg>
          Home / <b>My Orders</b>
        </div>
        
        <div className="page-title">My Orders</div>
        <div className="page-sub">View and track your recent orders</div>

        <div className="tabs">
          {['All Orders', 'Confirmed', 'Pending', 'Cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tab ${activeTab === tab ? 'active' : ''}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {orders.length === 0 ? (
           <div className="empty-orders">
             <div className="empty-icon">
               <Package size={32} color="var(--text-faint)" />
             </div>
             <div className="empty-title">No orders yet</div>
             <div className="empty-sub">When you place an order, it will appear here.</div>
             <Link to="/products" className="empty-btn">Start Shopping</Link>
           </div>
        ) : filteredOrders.length === 0 ? (
           <div className="empty-orders">
             <div className="empty-sub">No orders found for the selected filter.</div>
           </div>
        ) : (
          <div>
            {filteredOrders.map((order) => (
              <div key={order.orderId} className="order-card">
                <div className="order-header">
                  <div>
                    <div className="order-id">
                      Order #{order.orderId || 'N/A'}
                      {order.orderStatus && (
                        <span className={`order-status ${getStatusClass(order.orderStatus)}`}>
                          {getStatusLabel(order.orderStatus)}
                        </span>
                      )}
                    </div>
                    <div className="order-date">
                      Placed on {order.orderDate ? new Date(order.orderDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Unknown Date'}
                    </div>
                  </div>
                  <div>
                    <div className="order-total-label">Total Amount</div>
                    <div className="order-total">₹{order.totalAmount ? order.totalAmount.toFixed(2) : '0.00'}</div>
                  </div>
                </div>
                
                <div className="order-items">
                  {order.products && order.products.map((item, idx) => (
                    <div key={item.productId || idx} className="order-item">
                      <div className="item-left">
                        <span className="item-qty">{item.quantity}x</span>
                        <span className="item-name">{item.name}</span>
                      </div>
                      <span className="item-price">₹{item.totalPrice}</span>
                    </div>
                  ))}
                </div>
                
                <div className="order-footer">
                  <button 
                    onClick={() => handleDownloadInvoice(order.orderId)}
                    disabled={downloadingOrderId === order.orderId}
                    className="order-action"
                  >
                    {downloadingOrderId === order.orderId ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12m0 0-4-4m4 4 4-4"/><path d="M4 17v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/></svg>
                    )}
                    Invoice
                  </button>
                  <Link to={`/order/${order.orderId}`} className="order-details-link">
                    View Details
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

