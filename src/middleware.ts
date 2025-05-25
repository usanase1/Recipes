import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

// Define which routes should be protected (require authentication)
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/profile(.*)",
  // Add other routes that should require authentication
])

export default clerkMiddleware(async (auth, req) => {
  // Only protect specific routes, allow public access to recipes
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}
