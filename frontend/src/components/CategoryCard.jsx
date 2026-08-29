import { Link } from 'react-router-dom';

export default function CategoryCard({ category, index = 0, variant = 'photo' }) {
  // Alternate between pch-cp-1, pch-cp-2, pch-cp-3, pch-cp-4
  const cpClass = `pch-cp-${(index % 4) + 1}`;

  const renderIcon = () => {
    switch(index % 4) {
      case 0:
        return <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3c-3 3-3 7 0 10s3 7 0 10"/><path d="M12 3c3 3 3 7 0 10s-3 7 0 10"/></svg>;
      case 1:
        return <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a3 3 0 1 0 6 0a3 3 0 1 0-6 0"/><path d="M5 21c0-4 3-6 7-6s7 2 7 6"/></svg>;
      case 2:
        return <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9 12h6M12 9v6"/></svg>;
      case 3:
      default:
        return <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v3M12 18v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M3 12h3M18 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></svg>;
    }
  };

  return (
    <Link to={`/products?category=${category.slug || category.id}`} className="pch-cat-card">
      <style>{`
        /* Scoped styles for CategoryCard if needed, but we can put them here */
        .pch-cat-card{background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); overflow:hidden; text-decoration:none; color:var(--text); transition:box-shadow .2s ease, transform .2s ease; display:flex; flex-direction:column;}
        .pch-cat-card:hover{box-shadow:var(--shadow-lift); transform:translateY(-4px);}
        .pch-cat-photo{height:190px; display:flex; align-items:center; justify-content:center; position:relative;}
        .pch-cat-photo svg{width:46px; height:46px;}
        .pch-cp-1{background:var(--primary-light);} .pch-cp-1 svg{stroke:var(--primary);}
        .pch-cp-2{background:var(--secondary-light);} .pch-cp-2 svg{stroke:var(--secondary);}
        .pch-cp-3{background:var(--accent-light);} .pch-cp-3 svg{stroke:#B57A2F;}
        .pch-cp-4{background:var(--danger-light);} .pch-cp-4 svg{stroke:var(--danger);}
        .pch-cat-count-tag{position:absolute; top:14px; right:14px; background:rgba(255,255,255,0.92); font-size:11px; font-weight:800; padding:5px 11px; border-radius:999px; color:var(--text);}
        .pch-cat-body{padding:20px; display:flex; align-items:center; justify-content:space-between; flex:1;}
        .pch-cat-name{font-family:var(--font-display); font-size:18px; font-weight:600;}
        .pch-cat-arrow{width:32px; height:32px; border-radius:50%; background:var(--primary-light); display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:background .18s ease, transform .18s ease;}
        .pch-cat-arrow svg{width:14px; height:14px; stroke:var(--primary);}
        .pch-cat-card:hover .pch-cat-arrow{background:var(--primary); transform:translateX(2px);}
        .pch-cat-card:hover .pch-cat-arrow svg{stroke:#fff;}
      `}</style>
      <div className={`pch-cat-photo ${cpClass}`} style={variant === 'photo' ? { overflow: 'hidden' } : {}}>
        {variant === 'photo' && (
          <img
            src={category.name && category.name.toLowerCase().includes('ayurved') ? '/ayurvedic.png' : (category.image || '/cat_medicines.png')}
            alt={category.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
            onError={(e) => {e.target.src = '/cat_medicines.png'}}
          />
        )}
        <span className="pch-cat-count-tag" style={variant === 'photo' ? { zIndex: 10 } : {}}>{category.productCount || Math.floor(Math.random() * 50) + 10} Products</span>
        {variant === 'svg' && renderIcon()}
      </div>
      <div className="pch-cat-body">
        <div className="pch-cat-name">{category.name}</div>
        <div className="pch-cat-arrow">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </div>
      </div>
    </Link>
  );
}
