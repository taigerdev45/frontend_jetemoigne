import { cookies } from "next/headers";

/**
 * Lire le token JWT depuis le cookie HttpOnly cote serveur (Server Components / API Routes).
 */
export async function getServerAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("auth-token")?.value || null;
}
