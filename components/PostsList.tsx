"use client";
import { jobInterface, PostInterface } from "@/types";
import { PostCard } from "./cards/PostCard";
import { Session } from "next-auth";
import { useState } from "react";
import {
  Autocomplete,
  AutocompleteItem,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { HiBanknotes } from "react-icons/hi2";
import { IoFilter } from "react-icons/io5";

export const PostsList = ({
  postsData,
  jobs,
  session,
}: {
  postsData: PostInterface[];
  jobs: jobInterface[];
  session: Session | null;
}) => {

  const [posts, setPosts] = useState(postsData);
  const [value, setValue] = useState("all");
  const [amountSelected, setAmountSelected] = useState("default");
  const handleSelectionChange = (e: any) => {
    setValue(e.target.value);
    filterByTypeWork(e.target.value);
  };

  const handleSelectionAmountChange = (e: any) => {
    setAmountSelected(e.target.value);
    filterByAmount(e.target.value);
  };

  const filterByTypeWork = (typeWork: string) => {
    if (!typeWork) return setPosts(postsData);
    if (typeWork === "all") return setPosts(postsData);
    const filteredPosts = postsData.filter(
      (post) => post.typeWork === typeWork
    );
    setPosts(filteredPosts);
  };

  const filterByAmount = (amount: string) => {
    if (!amount) return setPosts(postsData);

    const filteredPosts = posts.sort((a, b) => {
      if (amount === "mayor") {
        return a.hourly - b.hourly;
      }
      if (amount === "menor") {
        return b.hourly - a.hourly;
      }
      return 0;
    });
    setPosts(filteredPosts);
  };

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-4 gap-4">
        <Select
          selectedKeys={[value]}
          onChange={handleSelectionChange}
          label="filtrar por tipo de pago"
          startContent={<IoFilter className="text-default-500" />}
          classNames={{
            trigger: "bg-white hover:bg-gray-200",
          }}
        >
          <SelectItem key="all">Todo</SelectItem>
          <SelectItem key="job">Por trabajo</SelectItem>
          <SelectItem key="daily">Por día</SelectItem>
          <SelectItem key="hourly">Por hora</SelectItem>
        </Select>
        {value === "hourly" ||
          (value === "daily" && (
            <Select
              selectedKeys={[amountSelected]}
              onChange={handleSelectionAmountChange}
              label="filtrar por monto"
              startContent={<HiBanknotes className="text-default-500" />}
              classNames={{
                trigger: "bg-white hover:bg-gray-200",
              }}
            >
              <SelectItem key="default">Normal</SelectItem>
              <SelectItem key="mayor">Mayor a menor</SelectItem>
              <SelectItem key="menor">Menor a mayor</SelectItem>
            </Select>
          ))}
        <Autocomplete
          inputProps={{
            classNames: {
              inputWrapper: "bg-white",
            },
          }}
          startContent={<IoFilter className="text-default-500" />}
          label="Empleos"
          defaultItems={jobs}
        >
          {(job) => (
            <AutocompleteItem href={`/jobs/${job.id}`} key={job.name}>{job.name}</AutocompleteItem>
          )}
        </Autocomplete>
        {/* {!!session && role !== EMPLOYEE && <FilterDropdown jobs={jobs} />} */}
      </div>

      <div
        className={
          posts.length >= 4 ? "auto-grid" : "grid md:grid-cols-3 gap-4"
        }
      >
        {posts.map((post: any) => (
          <PostCard
            post={post}
            session={session}
            profileImage={post.users.profileImage}
            key={post.id}
            username={`${post.users.names} ${post.users.lastname}`}
            id={post.id}
            userId={post.userId}
          />
        ))}
      </div>
    </div>
  );
};
