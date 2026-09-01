import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function ProductCard({ product }) {
  const { items, addItem: addToCart, updateQuantity } = useCart();
  const { items: wishItems, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlist();
  
  const cartItem = items.find((i) => i.id === product.id);
  const isWishlisted = wishItems?.some((i) => i.id === product.id);
  
  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };
  
  // Choose background color based on product ID
  const ptClass = `pt-${(Math.abs(product.id || 0) % 4) + 1}`; // pt-1 to pt-4

  return (
    <div className="prod-card">
      <Link to={`/product/${product.id}`} className={`prod-thumb ${ptClass}`}>
        {product.stock > 0 ? (
          <span className="stock-tag">In stock</span>
        ) : (
          <span className="stock-tag out-stock">Out of stock</span>
        )}
        
        <button 
          onClick={handleWishlistToggle}
          className={`prod-wish ${isWishlisted ? 'active' : ''}`}
        >
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/>
          </svg>
        </button>
        
        <img
          src={product.image?.includes('ik.imagekit.io') 
            ? (product.image.includes('?') ? `${product.image}&tr=w-300,h-300,q-80` : `${product.image}?tr=w-300,h-300,q-80`)
            : product.image}
          alt={product.name}
          loading="lazy"
          style={{ width: '70%', height: '70%', objectFit: 'contain', mixBlendMode: 'multiply' }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.style.mixBlendMode = 'normal';
            e.target.src = getCategoryFallbackImage(product.category?.name || product.category);
          }}
        />
      </Link>

      <div className="prod-body">
        <div className="prod-cat">{product.category?.name || product.category || 'General'}</div>
        
        <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
          <div className="prod-name">{product.name}</div>
        </Link>

        <div className="prod-foot">
          <span className="prod-price">₹{product.price}</span>
          
          {cartItem ? (
            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface-alt)', borderRadius: '999px', border: '1px solid var(--border)', padding: '2px', height: '36px' }}>
              <button
                onClick={() => updateQuantity(product.id, cartItem.quantity - 1)}
                style={{ width: '30px', height: '30px', borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M5 12h14"/></svg>
              </button>
              <span style={{ fontSize: '13px', fontWeight: '800', width: '20px', textAlign: 'center' }}>{cartItem.quantity}</span>
              <button
                onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}
                disabled={cartItem.quantity >= product.stock}
                style={{ width: '30px', height: '30px', borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: cartItem.quantity >= product.stock ? 0.5 : 1 }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M12 5v14M5 12h14"/></svg>
              </button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(product)}
              disabled={product.stock === 0}
              className="prod-add"
              style={{ opacity: product.stock === 0 ? 0.5 : 1 }}
            >
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14"/>
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
