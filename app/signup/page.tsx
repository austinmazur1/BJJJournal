import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SignUpForm from "@/components/credentials/SignUpForm";
import { SignInButton } from "@/components/auth-buttons";
import Link from "next/link";

export default async function SignUpPage() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm rounded border p-6 flex flex-col gap-4">
        <h1 className="text-xl font-semibold">Create your account</h1>
        <p className="text-sm text-gray-600">Use your Google account to continue.</p>
        <SignInButton />
        <div className="h-px bg-gray-200" />
        <p className="text-sm text-gray-600">Or create with email and password</p>
        <SignUpForm />
        <p className="text-sm text-gray-600">
          Already have an account? <Link className="underline" href="/signin">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

