import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SignOutButton } from "@/components/auth-buttons";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="flex flex-col gap-2 items-center sm:items-start">
          {session?.user?.image ? (
            <Image
              className="rounded-full"
              src={session?.user?.image}
              alt={session?.user?.name ?? "User avatar"}
              width={48}
              height={48}
            />
          ) : null}
          <p className="text-sm">Signed in as {session?.user?.email ?? session?.user?.name}</p>
          <SignOutButton />
        </div>
      </main>
    </div>
  );
}