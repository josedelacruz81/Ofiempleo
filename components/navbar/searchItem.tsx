import { searchResult } from "@/types";
import { Avatar } from "@nextui-org/react";
import Link from "next/link";
import { HiBriefcase } from "react-icons/hi";

export const SearchItem = ({ result }: { result: searchResult }) => {
  const handleHref = () => {
    switch (result.result_type) {
      case "users":
        return `/user/profile/${result.result_id}`;
      case "posts":
        return `/post/${result.result_id}`;
      default:
        return "/";
    }
  };
  const truncate = (text: string, limit: number) => {
    return text.length > limit ? text.substring(0, limit) + "..." : text;
  };

  if(result.result_type === "jobs") return null

  return (
    <>
     <Link
          href={handleHref()}
          className="grid grid-cols-12 items-center p-2 hover:bg-default-100 rounded-xl transition-colors gap-3"
        >
          <div className="col-span-1">
            {result.result_type === "users" ? (
              <Avatar src={result.image} alt="avatar" />
            ) : (
              <HiBriefcase size={25} className="text-default-500" />
            )}
          </div>
          <div className="col-span-10 text-sm">
            <h4 className="font-semibold">
              {result.result_type === "users"
                ? result.result
                : result.profession}
            </h4>

            <p className=" text-default-600">
              {result.result_type === "users"
                ? result.email
                : truncate(result.result, 120)}
            </p>
          </div>
        </Link>
    </>
  );
};
