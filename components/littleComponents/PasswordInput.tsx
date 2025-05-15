"use client"
import { Input, InputProps } from "@nextui-org/react";
import { useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";

export const PasswordInput:React.FC<InputProps> = ({ ...rest }) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <Input
      endContent={
        <button
          className="focus:outline-none"
          type="button"
          onClick={toggleVisibility}
          aria-label="toggle password visibility"
        >
          {isVisible ? (
            <HiEyeOff className="text-2xl text-default-400 pointer-events-none" />
          ) : (
            <HiEye className="text-2xl text-default-400 pointer-events-none" />
          )}
        </button>
      }
      type={isVisible ? "text" : "password"}
      {...rest}
    />
  );
};
