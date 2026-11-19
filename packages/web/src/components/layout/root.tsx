import { useMemo, type ReactElement } from "react";
import { Outlet, useMatches, type UIMatch } from "react-router";

export function RootLayout() {
    const matches = useMatches() as UIMatch<unknown, {breadcrumb?: ReactElement}>[]
    const breadcrumbs = useMemo(() => matches.filter(m => m.handle && m.handle.breadcrumb).map(m => m.handle.breadcrumb), [matches])

    return <div className="container mx-auto p-4 space-y-12">
        {breadcrumbs.length > 0 && <div className="flex gap-1">{breadcrumbs.map((component, index) => <>{index > 0 && "/"}{component}</>)}</div>}
        <Outlet/>
    </div>
}