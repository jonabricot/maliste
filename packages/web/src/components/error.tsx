import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Link } from "@tanstack/react-router";
import { LucideArrowLeft } from "lucide-react";

export function Error() {
    return <Empty>
        <EmptyHeader>
            <EmptyTitle>Toutes nos excuses, une erreur est survenue.</EmptyTitle>    
            <EmptyDescription>Veuillez réessayer ultérieurement.</EmptyDescription> 
        </EmptyHeader>   
        <EmptyContent>
            <Button render={<Link to={"/"}/>} variant="link" nativeButton={false}>
                <LucideArrowLeft/> Retour à l'accueil
            </Button>
        </EmptyContent>
    </Empty>
}