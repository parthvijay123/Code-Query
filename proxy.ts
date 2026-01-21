
import { auth } from "@/auth"

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const isOnDashboard = req.nextUrl.pathname.startsWith("/questions/ask") // Example protected route

    if (isOnDashboard) {
        if (isLoggedIn) return
        return Response.redirect(new URL("/login", req.nextUrl)) // Redirect unauthenticated users to login page
    }
    return
})

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
