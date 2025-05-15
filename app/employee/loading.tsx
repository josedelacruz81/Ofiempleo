import { Card, Spinner } from "@nextui-org/react";

export default function Loading() {
  return (
    <Card className="w-full h-screen bg-white my-5">
      <div className="flex flex-col items-center justify-center h-full">
        <Spinner size="lg" color="primary" />
      </div>
    </Card>
  );
}
