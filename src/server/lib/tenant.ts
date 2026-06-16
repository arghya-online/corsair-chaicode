import { corsair } from "@/src/server/corsair";
import { getCurrentUser } from "@/src/actions/auth";

/**
 * Returns a tenant-scoped Corsair instance tied to the current JWT session.
 * The user's `id` (UUID from the `users` table) is used as the Corsair tenant id.
 * Throws "Not authenticated" if no valid session cookie exists.
 */
export async function getTenant() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");
  return corsair.withTenant(user.id);
}
