import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar user={session.user as { name?: string | null; email?: string | null; image?: string | null; username?: string }} />
      <main className="flex-1 ml-0 lg:ml-64 p-6 lg:p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
