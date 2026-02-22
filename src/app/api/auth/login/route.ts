import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://backend-jetemoigne-458j.onrender.com";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const backendResponse = await fetch(
      `${BACKEND_URL}/api/v1/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    if (!backendResponse.ok) {
      const error = await backendResponse.json().catch(() => ({}));
      return NextResponse.json(
        { message: error.message || "Identifiants invalides" },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();

    // Creer la reponse avec le cookie HttpOnly
    const response = NextResponse.json({ user: data.user });

    response.cookies.set("auth-token", data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 jour (meme duree que le JWT backend)
    });

    return response;
  } catch {
    return NextResponse.json(
      { message: "Erreur de connexion au serveur" },
      { status: 500 }
    );
  }
}
