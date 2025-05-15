import { Spinner } from "@nextui-org/react";

export default function Loading() {
  return (
    <main className="w-full h-screen bg-white">
      <div className="flex flex-col items-center justify-center h-full">
        <Spinner size="lg" color="primary" />
      </div>
    </main>
  );
}
