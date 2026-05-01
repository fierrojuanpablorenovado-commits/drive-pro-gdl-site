export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/leads/:path*",
    "/pipeline/:path*",
    "/tasks/:path*",
    "/alerts/:path*",
    "/reports/:path*",
    "/users/:path*",
    "/settings/:path*",
  ],
};
