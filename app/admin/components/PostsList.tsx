"use client";

import { PostCard } from "@/components/cards/PostCard";
import { useToast } from "@/components/shadCn/useToast";
import { useRole } from "@/context/RoleContext";
import { ACEPTED, ADMIN, PENDING, PostInterface, REJECTED } from "@/types";
import { Input, Select, SelectItem } from "@nextui-org/react";
import { Session } from "next-auth";
import { useState } from "react";
import { HiSearch } from "react-icons/hi";
import { IoFilter } from "react-icons/io5";

export const PostsList = ({
  postsData,
  session,
}: {
  postsData: PostInterface[];
  session: Session;
}) => {
  const { role } = useRole();

  const [posts, setPosts] = useState<PostInterface[]>(postsData);
  const [selected, setSelected] = useState<string>("todo");
  const { toast } = useToast();

  const handleDeletePost = async (id: string) => {
    if (role !== ADMIN) return;
    const res = await fetch(`/api/admin/posts/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();

    // setPosts(posts.filter((post) => post.id !== id));
    toast({
      title: "Post eliminado",
      description: "El post ha sido eliminado con éxito",
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setPosts(postsData);
    } else if (!isNaN(parseInt(value))) {
      const filteredReports = posts.filter((post) =>
        post.users.id.toString().toLowerCase().includes(value.toLowerCase())
      );
      setPosts(filteredReports);
    } else {
      const filteredReports = posts.filter((post) =>
        `${post.users.names} ${post.users.lastname}`
          .toLowerCase()
          .includes(value.toLowerCase())
      );
      setPosts(filteredReports);
    }
  };

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelected(e.target.value);
  };

  const filteredPosts = posts.filter((post) => {
    if (selected === "todo") return post;
    if (selected === PENDING) return post.status === PENDING;
    if (selected === ACEPTED) return post.status === ACEPTED;
    if (selected === REJECTED) return post.status === REJECTED
  });

  return (
    <div className="space-y-4">
      <div className="grid lg:grid-cols-3 gap-4">
        <h2 className="text-xl font-medium mb-5  ml-4">Panel Administrativo</h2>
        <Select
          defaultSelectedKeys={["todo"]}
          variant="faded"
          radius="lg"
          onChange={handleSelect}
          classNames={{ trigger: "bg-white border-0 radius-xl" }}
          label="filtrar por estado"
          startContent={
            <IoFilter />
          }
        >
          <SelectItem key="todo">Todo</SelectItem>
          <SelectItem key="Pendiente">Pendiente</SelectItem>
          <SelectItem key="Aceptado">Aceptado</SelectItem>
          <SelectItem key="Rechazado">Rechazado</SelectItem>
        </Select>
        <Input
          startContent={<HiSearch className="text-default-500" />}
          label="Buscar perfiles"
          placeholder="Busca por nombre o cédula"
          classNames={{
            inputWrapper: "bg-white",
          }}
          onChange={handleSearch}
        />
      </div>
      <div className="auto-grid">
        {filteredPosts.map((post) => (
          <PostCard
            admin
            handleDeletePost={handleDeletePost}
            profileImage={post.users.profileImage}
            post={post}
            key={post.id}
            session={session}
            username={`${post.users.names} ${post.users.lastname}`}
            id={post.id}
            userId={post.userId}
          />
        ))}
      </div>
    </div>
  );
};
