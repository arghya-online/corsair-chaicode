import { NextRequest, NextResponse } from "next/server";
import { generateOAuthUrl } from "corsair/oauth";
import { corsair } from "@/src/server/corsair";
import { getCurrentUser } from "@/src/actions/auth";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const requestUrl = new URL(request.url);
  const origin = requestUrl.origin;
  const redirectUri = `${origin}/api/auth`;

  const plugin = requestUrl.searchParams.get("plugin");
  if (!plugin) {
    return NextResponse.json({ error: "Missing plugin param" }, { status: 400 });
  }

  const { url, state } = await generateOAuthUrl(corsair, plugin, {
    tenantId: user.id,
    redirectUri,
  });

  const response = NextResponse.redirect(url);
  response.cookies.set("oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 10, // 10 minutes
    path: "/",
  });
  return response;
}
