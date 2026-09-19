import { db } from "@/src";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "@/src/db/schema";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema: schema }),
  user: { modelName: "user" },
  baseURL: "http://localhost:3000",
  rateLimit: {
    enabled: true,
    window: 60,
    max: 5,
    customRules: {
      "/forget-password": {
        window: 900,
        max: 1,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      void resend.emails.send({
        from: "onboarding@resend.dev",
        to: user.email,
        subject: "Reset your password",
        html: `<a href=${url}>Reset Password<a>`,
      });
    },
    onPasswordReset: async ({ user }, request) => {
      alert(`Password for user ${user.email} has been reset.`);
    },
  },
});
