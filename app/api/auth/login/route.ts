import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = body.email;
    const password = body.password;

    if (!email || !password) {
      return NextResponse.json(
        { error: "email and password are required" },
        { status: 400 },
      );
    }

    const reqHeaders = await headers();

    const { response, headers: cookieHeaders } = await auth.api.signInEmail({
      body: { email, password },
      headers: reqHeaders,
      returnHeaders: true,
    });

    const result = NextResponse.json(
      { success: "true", message: "Login successful", user: response.user },
      { status: 200 },
    );

    for (const cookie of cookieHeaders?.getSetCookie() ?? []) {
      result.headers.append("Set-Cookie", cookie);
    }

    return result;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
