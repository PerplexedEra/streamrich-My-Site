'use client';

import { Button, ButtonProps } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { useCart } from '@/contexts/cart-context';
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';

interface AddToCartButtonProps extends ButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    image?: string;
  };
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'secondary' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  showSuccess?: boolean;
}

export function AddToCartButton({
  product,
  variant = 'default',
  size = 'default',
  className = '',
  showSuccess = true,
  ...props
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = () => {
    try {
      setIsLoading(true);
      addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      });
      
      if (showSuccess) {
        toast({
          title: 'Added to cart',
          description: `${product.name} has been added to your cart.`,
          action: (
            <a 
              href="/cart" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1.5 rounded-md text-sm font-medium"
            >
              View Cart
            </a>
          ),
        });
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to add item to cart. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleAddToCart}
      variant={variant}
      size={size}
      className={className}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Icons.loader2 className="mr-2 h-4 w-4 animate-spin" />
          Adding...
        </>
      ) : (
        <>
          <Icons.shoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </>
      )}
    </Button>
  );
}
