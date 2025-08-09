import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { UserRole } from "@prisma/client";

export async function POST(req: Request) {
  try {
    // Get the current session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Parse the request body
    const { role } = await req.json();

    // Validate the role
    if (!Object.values(UserRole).includes(role)) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      );
    }

    // Update the user's role in the database
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        profile: {
          select: {
            points: true,
            availableCash: true,
            totalEarned: true,
            totalWithdrawn: true,
          },
        },
      },
    });

    // Return the updated user data
    return NextResponse.json({
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        image: updatedUser.image,
        role: updatedUser.role,
        points: updatedUser.profile?.points || 0,
        balance: updatedUser.profile?.availableCash || 0,
      },
    });
  } catch (error) {
    console.error("Role update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
