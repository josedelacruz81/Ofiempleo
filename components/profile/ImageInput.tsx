"use client";
import { InputFile } from "@/components/littleComponents/InputFile";
import { useState } from "react";
import { useToast } from "../shadCn/useToast";
import { Spinner } from "@nextui-org/react";
export default function ImageInput({
  children,
  userId,
  className,
  onImageChange,
}: {
  children: React.ReactNode;
  userId: string;
  className?: string;
  onImageChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = Array.from(e.target.files || []);

      if (onImageChange) onImageChange(e);
      const imagesData = files.map((file: File) => {
        return new Promise<string | ArrayBuffer | null>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve(reader.result);
          };
          reader.onerror = (error) => {
            reject(error);
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(imagesData)
        .then(async (imagesDataURL) => {
          const validImage = imagesDataURL.filter(
            (url): url is string => typeof url === "string"
          );

          const formData = new FormData();
          formData.append("userId", userId);
          formData.append("file", validImage[0]);
          const res = await fetch(`/api/user/uploadImage`, {
            method: "POST",
            body: formData,
          });
          const data = await res.json();
          toast({
            title: "Cambios guardados",
            description: "La imagen de perfil fue cambiada con exito",
          });
        })
        .catch((error) => {
          console.error("Error al cargar las imágenes:", error);
        });
    } catch (error) {
      console.error("Error al cargar las imágenes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <InputFile
      className={`relative ${className}`}
      accept={"image/png, image/jpeg, image/jpg, image/webp"}
      onChange={handleChange}
    >
      {isLoading && (
        <Spinner size="sm" className="absolute z-50 -top-2 -right-6" />
      )}
      {children}
    </InputFile>
  );
}
