import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://backend-jetemoigne-458j.onrender.com";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "Non authentifie" },
      { status: 401 }
    );
  }

  try {
    const backendResponse = await fetch(
      `${BACKEND_URL}/api/v1/auth/profile`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!backendResponse.ok) {
      return NextResponse.json(
        { message: "Token invalide ou expire" },
        { status: 401 }
      );
    }

    const user = await backendResponse.json();
    return NextResponse.json({ user, token });
  } catch {
    return NextResponse.json(
      { message: "Erreur de connexion au serveur" },
      { status: 500 }
    );
  }
}
