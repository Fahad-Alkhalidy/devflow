import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import Routes from "@/constants/routes";
import React from "react";

const Home = async () => {
  const session = await auth();
  console.log(session);
  return (
    <div>
      <h1 className="h1-bold font-space-grotesk">hello</h1>
      <h1 className="h1-bold font-inter">hello</h1>
      <form
        className="px-10 pt-[100]"
        action={async () => {
          "use server";
          await signOut({ redirectTo: Routes.SIGN_IN });
        }}
      >
        <Button>Log out</Button>
      </form>
    </div>
  );
};

export default Home;
