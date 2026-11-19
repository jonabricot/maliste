import { cn } from "cn";
import { Spinner } from "./ui/spinner";

export function Loader({loading}: {loading?: boolean}) {
    return <span className={cn("w-0 opacity-0 transition-all delay-0", loading && "w-4 opacity-100 delay-300")}>
        <Spinner/>
    </span>
}