import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const { totalItems: cartCount } = useCart();
  const { totalItems: wishCount } = useWishlist();

  const displayName = user?.userName || 'User';
  
  // Format current date e.g. "Thursday, 6 August"
  const dateOptions = { weekday: 'long', day: 'numeric', month: 'long' };
  const formattedDate = new Date().toLocaleDateString('en-US', dateOptions);

  return (
    <>
      <section className="hero s1">
        <div className="hero-greeting">
          <div className="blob blob-a"></div>
          <div className="blob blob-b"></div>
          <div className="eyebrow">{formattedDate}</div>
          <h1 className="greeting-title">Good afternoon, <em>{displayName}</em></h1>
          <p className="greeting-sub">Everything looks steady today. One refill is coming up this week — take a look whenever you're ready.</p>
          <a className="greeting-cta" href="#">
            View refill schedule
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
          </a>
        </div>
        <div className="ring-card">
          <div className="ring-wrap">
            <svg width="132" height="132" viewBox="0 0 132 132">
              <circle className="ring-track" cx="66" cy="66" r="56"/>
              <circle className="ring-progress" cx="66" cy="66" r="56"/>
            </svg>
            <div className="ring-center">
              <div className="ring-num">82%</div>
              <div className="ring-label">ADHERENCE</div>
            </div>
          </div>
          <div className="ring-caption">On track this month</div>
          <div className="ring-note">You've taken 23 of 28 scheduled doses</div>
        </div>
      </section>
    
      <section className="stats s2">
        <div className="stat-card">
          <div className="stat-top">
            <div className="stat-icon icon-green"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a4 4 0 0 1 8 0v2"/></svg></div>
            <span className="stat-trend">+3</span>
          </div>
          <div className="stat-value">21</div>
          <div className="stat-label">Active orders</div>
        </div>
        <div className="stat-card">
          <div className="stat-top">
            <div className="stat-icon icon-lavender"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg></div>
          </div>
          <div className="stat-value">{wishCount}</div>
          <div className="stat-label">Wishlist items</div>
        </div>
        <div className="stat-card">
          <div className="stat-top">
            <div className="stat-icon icon-amber"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg></div>
            <span className="stat-trend">Soon</span>
          </div>
          <div className="stat-value">3 days</div>
          <div className="stat-label">Next refill due</div>
        </div>
        <div className="stat-card">
          <div className="stat-top">
            <div className="stat-icon icon-rose"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.5 3h2l2.6 12.6a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 2-1.6L21.5 8H6"/></svg></div>
          </div>
          <div className="stat-value">{cartCount}</div>
          <div className="stat-label">Cart items</div>
        </div>
      </section>
    
      <section className="grid-2 s3">
        <div className="panel">
          <div className="panel-head">
            <div className="panel-title">Upcoming refills</div>
            <a className="panel-link" href="#">View all</a>
          </div>
          <div className="refill-row">
            <div className="refill-icon"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.5 20.5 3.5 13.5a5 5 0 1 1 7-7l7 7a5 5 0 1 1-7 7Z"/><path d="M8.5 8.5l7 7"/></svg></div>
            <div>
              <div className="refill-name">Amlodipine 5 mg</div>
              <div className="refill-meta">1 tablet · daily · morning</div>
            </div>
            <span className="pill pill-soon">Due in 3 days</span>
          </div>
          <div className="refill-row">
            <div className="refill-icon"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.5 20.5 3.5 13.5a5 5 0 1 1 7-7l7 7a5 5 0 1 1-7 7Z"/><path d="M8.5 8.5l7 7"/></svg></div>
            <div>
              <div className="refill-name">Atorvastatin 10 mg</div>
              <div className="refill-meta">1 tablet · nightly</div>
            </div>
            <span className="pill pill-ok">Due in 12 days</span>
          </div>
          <div className="refill-row">
            <div className="refill-icon"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.5 20.5 3.5 13.5a5 5 0 1 1 7-7l7 7a5 5 0 1 1-7 7Z"/><path d="M8.5 8.5l7 7"/></svg></div>
            <div>
              <div className="refill-name">Amoxicillin 500 mg</div>
              <div className="refill-meta">Course completed</div>
            </div>
            <span className="pill pill-ok">No action needed</span>
          </div>
        </div>
    
        <div className="panel">
          <div className="panel-head">
            <div className="panel-title">Recent orders</div>
            <Link className="panel-link" to="/orders">View all</Link>
          </div>
          <div className="order-row">
            <div>
              <div className="order-id">ORD-2C75F576</div>
              <div className="order-date">Aug 3, 2026</div>
            </div>
            <div className="order-right">
              <span className="status status-confirmed">Confirmed</span>
              <span className="order-amt">₹236.00</span>
            </div>
          </div>
          <div className="order-row">
            <div>
              <div className="order-id">ORD-8AE4CDD0</div>
              <div className="order-date">Aug 3, 2026</div>
            </div>
            <div className="order-right">
              <span className="status status-confirmed">Confirmed</span>
              <span className="order-amt">₹295.00</span>
            </div>
          </div>
          <div className="order-row">
            <div>
              <div className="order-id">ORD-D66A88F2</div>
              <div className="order-date">Aug 3, 2026</div>
            </div>
            <div className="order-right">
              <span className="status status-cancelled">Cancelled</span>
              <span className="order-amt">₹236.00</span>
            </div>
          </div>
        </div>
      </section>
    
      <section className="tip s3">
        <div className="tip-icon">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.4 1 1.2 1 2.3v.4h6v-.4c0-1.1.4-1.9 1-2.3A7 7 0 0 0 12 2Z"/></svg>
        </div>
        <div>
          <div className="tip-text">"Taking medication at the same time each day is the single biggest habit that improves adherence."</div>
          <div className="tip-sub">Today's wellness tip</div>
        </div>
      </section>
    
      <section className="s4">
        <div className="panel-title-row">
          <div className="panel-title">Recommended for you</div>
          <Link className="panel-link" to="/products">Browse all</Link>
        </div>
        <div className="product-scroll">
          <div className="product-card">
            <div className="product-thumb thumb-a"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.5 20.5 3.5 13.5a5 5 0 1 1 7-7l7 7a5 5 0 1 1-7 7Z"/><path d="M8.5 8.5l7 7"/></svg></div>
            <div className="product-name">Adhesive Bandages</div>
            <div className="product-cat">First aid</div>
            <div className="product-foot">
              <span className="product-price">₹199</span>
              <button className="add-btn"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg></button>
            </div>
          </div>
          <div className="product-card">
            <div className="product-thumb thumb-b"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a4 4 0 0 1 8 0v2"/></svg></div>
            <div className="product-name">Amlodipine 5 mg</div>
            <div className="product-cat">Prescription</div>
            <div className="product-foot">
              <span className="product-price">₹149</span>
              <button className="add-btn"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg></button>
            </div>
          </div>
          <div className="product-card">
            <div className="product-thumb thumb-c"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9 12h6M12 9v6"/></svg></div>
            <div className="product-name">Multivitamin Gummies</div>
            <div className="product-cat">Wellness</div>
            <div className="product-foot">
              <span className="product-price">₹349</span>
              <button className="add-btn"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg></button>
            </div>
          </div>
          <div className="product-card">
            <div className="product-thumb thumb-d"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v3M12 18v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M3 12h3M18 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></svg></div>
            <div className="product-name">Digital Thermometer</div>
            <div className="product-cat">Devices</div>
            <div className="product-foot">
              <span className="product-price">₹499</span>
              <button className="add-btn"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg></button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
