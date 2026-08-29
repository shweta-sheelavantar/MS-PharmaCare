import { createContext, useCallback, useContext, useEffect, useMemo, useState, useRef } from 'react';
import { useAuth } from './AuthContext';
import { ecommerceApi } from '../api/ecommerceApi';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { isAuthenticated, token, user } = useAuth();
  const prevAuth = useRef(isAuthenticated);
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('mspharmcare_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Fetch wishlist items from backend when authenticated
  useEffect(() => {
    if (isAuthenticated && token && user?.role === 'CUSTOMER') {
      const syncAndFetchWishlist = async () => {
        try {
          // 1. Sync guest wishlist from localStorage to backend if it exists
          const localItemsStr = localStorage.getItem('mspharmcare_wishlist');
          if (localItemsStr) {
            const localItems = JSON.parse(localItemsStr);
            if (localItems && localItems.length > 0) {
              for (const item of localItems) {
                try {
                  await ecommerceApi.addToWishlist(item.id, token);
                } catch (e) {
                  console.error("Failed to sync local wishlist item:", item.id, e);
                }
              }
              // Clear local wishlist after syncing
              localStorage.removeItem('mspharmcare_wishlist');
            }
          }

          // 2. Fetch merged wishlist from backend
          const data = await ecommerceApi.getWishlistItems(token);
          if (data && data.items) {
             const backendItems = data.items.map(i => ({
               id: i.product_id || i.productId,
               name: i.name,
               price: i.price,
               image: i.image_url || i.imageUrl,
               description: i.description,
               stock: i.stock,
               category: i.category
             }));
             setItems(backendItems);
          }
        } catch (error) {
          console.error("Failed to fetch wishlist:", error);
        }
      };
      syncAndFetchWishlist();
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    if (prevAuth.current === true && isAuthenticated === false) {
      // User just logged out, clear memory items to prevent leaking
      setItems([]);
    } else if (!isAuthenticated) {
      // It's a genuine guest state, safe to sync to localStorage
      localStorage.setItem('mspharmcare_wishlist', JSON.stringify(items));
    }
    prevAuth.current = isAuthenticated;
  }, [items, isAuthenticated]);

  const addItem = useCallback(async (product) => {
    setItems((prev) => {
      if (prev.find((i) => i.id === product.id)) return prev;
      return [...prev, product];
    });

    if (isAuthenticated && token && user?.role === 'CUSTOMER') {
      try {
        await ecommerceApi.addToWishlist(product.id, token);
      } catch (error) {
        console.error("Failed to add item to wishlist backend:", error);
      }
    }
  }, [isAuthenticated, token, user]);

  const removeItem = useCallback(async (productId) => {
    setItems((prev) => prev.filter((i) => i.id !== productId));
    
    if (isAuthenticated && token && user?.role === 'CUSTOMER') {
      try {
        await ecommerceApi.removeFromWishlist(productId, token);
      } catch (error) {
        console.error("Failed to remove item from wishlist backend:", error);
      }
    }
  }, [isAuthenticated, token, user]);

  const toggleItem = useCallback(async (product) => {
    const exists = items.find((i) => i.id === product.id);
    if (exists) {
      await removeItem(product.id);
    } else {
      await addItem(product);
    }
  }, [items, addItem, removeItem]);

  const isInWishlist = useCallback((productId) => items.some((i) => i.id === productId), [items]);

  const clearWishlist = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({ items, addItem, removeItem, toggleItem, isInWishlist, clearWishlist, totalItems: items.length }),
    [items, addItem, removeItem, toggleItem, isInWishlist, clearWishlist]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used inside WishlistProvider');
  return context;
}
