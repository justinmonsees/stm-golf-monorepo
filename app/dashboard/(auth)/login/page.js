import { LoginForm } from "@/components/dashboard/LoginForm";
import Link from "next/link";

export default function Login() {
  return (
    <>
      <LoginForm />
      <Link href="/forgot-password" className="text-sm max-w-sm w-full">
        Forgot Password?
      </Link>
    </>
  );
}
