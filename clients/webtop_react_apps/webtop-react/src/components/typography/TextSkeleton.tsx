import { Skeleton } from "@heroui/react";
import { ReactNode } from "react";

export default function TextSkeleton({ children }: { children?: ReactNode }) {
    return (
        <Skeleton className="text-skeleton rounded-lg flex-grow">
            <div>
                {children ? children : "Loading..."}
            </div>
        </Skeleton>
    )
}