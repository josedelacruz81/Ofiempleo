"use client";
import { usePost } from "@/context/PostContext";
import { PostCard } from "../cards/PostCard";
import { HiOutlineSearch } from "react-icons/hi";
import { UserCard } from "../cards/UserCard";

export const SearchedUsers = () => {
  const { users: searchedUsers} = usePost();
  
  return (
    <div className="flex flex-col gap-5">
      {searchedUsers && searchedUsers.length === 0 && (
        <h3 className="text-xl font-medium ml-3">No se encontraron resultados</h3>
      )}
      {searchedUsers && searchedUsers.length > 0 && (
        <h3 className="text-xl font-medium flex items-center gap-2 ml-3">
          Resultados de la busqueda
          <HiOutlineSearch size={30} className="text-blue-500" />
        </h3>
      )}
      <section className="auto-grid">
        {searchedUsers &&
          searchedUsers.map((user: any,index:number) => (
            <UserCard userData={user} key={index}/>
          ))}
      </section>
      {searchedUsers && searchedUsers.length > 0 && (
        <h3 className="text-2xl font-medium flex items-center gap-2 ml-3">
          Todas las publicaciones
          
        </h3>
      )}
    </div>
  );
};
