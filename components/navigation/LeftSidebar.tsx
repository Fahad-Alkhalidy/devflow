import { Button } from "@/components/ui/button";
import Routes from "@/constants/routes";
import Image from "next/image";
import Link from "next/link";
import NavLinks from "./navbar/NavLinks";

const LeftSidebar = () => {
  return (
    <section
      className="custom-scrollbar background-light900_dark200
     light-border sticky left-0 top-0 h-screen flex flex-col justify-between 
     overflow-y-auto border-r p-6 pt-36 shadow-light-300 
     dark:shadow-none max-sm:hidden lg:w-[266px]"
    >
      <div className="flex flex-1 flex-col gap-6">
        <NavLinks></NavLinks>
      </div>
      <div className="flex flex-col gap-3">
        <Button
          className="small-medium btn-secondary min-h-[41px] w-full rounded-lg 
            px-4 py-3 shadow-none"
          asChild
        >
          <Link href={Routes.SIGN_IN}>
            <Image
              src="/icons/account.svg"
              alt="Account"
              width={20}
              height={20}
              className="invert-color lg:hidden"
            ></Image>
            <span className="primary-text-gradient max-lg:hidden">Log In</span>
          </Link>
        </Button>
        <Button
          className="small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] border w-full rounded-lg 
                  px-4 py-3 shadow-none"
          asChild
        >
          <Link href={Routes.SIGN_UP}>
            <Image
              src="/icons/account.svg"
              alt="Account"
              width={20}
              height={20}
              className="invert-color lg:hidden"
            ></Image>
            <span className="max-lg:hidden">Sign Up</span>
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default LeftSidebar;
