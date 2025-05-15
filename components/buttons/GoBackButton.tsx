"use client";
import React from 'react'
import { useRouter } from 'next/navigation';
import { Button } from '@nextui-org/react';
import { HiOutlineX } from 'react-icons/hi';
export const GoBackButton = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  }

  return (
    <Button onPress={handleBack} className="absolute right-0 top-0" variant="light" size="sm" isIconOnly radius="full">
    <HiOutlineX />
  </Button>
  )
}
