import { DataTable, type DataTableFeatures } from "@/components/data-table"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createColumnHelper } from "@tanstack/react-table"
import type { ListType } from "api/types"
import { useLoaderData } from "react-router"

const columnHelper = createColumnHelper<DataTableFeatures, ListType>()
 
export const columns = columnHelper.columns([
    columnHelper.accessor("id", {
    header: "Identifiant",
  }),
  columnHelper.accessor("name", {
    header: "Name",
  }),
  columnHelper.accessor("createdAt", {
    header: "Created at",
  }),
])

export function ListsPage() {
    const data = useLoaderData()

    return <div className="space-y-8">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(20ch,1fr))] gap-4">
        <Card>
          <CardHeader>
            <CardDescription>Utilisateurs total</CardDescription>
            <CardTitle>200</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Utilisateurs inscrits</CardDescription>
            <CardTitle></CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Utilisateurs actifs</CardDescription>
            <CardTitle></CardTitle>
          </CardHeader>
        </Card>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
}