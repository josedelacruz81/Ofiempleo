"use client"
import { BreadcrumbItem,Breadcrumbs as Bd } from "@nextui-org/breadcrumbs"

export const Breadcrumbs = () => {
  return (
    <Bd className="mx-auto">
      <BreadcrumbItem>Home</BreadcrumbItem>
      <BreadcrumbItem>Music</BreadcrumbItem>
      <BreadcrumbItem>Artist</BreadcrumbItem>
      <BreadcrumbItem>Album</BreadcrumbItem>
      <BreadcrumbItem>Song</BreadcrumbItem>
    </Bd>
  )
}
