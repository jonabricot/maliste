import { cn } from "cn";
import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "./ui/dropdown-menu";
import {useMediaQuery} from '@uidotdev/usehooks'
import { createContext, useContext, useState, type ComponentProps } from "react";
import { Button } from "./ui/button";

const ResponsiveDropdownContext = createContext<{ close: () => void, display: 'dropdown' | 'drawer' }>({close: () => null, display: 'dropdown'})

export function ResponsiveDropdownMenu(props: ComponentProps<typeof Drawer & typeof DropdownMenu>) {
    const isMobile = useMediaQuery('only screen and (max-width : 40rem)')
    const [open, setOpen] = useState(false)

    return <ResponsiveDropdownContext.Provider value={{ close: () => setOpen(false), display: isMobile ? 'drawer' : 'dropdown' }}>
        {isMobile ? <Drawer showSwipeHandle {...props as ComponentProps<typeof Drawer>} open={open} onOpenChange={setOpen}/> : <DropdownMenu {...props} open={open} onOpenChange={setOpen}/>}
    </ResponsiveDropdownContext.Provider>
}

export function ResponsiveDropdownMenuTrigger(props: ComponentProps<typeof DrawerTrigger & typeof DropdownMenuTrigger>) {
    const context = useContext(ResponsiveDropdownContext)
    return context.display === "drawer" ? <DrawerTrigger {...props as ComponentProps<typeof DrawerTrigger>}/> : <DropdownMenuTrigger {...props}/> 
}

export function ResponsiveDropdownMenuContent(props:  ComponentProps<typeof DrawerContent & typeof DropdownMenuContent>) {
    const context = useContext(ResponsiveDropdownContext)
    return context.display === 'drawer' ? 
        <DrawerContent {...props as ComponentProps<typeof DrawerContent>}>
            <div className={cn("grid p-2", props.className)}>{props.children}</div>
        </DrawerContent> : 
        <DropdownMenuContent {...props} className={cn("w-auto grid p-2", props.className)}/>
}

export function ResponsiveDropdownMenuItem(props: ComponentProps<typeof Button>) {
    const context = useContext(ResponsiveDropdownContext)

    return <Button variant="ghost"  {...props} className={cn("text-left justify-start", props.className)} onClick={(e) =>{context.close(); props.onClick && props.onClick(e)}}/>
}