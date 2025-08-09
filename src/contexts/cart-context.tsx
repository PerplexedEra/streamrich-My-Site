'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Icons } from '@/components/icons';
import { toast } from '@/components/ui/use-toast';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id' | 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage', error);
      }
    }
    setIsMounted(true);
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, isMounted]);

  const addItem = (item: Omit<CartItem, 'id' | 'quantity'>) => {
    setItems(prevItems => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(
        i => i.productId === item.productId
      );

      if (existingItemIndex > -1) {
        // Update quantity if item exists
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1,
        };
        toast({
          title: 'Cart updated',
          description: `${item.name} quantity updated in your cart.`,
        });
        return updatedItems;
      } else {
        // Add new item with unique ID
        const newItem = {
          ...item,
          id: `item-${Date.now()}`,
          quantity: 1,
        };
        toast({
          title: 'Added to cart',
          description: `${item.name} has been added to your cart.`,
        });
        return [...prevItems, newItem];
      }
    });
  };

  const removeItem = (id: string) => {
    setItems(prevItems => {
      const item = prevItems.find(item => item.id === id);
      const newItems = prevItems.filter(item => item.id !== id);
      
      if (item) {
        toast({
          title: 'Removed from cart',
          description: `${item.name} has been removed from your cart.`,
        });
      }
      
      return newItems;
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(id);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  // Calculate total items in cart
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  // Calculate total price
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
