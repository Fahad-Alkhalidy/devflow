//import { auth } from "@/auth";
import QuesionCard from "@/components/cards/QuestionCard";
import HomeFilter from "@/components/filters/HomeFilter";
import LocalSearch from "@/components/search/LocalSearch";
import { Button } from "@/components/ui/button";
import Routes from "@/constants/routes";
import handleError from "@/lib/handlers/error";
import Link from "next/link";
import React from "react";

const Home = async () => {
  //const session = await auth();
  //console.log(session);
  return (
    <>
      <section
        className="flex w-full flex-col-reverse sm:flex-row 
      justify-between gap-4 sm:items-center"
      >
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Button
          className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900"
          asChild
        >
          <Link href={Routes.ASK_QUESTION}>Ask a Question</Link>
        </Button>
      </section>
      <section className="mt-11">
        <LocalSearch
          route="/"
          imgSrc="/icons/search.svg"
          placeholder="Search Questions"
          otherClasses="flex-1"
        ></LocalSearch>
      </section>
      <HomeFilter></HomeFilter>
      <div className="flex w-full flex-col gap-6 mt-10">
        {
          //<QuesionCard key={122} question={"Hello There"} />
        }
      </div>
      {/* <form
        className="px-10 pt-[100]"
        action={async () => {
          "use server";
          await signOut({ redirectTo: Routes.SIGN_IN });
        }}
      >
        <Button>Log out</Button>
      </form> */}
    </>
  );
};

export default Home;
