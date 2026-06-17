import { corsair } from "@/src/server/corsair";
import { getCurrentUser } from "@/src/actions/auth";

export async function getTenant() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");
  return corsair.withTenant(user.id);
}
