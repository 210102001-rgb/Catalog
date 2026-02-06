import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Create response and clear the auth cookie
    const response = NextResponse.json({
      message: "Logout successful",
    });

    // Clear the auth token cookie
    response.cookies.delete("auth_token");

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan saat logout" }, { status: 500 });
  }
}
