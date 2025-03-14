import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(request) {
  const secret = request.nextUrl.searchParams.get("secret");

  if (secret !== process.env.REVALIDATE_SECRET_TOKEN) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  const path = request.nextUrl.searchParams.get("path") || "/";

  revalidatePath(path);
  return NextResponse.json({ revalidated: true });
}
