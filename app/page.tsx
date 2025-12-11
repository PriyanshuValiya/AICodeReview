import { Button } from "@/components/ui/button";
import Logout from "@/module/auth/components/logout";
import { requireAuth } from "@/module/utils/auth-utils";

export default async function Home() {
  await requireAuth();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Logout>
        <Button>Daya</Button>
      </Logout>
    </div>
  );
}
