import { Skeleton } from "@nextui-org/react"

export default function Loading() {
  return (
    <div className="flex flex-col items-center gap-6">
    <div>
      <h3 className="text-lg text-center">Bienvenido </h3>
      <p className="text-gray-400 text-sm text-center">
        Ingresa tus datos
      </p>
    </div>
    <div className="w-full flex flex-col gap-4">
      <Skeleton className="h-10 w-full rounded-lg"/>
      <Skeleton className="h-5 w-full rounded-lg"/>
      <Skeleton className="h-5 w-full rounded-lg"/>
      <Skeleton className="h-10 w-full rounded-lg"/>
    </div>
   
  </div>
  )
}
