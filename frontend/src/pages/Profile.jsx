import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useLayoutEffect } from 'react';

export default function Profile() {
  const { user, logout } = useAuth();
  const { items: cartItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const navigate = useNavigate();

  const displayName = user?.userName || 'User';
  const email = user?.email || 'No email provided';
  const initials = displayName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  const joinDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'July 2024';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  useLayoutEffect(() => {
    // Aggressively force scroll to top on mount before paint
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  return (
    <>
      <section className="page" style={{ opacity: 1, animation: 'none', padding: '10px 0 20px' }}>
        <div className="breadcrumb">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5 12 3l9 6.5V21a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5Z"/></svg>
          <Link to="/">Home</Link> / <b>My Profile</b>
        </div>
        <div className="page-title">My Profile</div>
        <div className="page-sub">Manage your personal information and security</div>

        <div className="profile-card">
          <div className="profile-hero">
            <div className="profile-avatar">{initials}</div>
            <div>
              <div className="profile-name">{displayName}</div>
              <div className="profile-email">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/></svg>
                {email}
              </div>
              <div className="active-badge"><span className="active-dot"></span>Active Account</div>
            </div>
          </div>

          <div className="info-grid">
            <div className="info-panel">
              <div className="info-head">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg>
                <div className="info-title">Personal Details</div>
              </div>
              <div className="info-row"><div className="info-label">Username</div><div className="info-value">{displayName}</div></div>
              <div className="info-row"><div className="info-label">Email Address</div><div className="info-value">{email}</div></div>
            </div>
            <div className="info-panel">
              <div className="info-head">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>
                <div className="info-title">Security &amp; Status</div>
              </div>
              <div className="info-row"><div className="info-label">Password</div><div className="info-value dots">••••••••</div></div>
              <div className="info-row"><div className="info-label">Member Since</div><div className="info-value">{joinDate}</div></div>
            </div>
          </div>

          <div className="actions-row">
            <div className="actions-title">Account Actions</div>
            <Link className="btn btn-primary" to="/profile">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
              Edit Profile
            </Link>
            <Link className="btn btn-ghost" to="/change-password">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>
              Change Password
            </Link>
            <button className="btn btn-danger" onClick={handleLogout}>
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>
              Logout
            </button>
          </div>
        </div>
      </section>

      <section className="d2" style={{ opacity: 1, animation: 'none', padding: '10px 0 20px' }}>
        <div className="activity-title">Your Activity</div>
        <div className="activity-grid">
          <Link to="/orders" className="activity-card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="activity-icon ai-1"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a4 4 0 0 1 8 0v2"/></svg></div>
            <div><div className="activity-num">0</div><div className="activity-label">Active orders</div></div>
          </Link>
          <Link to="/wishlist" className="activity-card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="activity-icon ai-2"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg></div>
            <div><div className="activity-num">{wishlistItems.length}</div><div className="activity-label">Wishlist items</div></div>
          </Link>
          <Link to="/cart" className="activity-card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="activity-icon ai-3"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.5 3h2l2.6 12.6a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 2-1.6L21.5 8H6"/></svg></div>
            <div><div className="activity-num">{cartItems.length}</div><div className="activity-label">Cart items</div></div>
          </Link>
        </div>
      </section>
    </>
  );
}
