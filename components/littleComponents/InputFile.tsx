'use client';
import { useRef } from "react";

export const InputFile = ({
  children,
  onChange,
  className,
  ...rest
}: {
  children: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  [key: string]: any;
}) => {
  const fileInput: React.RefObject<HTMLInputElement> = useRef(null);
  const openFileInput = () => {
    fileInput?.current?.click();
  };

  return (
    <div onClick={openFileInput} className={`${className} cursor-pointer`}>
      {children}
      <input
        {...rest}
        type="file"
        className="hidden"
        onChange={onChange}
        ref={fileInput}
      />
    </div>
  );
};
