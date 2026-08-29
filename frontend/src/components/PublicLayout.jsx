import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function PublicLayout() {
  const { user, logout } = useAuth();
  const { totalItems: cartCount } = useCart();
  const { totalItems: wishCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    navigate('/');
  };

  return (
    <div className="pch-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Manrope:wght@400;500;600;700;800&display=swap');
 
        .pch-root, .pch-root *{ box-sizing:border-box; }
        .pch-root{
          --bg:#F3F6F1; --surface:#FFFFFF; --surface-alt:#FAF9F4;
          --primary:#2F5245; --primary-light:#DCEAE1; --primary-dark:#1E362D;
          --secondary:#7C79B0; --secondary-light:#EAE8F6;
          --accent:#D9A256; --accent-light:#F6E9D3;
          --danger:#C15B4A; --danger-light:#F7E3DE;
          --text:#25332E; --text-muted:#748177; --text-faint:#9BA79E;
          --border:#E6EAE2; --radius-lg:22px; --radius-md:16px; --radius-sm:10px;
          --shadow-soft:0 10px 30px rgba(37,51,46,0.07); --shadow-lift:0 16px 40px rgba(37,51,46,0.12);
          --font-display:'Fraunces', serif; --font-body:'Manrope', sans-serif;
 
          font-family:var(--font-body); background:var(--bg); color:var(--text);
          -webkit-font-smoothing:antialiased; width:100%; min-height: 100vh; display: flex; flex-direction: column;
        }
        .pch-root a{ color:inherit; }
        .pch-root img, .pch-root svg{ display:block; }
        @media (prefers-reduced-motion: reduce){ .pch-root *{ animation-duration:.001ms !important; transition-duration:.001ms !important; } }
 
        .pch-wrap{ max-width:1280px; margin:0 auto; padding:0 40px; }
        .pch-section{ opacity:0; animation:pch-rise .6s ease forwards; }
        @keyframes pch-rise{ from{opacity:0; transform:translateY(10px);} to{opacity:1; transform:translateY(0);} }
        .pch-r1{ animation-delay:.02s; } .pch-r2{ animation-delay:.1s; } .pch-r3{ animation-delay:.18s; } .pch-r4{ animation-delay:.26s; } .pch-r5{ animation-delay:.34s; }
 
        /* ---------- Notice / Header ---------- */
        .pch-notice{ background:var(--primary); color:#fff; text-align:center; font-size:12.5px; font-weight:600; padding:8px; letter-spacing:0.02em; }
        .pch-header{ background:var(--surface); border-bottom:1px solid var(--border); position:sticky; top:0; z-index:20; }
        .pch-header-row{ display:flex; align-items:center; gap:28px; padding:16px 0; flex-wrap:wrap; }
        .pch-brand{ display:flex; align-items:center; gap:10px; flex-shrink:0; }
        .pch-brand-mark{ width:36px; height:36px; border-radius:11px; background:var(--primary); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .pch-brand-mark svg{ width:19px; height:19px; stroke:#fff; }
        .pch-brand-name{ font-family:var(--font-display); font-weight:600; font-size:19px; }
        .pch-navlinks{ display:flex; align-items:center; gap:26px; margin-left:12px; }
        .pch-navlink{ font-size:13.5px; font-weight:700; color:var(--text-muted); text-decoration:none; transition:color .18s ease; }
        .pch-navlink.pch-active, .pch-navlink:hover{ color:var(--primary); }
        .pch-header-search{ flex:1; min-width:160px; max-width:400px; display:flex; align-items:center; gap:9px; background:var(--surface-alt); border:1px solid var(--border); border-radius:999px; padding:10px 16px; margin-left:auto; transition:border-color .18s ease, box-shadow .18s ease; }
        .pch-header-search:focus-within{ border-color:var(--primary); box-shadow:0 0 0 4px var(--primary-light); }
        .pch-header-search svg{ width:16px; height:16px; stroke:var(--text-faint); flex-shrink:0; }
        .pch-header-search input{ border:none; outline:none; background:none; font-family:var(--font-body); font-size:13.5px; width:100%; color:var(--text); }
        .pch-header-search input::placeholder{ color:var(--text-faint); }
        .pch-header-actions{ display:flex; align-items:center; gap:10px; position:relative; }
        .pch-hicon{ width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; background:var(--surface-alt); border:1px solid var(--border); position:relative; cursor:pointer; transition:background .18s ease; }
        .pch-hicon:hover{ background:var(--primary-light); }
        .pch-hicon svg{ width:17px; height:17px; stroke:var(--text-muted); }
        .pch-hbadge{ position:absolute; top:-4px; right:-4px; background:var(--accent); color:#fff; font-size:10px; font-weight:800; width:17px; height:17px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:2px solid var(--surface); }
        .pch-havatar{ width:40px; height:40px; border-radius:50%; background:var(--secondary); color:#fff; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:14px; flex-shrink:0; cursor:pointer; border:2px solid transparent; transition:border-color .18s ease; }
        .pch-havatar.pch-open{ border-color:var(--primary-light); }
 
        /* ---------- Dropdown ---------- */
        .pch-dropdown{ position:absolute; top:56px; right:0; width:280px; background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); box-shadow:var(--shadow-lift); overflow:hidden; z-index:30; animation:pch-pop .16s ease; }
        @keyframes pch-pop{ from{opacity:0; transform:translateY(-6px) scale(0.98);} to{opacity:1; transform:translateY(0) scale(1);} }
        .pch-dropdown::before{ content:''; position:absolute; top:-7px; right:14px; width:14px; height:14px; background:var(--surface); border-left:1px solid var(--border); border-top:1px solid var(--border); transform:rotate(45deg); }
        .pch-dd-header{ display:flex; align-items:center; gap:12px; padding:18px 18px 16px; background:linear-gradient(135deg, var(--primary-light), var(--secondary-light)); }
        .pch-dd-avatar{ width:44px; height:44px; border-radius:50%; background:var(--secondary); color:#fff; display:flex; align-items:center; justify-content:center; font-family:var(--font-display); font-weight:600; font-size:17px; flex-shrink:0; border:3px solid var(--surface); }
        .pch-dd-name{ font-family:var(--font-display); font-size:16px; font-weight:600; }
        .pch-dd-email{ font-size:11.5px; color:var(--text-muted); margin-top:2px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:180px; }
        .pch-dd-section{ padding:8px; }
        .pch-dd-item{ display:flex; align-items:center; gap:12px; padding:10px 10px; border-radius:11px; font-size:13.5px; font-weight:600; color:var(--text); transition:background .15s ease; cursor:pointer; }
        .pch-dd-item:hover{ background:var(--surface-alt); }
        .pch-dd-icon{ width:32px; height:32px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .pch-dd-icon svg{ width:15px; height:15px; }
        .pch-ic-a{ background:var(--primary-light); } .pch-ic-a svg{ stroke:var(--primary); }
        .pch-ic-b{ background:var(--accent-light); } .pch-ic-b svg{ stroke:#B57A2F; }
        .pch-ic-c{ background:var(--secondary-light); } .pch-ic-c svg{ stroke:var(--secondary); }
        .pch-dd-badge{ margin-left:auto; background:var(--primary); color:#fff; font-size:10px; font-weight:800; padding:2px 8px; border-radius:999px; }
        .pch-dd-divider{ height:1px; background:var(--border); margin:2px 8px; }
        .pch-dd-logout{ display:flex; align-items:center; gap:12px; padding:12px 18px; color:var(--danger); font-size:13.5px; font-weight:700; transition:background .15s ease; cursor:pointer; }
        .pch-dd-logout:hover{ background:var(--danger-light); }
        .pch-dd-logout svg{ width:16px; height:16px; stroke:currentColor; }

        /* ---------- Footer ---------- */
        .pch-footer{ background:var(--surface-alt); border-top:1px solid var(--border); padding:48px 0 24px; margin-top:auto; }
        .pch-foot-grid{ display:grid; grid-template-columns:1.4fr 1fr 1fr 1fr; gap:32px; padding-bottom:32px; }
        .pch-foot-brand{ display:flex; align-items:center; gap:10px; margin-bottom:12px; }
        .pch-foot-desc{ font-size:12.5px; color:var(--text-muted); line-height:1.7; max-width:260px; }
        .pch-foot-col h5{ font-size:12px; font-weight:800; letter-spacing:0.05em; text-transform:uppercase; color:var(--text-faint); margin-bottom:14px; }
        .pch-foot-col a{ display:block; font-size:13px; color:var(--text-muted); text-decoration:none; margin-bottom:10px; transition:color .18s ease; }
        .pch-foot-col a:hover{ color:var(--primary); }
        .pch-foot-bottom{ border-top:1px solid var(--border); padding-top:20px; display:flex; align-items:center; justify-content:space-between; font-size:12px; color:var(--text-faint); }
 
        @media (max-width:1080px){
          .pch-wrap{ padding:0 24px; }
          .pch-navlinks{ display:none; }
          .pch-foot-grid{ grid-template-columns:1fr 1fr; }
        }
        @media (max-width:768px){
          .pch-wrap{ padding:0 16px; }
          .pch-foot-grid{ grid-template-columns:1fr; gap: 24px; }
          .pch-header-row{ justify-content: space-between; }
          .pch-header-search{ max-width: 100%; margin: 8px 0; order: 3; flex-basis: 100%; }
        }
      `}</style>
 
      <div className="pch-notice">Free delivery on orders above ₹499 · Certified pharmacy · 100% authentic medicines</div>
 
      <header className="pch-header">
        <div className="pch-wrap pch-header-row">
          <Link to="/" className="pch-brand" style={{textDecoration: 'none'}}>
            <img src="/newlogo.png" alt="PharmCare Logo" style={{ height: '38px', width: 'auto', objectFit: 'contain' }} />
            <div className="pch-brand-name">PharmCare</div>
          </Link>
          <div className="pch-navlinks">
            <Link className={`pch-navlink ${location.pathname === '/' ? 'pch-active' : ''}`} to="/">Home</Link>
            <Link className={`pch-navlink ${location.pathname === '/products' ? 'pch-active' : ''}`} to="/products">Medicines</Link>
            <Link className={`pch-navlink ${location.pathname === '/categories' ? 'pch-active' : ''}`} to="/categories">Categories</Link>
            <Link className={`pch-navlink ${location.pathname === '/about' ? 'pch-active' : ''}`} to="/about">About Us</Link>
          </div>
          <div className="pch-header-search">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
            <input 
              type="text" 
              placeholder="Search medicines, wellness products…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>
          <div className="pch-header-actions" ref={dropdownRef}>
            <div className="pch-hicon" title="Wishlist" onClick={() => navigate('/wishlist')}>
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg>
              {wishCount > 0 && <span className="pch-hbadge">{wishCount}</span>}
            </div>
            <div className="pch-hicon" title="Cart" onClick={() => navigate('/cart')}>
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.5 3h2l2.6 12.6a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 2-1.6L21.5 8H6"/></svg>
              {cartCount > 0 && <span className="pch-hbadge">{cartCount}</span>}
            </div>
            {user ? (
               <>
                 <div className={`pch-havatar ${dropdownOpen ? 'pch-open' : ''}`} onClick={() => setDropdownOpen(!dropdownOpen)}>
                   {getInitials(user.userName)}
                 </div>
                 
                 {dropdownOpen && (
                   <div className="pch-dropdown">
                     <div className="pch-dd-header">
                       <div className="pch-dd-avatar">{getInitials(user.userName)}</div>
                       <div>
                         <div className="pch-dd-name">{user.userName}</div>
                         <div className="pch-dd-email">{user.email}</div>
                       </div>
                     </div>
              
                     <div className="pch-dd-section">
                       <div className="pch-dd-item" onClick={() => { setDropdownOpen(false); navigate('/dashboard'); }}>
                         <div className="pch-dd-icon pch-ic-a"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" rx="2"/><rect x="14" y="3" width="7" height="5" rx="2"/><rect x="14" y="12" width="7" height="9" rx="2"/><rect x="3" y="16" width="7" height="5" rx="2"/></svg></div>
                         Dashboard
                       </div>
                       <div className="pch-dd-item" onClick={() => { setDropdownOpen(false); navigate('/dashboard'); }}>
                         <div className="pch-dd-icon pch-ic-a"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a4 4 0 0 1 8 0v2"/></svg></div>
                         My Orders
                       </div>
                       <div className="pch-dd-item" onClick={() => { setDropdownOpen(false); navigate('/wishlist'); }}>
                         <div className="pch-dd-icon pch-ic-b"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg></div>
                         Wishlist
                         {wishCount > 0 && <span className="pch-dd-badge">{wishCount}</span>}
                       </div>
                       <div className="pch-dd-item" onClick={() => { setDropdownOpen(false); navigate('/dashboard'); }}>
                         <div className="pch-dd-icon pch-ic-c"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg></div>
                         Change Password
                       </div>
                     </div>
              
                     <div className="pch-dd-divider"></div>
              
                     <div className="pch-dd-logout" onClick={handleLogout}>
                       <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>
                       Logout
                     </div>
                   </div>
                 )}
               </>
            ) : (
               <Link to="/login" className="pch-navlink">Login</Link>
            )}
          </div>
        </div>
      </header>

      {/* Page Content */}
      <div className="pch-main-content" style={{ flexGrow: 1 }}>
        <Outlet />
      </div>
 
      <footer className="pch-footer">
        <div className="pch-wrap">
          <div className="pch-foot-grid">
            <div>
              <Link to="/" className="pch-brand" style={{textDecoration: 'none', marginBottom:'16px'}}>
                <img src="/newlogo.png" alt="PharmCare Logo" style={{ height: '38px', width: 'auto', objectFit: 'contain' }} />
                <div className="pch-brand-name" style={{fontSize:'22px'}}>PharmCare</div>
              </Link>
              <p className="pch-foot-desc">Your trusted partner in healthcare. Providing quality medicines, expert care, and reliable delivery since day one.</p>
            </div>
            <div className="pch-foot-col">
              <h5>Quick Links</h5>
              <Link to="/products">All Products</Link>
              <Link to="/products">Categories</Link>
              <Link to="/about">About Us</Link>
              <Link to="/dashboard">My Account</Link>
            </div>
            <div className="pch-foot-col">
              <h5>Customer Service</h5>
              <Link to="#">Shipping Policy</Link>
              <Link to="#">Returns &amp; Refunds</Link>
              <Link to="#">Privacy Policy</Link>
              <Link to="#">FAQs</Link>
            </div>
            <div className="pch-foot-col">
              <h5>Contact Us</h5>
              <Link to="#">+91 1800-PHARMA</Link>
              <Link to="#">care@mspharmcare.com</Link>
            </div>
          </div>
          <div className="pch-foot-bottom">
            <span>© 2026 PharmCare. All rights reserved.</span>
            <span>Made with care for your wellbeing</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
