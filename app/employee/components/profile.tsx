"use client";
import ImageInput from "@/components/profile/ImageInput";
import { capitalizeFirstLetter } from "@/lib/functions";
import { Avatar, Button } from "@nextui-org/react";
import { useState } from "react";
import { HiOutlineCamera } from "react-icons/hi";

export const ProfileImage = ({
  user,
  profileImage,
  setProfileImage,
}: {
  user: any;
  profileImage: string;
  setProfileImage: (url: string) => void;
}) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <ImageInput
        className="flex"
        onImageChange={handleImageChange}
        userId={user.id}
      >
   
        <Avatar
          isBordered
          color={profileImage ? "primary" : "danger"}
          src={profileImage}
          name={user.names}
          className="w-16 h-16"
        />
      </ImageInput>
      <div>
        <h3 className="text-gray-700">
          {capitalizeFirstLetter(`${user.names} ${user.lastname}`)}
        </h3>
        {!profileImage && (
          <p className="text-danger font-bold text-sm animate-pulse">
            Tienes que subir una foto de perfil
          </p>
        )}
      </div>
    </div>
  );
};
