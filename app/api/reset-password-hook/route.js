"use server";

import { NextResponse } from "next/server";
import { Webhook } from "standardwebhooks";
import resetLinkEmail from "@/utils/email-templates/reset-password";
import { Resend } from "resend";

const SEND_EMAIL_HOOK_SECRET = process.env.SEND_EMAIL_HOOK_SECRET.replace(
  "v1,whsec_",
  ""
);

export async function POST(request) {
  const wh = new Webhook(SEND_EMAIL_HOOK_SECRET);

  const headers = await Object.fromEntries(request.headers);
  const payload = await request.text();

  try {
    const { user, email_data } = wh.verify(payload, headers);

    const type = email_data.email_action_type;

    if (type.toLowerCase() === "recovery") {
      const email = user.email;
      const token_hash = email_data.token_hash;
      const resend = new Resend(process.env.RESEND_API_KEY);
      const next = process.env.BASE_URL;

      const { data: emailData, error: emailError } = await resend.emails.send({
        from: `STM Golf Event <${process.env.SEND_FROM_EMAIL}>`,
        to: [email],
        subject: "STM Golf Dashboard: Reset Password",
        react: resetLinkEmail(token_hash, next),
      });

      if (emailError && Object.keys(emailError).length >= 1) {
        throw new Error(emailError.message);
      }

      return new NextResponse({ status: 200 });
    }
  } catch (error) {
    console.error(error); // Log the error for debugging
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
