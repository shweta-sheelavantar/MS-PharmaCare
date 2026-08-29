  import { createContext, useCallback, useContext, useEffect, useMemo, useState, useRef } from 'react';
import { useAuth } from './AuthContext';
import { ecommerceApi } from '../api/ecommerceApi';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated, token, user } = useAuth();
  const prevAuth = useRef(isAuthenticated);
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('mspharmcare_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Fetch cart items from backend when authenticated
  useEffect(() => {
    if (isAuthenticated && token && user?.role === 'CUSTOMER') {
      const syncAndFetchCart = async () => {
        try {
          // 1. Sync guest cart from localStorage to backend if it exists
          const localItemsStr = localStorage.getItem('mspharmcare_cart');
          if (localItemsStr) {
            const localItems = JSON.parse(localItemsStr);
            if (localItems && localItems.length > 0) {
              for (const item of localItems) {
                try {
                  await ecommerceApi.addToCart(item.id, item.quantity, token);
                } catch (e) {
                  console.error("Failed to sync local cart item:", item.id, e);
                }
              }
              // Clear local cart after syncing
              localStorage.removeItem('mspharmcare_cart');
            }
          }

          // 2. Fetch merged cart from backend
          const data = await ecommerceApi.getCartItems(token);
          if (data && data.data && data.data.cart && data.data.cart.products) {
             const backendItems = data.data.cart.products.map(i => ({
               id: i.product_id || i.productId, 
               name: i.name,
               price: i.price_per_unit || i.pricePerUnit,
               quantity: i.quantity,
               image: i.image_url || i.imageUrl,
               description: i.description,
               stock: i.stock,
               category: i.category
             }));
             setItems(backendItems);
          }
        } catch (error) {
          console.error("Failed to fetch cart:", error);
        }
      };
      syncAndFetchCart();
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    if (prevAuth.current === true && isAuthenticated === false) {
      // User just logged out, clear memory items to prevent leaking
      setItems([]);
    } else if (!isAuthenticated) {
      // It's a genuine guest state, safe to sync to localStorage
      localStorage.setItem('mspharmcare_cart', JSON.stringify(items));
    }
    prevAuth.current = isAuthenticated;
  }, [items, isAuthenticated]);

  const addItem = useCallback(async (product, qty = 1) => {
    // 1. Optimistic update
    setItems((prev) => {
      const exists = prev.find((i) => i.id === product.id);
      if (exists) {
        if (exists.quantity + qty > product.stock) {
          // If exceeding stock locally, don't update
          return prev;
        }
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [...prev, { ...product, quantity: qty }];
    });

    if (isAuthenticated && token && user?.role === 'CUSTOMER') {
      try {
        await ecommerceApi.addToCart(product.id, qty, token);
      } catch (error) {
        console.error("Failed to add item to cart backend:", error);
        // Optional: Revert optimistic update here on failure
      }
    }
  }, [isAuthenticated, token, user]);

  const removeItem = useCallback(async (productId) => {
    setItems((prev) => prev.filter((i) => i.id !== productId));
    
    if (isAuthenticated && token && user?.role === 'CUSTOMER') {
      try {
        await ecommerceApi.removeFromCart(productId, token);
      } catch (error) {
        console.error("Failed to remove item from cart backend:", error);
      }
    }
  }, [isAuthenticated, token, user]);

  const updateQuantity = useCallback(async (productId, quantity) => {
    const currentItem = items.find(i => i.id === productId);
    if (!currentItem) return;

    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.id !== productId));
      if (isAuthenticated && token) {
        try {
          await ecommerceApi.removeFromCart(productId, token);
        } catch (error) {
          console.error("Failed to remove item:", error);
        }
      }
    } else {
      const isIncrement = quantity > currentItem.quantity;
      setItems((prev) =>
        prev.map((i) => (i.id === productId ? { ...i, quantity } : i))
      );
      
      if (isAuthenticated && token) {
        try {
          const operation = isIncrement ? 'INCREMENT' : 'DECREMENT';
          await ecommerceApi.updateCartQuantity(productId, operation, token);
        } catch (error) {
          console.error("Failed to update cart quantity backend:", error);
        }
      }
    }
  }, [items, isAuthenticated, token, user]);

  const clearCart = useCallback(async () => {
    setItems([]);
    if (isAuthenticated && token && user?.role === 'CUSTOMER') {
      try {
        await ecommerceApi.clearCart(token);
      } catch (error) {
        console.error("Failed to clear cart backend:", error);
      }
    }
  }, [isAuthenticated, token, user]);

  const totalItems = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);
  const totalPrice = useMemo(() => items.reduce((sum, i) => sum + i.price * i.quantity, 0), [items]);

  const value = useMemo(
    () => ({ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }),
    [items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
}
