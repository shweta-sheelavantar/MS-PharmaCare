import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { ecommerceApi } from '../api/ecommerceApi';

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategories, setSelectedCategories] = useState(
    searchParams.get('category') ? [searchParams.get('category')] : []
  );
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [sortBy, setSortBy] = useState('popularity');
  const [perPage, setPerPage] = useState(20);
  const [viewMode, setViewMode] = useState('grid'); 
  const [maxPrice, setMaxPrice] = useState(5000);
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Accordion states
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isBrandOpen, setIsBrandOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(true);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategories, selectedBrands, sortBy, perPage, maxPrice]);

  useEffect(() => {
    if (searchParams.has('search')) setSearch(searchParams.get('search') || '');
    if (searchParams.has('category')) {
      const catParam = searchParams.get('category');
      if (catParam) setSelectedCategories([catParam]);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          ecommerceApi.getAllProducts(),
          ecommerceApi.getAllCategories()
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
        
        const maxP = Math.max(...productsData.map(p => p.price), 5000);
        setMaxPrice(Math.ceil(maxP / 100) * 100);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const uniqueBrands = useMemo(() => {
    const brands = products.map(p => p.manufacturer).filter(Boolean);
    return [...new Set(brands)].sort();
  }, [products]);

  const toggleCategory = (slug) => {
    setSelectedCategories(prev => prev.includes(slug) ? [] : [slug]);
  };

  const toggleBrand = (brand) => {
    setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]);
  };

  const clearAllFilters = () => {
    setSearch('');
    setSelectedCategories([]);
    setSelectedBrands([]);
    setMaxPrice(Math.max(...products.map(p => p.price), 5000));
  };

  const filtered = useMemo(() => {
    let result = [...products];
    if (search) {
      result = result.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    }
    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category?.slug || p.category));
    }
    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.manufacturer));
    }
    
    // Price filter
    result = result.filter((p) => p.price <= maxPrice);

    if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else if (sortBy === 'popularity') result.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
    else if (sortBy === 'newest') result.sort((a, b) => b.id - a.id);
    else result.sort((a, b) => a.name.localeCompare(b.name));
    
    return result;
  }, [search, selectedCategories, selectedBrands, sortBy, maxPrice, products]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * perPage;
    return filtered.slice(startIndex, startIndex + perPage);
  }, [filtered, currentPage, perPage]);

  const totalPages = Math.ceil(filtered.length / perPage);

  const getCategoryCount = (slug) => products.filter(p => (p.category?.slug || p.category) === slug).length;
  const getBrandCount = (brand) => products.filter(p => p.manufacturer === brand).length;

  return (
    <main className="wrap page">
      <div className="breadcrumb">
        <Link to="/" style={{ textDecoration: 'none' }}>Home</Link> / <b>All Products</b>
      </div>
      <h1 className="page-title">Medicines &amp; Wellness Products</h1>

      <div className="layout">
        <div className="mobile-filters-toggle" onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}>
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px' }}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
          {isMobileFiltersOpen ? 'Hide Filters' : 'Show Filters'}
        </div>
        <aside className={`filters ${isMobileFiltersOpen ? 'open' : ''}`}>
          <div className="filters-head">
            <div className="filters-title">Filters</div>
            <button className="clear-all" onClick={clearAllFilters}>Clear All</button>
          </div>

          <div className="filter-group">
            <div className="filter-group-head" onClick={() => setIsCategoryOpen(!isCategoryOpen)}>
              <div className="filter-group-title">Categories</div>
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isCategoryOpen ? 'rotate(180deg)' : 'none' }}>
                <path d="m18 15-6-6-6 6"/>
              </svg>
            </div>
            {isCategoryOpen && categories.map((cat) => {
              const isChecked = selectedCategories.includes(cat.slug);
              return (
                <label key={cat.slug} className={`cat-option ${isChecked ? 'checked' : ''}`}>
                  <input 
                    type="checkbox" 
                    checked={isChecked}
                    onChange={() => toggleCategory(cat.slug)}
                    style={{ display: 'none' }}
                  />
                  <span className="cat-check">
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5"/>
                    </svg>
                  </span>
                  <span className="cat-info">
                    <span className="cat-name">{cat.name}</span>
                    <span className="cat-count">{getCategoryCount(cat.slug)}</span>
                  </span>
                </label>
              );
            })}
          </div>

          <div className="filter-group">
            <div className="filter-group-head" onClick={() => setIsPriceOpen(!isPriceOpen)}>
              <div className="filter-group-title">Price Range</div>
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isPriceOpen ? 'rotate(180deg)' : 'none' }}>
                <path d="m18 15-6-6-6 6"/>
              </svg>
            </div>
            {isPriceOpen && (
              <div className="price-range">
                <input 
                  type="range" 
                  min="0" 
                  max={Math.max(...products.map(p => p.price), 5000)} 
                  step="50"
                  value={maxPrice} 
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--primary)', marginBottom: '8px' }}
                />
                <div className="price-labels">
                  <span>₹0</span>
                  <span>Up to ₹{maxPrice}</span>
                </div>
              </div>
            )}
          </div>

          <div className="filter-group">
            <div className="filter-group-head" onClick={() => setIsBrandOpen(!isBrandOpen)}>
              <div className="filter-group-title">Brands</div>
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isBrandOpen ? 'rotate(180deg)' : 'none' }}>
                <path d="m18 15-6-6-6 6"/>
              </svg>
            </div>
            {isBrandOpen && uniqueBrands.map((brand) => {
              const isChecked = selectedBrands.includes(brand);
              return (
                <label key={brand} className={`cat-option ${isChecked ? 'checked' : ''}`}>
                  <input 
                    type="checkbox" 
                    checked={isChecked}
                    onChange={() => toggleBrand(brand)}
                    style={{ display: 'none' }}
                  />
                  <span className="cat-check">
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5"/>
                    </svg>
                  </span>
                  <span className="cat-info">
                    <span className="cat-name">{brand}</span>
                    <span className="cat-count">{getBrandCount(brand)}</span>
                  </span>
                </label>
              );
            })}
          </div>
        </aside>

        <div>
          <div className="toolbar">
            <div className="results-count">Showing <b>{paginatedProducts.length}</b> products</div>
            <div className="toolbar-right">
              <div className="sort-select">
                Sort by:
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="popularity">Popularity</option>
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </div>
              <div className="view-toggle">
                <div 
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`} 
                  onClick={() => setViewMode('grid')}
                >
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>
                  </svg>
                </div>
                <div 
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`} 
                  onClick={() => setViewMode('list')}
                >
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18M3 12h18M3 18h18"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className={`prod-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', gridColumn: '1 / -1' }}>Loading products...</div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', gridColumn: '1 / -1' }}>No products found matching your filters.</div>
            ) : (
              paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <div 
                className="page-btn" 
                style={{ opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
              </div>
              
              {[...Array(totalPages)].map((_, i) => {
                if (totalPages > 5 && i > 1 && i < totalPages - 2 && Math.abs(i + 1 - currentPage) > 1) {
                    if (i === 2 || i === totalPages - 3) return <div key={i} className="page-btn" style={{ border: 'none', background: 'none' }}>...</div>;
                    return null;
                }
                return (
                  <div
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                  >
                    {i + 1}
                  </div>
                )
              })}
              
              <div 
                className="page-btn" 
                style={{ opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
