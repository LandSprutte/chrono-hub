import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <Skeleton className="w-1/2 h-8" />
      <Skeleton className="w-1/2 h-6" />
      <Skeleton className="w-2/3 h-[140px]" />
      <Skeleton className="w-full h-[248px]" />
    </div>
  );
}
