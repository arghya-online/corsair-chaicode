import { NextRequest, NextResponse } from "next/server";
import { processOAuthCallback } from "corsair/oauth";
import { corsair } from "@/src/server/corsair";

const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth`;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const storedState = request.cookies.get("oauth_state")?.value;

  // Always clear the cookie — on every exit path
  const clearCookie = new NextResponse(null);
  clearCookie.cookies.set("oauth_state", "", { maxAge: 0, path: "/" });

  if (error) {
    const response = NextResponse.redirect(
      new URL(
        `/dashboard?oauth_error=${encodeURIComponent(error)}`,
        request.url,
      ),
    );
    response.cookies.set("oauth_state", "", { maxAge: 0, path: "/" });
    return response;
  }

  if (!code || !state) {
    const response = NextResponse.redirect(
      new URL("/dashboard?oauth_error=missing_code", request.url),
    );
    response.cookies.set("oauth_state", "", { maxAge: 0, path: "/" });
    return response;
  }

  if (!storedState || storedState !== state) {
    const response = NextResponse.redirect(
      new URL("/dashboard?oauth_error=invalid_state", request.url),
    );
    response.cookies.set("oauth_state", "", { maxAge: 0, path: "/" });
    return response;
  }

  try {
    const result = await processOAuthCallback(corsair, {
      code,
      state,
      redirectUri: REDIRECT_URI,
    });

    const response = NextResponse.redirect(
      new URL(
        `/dashboard?oauth_success=${encodeURIComponent(result.plugin)}`,
        request.url,
      ),
    );
    response.cookies.set("oauth_state", "", { maxAge: 0, path: "/" });
    return response;
  } catch (err) {
    const message = err instanceof Error ? (err as Error).message : String(err);
    console.error("[/api/auth] OAuth callback error:", message);
    const response = NextResponse.redirect(
      new URL(
        `/dashboard?oauth_error=${encodeURIComponent(message)}`,
        request.url,
      ),
    );
    response.cookies.set("oauth_state", "", { maxAge: 0, path: "/" });
    return response;
  }
}
