import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice, clearCart } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = () => {
    if (!token) {
      alert("Please login to place an order.");
      navigate('/login');
      return;
    }
    setIsCheckingOut(true);
    // Simulate slight delay for effect
    setTimeout(() => {
      navigate('/checkout', { 
        state: { items, totalAmount: totalPrice, isBuyNow: false } 
      });
      setIsCheckingOut(false);
    }, 400);
  };

  const calculateDiscount = () => 22.00;
  const calculateGST = () => (totalPrice * 0.02).toFixed(2);
  const deliveryCharge = 0.00;
  const finalTotal = (totalPrice - calculateDiscount() + parseFloat(calculateGST()) + deliveryCharge).toFixed(2);

  if (items.length === 0) {
    return (
      <section className="d1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', padding: '20px' }}>
         <h2 className="page-title" style={{ marginBottom: '10px' }}>Your cart is empty</h2>
         <p className="page-sub" style={{ marginBottom: '20px' }}>Looks like you haven't added any products to your cart yet.</p>
         <Link to="/products" className="checkout-btn" style={{ width: 'auto', padding: '12px 24px' }}>
           Start Shopping
         </Link>
      </section>
    );
  }

  return (
    <section className="d1">
      <div className="breadcrumb">
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5 12 3l9 6.5V21a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5Z"/></svg>
        <Link to="/" style={{textDecoration: 'none', color: 'inherit'}}>Home</Link> / <b>My Cart</b>
      </div>
      <div className="page-title">My Cart</div>
      <div className="page-sub">{items.length} item{items.length !== 1 ? 's' : ''} in your cart</div>

      <div className="layout">
        <div className="cart-panel">
          <div className="cart-panel-head">
            <div className="cart-panel-title">Cart Items</div>
            <button className="clear-link" onClick={clearCart}>Clear Cart</button>
          </div>

          {items.map((item, index) => {
            const thumbClass = `ct-${(index % 3) + 1}`;
            const Icon = () => {
                if(thumbClass === 'ct-1') return <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.5 20.5 3.5 13.5a5 5 0 1 1 7-7l7 7a5 5 0 1 1-7 7Z"/><path d="M8.5 8.5l7 7"/></svg>;
                if(thumbClass === 'ct-2') return <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a4 4 0 0 1 8 0v2"/></svg>;
                return <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9 12h6M12 9v6"/></svg>;
            };

            return (
              <div className="cart-row" key={item.id}>
                <div className={`cart-thumb ${thumbClass}`}>
                  {item.image ? (
                    <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '14px' }} onError={(e) => {e.target.style.display='none'}} />
                  ) : (
                    <Icon />
                  )}
                </div>
                <div className="cart-info">
                  <div className="cart-top">
                    <div>
                      <Link to={`/product/${item.id}`} className="cart-name" style={{ textDecoration: 'none', color: 'inherit' }}>{item.name}</Link>
                      <div className="cart-tag">{item.category?.name || item.category || 'Product'}</div>
                    </div>
                    <button className="cart-remove" onClick={() => removeItem(item.id)}>
                      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6"/></svg>
                    </button>
                  </div>
                  <div className="cart-bottom">
                    <div className="qty-stepper">
                      <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>−</button>
                      <span className="qty-val">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => updateQuantity(item.id, Math.min(item.stock || 99, item.quantity + 1))}>+</button>
                    </div>
                    <div className="cart-price">
                      <span className="now">₹{(item.price * item.quantity).toFixed(2)}</span>
                      {item.originalPrice && <span className="was">₹{(item.originalPrice * item.quantity).toFixed(2)}</span>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <Link className="continue-link" to="/products" style={{padding:'0 24px 22px', display:'flex'}}>
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Continue shopping
          </Link>
        </div>

        <div className="summary-panel">
          <div className="summary-title">Order Summary</div>

          <div className="promo">
            <input type="text" placeholder="Promo code" />
            <button className="promo-btn">Apply</button>
          </div>

          <div className="sum-row"><span className="label">Subtotal ({items.length} items)</span><span className="val">₹{totalPrice.toFixed(2)}</span></div>
          <div className="sum-row"><span className="label">Discount</span><span className="val discount">−₹{calculateDiscount().toFixed(2)}</span></div>
          <div className="sum-row"><span className="label">GST (2%)</span><span className="val">₹{calculateGST()}</span></div>
          <div className="sum-row"><span className="label">Delivery Charge</span><span className="val">₹{deliveryCharge.toFixed(2)}</span></div>
          <div className="sum-divider"></div>
          <div className="sum-total"><span className="label">Total</span><span className="val">₹{finalTotal}</span></div>

          <button className="checkout-btn" onClick={handleCheckout} disabled={isCheckingOut}>
            {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
            {!isCheckingOut && <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>}
          </button>
          <div className="secure-note">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Safe and secure checkout
          </div>
        </div>
      </div>
    </section>
  );
}
