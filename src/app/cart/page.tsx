'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/icons';
import { useCart } from '@/contexts/cart-context';
import Link from 'next/link';
import { PaymentMethodSelector } from '@/components/payment/payment-method-selector';

export default function CartPage() {
  const { items, updateQuantity, removeItem, total, itemCount, clearCart } = useCart();

  const handleCheckout = () => {
    // This will be handled by the PaymentMethodSelector
  };

  if (itemCount === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <Icons.shoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Looks like you haven't added anything to your cart yet.</p>
          <Button asChild>
            <Link href="/store">
              <Icons.arrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Cart Items */}
        <div className="md:w-2/3">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Your Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})</h1>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearCart}
              className="text-destructive hover:text-destructive/90"
            >
              <Icons.trash className="mr-2 h-4 w-4" />
              Clear Cart
            </Button>
          </div>

          <div className="space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="flex">
                  <div className="w-24 h-24 bg-muted flex-shrink-0">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <Icons.image className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Icons.minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                          className="w-16 text-center h-8"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Icons.plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-destructive hover:text-destructive/90"
                      >
                        <Icons.trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="md:w-1/3">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span className="text-lg">${total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button asChild className="w-full" size="lg">
                <Link href="/checkout">
                  Proceed to Checkout
                  <Icons.arrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <div className="text-xs text-muted-foreground text-center">
                By proceeding, you agree to our{' '}
                <Link href="/terms" className="underline hover:text-primary">
                  Terms of Service
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
