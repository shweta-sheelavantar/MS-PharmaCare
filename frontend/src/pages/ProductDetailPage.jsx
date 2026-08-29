import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import { ecommerceApi } from '../api/ecommerceApi';
import { useAuth } from '../context/AuthContext';
import { getCategoryFallbackImage } from '../utils/imageUtils';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addItem: addToCart } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { isAuthenticated, token } = useAuth();
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const data = await ecommerceApi.getProductById(id);
        setProduct(data);
        setQuantity(1);
        
        try {
          const productReviews = await ecommerceApi.getProductReviews(id);
          setReviews(productReviews);
        } catch(e) {
          console.error("Failed to fetch reviews", e);
        }

        if (data.category?.id) {
          const similar = await ecommerceApi.getProductsByCategory(data.category.id);
          setSimilarProducts(similar.filter(p => p.id !== data.id).slice(0, 3)); // show 3 to match prod-grid
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="wrap page" style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--text-muted)', fontSize: '18px' }}>Loading product details...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="wrap page" style={{ textAlign: 'center', padding: '80px 0' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '18px' }}>Product not found</p>
        <Link to="/products" style={{ color: 'var(--primary)', fontWeight: 'bold', marginTop: '16px', display: 'inline-block' }}>← Back to Products</Link>
      </div>
    );
  }

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity(q => q + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    try {
      setSubmittingReview(true);
      await ecommerceApi.addReview(id, { rating: reviewRating, comment: reviewText }, token);
      setReviewText('');
      setReviewRating(5);
      
      const updatedProduct = await ecommerceApi.getProductById(id);
      setProduct(updatedProduct);
      const productReviews = await ecommerceApi.getProductReviews(id);
      setReviews(productReviews);
    } catch(error) {
      console.error("Failed to submit review", error);
    } finally {
      setSubmittingReview(false);
    }
  };

  const inWishlist = isInWishlist(product.id);
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <div className="wrap">
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        {product.category?.name ? (
          <>
            <Link to={`/products?category=${product.category.slug}`}>{product.category.name}</Link>
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </>
        ) : (
          <>
            <Link to="/products">Products</Link>
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </>
        )}
        <b>{product.name}</b>
      </div>

      <section className="product-layout">
        <div className="image-card">
          {product.prescription && <span className="rx-badge">Rx Required</span>}
          <button 
            className={`image-wish ${inWishlist ? 'active' : ''}`}
            onClick={() => toggleItem(product)}
          >
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/>
            </svg>
          </button>
          <div className="image-frame">
              <img 
                src={product.image} 
                alt={product.name} 
                style={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain', mixBlendMode: 'multiply' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.mixBlendMode = 'normal';
                  e.target.src = getCategoryFallbackImage(product.category?.name || product.category);
                }} 
              />
          </div>
        </div>

        <div>
          <span className="cat-pill">{typeof product.category === 'object' ? (product.category?.name || 'General') : (product.category || 'General')}</span>
          <h1 className="product-title">{product.name}</h1>
          <div className="rating-row">
            {product.reviewCount > 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--accent-light)', padding: '2px 8px', borderRadius: '999px' }}>
                  <Star size={12} className="text-[var(--accent)] fill-[var(--accent)]" />
                  <span style={{ color: 'var(--text)', fontWeight: 'bold' }}>{product.averageRating}</span>
                </div>
                <span>{product.reviewCount} reviews</span>
              </div>
            ) : (
              'No reviews yet'
            )}
          </div>

          <div className="price-row">
            <div className="price-now">₹{product.price}</div>
            {product.originalPrice && (
              <>
                <div className="price-was">₹{product.originalPrice}</div>
                <div className="price-save">Save {discount}%</div>
              </>
            )}
          </div>

          <div className="stock-row">
            <div className={`stock-badge ${product.stock === 0 ? 'out-of-stock' : ''}`}>
              <span className={`stock-dot ${product.stock === 0 ? 'out-of-stock' : ''}`}></span>
              {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
            </div>
            {product.prescription && (
              <div className="rx-note">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/></svg>
                Prescription required at checkout
              </div>
            )}
          </div>

          <div className="desc-card">
            <div className="desc-title">Product Description</div>
            <div className="desc-text">{product.description || 'No description available for this product.'}</div>
          </div>

          <div className="buy-panel">
            <div className="qty-row">
              <span className="qty-label">Quantity</span>
              <div className="qty-stepper">
                <button className="qty-btn" onClick={handleDecrement} disabled={quantity <= 1}>−</button>
                <input type="number" className="qty-val" value={quantity} readOnly />
                <button className="qty-btn" onClick={handleIncrement} disabled={quantity >= product.stock}>+</button>
              </div>
            </div>

            <div className="action-row">
              <button 
                className="btn-addcart" 
                onClick={() => addToCart(product, quantity)}
                disabled={product.stock === 0}
              >
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.5 3h2l2.6 12.6a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 2-1.6L21.5 8H6"/></svg>
                Add to Cart
              </button>
              <button 
                className="btn-buynow"
                disabled={product.stock === 0}
                onClick={() => {
                  navigate('/checkout', {
                    state: {
                      items: [{ ...product, quantity: quantity }],
                      totalAmount: product.price * quantity,
                      isBuyNow: true
                    }
                  });
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 3 14h7l-1 8 11-14h-8l1-6Z"/></svg>
                Buy Now
              </button>
              <button 
                className={`btn-wish-lg ${inWishlist ? 'active' : ''}`}
                onClick={() => toggleItem(product)}
              >
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg>
              </button>
            </div>
          </div>

          <div className="trust-strip">
            <div className="trust-tile">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z"/></svg>
              <span>Genuine Products</span>
            </div>
            <div className="trust-tile">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8Z"/><circle cx="5.5" cy="18.5" r="1.5"/><circle cx="18.5" cy="18.5" r="1.5"/></svg>
              <span>Fast Delivery</span>
            </div>
            <div className="trust-tile">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 2.6-6.3"/><path d="M3 4v5h5"/></svg>
              <span>Easy Returns</span>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '32px', marginBottom: '60px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: '600', marginBottom: '24px', color: 'var(--primary-dark)' }}>Customer Reviews</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
          {/* Review Form */}
          <div>
            <div style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '24px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '16px' }}>Write a review</h3>
              {isAuthenticated ? (
                <form onSubmit={handleReviewSubmit}>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px' }}>Rating</label>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                        >
                          <Star
                            size={28}
                            className={star <= reviewRating ? 'text-[var(--accent)] fill-[var(--accent)]' : 'text-gray-300'}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px' }}>Review (Optional)</label>
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      rows={4}
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '14px', outline: 'none', color: 'var(--text)', fontFamily: 'var(--font-body)' }}
                      placeholder="What did you like or dislike?"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    style={{ width: '100%', background: 'var(--primary)', color: '#fff', border: 'none', padding: '12px', borderRadius: '999px', fontWeight: '700', cursor: submittingReview ? 'not-allowed' : 'pointer', opacity: submittingReview ? 0.7 : 1 }}
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              ) : (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginBottom: '16px' }}>You need to be logged in to write a review.</p>
                  <Link to="/login" style={{ display: 'inline-block', background: 'var(--primary)', color: '#fff', padding: '10px 20px', borderRadius: '999px', fontWeight: '700', fontSize: '13.5px' }}>
                    Login to Review
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Review List */}
          <div>
            {reviews.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {reviews.map((review) => (
                  <div key={review.id} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '16px' }}>
                        {review.reviewerName ? review.reviewerName.charAt(0).toUpperCase() : 'A'}
                      </div>
                      <div>
                        <h4 style={{ fontWeight: '700', fontSize: '14.5px' }}>{review.reviewerName}</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ display: 'flex', gap: '2px' }}>
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={12}
                                className={i < review.rating ? 'text-[var(--accent)] fill-[var(--accent)]' : 'text-gray-200'}
                              />
                            ))}
                          </div>
                          <span style={{ fontSize: '11.5px', color: 'var(--text-faint)', fontWeight: '600' }}>
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    {review.comment && (
                      <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6', paddingLeft: '52px' }}>{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0', background: 'var(--surface-alt)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border)' }}>
                <Star size={32} style={{ color: 'var(--border)', margin: '0 auto 12px' }} />
                <p style={{ fontWeight: '600', fontSize: '15px' }}>No reviews yet.</p>
                <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginTop: '4px' }}>Be the first to review this product!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <section style={{ paddingBottom: '60px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: '600', marginBottom: '24px', color: 'var(--primary-dark)' }}>Similar Products</h2>
          <div className="prod-grid">
            {similarProducts.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
