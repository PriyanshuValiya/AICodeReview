import { Button } from "@/components/ui/button";
import { requireAuth } from "@/module/utils/auth-utils";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  await requireAuth();
  return redirect("/dashboard");

  // return (
  //   <div className="flex flex-col items-center justify-center h-screen">
  //     <Button><Link href="/dashboard">Dashboard</Link></Button>
  //   </div>
  // );
}
