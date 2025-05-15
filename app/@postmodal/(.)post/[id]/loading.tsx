import { ModalBody, Skeleton } from "@nextui-org/react";

export default function Loading() {
  return (
    <ModalBody className="p-2">
          <div className="w-full  relative flex flex-col gap-4">
            <Skeleton className="rounded-xl">
              <div className="h-72 w-full rounded-lg bg-default-300" />
            </Skeleton>
            <div className="flex gap-2 items-center">
              <Skeleton className="flex rounded-full w-24 h-24  " />
         
                <Skeleton className="w-3/5 rounded-lg">
                  <div className="h-3 w-3/5 rounded-lg bg-default-200" />
                </Skeleton>
              
             
            </div>
            <div className="space-y-6 px-6 pb-4 ">
              <Skeleton className="w-3/5 rounded-lg">
                <div className="h-3 w-3/5 rounded-lg bg-default-200" />
              </Skeleton>
              <Skeleton className="w-4/5 rounded-lg">
                <div className="h-3 w-4/5 rounded-lg bg-default-200" />
              </Skeleton>
              <Skeleton className="w-2/5 rounded-lg">
                <div className="h-3 w-2/5 rounded-lg bg-default-300" />
              </Skeleton>
            </div>
          </div>
        </ModalBody>
  );
}
