/**
 * Route proxy universelle — transfère toutes les requêtes vers le backend NestJS
 * côté serveur (server-to-server = pas de CORS).
 *
 * Usage côté client :  fetch('/api/proxy/admin/hub/dashboard')
 *   → proxifié vers :  https://backend.../api/v1/admin/hub/dashboard
 *
 * Le cookie HttpOnly `auth-token` est automatiquement lu et injecté en Bearer.
 */
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://backend-jetemoigne-458j.onrender.com";

async function handler(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const backendPath = path.join("/");
  const search = request.nextUrl.search ?? "";
  const url = `${BACKEND_URL}/api/v1/${backendPath}${search}`;

  // Lire le token depuis le cookie HttpOnly (server-side)
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  // Construire les headers à transmettre
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Transmettre Content-Type sauf pour FormData (le browser le gère)
  const contentType = request.headers.get("content-type");
  if (contentType && !contentType.includes("multipart/form-data")) {
    headers["Content-Type"] = contentType;
  }

  // Lire le body selon la méthode
  let body: BodyInit | undefined;
  const method = request.method;
  if (!["GET", "HEAD", "OPTIONS"].includes(method)) {
    body = await request.arrayBuffer().then((b) => Buffer.from(b));
  }

  try {
    const backendResponse = await fetch(url, {
      method,
      headers,
      body,
    });

    const responseContentType = backendResponse.headers.get("content-type") ?? "";
    const responseBody = responseContentType.includes("application/json")
      ? await backendResponse.json()
      : await backendResponse.text();

    return NextResponse.json(responseBody, {
      status: backendResponse.status,
    });
  } catch (err) {
    console.error(`[proxy] Erreur pour ${url}:`, err);
    return NextResponse.json(
      { message: "Erreur de connexion au serveur backend" },
      { status: 502 }
    );
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const OPTIONS = handler;
