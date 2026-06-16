import { NextRequest, NextResponse } from "next/server";
import { generateOAuthUrl } from "corsair/oauth";
import { corsair } from "@/src/server/corsair";
import { getCurrentUser } from "@/src/actions/auth";

const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth`;

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const plugin = new URL(request.url).searchParams.get("plugin");
  if (!plugin) {
    return NextResponse.json({ error: "Missing plugin param" }, { status: 400 });
  }

  const { url, state } = await generateOAuthUrl(corsair, plugin, {
    tenantId: user.id,
    redirectUri: REDIRECT_URI,
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
