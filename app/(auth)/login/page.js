import { LoginForm } from "@/components/LoginForm";
import Link from "next/link";

export default function Login() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-3 p-24">
      <LoginForm />
      <Link href="/forgot-password" className="text-sm max-w-sm w-full">
        Forgot Password?
      </Link>
    </main>
  );
}
