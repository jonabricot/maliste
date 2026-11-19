import { DataTable, type DataTableFeatures } from "@/components/data-table"
import { createColumnHelper } from "@tanstack/react-table"
import type { User } from "better-auth"
import { useLoaderData } from "react-router"

const columnHelper = createColumnHelper<DataTableFeatures, User>()
 
export const columns = columnHelper.columns([
    columnHelper.accessor("id", {
    header: "Identifiant",
  }),
  columnHelper.accessor("email", {
    header: "Email",
  }),
  columnHelper.accessor("name", {
    header: "Name",
  }),
  columnHelper.accessor("createdAt", {
    header: "Created at",
  }),
])

export function UsersPage() {
    const data = useLoaderData()
    return <DataTable columns={columns} data={data} />
}