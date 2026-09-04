import Header from "@/components/header/Header";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { findUserById } from "@/lib/userStore";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const userProfile = session?.user?.id ? await findUserById(session.user.id) : null;
  return (
    <>
      {userProfile && <Header userProfile={userProfile}/>}
      <main className="min-h-[calc(100vh-4rem)]">
        {children}
      </main>
    </>
  );
}

