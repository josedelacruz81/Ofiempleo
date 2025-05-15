import { Skeleton } from "@nextui-org/react";
import ProfileModal from "./Modal";

export default function Loading() {
  return (
    <div className="p-5">
      {/* <Profile session={session} post={post} user={user} /> */}
      <div className="w-[300px] flex items-center gap-3 mb-5">
        <div>
          <Skeleton className="flex rounded-full w-20 h-20" />
        </div>
        <div className="w-full flex flex-col gap-2">
          <Skeleton className="h-3 w-3/5 rounded-lg" />
          <Skeleton className="h-3 w-4/5 rounded-lg" />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4 border-2 border-[#e4e4e7] rounded-xl p-2">
        <div className="w-full flex flex-col gap-2 md:col-span-2">
          <Skeleton className="h-3 w-3/5 rounded-lg" />
        </div>
        <Skeleton className="rounded-lg">
          <div className="h-14  rounded-lg bg-default-300"></div>
        </Skeleton>
        <Skeleton className="rounded-lg">
          <div className="h-14  rounded-lg bg-default-300"></div>
        </Skeleton>
        <Skeleton className="rounded-lg">
          <div className="h-14  rounded-lg bg-default-300"></div>
        </Skeleton>
        <Skeleton className="rounded-lg">
          <div className="h-14  rounded-lg bg-default-300"></div>
        </Skeleton>
        <Skeleton className="rounded-lg md:col-span-2">
          <div className="h-14  rounded-lg bg-default-300"></div>
        </Skeleton>
      </div>
      {/* <div className="grid  gap-4 border-2 border-[#e4e4e7] rounded-xl p-2">
        <div className="w-full flex flex-col gap-2">
          <Skeleton className="h-3 w-3/5 rounded-lg" />
          <Skeleton className="h-2 w-2/5 rounded-lg" />
        </div>
        <Skeleton className="rounded-full w-4/5">
          <div className="h-4  rounded-lg bg-default-300"></div>
        </Skeleton>
        <Skeleton className="rounded-full w-3/5">
          <div className="h-4  rounded-lg bg-default-300"></div>
        </Skeleton>
        <Skeleton className="rounded-full w-4/5">
          <div className="h-4  rounded-lg bg-default-300"></div>
        </Skeleton>
        <Skeleton className="rounded-full w-3/5">
          <div className="h-4  rounded-lg bg-default-300"></div>
        </Skeleton>
      </div> */}
    </div>
  );
}
