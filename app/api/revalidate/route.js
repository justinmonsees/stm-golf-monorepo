import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(request) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      { message: "Unauthorized Request" },
      { status: 401 }
    );
  }

  //revalidate the homepage
  revalidatePath("/home");

  return NextResponse.json({ revalidated: true });
}
