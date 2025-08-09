"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
// Define UserRole enum to match Prisma schema
enum UserRole {
  STREAMER = 'STREAMER',
  CREATOR = 'CREATOR',
  ADMIN = 'ADMIN'
}
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Icons } from "@/components/icons";

const ROLE_DESCRIPTIONS = {
  [UserRole.STREAMER]: {
    title: "I'm a Streamer",
    description: "Watch content, earn points, and get paid for your engagement. Perfect for viewers who want to monetize their watch time.",
    icon: <Icons.playCircle className="h-8 w-8 mb-4 text-primary" />,
    features: [
      "Earn points for watching content",
      "Redeem points for cash rewards",
      "Discover new creators and content",
      "Support your favorite creators"
    ]
  },
  [UserRole.CREATOR]: {
    title: "I'm a Creator",
    description: "Upload your content, set your pricing, and earn money from viewers. Perfect for content creators looking to monetize their work.",
    icon: <Icons.upload className="h-8 w-8 mb-4 text-primary" />,
    features: [
      "Upload and manage your content",
      "Set your own pricing and plans",
      "Earn money from viewer engagement",
      "Track your earnings and analytics"
    ]
  }
};

export default function RoleSelectionPage() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!selectedRole) {
      toast({
        title: 'Error',
        description: 'Please select a role',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Update the user's role in the database
      const response = await fetch("/api/users/update-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: selectedRole }),
      });

      if (!response.ok) {
        throw new Error("Failed to update role. Please try again.");
      }

      // Update the session with the new role
      await update({
        ...session,
        user: {
          ...session?.user,
          role: selectedRole,
        },
      });
      
      // Redirect based on role
      const redirectPath = selectedRole === 'STREAMER' ? '/content' : '/dashboard';
      router.push(redirectPath);
    } catch (error) {
      console.error("Role selection error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred while updating your role.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // If user has already selected a role and it's a creator, show creator options
  if (selectedRole === UserRole.CREATOR && session?.user?.role === UserRole.CREATOR) {
    return (
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[600px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome, Creator!
            </h1>
            <p className="text-muted-foreground">
              What would you like to do next?
            </p>
          </div>

          <div className="grid gap-4">
            <Button 
              onClick={() => router.push("/dashboard")} 
              className="h-24 text-lg"
              variant="outline"
            >
              <div className="flex flex-col items-center gap-2">
                <Icons.dashboard className="h-6 w-6" />
                <span>Go to Dashboard</span>
                <span className="text-sm font-normal text-muted-foreground">Manage your content and earnings</span>
              </div>
            </Button>

            <Button 
              onClick={() => router.push("/content/promote")} 
              className="h-24 text-lg"
              variant="outline"
            >
              <div className="flex flex-col items-center gap-2">
                <Icons.upload className="h-6 w-6" />
                <span>Promote a Video/Song</span>
                <span className="text-sm font-normal text-muted-foreground">Paste a link to promote your content</span>
              </div>
            </Button>
          </div>

          <Button 
            variant="ghost" 
            className="mt-4"
            onClick={() => {
              setSelectedRole(null);
              // Reset the role in the session
              update({
                ...session,
                user: {
                  ...session?.user,
                  role: null,
                },
              });
            }}
          >
            <Icons.arrowLeft className="mr-2 h-4 w-4" />
            Go back to role selection
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[600px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Choose Your Role
          </h1>
          <p className="text-sm text-muted-foreground">
            Select how you want to use StreamRich. You can always change this later in your settings.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {Object.entries(ROLE_DESCRIPTIONS).map(([role, details]) => {
            const roleEnum = role as UserRole;
            const isSelected = selectedRole === roleEnum;
            
            return (
              <Card 
                key={role}
                className={`cursor-pointer transition-all hover:border-primary ${isSelected ? "border-primary ring-2 ring-primary/20" : ""}`}
                onClick={() => handleRoleSelect(roleEnum)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    {details.icon}
                    {isSelected && <Icons.check className="h-5 w-5 text-green-500" />}
                  </div>
                  <CardTitle className="text-lg">{details.title}</CardTitle>
                  <CardDescription>{details.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {details.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <Icons.checkCircle className="mr-2 h-4 w-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Button 
          onClick={handleSubmit} 
          disabled={!selectedRole || isLoading}
          className="mt-6 w-full"
        >
          {isLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.arrowRight className="mr-2 h-4 w-4" />
          )}
          {selectedRole === UserRole.STREAMER ? 'Browse Content' : 'Continue as Creator'}
        </Button>
      </div>
    </div>
  );
}
