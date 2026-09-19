import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = body.name;
    const email = body.email;
    const password = body.password;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const reqHeaders = await headers();

    const { response, headers: cookieHeaders } = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
      headers: reqHeaders,
      returnHeaders: true,
    });

    const result = NextResponse.json(
      { success: "true", message: "user created", user: response },
      { status: 201 },
    );

    for (const cookie of cookieHeaders?.getSetCookie() ?? []) {
      result.headers.append("Set-Cookie", cookie);
    }

    return result;
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
