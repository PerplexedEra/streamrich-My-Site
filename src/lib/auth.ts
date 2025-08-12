import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient, User as PrismaUser, UserRole } from "@prisma/client";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import { Adapter } from "next-auth/adapters";

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: UserRole;
      points?: number;
      balance?: number;
      twoFactorAuth?: boolean;
    };
    accessToken?: string;
  }
  
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: UserRole;
    points?: number;
    balance?: number;
    twoFactorAuth?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: UserRole;
    points?: number;
    balance?: number;
    twoFactorAuth?: boolean;
    accessToken?: string;
  }
}

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  session: {
    strategy: "jwt" as const,
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: 'STREAMER', // Default role for Google sign-ups
        };
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Please enter your email and password");
        }

        const prisma = new PrismaClient();
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { 
            profile: true,
            accounts: {
              where: { provider: 'credentials' },
              select: { refresh_token: true }
            }
          },
        });

        if (!user || !user.accounts || user.accounts.length === 0) {
          throw new Error("No user found with this email or invalid credentials");
        }

        const hashedPassword = user.accounts[0].refresh_token;
        
        if (!hashedPassword) {
          throw new Error("Invalid account configuration");
        }

        const isValid = await compare(credentials.password, hashedPassword);

        if (!isValid) {
          throw new Error("Incorrect password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Handle OAuth sign-in
      if (account?.provider === 'google' && user.email) {
        // Check if user exists in your database
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        // If user doesn't exist, create a new one with default role
        if (!existingUser) {
          await prisma.user.create({
            data: {
              email: user.email,
              name: user.name || user.email.split('@')[0],
              image: user.image || null,
              role: 'STREAMER', // Default role for new users
              twoFactorAuth: false, // Default to false
              profile: {
                create: {
                  displayName: user.name || user.email.split('@')[0],
                  points: 0,
                  availableCash: 0,
                  totalEarned: 0,
                  totalWithdrawn: 0,
                },
              },
            },
          });
        }
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.user.points = token.points as number | undefined;
        session.user.balance = token.balance as number | undefined;
        session.user.twoFactorAuth = token.twoFactorAuth as boolean | undefined;
      }
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || 'STREAMER';
        token.twoFactorAuth = (user as any).twoFactorAuth || false;
      }

      // Fetch fresh user data from database on each request
      if (token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          include: { profile: true },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.twoFactorAuth = dbUser.twoFactorAuth || false;
          
          // Include profile data if available
          if (dbUser.profile) {
            token.points = dbUser.profile.points;
            token.balance = dbUser.profile.availableCash;
          }
          
          // Ensure twoFactorAuth is a boolean
          token.twoFactorAuth = Boolean(dbUser.twoFactorAuth);
        }
      }

      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: UserRole;
      points?: number;
      balance?: number;
      twoFactorAuth?: boolean;
    };
    accessToken?: string;
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: UserRole;
    points?: number;
    balance?: number;
    twoFactorAuth?: boolean;
  }
}
