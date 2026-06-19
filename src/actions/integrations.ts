"use server";

import prisma from "@/src/lib/prisma";
import { getCurrentUser } from "@/src/actions/auth";
import { revalidatePath } from "next/cache";

/**
 * Disconnects a user integration by deleting the associated Corsair account.
 * This cascades to delete all cached entities and events.
 */
export async function disconnectIntegrationAction(integrationName: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const integration = await prisma.corsairIntegration.findFirst({
      where: { name: integrationName },
    });

    if (!integration) {
      return { success: false, error: `Integration "${integrationName}" not found.` };
    }

    await prisma.corsairAccount.deleteMany({
      where: {
        tenantId: user.id,
        integrationId: integration.id,
      },
    });

    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/connections");

    return { success: true };
  } catch (error: any) {
    console.error(`Failed to disconnect integration ${integrationName}:`, error);
    return { success: false, error: error.message || "Failed to disconnect integration" };
  }
}
