import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ecommerceApi } from '../api/ecommerceApi';
import { getCategoryFallbackImage } from '../utils/imageUtils';

export default function LandingPage() {
  const { user, token } = useAuth();
  const { totalItems: cartCount, addToCart } = useCart();
  const { totalItems: wishCount, addToWishlist, wishlistItems } = useWishlist();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    ecommerceApi.getAllCategories().then(res => setCategories(Array.isArray(res) ? res : [])).catch(console.error);
    ecommerceApi.getAllProducts().then(res => setProducts(Array.isArray(res) ? res.slice(0, 8) : [])).catch(console.error);
  }, []);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleAddToCart = async (product) => {
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      await addToCart(product.id, 1);
    } catch (err) {
      alert('Failed to add to cart');
    }
  };

  const handleAddToWishlist = async (product) => {
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      await addToWishlist(product.id);
    } catch (err) {
      alert('Failed to add to wishlist');
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  const getCatIconClass = (index) => {
    const classes = ['pch-ci-1', 'pch-ci-2', 'pch-ci-3', 'pch-ci-4'];
    return classes[index % 4];
  };

  const getProdThumbClass = (index) => {
    const classes = ['pch-pt-1', 'pch-pt-2', 'pch-pt-3', 'pch-pt-4'];
    return classes[index % 4];
  };

  return (
    <>
      <style>{`
        /* ---------- Hero ---------- */
        .pch-hero{ padding:64px 0 56px; position:relative; overflow:hidden; }
        .pch-hero-inner{ display:grid; grid-template-columns:1fr 0.95fr; gap:40px; align-items:center; position:relative; }
        .pch-blob{ position:absolute; border-radius:999px; filter:blur(50px); opacity:0.55; pointer-events:none; }
        .pch-blob-a{ width:340px; height:180px; background:var(--primary-light); top:-40px; right:180px; }
        .pch-blob-b{ width:220px; height:120px; background:var(--secondary-light); bottom:0; right:0; transform:rotate(-15deg); }
        .pch-eyebrow{ display:inline-flex; align-items:center; gap:7px; font-size:12px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:var(--primary); background:var(--primary-light); padding:6px 14px; border-radius:999px; position:relative; }
        .pch-hero-title{ font-family:var(--font-display); font-size:46px; font-weight:500; line-height:1.14; letter-spacing:-0.01em; margin-top:18px; position:relative; }
        .pch-hero-title em{ font-style:italic; color:var(--primary); }
        .pch-hero-sub{ font-size:15.5px; color:var(--text-muted); line-height:1.7; margin-top:16px; max-width:460px; position:relative; }
        .pch-hero-actions{ display:flex; align-items:center; gap:14px; margin-top:28px; position:relative; flex-wrap:wrap; }
        .pch-btn-primary{ background:var(--primary); color:#fff; padding:13px 26px; border-radius:999px; font-size:14px; font-weight:700; text-decoration:none; display:inline-flex; align-items:center; gap:8px; border:none; cursor:pointer; transition:background .18s ease, transform .18s ease; }
        .pch-btn-primary:hover{ background:var(--primary-dark); transform:translateY(-1px); }
        .pch-btn-primary svg{ width:15px; height:15px; stroke:#fff; }
        .pch-btn-ghost{ padding:13px 22px; border-radius:999px; font-size:14px; font-weight:700; text-decoration:none; color:var(--text); border:1.5px solid var(--border); background:none; cursor:pointer; transition:border-color .18s ease, background .18s ease; }
        .pch-btn-ghost:hover{ border-color:var(--primary); background:var(--primary-light); }
        .pch-trust-mini{ display:flex; align-items:center; gap:22px; margin-top:32px; position:relative; flex-wrap:wrap; }
        .pch-trust-item{ display:flex; align-items:center; gap:8px; font-size:12.5px; font-weight:700; color:var(--text-muted); }
        .pch-trust-item svg{ width:16px; height:16px; stroke:var(--primary); flex-shrink:0; }
 
        .pch-hero-art{ position:relative; display:flex; align-items:center; justify-content:center; }
        .pch-art-card{ background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); box-shadow:var(--shadow-lift); padding:26px; width:100%; max-width:340px; position:relative; z-index:2; }
        .pch-art-icon{ width:52px; height:52px; border-radius:16px; background:var(--primary); display:flex; align-items:center; justify-content:center; margin-bottom:16px; }
        .pch-art-icon svg{ width:24px; height:24px; stroke:#fff; }
        .pch-art-card h3{ font-family:var(--font-display); font-size:19px; font-weight:600; margin:0; }
        .pch-art-card p{ font-size:13px; color:var(--text-muted); margin-top:8px; line-height:1.6; }
        .pch-art-float{ position:absolute; background:var(--surface); border:1px solid var(--border); border-radius:16px; box-shadow:var(--shadow-soft); padding:14px 16px; display:flex; align-items:center; gap:10px; z-index:3; }
        .pch-art-float.pch-f1{ top:-6px; left:-30px; }
        .pch-art-float.pch-f2{ bottom:10px; right:-28px; }
        .pch-art-float svg{ width:20px; height:20px; stroke:var(--primary); flex-shrink:0; }
        .pch-ff-label{ font-size:11px; color:var(--text-faint); font-weight:700; }
        .pch-ff-value{ font-size:13.5px; font-weight:800; font-family:var(--font-display); }
 
        /* ---------- Section heading ---------- */
        .pch-sec-head{ display:flex; align-items:flex-end; justify-content:space-between; margin-bottom:26px; flex-wrap:wrap; gap:12px; }
        .pch-sec-eyebrow{ font-size:12px; font-weight:700; letter-spacing:0.07em; text-transform:uppercase; color:var(--primary); }
        .pch-sec-title{ font-family:var(--font-display); font-size:28px; font-weight:600; margin-top:6px; letter-spacing:-0.01em; }
        .pch-sec-link{ font-size:13px; font-weight:700; color:var(--primary); text-decoration:none; display:flex; align-items:center; gap:6px; white-space:nowrap; }
        .pch-sec-link svg{ width:14px; height:14px; stroke:var(--primary); }
 
        /* ---------- Categories ---------- */
        .pch-categories{ padding:52px 0 8px; }
        .pch-cat-grid{ display:grid; grid-template-columns:repeat(6,minmax(0,1fr)); gap:14px; }
        .pch-cat-card{ background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-md); padding:22px 14px; text-align:center; text-decoration:none; color:var(--text); transition:box-shadow .2s ease, transform .2s ease, border-color .2s ease; min-width:0; }
        .pch-cat-card:hover{ box-shadow:var(--shadow-soft); transform:translateY(-3px); border-color:var(--primary-light); }
        .pch-cat-icon{ width:52px; height:52px; border-radius:50%; margin:0 auto 12px; display:flex; align-items:center; justify-content:center; }
        .pch-cat-icon svg{ width:23px; height:23px; }
        .pch-ci-1{ background:var(--primary-light); } .pch-ci-1 svg{ stroke:var(--primary); }
        .pch-ci-2{ background:var(--secondary-light); } .pch-ci-2 svg{ stroke:var(--secondary); }
        .pch-ci-3{ background:var(--accent-light); } .pch-ci-3 svg{ stroke:#B57A2F; }
        .pch-ci-4{ background:var(--danger-light); } .pch-ci-4 svg{ stroke:var(--danger); }
        .pch-cat-name{ font-size:12.5px; font-weight:700; text-transform: capitalize; }
 
        /* ---------- Trust strip ---------- */
        .pch-trust-strip{ padding:52px 0 8px; }
        .pch-trust-grid{ display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:16px; }
        .pch-trust-card{ background:var(--surface-alt); border:1px solid var(--border); border-radius:var(--radius-md); padding:22px; display:flex; gap:14px; align-items:flex-start; min-width:0; }
        .pch-trust-card-icon{ width:42px; height:42px; border-radius:12px; background:var(--surface); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .pch-trust-card-icon svg{ width:19px; height:19px; stroke:var(--primary); }
        .pch-trust-card h4{ font-size:14px; font-weight:700; margin:0; }
        .pch-trust-card p{ font-size:12px; color:var(--text-muted); margin-top:4px; line-height:1.5; }
 
        /* ---------- Products ---------- */
        .pch-products{ padding:52px 0 8px; }
        .pch-prod-grid{ display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:18px; }
        .pch-prod-card{ background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-md); overflow:hidden; transition:box-shadow .2s ease, transform .2s ease; min-width:0; display:block; text-decoration:none; color:inherit; }
        .pch-prod-card:hover{ box-shadow:var(--shadow-lift); transform:translateY(-3px); }
        .pch-prod-thumb{ height:130px; display:flex; align-items:center; justify-content:center; position:relative; overflow:hidden;}
        .pch-prod-thumb svg{ width:36px; height:36px; }
        .pch-pt-1{ background:var(--primary-light); } .pch-pt-1 svg{ stroke:var(--primary); }
        .pch-pt-2{ background:var(--accent-light); } .pch-pt-2 svg{ stroke:#B57A2F; }
        .pch-pt-3{ background:var(--secondary-light); } .pch-pt-3 svg{ stroke:var(--secondary); }
        .pch-pt-4{ background:var(--danger-light); } .pch-pt-4 svg{ stroke:var(--danger); }
        .pch-prod-wish{ position:absolute; top:12px; right:12px; width:30px; height:30px; border-radius:50%; background:rgba(255,255,255,0.9); border:none; display:flex; align-items:center; justify-content:center; cursor:pointer; }
        .pch-prod-wish svg{ width:14px; height:14px; stroke:var(--text-muted); transition: fill 0.2s, stroke 0.2s;}
        .pch-prod-wish.active svg{ stroke:var(--danger); fill:var(--danger); }
        .pch-prod-tag{ position:absolute; top:12px; left:12px; background:var(--surface); font-size:9.5px; font-weight:800; letter-spacing:0.03em; text-transform:uppercase; padding:4px 9px; border-radius:999px; color:var(--primary); }
        .pch-prod-body{ padding:16px; }
        .pch-prod-cat{ font-size:10px; color:var(--text-faint); font-weight:700; text-transform:uppercase; letter-spacing:0.03em; }
        .pch-prod-name{ font-size:14px; font-weight:700; margin-top:5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;}
        .pch-prod-foot{ display:flex; align-items:center; justify-content:space-between; margin-top:13px; }
        .pch-prod-price{ font-family:var(--font-display); font-size:17px; font-weight:600; }
        .pch-prod-add{ width:34px; height:34px; border-radius:50%; background:var(--primary); border:none; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:background .18s ease; }
        .pch-prod-add:hover{ background:var(--primary-dark); }
        .pch-prod-add svg{ width:15px; height:15px; stroke:#fff; }
 
        /* ---------- CTA banner ---------- */
        .pch-cta{ padding:56px 0; }
        .pch-cta-card{ background:var(--primary); border-radius:var(--radius-lg); padding:44px 48px; display:flex; align-items:center; justify-content:space-between; gap:24px; position:relative; overflow:hidden; color:#fff; flex-wrap:wrap; }
        .pch-cta-card::before{ content:''; position:absolute; width:260px; height:260px; border-radius:50%; background:rgba(255,255,255,0.06); top:-110px; right:-60px; }
        .pch-cta-text h3{ font-family:var(--font-display); font-size:25px; font-weight:600; max-width:420px; line-height:1.3; margin:0; }
        .pch-cta-text p{ font-size:13.5px; opacity:0.85; margin-top:10px; max-width:400px; line-height:1.6; }
        .pch-cta-btn{ background:#fff; color:var(--primary-dark); padding:13px 26px; border-radius:999px; font-size:14px; font-weight:800; text-decoration:none; white-space:nowrap; position:relative; z-index:2; transition:transform .18s ease; border:none; cursor:pointer; }
        .pch-cta-btn:hover{ transform:translateY(-1px); }
 
        @media (max-width:1080px){
          .pch-hero-inner{ grid-template-columns:1fr; }
          .pch-hero-art{ order:-1; }
          .pch-cat-grid{ grid-template-columns:repeat(3,minmax(0,1fr)); }
          .pch-trust-grid{ grid-template-columns:repeat(2,minmax(0,1fr)); }
          .pch-prod-grid{ grid-template-columns:repeat(2,minmax(0,1fr)); }
          .pch-cta-card{ flex-direction:column; text-align:center; }
        }
        @media (max-width:768px){
          .pch-hero-title{ font-size: 32px; }
          .pch-cat-grid{ grid-template-columns:repeat(2,minmax(0,1fr)); }
          .pch-trust-grid{ grid-template-columns:1fr; }
          .pch-prod-grid{ grid-template-columns:1fr; }
          .pch-cta-card{ padding: 24px; }
        }
      `}</style>
 
      <section className="pch-hero pch-section pch-r1">
        <div className="pch-wrap pch-hero-inner">
          <div className="pch-blob pch-blob-a"></div>
          <div className="pch-blob pch-blob-b"></div>
          <div>
            <span className="pch-eyebrow">Trusted by 50,000+ families</span>
            <h1 className="pch-hero-title">Your health,<br/><em>delivered with care</em></h1>
            <p className="pch-hero-sub">Order medicines, wellness essentials, and healthcare devices from a certified pharmacy — delivered to your door, usually within a day.</p>
            <div className="pch-hero-actions">
              <Link className="pch-btn-primary" to="/products">
                Shop medicines
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
              </Link>
              <Link className="pch-btn-ghost" to="/products">Upload prescription</Link>
            </div>
            <div className="pch-trust-mini">
              <div className="pch-trust-item"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Licensed pharmacists</div>
              <div className="pch-trust-item"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Secure payments</div>
              <div className="pch-trust-item"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Easy returns</div>
            </div>
          </div>
 
          <div className="pch-hero-art">
            <div className="pch-art-float pch-f1">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg>
              <div><div className="pch-ff-label">Wishlist</div><div className="pch-ff-value">{wishCount} items saved</div></div>
            </div>
            <div className="pch-art-card">
              <div className="pch-art-icon"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a4 4 0 0 1 8 0v2"/></svg></div>
              <h3>Refill in one tap</h3>
              <p>Save your prescriptions once — reorder your regular medicines anytime without searching again.</p>
            </div>
            <div className="pch-art-float pch-f2">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 17l6-6 4 4 8-8"/><path d="M17 7h4v4"/></svg>
              <div><div className="pch-ff-label">Delivery</div><div className="pch-ff-value">Usually next day</div></div>
            </div>
          </div>
        </div>
      </section>
 
      <section className="pch-categories pch-section pch-r2">
        <div className="pch-wrap">
          <div className="pch-sec-head">
            <div>
              <div className="pch-sec-eyebrow">Browse</div>
              <div className="pch-sec-title">Shop by category</div>
            </div>
            <Link className="pch-sec-link" to="/products">View all categories <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg></Link>
          </div>
          
          <div className="pch-cat-grid">
             {categories.slice(0, 6).map((cat, idx) => (
                <Link key={cat.id} className="pch-cat-card" to={`/products?category=${cat.slug || cat.id}`}>
                  <div className={`pch-cat-icon ${getCatIconClass(idx)}`}>
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3c-3 3-3 7 0 10s3 7 0 10"/><path d="M12 3c3 3 3 7 0 10s-3 7 0 10"/></svg>
                  </div>
                  <div className="pch-cat-name">{cat.name}</div>
                </Link>
             ))}
             {categories.length === 0 && [1,2,3,4,5,6].map((idx) => (
               <div key={idx} className="pch-cat-card">
                  <div className={`pch-cat-icon ${getCatIconClass(idx)}`}>
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3c-3 3-3 7 0 10s3 7 0 10"/><path d="M12 3c3 3 3 7 0 10s-3 7 0 10"/></svg>
                  </div>
                  <div className="pch-cat-name">Loading...</div>
                </div>
             ))}
          </div>
        </div>
      </section>
 
      <section className="pch-trust-strip pch-section pch-r3">
        <div className="pch-wrap">
          <div className="pch-trust-grid">
            <div className="pch-trust-card">
              <div className="pch-trust-card-icon"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8Z"/><circle cx="5.5" cy="18.5" r="1.5"/><circle cx="18.5" cy="18.5" r="1.5"/></svg></div>
              <div><h4>Fast delivery</h4><p>Most orders arrive within 24 hours</p></div>
            </div>
            <div className="pch-trust-card">
              <div className="pch-trust-card-icon"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z"/></svg></div>
              <div><h4>Certified pharmacy</h4><p>Licensed and quality-checked medicines</p></div>
            </div>
            <div className="pch-trust-card">
              <div className="pch-trust-card-icon"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>
              <div><h4>Secure payments</h4><p>Your transactions are fully encrypted</p></div>
            </div>
            <div className="pch-trust-card">
              <div className="pch-trust-card-icon"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg></div>
              <div><h4>24/7 support</h4><p>Pharmacists on call whenever you need</p></div>
            </div>
          </div>
        </div>
      </section>
 
      <section className="pch-products pch-section pch-r4">
        <div className="pch-wrap">
          <div className="pch-sec-head">
            <div>
              <div className="pch-sec-eyebrow">Popular</div>
              <div className="pch-sec-title">Recommended for you</div>
            </div>
            <Link className="pch-sec-link" to="/products">Browse all products <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg></Link>
          </div>
          
          <div className="pch-prod-grid">
             {products.length === 0 ? (
               <p className="pch-sec-eyebrow">Loading products...</p>
             ) : (
               products.map((product, idx) => {
                 const inWishlist = wishlistItems?.some(item => item.product?.id === product.id);
                 return (
                   <Link key={product.id} className="pch-prod-card" to={`/product/${product.id}`}>
                    <div className={`pch-prod-thumb ${getProdThumbClass(idx)}`}>
                      {product.stockQuantity > 0 ? (
                        <span className="pch-prod-tag">In stock</span>
                      ) : (
                        <span className="pch-prod-tag" style={{color: 'var(--danger)'}}>Out of stock</span>
                      )}
                      
                      <button 
                        className={`pch-prod-wish ${inWishlist ? 'active' : ''}`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddToWishlist(product);
                        }}
                      >
                        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg>
                      </button>
                      <img 
                        src={product.image?.includes('ik.imagekit.io') 
                          ? (product.image.includes('?') ? `${product.image}&tr=w-300,h-300,q-80` : `${product.image}?tr=w-300,h-300,q-80`)
                          : (product.image || getCategoryFallbackImage(product.category?.name || product.category))} 
                        alt={product.name} 
                        loading="lazy"
                        style={{width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply', padding: '16px'}} 
                        onError={(e) => {e.target.src = getCategoryFallbackImage(product.category?.name || product.category)}}
                      />
                    </div>
                    <div className="pch-prod-body">
                      <div className="pch-prod-cat">{product.category?.name || 'Category'}</div>
                      <div className="pch-prod-name" title={product.name}>{product.name}</div>
                      <div className="pch-prod-foot">
                        <span className="pch-prod-price">₹{product.price.toFixed(2)}</span>
                        <button 
                          className="pch-prod-add"
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddToCart(product);
                          }}
                        >
                          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                        </button>
                      </div>
                    </div>
                  </Link>
                 )
               })
             )}
          </div>
        </div>
      </section>
 
      <section className="pch-cta pch-section pch-r5">
        <div className="pch-wrap">
          <div className="pch-cta-card">
            <div className="pch-cta-text">
              <h3>Never run out of your medicines again</h3>
              <p>Upload your prescription once and set up auto-refills — we'll remind you before you run low.</p>
            </div>
            <Link className="pch-cta-btn" to="/products">Upload prescription</Link>
          </div>
        </div>
      </section>
 
    </>
  );
}
