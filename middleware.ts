import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const authObj = await auth();
  if (isProtectedRoute(req) && !authObj.userId) {
    return authObj.redirectToSignIn();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files, allowing callback endpoints
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API/TRPC routes
    "/(api|trpc)(.*)",
  ],
};
