"use client";

import { useEffect, useState } from "react";
import { Image } from "@nextui-org/react";
import NextImage from "next/image";
import { type CarouselApi } from "@/components/shadCn/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/shadCn/carousel";

export const ImageCarousel = ({
  postData,
  size,
}: {
  postData: any;
  size?: number;
}) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);
  return (
    <div className="w-full">
      <Carousel setApi={setApi} className="relative">
        <CarouselContent>
          {postData.images.map((post: any, index: number) => (
            <CarouselItem key={index}>
              <picture
                className={`${
                  size
                    ? `w-full h-[22rem]`
                    : "max-w-96 max-h-96"
                }  mx-auto overflow-hidden rounded-xl`}
              >
                <Image
                  removeWrapper
                  className="w-full h-full object-cover"
                  as={NextImage}
                  priority={false}
                  src={post}
                  alt={`Image ${index}`}
                  width={400}
                  height={400}
                />
              </picture>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious
          variant="light"
          color="primary"
          className="absolute"
        />
        <CarouselNext
          variant="light"
          color="primary"
          className="absolute right-0"
        />
      </Carousel>

      <div className="flex justify-center mr-4">
        <div className="flex gap-2 items-center my-2">
          {postData.images.map((post: any, index: number) => (
            <div
              key={index}
              className={`w-2 h-2  mx-auto rounded-full transition-all ${
                index === current - 1 ? "bg-blue-700 w-4" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
