import { Profile } from "@/components/profile";
import { auth } from "@/auth";
import {
  getRating,
  getRatingCount,
} from "@/lib/functions";
import { getReportedUser } from "@/lib/services";

const getUserData = async (id: string) => {
  const userUrl = `${process.env.PUBLIC_URL}/api/user/${id}`;
  const res = await fetch(userUrl, { cache: "no-cache" });
  const userData = await res.json();

  return userData;
};

export default async function Page({ params }: { params: { id: string } }) {
  const session = await auth();
  const { user, post, comments } = await getUserData(params.id);
  const rating = await getRating(params.id);
  const ratingCount = await getRatingCount(params.id);
  const reportedUser = session
    ? await getReportedUser(params.id, session.user.id)
    : null;
 
  return (
    <Profile
      comments={comments}
      rating={rating}
      ratingCount={ratingCount}
      session={session}
      isReported={reportedUser ? reportedUser.length > 0 : false}
      user={user}
    />
  );
}
