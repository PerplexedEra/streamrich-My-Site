import { Button, ButtonProps } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { usePayment } from '@/hooks/use-payment';

interface PaymentButtonProps extends ButtonProps {
  productId: string;
  amount: number;
  buttonText?: string;
}

export function PaymentButton({
  productId,
  amount,
  buttonText = 'Buy Now',
  className,
  ...props
}: PaymentButtonProps) {
  const { initiatePayment, isLoading } = usePayment();

  const handleClick = async () => {
    await initiatePayment(productId, amount);
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      className={`relative ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <Icons.creditCard className="mr-2 h-4 w-4" />
          {buttonText}
        </>
      )}
    </Button>
  );
}
