import { Link } from "@tanstack/react-router";
import type { ComponentProps, ReactElement } from "react";
import { Button } from "./ui/button";
import { LucideArrowLeft } from "lucide-react";

export function BackButton({children, ...props}: ComponentProps<typeof Link> & {children: ReactElement|string}) {
    return <Button render={<Link {...props}/>} variant="link" size="none" nativeButton={false}>
        <LucideArrowLeft/>
        {children}
    </Button>
}