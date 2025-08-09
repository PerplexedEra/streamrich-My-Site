'use client';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/cart-context';
import Link from 'next/link';

export function CartIcon() {
  const { itemCount } = useCart();

  return (
    <Button
      asChild
      variant="ghost"
      size="icon"
      className="relative hover:bg-transparent hover:text-foreground"
    >
      <Link href="/cart">
        <Icons.shoppingCart className="h-5 w-5" />
        {itemCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
            {itemCount > 9 ? '9+' : itemCount}
          </span>
        )}
        <span className="sr-only">Cart</span>
      </Link>
    </Button>
  );
}
