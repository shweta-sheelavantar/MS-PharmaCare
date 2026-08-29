import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { ecommerceApi } from '../api/ecommerceApi';
import CategoryCard from '../components/CategoryCard';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await ecommerceApi.getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="animate-spin" style={{color: 'var(--primary)'}} size={32} />
      </div>
    );
  }

  return (
    <>
      <style>{`
        /* ---------- Page head ---------- */
        .pch-page-head{padding:56px 0 44px; text-align:center; position:relative; overflow:hidden;}
        .pch-blob{position:absolute; border-radius:999px; filter:blur(50px); opacity:0.5; pointer-events:none;}
        .pch-blob-a{width:300px; height:160px; background:var(--primary-light); top:-30px; left:60px;}
        .pch-blob-b{width:220px; height:120px; background:var(--secondary-light); top:20px; right:80px; transform:rotate(-12deg);}
        .pch-breadcrumb{font-size:12px; font-weight:700; letter-spacing:0.07em; text-transform:uppercase; color:var(--primary); position:relative;}
        .pch-page-title{font-family:var(--font-display); font-size:38px; font-weight:600; letter-spacing:-0.01em; margin-top:10px; position:relative;}
        .pch-page-sub{font-size:14.5px; color:var(--text-muted); line-height:1.7; max-width:560px; margin:14px auto 0; position:relative;}
       
        /* ---------- Category grid ---------- */
        .pch-cat-section{padding-bottom:70px;}
        .pch-cat-grid{display:grid; grid-template-columns:repeat(3,1fr); gap:22px;}
       
        @media (max-width:1080px){
          .pch-cat-grid{grid-template-columns:repeat(2,1fr);}
        }
        @media (max-width:680px){
          .pch-cat-grid{grid-template-columns:1fr;}
        }
      `}</style>
      <section className="pch-page-head pch-section pch-r1">
        <div className="pch-blob pch-blob-a"></div>
        <div className="pch-blob pch-blob-b"></div>
        <div className="pch-wrap">
          <div className="pch-breadcrumb">Browse</div>
          <h1 className="pch-page-title">Shop by Category</h1>
          <p className="pch-page-sub">
            Explore our comprehensive range of healthcare products. From daily medicines to personal care, we have everything you need for a healthy life.
          </p>
        </div>
      </section>

      <section className="pch-cat-section pch-section pch-r2">
        <div className="pch-wrap">
          <div className="pch-cat-grid">
            {categories.map((cat, i) => (
              <CategoryCard key={cat.id} category={cat} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
