"use server";

import { Webhook } from "standardwebhooks";
import resetLinkEmail from "@/utils/email-templates/reset-password";
import { Resend } from "resend";

const SEND_EMAIL_HOOK_SECRET = process.env.SEND_EMAIL_HOOK_SECRET.replace(
  "v1,whsec_",
  ""
);

export async function POST(request) {
  const wh = new Webhook(SEND_EMAIL_HOOK_SECRET);

  const headers = Object.fromEntries(request.headers);
  const payload = await request.text();

  const responseHeaders = new Headers();
  responseHeaders.set("Content-Type", "application/json");

  try {
    const { user, email_data } = wh.verify(payload, headers);

    const type = email_data.email_action_type;

    if (type.toLowerCase() === "recovery") {
      const email = user.email;
      const token = email_data.token;
      const resend = new Resend(process.env.RESEND_API_KEY);

      const { data: emailData, error: emailError } = await resend.emails.send({
        from: `STM Golf Event <${process.env.SEND_FROM_EMAIL}>`,
        to: [email],
        subject: "STM Golf Dashboard: Reset Password",
        react: resetLinkEmail(token),
      });

      if (emailError && Object.keys(emailError).length >= 1) {
        throw new Error(emailError.message);
      }

      return new Response(JSON.stringify({}), {
        status: 200,
        headers: responseHeaders,
      });
    } else {
      throw new Error("Invalid OTP Type");
    }
  } catch (error) {
    console.error(error); // Log the error for debugging
    return new Response(JSON.stringify({}), {
      status: 500,
      headers: responseHeaders,
    });
  }
}
