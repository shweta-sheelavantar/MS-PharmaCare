import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { ecommerceApi } from '../api/ecommerceApi';

export default function WishlistPage() {
  const { items, clearWishlist, removeItem } = useWishlist();
  const { addItem: addToCart } = useCart();
  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
    ecommerceApi.getAllProducts().then(res => setRecommended(Array.isArray(res) ? res.slice(0, 4) : [])).catch(console.error);
  }, []);

  const handleMoveToCart = (product) => {
    addToCart(product, 1);
    removeItem(product.id);
  };

  const emptySlots = Math.max(0, 4 - items.length);

  const getWishThumbClass = (index) => {
    const classes = ['wt-1', 'wt-2', 'wt-3', 'wt-4'];
    return classes[index % 4];
  };

  const getRecThumbClass = (index) => {
    const classes = ['rt-1', 'rt-2', 'rt-3', 'rt-4'];
    return classes[index % 4];
  };

  return (
    <>
      <section className="d1">
        <div className="breadcrumb">Home / <b>My Wishlist</b></div>
        <div className="page-head">
          <div>
            <div className="page-title">My Wishlist</div>
            <div className="page-sub">{items.length} items saved</div>
          </div>
          {items.length > 0 && (
            <button className="clear-btn" onClick={clearWishlist}>
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6"/></svg>
              Clear Wishlist
            </button>
          )}
        </div>

        <div className="wish-grid">
          {items.map((product, idx) => (
            <div key={product.id} className="wish-card">
              <div className={`wish-thumb ${getWishThumbClass(idx)}`}>
                <button className="wish-del" style={{ zIndex: 10 }} onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeItem(product.id);
                }}>
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6"/></svg>
                </button>
                {product.image ? (
                  <img src={product.image} alt={product.name} style={{width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply', position: 'relative', zIndex: 1}} />
                ) : (
                  idx % 2 === 0 ? (
                     <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.5 20.5 3.5 13.5a5 5 0 1 1 7-7l7 7a5 5 0 1 1-7 7Z"/><path d="M8.5 8.5l7 7"/></svg>
                  ) : (
                     <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a4 4 0 0 1 8 0v2"/></svg>
                  )
                )}
              </div>
              <div className="wish-body">
                <div className="wish-cat">{product.category?.name || product.category || 'Product'}</div>
                <div className="wish-name">{product.name}</div>
                <div className="wish-price">₹{product.price.toFixed(2)}</div>
                <button 
                  className="wish-btn" 
                  onClick={() => handleMoveToCart(product)}
                  disabled={product.stockQuantity === 0}
                >
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.5 3h2l2.6 12.6a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 2-1.6L21.5 8H6"/></svg>
                  {product.stockQuantity === 0 ? 'Out of Stock' : 'Move to Cart'}
                </button>
              </div>
            </div>
          ))}

          {Array.from({ length: emptySlots }).map((_, i) => (
            <div key={`empty-${i}`} className="empty-slot">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg>
              <p>{i === 0 ? 'Save items you love here — tap the heart icon on any product' : 'Your wishlist can hold as many items as you like'}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="d2">
        <div className="rec-head">
          <div className="rec-title">You might also like</div>
          <Link className="rec-link" to="/products">Browse all products</Link>
        </div>
        <div className="rec-grid">
           {recommended.map((product, idx) => (
             <Link key={product.id} className="rec-card" to={`/product/${product.id}`} style={{textDecoration: 'none', color: 'inherit'}}>
               <div className={`rec-thumb ${getRecThumbClass(idx)}`}>
                 {product.image ? (
                   <img src={product.image} alt={product.name} style={{width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply'}} />
                 ) : (
                   idx % 4 === 0 ? <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a4 4 0 0 1 8 0v2"/></svg>
                   : idx % 4 === 1 ? <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a4 4 0 0 1 8 0v2"/></svg>
                   : idx % 4 === 2 ? <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9 12h6M12 9v6"/></svg>
                   : <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v3M12 18v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M3 12h3M18 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></svg>
                 )}
               </div>
               <div className="rec-name" title={product.name}>{product.name}</div>
               <div className="rec-foot">
                 <span className="rec-price">₹{product.price.toFixed(2)}</span>
                 <button 
                  className="rec-add" 
                  onClick={(e) => {
                    e.preventDefault();
                    addToCart(product, 1);
                  }}
                 >
                   <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                 </button>
               </div>
             </Link>
           ))}
        </div>
      </section>
    </>
  );
}
