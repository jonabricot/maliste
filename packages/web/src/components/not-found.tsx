import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Link } from "@tanstack/react-router";
import { LucideArrowLeft } from "lucide-react";

export function NotFound() {
    return <Empty>
        <EmptyHeader>
            <EmptyTitle>Toutes nos excuses, nous ne trouvons pas cette page</EmptyTitle>    
            <EmptyDescription>La page demandée n'est pas disponible. Comment êtes-vous arrivés ici ?</EmptyDescription> 
        </EmptyHeader>   
        <EmptyContent>
            <Button render={<Link to={"/"}/>} variant="link" nativeButton={false}>
                <LucideArrowLeft/> Retour à l'accueil
            </Button>
        </EmptyContent>
    </Empty>
}