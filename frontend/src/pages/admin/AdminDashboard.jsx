import React, { useEffect, useState } from 'react';
import { adminAuthApi } from '../../api/adminAuthApi';
import { toast } from 'react-toastify';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminAuthApi.getStats();
        setStats(response.data?.data || response.data || {});
      } catch (error) {
        toast.error('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-emerald-500"></div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="pca-root w-full">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800&display=swap');

        .pca-root, .pca-root *{ box-sizing:border-box; }
        .pca-root{
          --bg:#EEF2F8; --surface:#FFFFFF; --surface-alt:#F5F8FC;
          --primary:#1D4E93; --primary-light:#DCE7F8; --primary-dark:#123568;
          --success:#1D9A6C; --success-light:#DFF4EA;
          --warning:#C98A1B; --warning-light:#FBF0D8;
          --danger:#CF3F3F; --danger-light:#FBE2E2;
          --text:#182233; --text-muted:#64707F; --text-faint:#96A1AE;
          --border:#E3E8F1; --radius-lg:20px; --radius-md:14px;
          --font-display:'Sora', sans-serif; --font-body:'Inter', sans-serif;

          font-family: var(--font-body);
          background: transparent;
          color: var(--text);
          display:block;
          width:100%;
          -webkit-font-smoothing:antialiased;
        }
        @media (prefers-reduced-motion: reduce){
          .pca-root *{ animation-duration:.001ms !important; animation-iteration-count:1 !important; transition-duration:.001ms !important; }
        }

        /* ---------- Main ---------- */
        .pca-main{ flex:1; min-width:0; padding:10px 0 0 0; max-width:1400px; width: 100%; }

        .pca-topbar{ display:flex; align-items:center; margin-bottom:22px; flex-wrap:wrap; gap:12px; }
        .pca-breadcrumb{ font-size:12.5px; color:var(--text-faint); font-weight:600; }
        .pca-breadcrumb b{ color:var(--text); font-weight:700; }
        .pca-status-pill{
          margin-left:auto; display:flex; align-items:center; gap:8px;
          background:var(--surface); border:1px solid var(--border);
          padding:8px 16px; border-radius:999px; font-size:12.5px; font-weight:600; color:var(--text-muted);
          white-space:nowrap;
        }
        .pca-status-dot{ width:7px; height:7px; border-radius:50%; background:var(--success); box-shadow:0 0 0 3px var(--success-light); flex-shrink:0; }
        .pca-status-pill b{ color:var(--success); font-weight:700; }

        .pca-section{ opacity:0; animation:pca-rise .55s ease forwards; }
        @keyframes pca-rise{ from{opacity:0; transform:translateY(8px);} to{opacity:1; transform:translateY(0);} }
        .pca-d1{ animation-delay:.02s; } .pca-d2{ animation-delay:.09s; }

        .pca-page-head{ margin-bottom:26px; }
        .pca-page-title{ font-family:var(--font-display); font-size:27px; font-weight:700; letter-spacing:-0.01em; }
        .pca-page-sub{ font-size:13.5px; color:var(--text-muted); margin-top:5px; }

        /* ---------- Stat cards ---------- */
        .pca-stats{ display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:16px; margin-bottom:20px; }
        .pca-stat-card{
          background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg);
          padding:22px 24px; position:relative; overflow:hidden; min-width:0;
          transition:box-shadow .2s ease, transform .2s ease;
        }
        .pca-stat-card:hover{ box-shadow:0 10px 28px rgba(15,26,46,0.07); transform:translateY(-2px); }
        .pca-stat-label{ font-size:11px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:var(--text-faint); }
        .pca-stat-row{ display:flex; align-items:flex-end; justify-content:space-between; margin-top:12px; gap:10px; }
        .pca-stat-value{ font-family:var(--font-display); font-size:26px; font-weight:700; letter-spacing:-0.01em; }
        .pca-stat-icon{ width:42px; height:42px; border-radius:12px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .pca-stat-icon svg{ width:19px; height:19px; }
        .pca-ic-blue{ background:var(--primary-light); } .pca-ic-blue svg{ stroke:var(--primary); }
        .pca-ic-green{ background:var(--success-light); } .pca-ic-green svg{ stroke:var(--success); }
        .pca-ic-amber{ background:var(--warning-light); } .pca-ic-amber svg{ stroke:var(--warning); }
        .pca-ic-purple{ background:#EBE6FA; } .pca-ic-purple svg{ stroke:#6E56CF; }
        .pca-stat-foot{ font-size:11.5px; color:var(--text-faint); margin-top:10px; font-weight:600; }

        /* ---------- Two column ---------- */
        .pca-grid-2{ display:grid; grid-template-columns:1fr 1.3fr; gap:16px; margin-bottom:20px; }
        .pca-panel{ background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:24px 26px; min-width:0; }
        .pca-panel-head{ display:flex; align-items:center; gap:9px; margin-bottom:18px; }
        .pca-panel-head svg{ width:17px; height:17px; stroke:var(--primary); flex-shrink:0; }
        .pca-panel-title{ font-family:var(--font-display); font-size:16px; font-weight:700; }

        .pca-fin-row{ display:flex; align-items:center; justify-content:space-between; padding:13px 4px; border-top:1px solid var(--border); font-size:14px; gap:10px; }
        .pca-fin-row.pca-first{ border-top:none; }
        .pca-fin-label{ color:var(--text-muted); font-weight:600; }
        .pca-fin-amt{ font-family:var(--font-display); font-weight:700; white-space:nowrap; }
        .pca-fin-total{
          display:flex; align-items:center; justify-content:space-between;
          background:var(--success-light); border-radius:12px; padding:14px 16px; margin-top:10px; gap:10px;
        }
        .pca-fin-total .pca-fin-label{ color:var(--success); font-weight:700; }
        .pca-fin-total .pca-fin-amt{ color:var(--success); font-size:16px; }

        .pca-mini-row{ display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:12px; margin-bottom:20px; }
        .pca-mini-block{ background:var(--surface-alt); border:1px solid var(--border); border-radius:14px; padding:18px; text-align:center; min-width:0; }
        .pca-mini-icon{ width:38px; height:38px; border-radius:11px; margin:0 auto 10px; display:flex; align-items:center; justify-content:center; }
        .pca-mini-icon svg{ width:18px; height:18px; }
        .pca-mini-num{ font-family:var(--font-display); font-size:22px; font-weight:700; }
        .pca-mini-label{ font-size:10.5px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:var(--text-faint); margin-top:3px; }

        .pca-matrix-label{ font-size:11px; font-weight:700; letter-spacing:0.07em; text-transform:uppercase; color:var(--text-faint); margin-bottom:10px; }
        .pca-matrix{ display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:10px; }
        .pca-matrix-chip{ display:flex; align-items:center; gap:10px; border-radius:12px; padding:13px 14px; min-width:0; }
        .pca-m-pending{ background:var(--warning-light); }
        .pca-m-delivered{ background:var(--success-light); }
        .pca-m-cancelled{ background:var(--danger-light); }
        .pca-matrix-dot{ width:9px; height:9px; border-radius:50%; flex-shrink:0; }
        .pca-m-pending .pca-matrix-dot{ background:var(--warning); }
        .pca-m-delivered .pca-matrix-dot{ background:var(--success); }
        .pca-m-cancelled .pca-matrix-dot{ background:var(--danger); }
        .pca-matrix-text{ flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; }
        .pca-matrix-name{ font-size:12px; font-weight:700; color:var(--text); white-space:nowrap; }
        .pca-matrix-num{ font-family:var(--font-display); font-size:17px; font-weight:700; flex-shrink:0; white-space:nowrap; }
        .pca-m-pending .pca-matrix-num{ color:#9C6510; }
        .pca-m-delivered .pca-matrix-num{ color:var(--success); }
        .pca-m-cancelled .pca-matrix-num{ color:var(--danger); }

        .pca-updated-note{
          display:flex; align-items:center; gap:8px; justify-content:center;
          font-size:12px; color:var(--text-faint); font-weight:600; margin-top:6px; padding-top:6px;
        }
        .pca-updated-note svg{ width:13px; height:13px; stroke:var(--text-faint); flex-shrink:0; }

        @media (max-width:1150px){
          .pca-stats{ grid-template-columns:repeat(2,minmax(0,1fr)); }
          .pca-grid-2{ grid-template-columns:1fr; }
        }
        @media (max-width:820px){
          .pca-mini-row, .pca-matrix{ grid-template-columns:1fr; }
        }
      `}</style>

      <main className="pca-main">

        <section className="pca-page-head pca-section pca-d1">
          <div className="pca-page-title">Dashboard Overview</div>
          <div className="pca-page-sub">Real-time metrics and system performance.</div>
        </section>

        <section className="pca-stats pca-section pca-d1">
          <div className="pca-stat-card">
            <div className="pca-stat-label">Total Revenue</div>
            <div className="pca-stat-row">
              <div className="pca-stat-value">${stats.totalRevenue?.toFixed(2) || '0.00'}</div>
              <div className="pca-stat-icon pca-ic-blue">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
            </div>
            <div className="pca-stat-foot">All-time earnings</div>
          </div>

          <div className="pca-stat-card">
            <div className="pca-stat-label">Today's Revenue</div>
            <div className="pca-stat-row">
              <div className="pca-stat-value">${stats.todayRevenue?.toFixed(2) || '0.00'}</div>
              <div className="pca-stat-icon pca-ic-green">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 17l6-6 4 4 8-8"/><path d="M17 7h4v4"/></svg>
              </div>
            </div>
            <div className="pca-stat-foot">No sales recorded yet today</div>
          </div>

          <div className="pca-stat-card">
            <div className="pca-stat-label">Total Orders</div>
            <div className="pca-stat-row">
              <div className="pca-stat-value">{(stats.pendingOrders || 0) + (stats.deliveredOrders || 0) + (stats.cancelledOrders || 0)}</div>
              <div className="pca-stat-icon pca-ic-purple">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.5 3h2l2.6 12.6a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 2-1.6L21.5 8H6"/></svg>
              </div>
            </div>
            <div className="pca-stat-foot">Across all customers</div>
          </div>

          <div className="pca-stat-card">
            <div className="pca-stat-label">Total Users</div>
            <div className="pca-stat-row">
              <div className="pca-stat-value">{stats.totalUsers || 0}</div>
              <div className="pca-stat-icon pca-ic-amber">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
            </div>
            <div className="pca-stat-foot">Registered accounts</div>
          </div>
        </section>

        <section className="pca-grid-2 pca-section pca-d2">
          <div className="pca-panel">
            <div className="pca-panel-head">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 17l6-6 4 4 8-8"/><path d="M17 7h4v4"/></svg>
              <div className="pca-panel-title">Financial Summary</div>
            </div>
            <div className="pca-fin-row pca-first"><span className="pca-fin-label">Today</span><span className="pca-fin-amt">${stats.todayRevenue?.toFixed(2) || '0.00'}</span></div>
            <div className="pca-fin-row"><span className="pca-fin-label">This Month</span><span className="pca-fin-amt">${(stats.todayRevenue || 0).toFixed(2)}</span></div>
            <div className="pca-fin-row"><span className="pca-fin-label">This Year</span><span className="pca-fin-amt">${(stats.totalRevenue || 0).toFixed(2)}</span></div>
            <div className="pca-fin-total"><span className="pca-fin-label">Total All-Time</span><span className="pca-fin-amt">${stats.totalRevenue?.toFixed(2) || '0.00'}</span></div>
          </div>

          <div className="pca-panel">
            <div className="pca-panel-head">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8l-9-5-9 5 9 5 9-5Z"/><path d="M3 8v8l9 5 9-5V8"/></svg>
              <div className="pca-panel-title">Inventory &amp; Fulfillment</div>
            </div>

            <div className="pca-mini-row">
              <div className="pca-mini-block">
                <div className="pca-mini-icon pca-ic-blue"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8l-9-5-9 5 9 5 9-5Z"/><path d="M3 8v8l9 5 9-5V8"/></svg></div>
                <div className="pca-mini-num">{stats.totalProducts || 0}</div>
                <div className="pca-mini-label">Products</div>
              </div>
              <div className="pca-mini-block">
                <div className="pca-mini-icon pca-ic-purple"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div>
                <div className="pca-mini-num">{stats.totalUsers || 0}</div>
                <div className="pca-mini-label">Users</div>
              </div>
              <div className="pca-mini-block">
                <div className="pca-mini-icon pca-ic-green"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M3 12h18M3 18h11"/></svg></div>
                <div className="pca-mini-num">{stats.totalCategories || 0}</div>
                <div className="pca-mini-label">Categories</div>
              </div>
            </div>

            <div className="pca-matrix-label">Order Status Matrix</div>
            <div className="pca-matrix">
              <div className="pca-matrix-chip pca-m-pending">
                <span className="pca-matrix-dot"></span>
                <span className="pca-matrix-text"><span className="pca-matrix-name">Pending</span></span>
                <span className="pca-matrix-num">{stats.pendingOrders || 0}</span>
              </div>
              <div className="pca-matrix-chip pca-m-delivered">
                <span className="pca-matrix-dot"></span>
                <span className="pca-matrix-text"><span className="pca-matrix-name">Delivered</span></span>
                <span className="pca-matrix-num">{stats.deliveredOrders || 0}</span>
              </div>
              <div className="pca-matrix-chip pca-m-cancelled">
                <span className="pca-matrix-dot"></span>
                <span className="pca-matrix-text"><span className="pca-matrix-name">Cancelled</span></span>
                <span className="pca-matrix-num">{stats.cancelledOrders || 0}</span>
              </div>
            </div>

            <div className="pca-updated-note">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
              Last updated just now
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
