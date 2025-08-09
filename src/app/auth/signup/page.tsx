'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
// Define UserRole enum locally since we can't import from @prisma/client
enum UserRole {
  STREAMER = 'STREAMER',
  CREATOR = 'CREATOR',
  ADMIN = 'ADMIN'
}

// Simple Input component
const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${props.className || ''}`}
  />
);

// Simple Label component
const Label = ({ htmlFor, children, className = '' }: { htmlFor?: string; children: React.ReactNode; className?: string }) => (
  <label htmlFor={htmlFor} className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}>
    {children}
  </label>
);

// Import the base Icons
import { Icons as BaseIcons } from '@/components/icons';

// Extend Icons with missing icons
const Icons = {
  ...BaseIcons,
  playCircle: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <polygon points="10 8 16 12 10 16 10 8" />
    </svg>
  ),
  upload: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  ),
};

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const ROLE_OPTIONS = [
  {
    value: UserRole.STREAMER,
    label: 'Streamer',
    description: 'Watch content, earn points, and get paid for your engagement.',
    icon: <Icons.playCircle className="h-5 w-5" />
  },
  {
    value: UserRole.CREATOR,
    label: 'Creator',
    description: 'Upload content, set your pricing, and earn money from viewers.',
    icon: <Icons.upload className="h-5 w-5" />
  }
];

export default function SignUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: UserRole.STREAMER,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const handleRoleSelect = (role: UserRole) => {
    setFormData(prev => ({
      ...prev,
      role
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    console.log('Starting signup process for:', formData.email);
    setIsLoading(true);

    try {
      // First, create the user account
      console.log('Sending signup request...');
      const signUpResponse = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      const signUpData = await signUpResponse.json();
      console.log('Signup response:', { status: signUpResponse.status, data: signUpData });

      if (!signUpResponse.ok) {
        throw new Error(signUpData.error || 'Something went wrong during signup');
      }

      // Then, sign in the user
      console.log('Attempting to sign in after signup...');
      const signInResult = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
        // Redirect to content page for regular users, admin to dashboard
        callbackUrl: formData.role === 'ADMIN' ? '/admin' : '/content',
      });

      console.log('Sign in result:', signInResult);
      
      if (signInResult?.error) {
        console.error('Sign in error:', signInResult.error);
        throw new Error(signInResult.error || 'Failed to sign in after account creation');
      }

      // If we get here, sign in was successful
      if (signInResult?.url) {
        console.log('Redirecting to:', signInResult.url);
        // Use window.location to ensure a full page refresh and proper session handling
        window.location.href = signInResult.url;
        return;
      }
      
      console.log('No URL in sign in result, using fallback redirect');

      // Fallback redirect to content page
      window.location.href = formData.role === 'ADMIN' ? '/admin' : '/content';
    } catch (err) {
      console.error('Signup error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create account';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Icons.logo className="mr-2 h-6 w-6" />
          StreamRich
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;This platform has completely transformed how I engage with content and earn money online.&rdquo;
            </p>
            <footer className="text-sm">Sofia Davis, Streamer</footer>
          </blockquote>
        </div>
      </div>
      
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your information to create an account
            </p>
          </div>
          
          <div className="grid gap-6">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    type="text"
                    autoCapitalize="none"
                    autoComplete="name"
                    autoCorrect="off"
                    disabled={isLoading}
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                  )}
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    placeholder="name@example.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={isLoading}
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    disabled={isLoading}
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? 'border-red-500' : ''}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password}</p>
                  )}
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    disabled={isLoading}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={errors.confirmPassword ? 'border-red-500' : ''}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label>I am a...</Label>
                  <div className="grid gap-2">
                    {ROLE_OPTIONS.map((option) => (
                      <div
                        key={option.value}
                        className={`flex items-center space-x-3 rounded-md border p-3 cursor-pointer transition-colors ${
                          formData.role === option.value
                            ? 'border-primary bg-primary/5'
                            : 'border-muted hover:bg-muted/50'
                        }`}
                        onClick={() => handleRoleSelect(option.value)}
                      >
                        <div className="flex-shrink-0">
                          {option.icon}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {option.label}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {option.description}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          {formData.role === option.value && (
                            <Icons.check className="h-4 w-4 text-primary" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    id="terms"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    required
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the{' '}
                    <a href="/terms" className="underline underline-offset-4 hover:text-primary">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" className="underline underline-offset-4 hover:text-primary">
                      Privacy Policy
                    </a>
                  </label>
                </div>
                
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create Account
                </Button>
              </div>
            </form>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            
            <Button variant="outline" type="button" disabled={isLoading} className="w-full">
              {isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.google className="mr-2 h-4 w-4" />
              )}
              Continue with Google
            </Button>
          </div>
          
          <p className="px-8 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              href="/auth/signin"
              className="underline underline-offset-4 hover:text-primary"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
