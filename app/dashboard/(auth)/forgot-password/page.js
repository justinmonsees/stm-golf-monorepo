import { ForgotPasswordForm } from "@/components/dashboard/ForgotPasswordForm";
import Link from "next/link";

export default function ForgotPassord() {
  return (
    <>
      <ForgotPasswordForm />
      <Link href="/login" className="text-sm max-w-sm w-full">
        Login
      </Link>
    </>
  );
}
