import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  ShoppingCart, 
  Users, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import './AdminLayout.css';

const AdminLayout = () => {
  const location = useLocation();
  const { logout, adminUser } = useAdminAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Categories', path: '/admin/categories', icon: Tags },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Users', path: '/admin/users', icon: Users },
  ];

  const currentNav = navItems.find(item => location.pathname.startsWith(item.path)) || { name: 'Dashboard' };

  return (
    <div className="admin-layout">
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="admin-backdrop" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        {/* Brand Block */}
        <div className="admin-brand">
          <div className="admin-brand-icon">MS</div>
          <div className="admin-brand-text">
            <div className="admin-brand-title">
              PharmCare<span>Admin</span>
            </div>
            <div className="admin-brand-sub">Console</div>
          </div>
          <button 
            className="admin-sidebar-close" 
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Nav List */}
        <nav className="admin-nav">
          <ul className="admin-nav-list">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`admin-nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        {/* Footer */}
        <div className="admin-footer">
          <div className="admin-user">
            <div className="admin-user-avatar">
              {adminUser?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="admin-user-info">
               <span className="admin-user-name">{adminUser?.name || 'Administrator'}</span>
               <span className="admin-user-email">{adminUser?.email || 'admin@admin.com'}</span>
            </div>
          </div>
          <button onClick={logout} className="admin-logout-btn">
            <LogOut />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="admin-main">
        {/* Top bar */}
        <header className="admin-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              className="admin-mobile-toggle"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <div className="admin-breadcrumbs">
              Admin / <span>{currentNav.name}</span>
            </div>
          </div>
          
          <div className="admin-status">
            <div className="admin-status-dot"></div>
            <span className="admin-status-text">Operational</span>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
