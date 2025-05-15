import { Spinner } from "@nextui-org/react";

export default function Loading() {
  return (
    <div className="min-h-96 flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}
