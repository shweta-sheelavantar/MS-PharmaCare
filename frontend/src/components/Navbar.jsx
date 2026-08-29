import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { User, LogOut, Grid3X3, Lock, Menu, X, Search } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems: cartCount } = useCart();
  const { totalItems: wishCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const profileRef = useRef(null);

  const displayName = user?.userName || 'Account';

  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = async () => {
    setProfileOpen(false);
    await logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { name: 'Home', to: '/' },
    { name: 'Medicines', to: '/products' },
    { name: 'Categories', to: '/categories' },
    { name: 'About Us', to: '/about' },
  ];

  return (
    <>
      <div className="notice">
        Free delivery on orders above ₹499 · Certified pharmacy · 100% authentic medicines
      </div>
      <header>
        <div className="wrap header-row">
          <div className="flex items-center gap-4 shrink-0">
            <button 
              className="lg:hidden text-[var(--text)] hover:text-[var(--primary)] transition-colors bg-transparent border-none p-0 cursor-pointer flex items-center justify-center mr-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link to="/" className="brand">
              <img src="/newlogo.png" alt="PharmCare Logo" style={{ height: '38px', width: 'auto', objectFit: 'contain' }} />
              <div className="brand-name">PharmCare</div>
            </Link>
          </div>
          
          <div className="navlinks hidden lg:flex">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.to} 
                className={`navlink ${location.pathname === link.to ? 'active' : ''}`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <form onSubmit={handleSearch} className="header-search hidden md:flex">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
            <input
              type="text"
              placeholder="Search medicines, wellness products…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          <div className="header-actions">
            <Link to={isAuthenticated ? '/wishlist' : '/login'} className="hicon hidden sm:flex">
              {wishCount > 0 && <span className="hbadge">{wishCount}</span>}
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg>
            </Link>

            <Link to={isAuthenticated ? '/cart' : '/login'} className="hicon">
              {cartCount > 0 && <span className="hbadge">{cartCount}</span>}
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.5 3h2l2.6 12.6a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 2-1.6L21.5 8H6"/></svg>
            </Link>

            <div className="relative" ref={profileRef}>
              {isAuthenticated ? (
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className={`havatar ${profileOpen ? 'open' : ''}`}
                >
                  {user?.userName?.[0] || 'U'}
                </button>
              ) : (
                <Link to="/login" className="hicon">
                  <User size={18} strokeWidth={2} />
                </Link>
              )}
              {profileOpen && isAuthenticated && (
                <div className="dropdown">
                  <div className="dd-header">
                    <div className="dd-avatar">{user?.userName?.[0] || 'U'}</div>
                    <div>
                      <div className="dd-name">{user?.userName || 'User'}</div>
                      <div className="dd-email" title={user?.email}>{user?.email}</div>
                    </div>
                  </div>
          
                  <div className="dd-section">
                    <Link to="/dashboard" onClick={() => setProfileOpen(false)} className="dd-item">
                      <div className="dd-icon ic-a"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" rx="2"/><rect x="14" y="3" width="7" height="5" rx="2"/><rect x="14" y="12" width="7" height="9" rx="2"/><rect x="3" y="16" width="7" height="5" rx="2"/></svg></div>
                      Dashboard
                    </Link>
                    <Link to="/orders" onClick={() => setProfileOpen(false)} className="dd-item">
                      <div className="dd-icon ic-a"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a4 4 0 0 1 8 0v2"/></svg></div>
                      My Orders
                    </Link>
                    <Link to="/wishlist" onClick={() => setProfileOpen(false)} className="dd-item">
                      <div className="dd-icon ic-b"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg></div>
                      Wishlist
                      {wishCount > 0 && <span className="dd-badge">{wishCount}</span>}
                    </Link>
                    <Link to="/change-password" onClick={() => setProfileOpen(false)} className="dd-item">
                      <div className="dd-icon ic-c"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg></div>
                      Change Password
                    </Link>
                  </div>
          
                  <div className="dd-divider"></div>
          
                  <button onClick={handleLogout} className="dd-logout border-none bg-transparent w-full text-left font-body">
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-black/50 z-50 transition-opacity lg:hidden ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setMobileMenuOpen(false)}>
        <div className={`fixed inset-y-0 left-0 w-3/4 max-w-sm bg-[var(--surface)] shadow-xl transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`} onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
             <Link to="/" className="brand" onClick={() => setMobileMenuOpen(false)}>
                <div className="brand-mark">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.5 20.5 3.5 13.5a5 5 0 1 1 7-7l7 7a5 5 0 1 1-7 7Z"/><path d="M8.5 8.5l7 7"/></svg>
                </div>
                <div className="brand-name text-lg">PharmCare</div>
             </Link>
             <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-[var(--text-muted)] hover:text-[var(--text)] bg-transparent border-none cursor-pointer"><X size={24} /></button>
          </div>
          <div className="p-4 border-b border-[var(--border)]">
            <form onSubmit={(e) => { handleSearch(e); setMobileMenuOpen(false); }} className="relative">
              <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-[var(--surface-alt)] border border-[var(--border)] rounded-full py-2.5 pl-4 pr-10 text-sm focus:outline-none focus:border-[var(--primary)]" style={{ fontFamily: 'var(--font-body)' }} />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] bg-transparent border-none cursor-pointer p-0"><Search size={18} /></button>
            </form>
          </div>
          <div className="py-2">
            {navLinks.map((link) => (
               <Link key={link.name} to={link.to} onClick={() => setMobileMenuOpen(false)} className="block px-6 py-3 text-sm font-semibold text-[var(--text)] hover:bg-[var(--primary-light)] hover:text-[var(--primary)]" style={{ fontFamily: 'var(--font-body)' }}>{link.name}</Link>
            ))}
            <Link to={isAuthenticated ? '/wishlist' : '/login'} onClick={() => setMobileMenuOpen(false)} className="block px-6 py-3 text-sm font-semibold text-[var(--text)] hover:bg-[var(--primary-light)] hover:text-[var(--primary)] sm:hidden" style={{ fontFamily: 'var(--font-body)' }}>Wishlist ({wishCount})</Link>
          </div>
        </div>
      </div>
    </>
  );
}
