import { ForgotPasswordForm } from "@/components/ForgotPasswordForm";
import Link from "next/link";

export default function ForgotPassord() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-3 p-24">
      <ForgotPasswordForm />
      <Link href="/login" className="text-sm max-w-sm w-full">
        Login
      </Link>
    </main>
  );
}
