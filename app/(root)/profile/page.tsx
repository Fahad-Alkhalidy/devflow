import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Routes from "@/constants/routes";

const ProfilePage = async () => {
  const session = await auth();

  // If user is not authenticated, redirect to login
  if (!session?.user?.id) {
    redirect(Routes.SIGN_IN);
  }

  // If user is authenticated, redirect to their own profile
  redirect(Routes.PROFILE(session.user.id));
};

export default ProfilePage;
