import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer>
      <div className="wrap max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-8">
          <div>
            <Link to="/" className="foot-brand">
              <img src="/newlogo.png" alt="PharmCare Logo" style={{ height: '38px', width: 'auto', objectFit: 'contain' }} />
              <div className="brand-name">PharmCare</div>
            </Link>
            <p className="foot-desc">Your trusted partner in healthcare. Providing quality medicines, expert care, and reliable delivery since day one.</p>
          </div>
          <div className="foot-col">
            <h5>Quick Links</h5>
            <Link to="/products">All Products</Link>
            <Link to="/categories">Categories</Link>
            <Link to="/about">About Us</Link>
            <Link to="/dashboard">My Account</Link>
          </div>
          <div className="foot-col">
            <h5>Customer Service</h5>
            <Link to="/shipping">Shipping Policy</Link>
            <Link to="/returns">Returns & Refunds</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/faq">FAQs</Link>
          </div>
          <div className="foot-col">
            <h5>Contact Us</h5>
            <span style={{ pointerEvents: 'none' }}>+91 1800-PHARMA</span>
            <span style={{ pointerEvents: 'none' }}>care@mspharmcare.com</span>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© {new Date().getFullYear()} PharmCare. All rights reserved.</span>
          <span>Made with care for your wellbeing</span>
        </div>
      </div>
    </footer>
  );
}
