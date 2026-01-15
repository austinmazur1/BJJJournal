import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SignInButton } from "@/components/auth-buttons";
import Link from "next/link";
import SignInForm from "@/components/credentials/SignInForm";
import { Separator } from "@/components/ui/separator";

export default async function SignInPage() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-xl border p-6 flex flex-col gap-4">
        <h1 className="text-xl font-semibold text-secondary-foreground">Sign in</h1>
        <p className="text-sm text-muted-foreground">Use your Google account to continue.</p>
        <SignInButton />
        <Separator />
        <p className="text-sm text-muted-foreground">Or use email and password</p>
        <SignInForm />
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account? <Link className="underline" href="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}


