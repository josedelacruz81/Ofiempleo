"use client";
import { usePost } from "@/context/PostContext";
import { PostCard } from "../cards/PostCard";
import { HiOutlineSearch } from "react-icons/hi";

export const SearchedPosts = ({ session }: { session: any }) => {
  const { posts: searchedPosts } = usePost();

  return (
    <div className="flex flex-col gap-5">
      {searchedPosts && searchedPosts.length === 0 && (
        <h3 className="text-xl font-medium ml-3">
          No se encontraron resultados
        </h3>
      )}
      {searchedPosts && searchedPosts.length > 0 && (
        <h3 className="text-xl font-medium flex items-center gap-2 ml-3">
          Resultados de la busqueda
          <HiOutlineSearch size={30} className="text-blue-500" />
        </h3>
      )}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {searchedPosts &&
          searchedPosts.map((post: any) => (
            <PostCard
              post={post}
              session={session}
              profileImage={post.users.profileImage}
              id={post.id}
              username={`${post.users.names} ${post.users.lastname}`}
              userId={post.userId}
              key={post.id}
            />
          ))}
      </section>
      {searchedPosts && searchedPosts.length > 0 && (
        <h3 className="text-2xl font-medium flex items-center gap-2 ml-3">
          Todas las publicaciones
        </h3>
      )}
    </div>
  );
};
