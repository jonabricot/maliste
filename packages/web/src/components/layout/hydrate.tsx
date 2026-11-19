import { cn } from 'cn'
import type { ReactElement } from 'react'
import type { useQuery } from 'react-query'

export function Hydrate({children, fallback, query}: {children?: ReactElement, fallback?: ReactElement, query: ReturnType<typeof useQuery>}) {
    return <div className="grid">
        <div className={cn("transition-all col-span-full row-span-full opacity-0", query.data !== undefined && "opacity-100")}>{query.data !== undefined && children}</div>
        <div className={cn("transition-all col-span-full row-span-full pointer-events-none", query.data !== undefined && "opacity-0")}>{fallback}</div>
    </div>
}