import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ecommerceApi } from '../api/ecommerceApi';
import { CheckCircle, Download, Package, ArrowRight, Truck, ShoppingBag, CreditCard, MapPin } from 'lucide-react';
import { generateInvoice } from '../utils/generateInvoice';
import Breadcrumbs from '../components/Breadcrumbs';
import axios from 'axios';

export default function OrderSuccessPage() {
    const { orderId } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchOrderAndUser = async () => {
            try {
                const data = await ecommerceApi.getUserOrders(token);
                const ordersList = Array.isArray(data.orders) ? data.orders : [];
                const foundOrder = ordersList.find(o => o.orderId === orderId);
                setOrder(foundOrder);
                
                const config = { headers: { Authorization: `Bearer ${token}` } };
                try {
                    const userResp = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/auth/profile`, config);
                    setUser(userResp.data);
                } catch (err) {
                    console.error("Failed to fetch order", err);
                }
            } catch (err) {
                console.error("Failed to fetch order", err);
            }
        };

        fetchOrderAndUser();
    }, [orderId, token, navigate]);

    if (!order) {
        return (
            <div className="pch-os-loading">
                <style>{`
                    .pch-os-loading { min-height: 60vh; display: flex; align-items: center; justify-content: center; }
                    .pch-os-spinner { width: 40px; height: 40px; border: 4px solid var(--border, #E6EAE2); border-top-color: var(--primary, #2F5245); border-radius: 50%; animation: pch-spin 0.8s linear infinite; }
                    @keyframes pch-spin { to { transform: rotate(360deg); } }
                `}</style>
                <div className="pch-os-spinner"></div>
            </div>
        );
    }

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);
    const products = order.products || order.items || [];

    return (
        <div className="pch-os-page">
            <style>{`
                /* ── Page ── */
                .pch-os-page { font-family: var(--font-body); padding: 32px 20px 60px; display: flex; flex-direction: column; align-items: center; min-height: 70vh; }

                /* ── Card ── */
                .pch-os-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); width: 100%; max-width: 520px; box-shadow: var(--shadow-lift); overflow: hidden; position: relative; }

                /* ── Green banner at top ── */
                .pch-os-banner { background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%); padding: 40px 32px 56px; display: flex; flex-direction: column; align-items: center; text-align: center; position: relative; }
                .pch-os-banner::after { content: ''; position: absolute; bottom: -1px; left: 0; right: 0; height: 32px; background: var(--surface); border-radius: 50% 50% 0 0; }

                .pch-os-check { width: 64px; height: 64px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; margin-bottom: 16px; backdrop-filter: blur(4px); animation: pch-pop 0.6s cubic-bezier(0.34,1.56,0.64,1); }
                @keyframes pch-pop { 0% { transform: scale(0); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }

                .pch-os-banner h1 { font-family: var(--font-display); font-size: 26px; font-weight: 600; color: white; margin: 0 0 6px; }
                .pch-os-banner p  { font-size: 14px; color: rgba(255,255,255,0.8); margin: 0; }

                /* ── Body ── */
                .pch-os-body { padding: 8px 28px 28px; }

                /* ── Order Meta Grid ── */
                .pch-os-meta { display: grid; grid-template-columns: 1fr 1fr; gap: 0; border: 1px solid var(--border); border-radius: var(--radius-md); overflow: hidden; margin-bottom: 20px; }
                .pch-os-meta-cell { padding: 14px 16px; background: var(--surface-alt); }
                .pch-os-meta-cell:nth-child(odd) { border-right: 1px solid var(--border); }
                .pch-os-meta-cell:nth-child(1), .pch-os-meta-cell:nth-child(2) { border-bottom: 1px solid var(--border); }
                .pch-os-meta-lbl { font-size: 11px; font-weight: 700; color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.8px; margin: 0 0 4px; }
                .pch-os-meta-val { font-size: 15px; font-weight: 700; color: var(--text); margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .pch-os-meta-val.green { color: var(--primary); font-size: 17px; }

                /* ── Product Items ── */
                .pch-os-items-title { display: flex; align-items: center; gap: 8px; font-family: var(--font-display); font-size: 16px; font-weight: 600; color: var(--text); margin: 0 0 12px; }
                .pch-os-items-title svg { color: var(--primary); }

                .pch-os-item { display: flex; align-items: center; gap: 14px; padding: 12px 0; border-bottom: 1px solid var(--border); }
                .pch-os-item:last-child { border-bottom: none; }

                .pch-os-item-img { width: 52px; height: 52px; border-radius: var(--radius-sm); background: var(--surface-alt); border: 1px solid var(--border); overflow: hidden; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
                .pch-os-item-img img { width: 100%; height: 100%; object-fit: cover; }
                .pch-os-item-img svg { color: var(--text-faint); }

                .pch-os-item-info { flex: 1; min-width: 0; }
                .pch-os-item-name { font-size: 14px; font-weight: 700; color: var(--text); margin: 0 0 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .pch-os-item-qty  { font-size: 12px; color: var(--text-muted); margin: 0; }

                .pch-os-item-price { font-size: 15px; font-weight: 700; color: var(--text); white-space: nowrap; }

                /* ── Delivery Row ── */
                .pch-os-delivery { display: flex; align-items: center; gap: 12px; width: 100%; padding: 14px 16px; background: var(--primary-light); border-radius: var(--radius-md); margin: 20px 0; }
                .pch-os-del-icon { width: 36px; height: 36px; background: var(--primary); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
                .pch-os-del-text { display: flex; flex-direction: column; }
                .pch-os-del-lbl { font-size: 11px; font-weight: 700; color: var(--primary-dark); text-transform: uppercase; letter-spacing: 0.5px; }
                .pch-os-del-val { font-size: 14px; font-weight: 700; color: var(--text); margin-top: 1px; }

                /* ── Address Row ── */
                .pch-os-address { display: flex; align-items: flex-start; gap: 10px; font-size: 13px; color: var(--text-muted); line-height: 1.5; margin-bottom: 20px; }
                .pch-os-address svg { flex-shrink: 0; margin-top: 2px; color: var(--text-faint); }

                /* ── Actions ── */
                .pch-os-actions { display: flex; gap: 10px; width: 100%; }
                .pch-os-btn { flex: 1; height: 46px; border-radius: var(--radius-sm); font-family: var(--font-body); font-size: 14px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 7px; cursor: pointer; transition: all 0.2s; text-decoration: none; border: none; }
                .pch-os-btn.primary { background: var(--primary); color: white; box-shadow: 0 4px 12px rgba(47,82,69,0.2); }
                .pch-os-btn.primary:hover { background: var(--primary-dark); transform: translateY(-1px); color: white; }
                .pch-os-btn.outline { background: transparent; color: var(--text); border: 2px solid var(--border); }
                .pch-os-btn.outline:hover { background: var(--surface-alt); border-color: var(--text-muted); }

                /* ── Continue ── */
                .pch-os-continue { margin-top: 28px; display: inline-flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 700; color: var(--secondary); text-decoration: none; transition: color 0.2s; }
                .pch-os-continue:hover { color: var(--primary); }
            `}</style>

            <div style={{ width: '100%', maxWidth: '1100px', margin: '0 auto 20px' }}>
                <Breadcrumbs items={[{ path: '/orders', label: 'Orders' }, { label: 'Order Confirmed' }]} />
            </div>

            <div className="pch-os-card">
                {/* ── Green Banner ── */}
                <div className="pch-os-banner">
                    <div className="pch-os-check">
                        <CheckCircle size={36} />
                    </div>
                    <h1>Order Confirmed!</h1>
                    <p>Thank you for your purchase. Your order is on its way!</p>
                </div>

                {/* ── Card Body ── */}
                <div className="pch-os-body">
                    {/* Order Meta */}
                    <div className="pch-os-meta">
                        <div className="pch-os-meta-cell">
                            <p className="pch-os-meta-lbl">Order ID</p>
                            <p className="pch-os-meta-val">#{order.orderId}</p>
                        </div>
                        <div className="pch-os-meta-cell">
                            <p className="pch-os-meta-lbl">Date</p>
                            <p className="pch-os-meta-val">{new Date(order.createdAt || order.orderDate).toLocaleDateString()}</p>
                        </div>
                        <div className="pch-os-meta-cell">
                            <p className="pch-os-meta-lbl">Payment</p>
                            <p className="pch-os-meta-val">
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                    <CreditCard size={14} />
                                    {order.paymentMethod === 'RAZORPAY' ? 'Paid Online' : 'Cash on Delivery'}
                                </span>
                            </p>
                        </div>
                        <div className="pch-os-meta-cell">
                            <p className="pch-os-meta-lbl">Total Amount</p>
                            <p className="pch-os-meta-val green">₹{order.totalAmount.toFixed(2)}</p>
                        </div>
                    </div>

                    {/* Products Ordered */}
                    {products.length > 0 && (
                        <>
                            <h3 className="pch-os-items-title"><ShoppingBag size={18} /> Items Ordered</h3>
                            <div>
                                {products.map((item, idx) => (
                                    <div className="pch-os-item" key={item.productId || idx}>
                                        <div className="pch-os-item-img">
                                            {item.imageUrl ? (
                                                <img src={item.imageUrl} alt={item.name} />
                                            ) : (
                                                <Package size={22} />
                                            )}
                                        </div>
                                        <div className="pch-os-item-info">
                                            <p className="pch-os-item-name">{item.name}</p>
                                            <p className="pch-os-item-qty">Qty: {item.quantity}{item.category ? ` · ${item.category}` : ''}</p>
                                        </div>
                                        <div className="pch-os-item-price">₹{item.totalPrice || (item.price * item.quantity).toFixed(2)}</div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* Delivery Info */}
                    <div className="pch-os-delivery">
                        <div className="pch-os-del-icon">
                            <Truck size={18} />
                        </div>
                        <div className="pch-os-del-text">
                            <span className="pch-os-del-lbl">Expected Delivery</span>
                            <span className="pch-os-del-val">By {deliveryDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                        </div>
                    </div>

                    {/* Address */}
                    {(order.shippingAddress || order.deliveryAddress) && (
                        <div className="pch-os-address">
                            <MapPin size={16} />
                            <span>{order.shippingAddress || order.deliveryAddress}</span>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="pch-os-actions">
                        <Link to="/orders" className="pch-os-btn primary">
                            <Package size={16} /> Track Order
                        </Link>
                        <button onClick={() => generateInvoice(order, user)} className="pch-os-btn outline">
                            <Download size={16} /> Invoice
                        </button>
                    </div>
                </div>
            </div>

            <Link to="/" className="pch-os-continue">
                Continue Shopping <ArrowRight size={16} />
            </Link>
        </div>
    );
}
