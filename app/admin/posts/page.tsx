import { auth } from "@/auth";
import { PostsList } from "../components/PostsList";
import { PostInterface } from "@/types";

const getPosts = async (): Promise<PostInterface[]> => {
  const res = await fetch(`${process.env.PUBLIC_URL}/api/admin/posts/postsRequests`, {
    cache: "no-store",
  });
  const data = await res.json();
  return data;
};

export default async function AdminPage() {
  const session = await auth();
  if(!session) return null;
  const posts = await getPosts();
  if (!session) return null;
  return <PostsList session={session} postsData={posts} />;
}
