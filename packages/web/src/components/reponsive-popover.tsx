import { cn } from "cn";
import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "./ui/dropdown-menu";
import {useMediaQuery} from '@uidotdev/usehooks'
import { createContext, useContext, useState, type ComponentProps } from "react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const ResponsivePopoverContext = createContext<{ close: () => void, display: 'popover' | 'drawer' }>({close: () => null, display: 'popover'})

export function ResponsivePopover(props: ComponentProps<typeof Drawer & typeof Popover>) {
    const isMobile = useMediaQuery('only screen and (max-width : 40rem)')
    const [open, setOpen] = useState(false)

    return <ResponsivePopoverContext.Provider value={{ close: () => setOpen(false), display: isMobile ? 'drawer' : 'popover' }}>
        {isMobile ? <Drawer showSwipeHandle {...props as ComponentProps<typeof Drawer>} open={open} onOpenChange={setOpen}/> : <Popover {...props} open={open} onOpenChange={setOpen}/>}
    </ResponsivePopoverContext.Provider>
}

export function ResponsivePopoverTrigger(props: ComponentProps<typeof DrawerTrigger & typeof PopoverTrigger>) {
    const context = useContext(ResponsivePopoverContext)
    return context.display === "drawer" ? <DrawerTrigger {...props as ComponentProps<typeof DrawerTrigger>}/> : <PopoverTrigger {...props}/> 
}

export function ResponsivePopoverContent(props:  ComponentProps<typeof DrawerContent & typeof PopoverContent>) {
    const context = useContext(ResponsivePopoverContext)
    return context.display === 'drawer' ? 
        <DrawerContent {...props as ComponentProps<typeof DrawerContent>}/> : 
        <PopoverContent {...props}/>
}
