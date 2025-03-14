import { updateSession } from "@/utils/supabase/middleware";
import { NextResponse } from "next/server";

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

export default async function middleware(req) {
  const url = req.nextUrl;

  // Get hostname of request (e.g. dashboard.stmgolf.org, dashboard.localhost:3000)
  let hostname = req.headers
    .get("host")
    .replace(".localhost:3000", `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);

  // special case for Vercel preview deployment URLs
  // if (
  //   hostname.includes("---") &&
  //   hostname.endsWith(`.${process.env.NEXT_PUBLIC_VERCEL_DEPLOYMENT_SUFFIX}`)
  // ) {
  //   hostname = `${hostname.split("---")[0]}.${
  //     process.env.NEXT_PUBLIC_ROOT_DOMAIN
  //   }`;
  // }

  const searchParams = req.nextUrl.searchParams.toString();
  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const path = `${url.pathname}${
    searchParams.length > 0 ? `?${searchParams}` : ""
  }`;

  // rewrites for dashboard pages
  if (hostname == `dashboard.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
    //update cookies for app router based authentication
    await updateSession(req);

    return NextResponse.rewrite(
      new URL(`/dashboard${path === "/" ? "" : path}`, req.url)
    );
  } else if (hostname === `api.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
    return NextResponse.rewrite(
      new URL(`/api${path === "/" ? "" : path}`, req.url)
    );
  }

  // rewrite any other request other than api or dashboard to `/home` folder
  else {
    return NextResponse.rewrite(
      new URL(`/home${path === "/" ? "" : path}`, req.url)
    );
  }
}
