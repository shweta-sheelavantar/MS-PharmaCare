import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function AboutPage() {
  const { user, token } = useAuth();
  const { totalItems: cartCount } = useCart();
  const { totalItems: wishCount } = useWishlist();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  return (
    <>
      <style>{`
        .pch-root{
          --bg:#F3F6F1; --surface:#FFFFFF; --surface-alt:#FAF9F4;
          --primary:#2F5245; --primary-light:#DCEAE1; --primary-dark:#1E362D;
          --secondary:#7C79B0; --secondary-light:#EAE8F6;
          --accent:#D9A256; --accent-light:#F6E9D3;
          --danger:#C15B4A; --danger-light:#F7E3DE;
          --text:#25332E; --text-muted:#748177; --text-faint:#9BA79E;
          --border:#E6EAE2; --radius-lg:22px; --radius-md:16px; --radius-sm:10px;
          --font-display:'Fraunces', serif; --font-body:'Manrope', sans-serif;
        }

        /* ---------- About Hero ---------- */
        .pch-about-hero{ padding:60px 0 50px; position:relative; overflow:hidden; }
        .pch-blob{ position:absolute; border-radius:999px; filter:blur(50px); opacity:0.5; pointer-events:none; }
        .pch-blob-a{ width:320px; height:170px; background:var(--primary-light); top:-40px; left:40px; }
        .pch-blob-b{ width:220px; height:120px; background:var(--secondary-light); top:10px; right:60px; transform:rotate(-12deg); }
        .pch-about-hero-inner{ text-align:center; max-width:680px; margin:0 auto; position:relative; }
        .pch-breadcrumb{ font-size:12px; font-weight:700; letter-spacing:0.07em; text-transform:uppercase; color:var(--primary); }
        .pch-about-title{ font-family:var(--font-display); font-size:40px; font-weight:600; letter-spacing:-0.01em; margin-top:12px; line-height:1.2; }
        .pch-about-title em{ font-style:italic; color:var(--primary); }
        .pch-about-sub{ font-size:15px; color:var(--text-muted); line-height:1.75; margin-top:16px; }
 
        /* ---------- Stats ---------- */
        .pch-stats-strip{ padding:8px 0 56px; }
        .pch-stats-grid{ display:grid; grid-template-columns:repeat(4,1fr); gap:16px; }
        .pch-stat-tile{ background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-md); padding:26px 22px; text-align:center; }
        .pch-stat-num{ font-family:var(--font-display); font-size:30px; font-weight:600; color:var(--primary); }
        .pch-stat-label{ font-size:12px; color:var(--text-muted); font-weight:700; margin-top:6px; }
 
        /* ---------- Story ---------- */
        .pch-story{ padding:20px 0 60px; }
        .pch-story-inner{ display:grid; grid-template-columns:0.9fr 1.1fr; gap:52px; align-items:center; }
        .pch-story-art{ position:relative; }
        .pch-story-card{ background:var(--primary); border-radius:var(--radius-lg); padding:40px 34px; color:#fff; position:relative; overflow:hidden; min-height:340px; display:flex; flex-direction:column; justify-content:center; }
        .pch-story-card::before{ content:''; position:absolute; width:240px; height:240px; border-radius:50%; background:rgba(255,255,255,0.06); top:-100px; right:-70px; }
        .pch-story-icon{ width:56px; height:56px; border-radius:16px; background:rgba(255,255,255,0.14); display:flex; align-items:center; justify-content:center; margin-bottom:20px; position:relative; }
        .pch-story-icon svg{ width:26px; height:26px; stroke:#fff; }
        .pch-story-card h4{ font-family:var(--font-display); font-size:22px; font-weight:600; line-height:1.35; max-width:300px; position:relative; }
        .pch-story-card p{ font-size:13px; opacity:0.82; margin-top:12px; line-height:1.7; max-width:300px; position:relative; }
 
        .pch-sec-eyebrow{ font-size:12px; font-weight:700; letter-spacing:0.07em; text-transform:uppercase; color:var(--primary); }
        .pch-story-title{ font-family:var(--font-display); font-size:28px; font-weight:600; letter-spacing:-0.01em; margin-top:8px; }
        .pch-story-text{ font-size:14.5px; color:var(--text-muted); line-height:1.8; margin-top:16px; }
        .pch-story-text + .pch-story-text{ margin-top:12px; }
 
        /* ---------- Values ---------- */
        .pch-values{ padding:20px 0 60px; }
        .pch-sec-head{ text-align:center; max-width:520px; margin:0 auto 34px; }
        .pch-values-grid{ display:grid; grid-template-columns:repeat(4,1fr); gap:18px; }
        .pch-value-card{ background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-md); padding:26px 22px; }
        .pch-value-icon{ width:44px; height:44px; border-radius:13px; display:flex; align-items:center; justify-content:center; margin-bottom:16px; }
        .pch-value-icon svg{ width:20px; height:20px; }
        .pch-vi-1{ background:var(--primary-light); } .pch-vi-1 svg{ stroke:var(--primary); }
        .pch-vi-2{ background:var(--secondary-light); } .pch-vi-2 svg{ stroke:var(--secondary); }
        .pch-vi-3{ background:var(--accent-light); } .pch-vi-3 svg{ stroke:#B57A2F; }
        .pch-vi-4{ background:var(--danger-light); } .pch-vi-4 svg{ stroke:var(--danger); }
        .pch-value-card h5{ font-size:15px; font-weight:700; }
        .pch-value-card p{ font-size:12.5px; color:var(--text-muted); margin-top:8px; line-height:1.6; }
 
        /* ---------- Timeline ---------- */
        .pch-timeline{ padding:20px 0 60px; }
        .pch-tl-row{ display:grid; grid-template-columns:repeat(4,1fr); gap:16px; position:relative; }
        .pch-tl-row::before{ content:''; position:absolute; top:22px; left:8%; right:8%; height:2px; background:var(--border); }
        .pch-tl-item{ position:relative; text-align:center; }
        .pch-tl-dot{ width:44px; height:44px; border-radius:50%; background:var(--surface); border:2px solid var(--primary); color:var(--primary); font-family:var(--font-display); font-weight:700; font-size:13px; display:flex; align-items:center; justify-content:center; margin:0 auto 14px; position:relative; z-index:2; }
        .pch-tl-item h6{ font-size:13.5px; font-weight:700; }
        .pch-tl-item p{ font-size:12px; color:var(--text-muted); margin-top:5px; line-height:1.5; max-width:190px; margin-left:auto; margin-right:auto; }
 
        /* ---------- Testimonial ---------- */
        .pch-testimonial{ padding:20px 0 60px; }
        .pch-test-card{ background:var(--secondary-light); border-radius:var(--radius-lg); padding:44px 52px; text-align:center; max-width:760px; margin:0 auto; position:relative; }
        .pch-quote-mark{ font-family:var(--font-display); font-size:60px; color:var(--secondary); line-height:0.5; opacity:0.5; }
        .pch-test-text{ font-family:var(--font-display); font-style:italic; font-size:19px; line-height:1.6; color:var(--primary-dark); margin-top:6px; }
        .pch-test-author{ display:flex; align-items:center; justify-content:center; gap:12px; margin-top:22px; }
        .pch-test-avatar{ width:38px; height:38px; border-radius:50%; background:var(--secondary); color:#fff; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:13px; }
        .pch-test-name{ font-size:13.5px; font-weight:700; text-align:left; }
        .pch-test-role{ font-size:11.5px; color:var(--text-muted); text-align:left; }
 
        /* ---------- CTA ---------- */
        .pch-cta{ padding:8px 0 56px; }
        .pch-cta-card{ background:var(--primary); border-radius:var(--radius-lg); padding:44px 48px; display:flex; align-items:center; justify-content:space-between; gap:24px; position:relative; overflow:hidden; color:#fff; }
        .pch-cta-card::before{ content:''; position:absolute; width:260px; height:260px; border-radius:50%; background:rgba(255,255,255,0.06); top:-110px; right:-60px; }
        .pch-cta-text h3{ font-family:var(--font-display); font-size:25px; font-weight:600; max-width:420px; line-height:1.3; margin:0;}
        .pch-cta-text p{ font-size:13.5px; opacity:0.85; margin-top:10px; max-width:400px; line-height:1.6; }
        .pch-cta-btn{ background:#fff; color:var(--primary-dark); padding:13px 26px; border-radius:999px; font-size:14px; font-weight:800; text-decoration:none; white-space:nowrap; position:relative; z-index:2; transition:transform .18s ease; display:inline-block;}
        .pch-cta-btn:hover{ transform:translateY(-1px); }
 
        .pch-foot-col a:hover{ color:var(--primary); }
        .pch-foot-bottom{ border-top:1px solid var(--border); padding-top:20px; display:flex; align-items:center; justify-content:space-between; font-size:12px; color:var(--text-faint); }
 
        @media (max-width:1080px){
          .pch-wrap{ padding:0 24px; }
          .pch-navlinks{ display:none; }
          .pch-stats-grid{ grid-template-columns:repeat(2,1fr); }
          .pch-story-inner{ grid-template-columns:1fr; }
          .pch-values-grid{ grid-template-columns:repeat(2,1fr); }
          .pch-tl-row{ grid-template-columns:repeat(2,1fr); row-gap:36px; }
          .pch-tl-row::before{ display:none; }
          .pch-cta-card{ flex-direction:column; text-align:center; }
          .pch-foot-grid{ grid-template-columns:1fr 1fr; }
          .pch-test-card{ padding:34px 26px; }
        }
      `}</style>
 

      <section className="pch-about-hero pch-section pch-r1">
        <div className="pch-blob pch-blob-a"></div>
        <div className="pch-blob pch-blob-b"></div>
        <div className="pch-wrap pch-about-hero-inner">
          <div className="pch-breadcrumb">About Us</div>
          <h1 className="pch-about-title">Care that goes <em>beyond</em> the counter</h1>
          <p className="pch-about-sub">PharmCare started with a simple idea: getting genuine medicines and honest advice shouldn't be complicated. Today we're a trusted healthcare partner for tens of thousands of families across the country.</p>
        </div>
      </section>
 
      <section className="pch-stats-strip pch-section pch-r1">
        <div className="pch-wrap pch-stats-grid">
          <div className="pch-stat-tile"><div className="pch-stat-num">50K+</div><div className="pch-stat-label">Families served</div></div>
          <div className="pch-stat-tile"><div className="pch-stat-num">166+</div><div className="pch-stat-label">Products stocked</div></div>
          <div className="pch-stat-tile"><div className="pch-stat-num">98%</div><div className="pch-stat-label">On-time delivery</div></div>
          <div className="pch-stat-tile"><div className="pch-stat-num">4.8★</div><div className="pch-stat-label">Average rating</div></div>
        </div>
      </section>
 
      <section className="pch-story pch-section pch-r2">
        <div className="pch-wrap pch-story-inner">
          <div className="pch-story-art">
            <div className="pch-story-card">
              <div className="pch-story-icon"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z"/></svg></div>
              <h4>Licensed pharmacists behind every order</h4>
              <p>Every prescription is reviewed by a certified pharmacist before it ships — no shortcuts, ever.</p>
            </div>
          </div>
          <div>
            <div className="pch-sec-eyebrow">Our story</div>
            <h2 className="pch-story-title">Built by people who take medicine seriously</h2>
            <p className="pch-story-text">PharmCare was founded to fix a simple, frustrating problem: finding genuine medicines quickly, without the guesswork. We partner directly with certified manufacturers and licensed pharmacists so every order — from a box of bandages to a monthly prescription refill — is exactly what it says it is.</p>
            <p className="pch-story-text">What started as a small local pharmacy has grown into a platform families rely on for everyday healthcare, without losing the personal care that got us here in the first place.</p>
          </div>
        </div>
      </section>
 
      <section className="pch-values pch-section pch-r3">
        <div className="pch-wrap">
          <div className="pch-sec-head">
            <div className="pch-sec-eyebrow">What we stand for</div>
            <h2 className="pch-story-title">The values behind every order</h2>
          </div>
          <div className="pch-values-grid">
            <div className="pch-value-card">
              <div className="pch-value-icon pch-vi-1"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg></div>
              <h5>Authenticity first</h5>
              <p>Every medicine is sourced directly from certified manufacturers — no exceptions.</p>
            </div>
            <div className="pch-value-card">
              <div className="pch-value-icon pch-vi-2"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg></div>
              <h5>Genuine care</h5>
              <p>Real pharmacists are a message away whenever you have a question about your medication.</p>
            </div>
            <div className="pch-value-card">
              <div className="pch-value-icon pch-vi-3"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8Z"/><circle cx="5.5" cy="18.5" r="1.5"/><circle cx="18.5" cy="18.5" r="1.5"/></svg></div>
              <h5>Speed you can rely on</h5>
              <p>Most orders reach your door within 24 hours, tracked from checkout to delivery.</p>
            </div>
            <div className="pch-value-card">
              <div className="pch-value-icon pch-vi-4"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>
              <h5>Privacy by default</h5>
              <p>Your prescriptions and health data are encrypted and never sold or shared.</p>
            </div>
          </div>
        </div>
      </section>
 
      <section className="pch-timeline pch-section pch-r4">
        <div className="pch-wrap">
          <div className="pch-sec-head">
            <div className="pch-sec-eyebrow">Our journey</div>
            <h2 className="pch-story-title">From one counter to a nationwide pharmacy</h2>
          </div>
          <div className="pch-tl-row">
            <div className="pch-tl-item">
              <div className="pch-tl-dot">2019</div>
              <h6>Founded</h6>
              <p>Opened as a single neighbourhood pharmacy counter.</p>
            </div>
            <div className="pch-tl-item">
              <div className="pch-tl-dot">2021</div>
              <h6>Went online</h6>
              <p>Launched home delivery across the first three cities.</p>
            </div>
            <div className="pch-tl-item">
              <div className="pch-tl-dot">2023</div>
              <h6>Certified network</h6>
              <p>Partnered with licensed pharmacists nationwide.</p>
            </div>
            <div className="pch-tl-item">
              <div className="pch-tl-dot">2026</div>
              <h6>50,000+ families</h6>
              <p>Now serving customers in every major city.</p>
            </div>
          </div>
        </div>
      </section>
 
      <section className="pch-testimonial pch-section pch-r4">
        <div className="pch-wrap">
          <div className="pch-test-card">
            <div className="pch-quote-mark">"</div>
            <p className="pch-test-text">PharmCare has made managing my parents' monthly prescriptions so much easier — refills arrive before we even run low, and I always know it's the real medicine.</p>
            <div className="pch-test-author">
              <div className="pch-test-avatar">R</div>
              <div>
                <div className="pch-test-name">Riya Sharma</div>
                <div className="pch-test-role">Customer since 2022</div>
              </div>
            </div>
          </div>
        </div>
      </section>
 
      <section className="pch-cta pch-section pch-r5">
        <div className="pch-wrap">
          <div className="pch-cta-card">
            <div className="pch-cta-text">
              <h3>Have a question for our pharmacists?</h3>
              <p>Our licensed team is available every day to help you choose the right medicine or answer any concern.</p>
            </div>
            <Link className="pch-cta-btn" to="/contact">Contact us</Link>
          </div>
        </div>
      </section>
 
    </>
  );
}
