import { ColumnDef } from '@tanstack/react-table'
import { Button } from '../../../components/ui/button'
import { ArrowUpDown, Pencil, Trash } from 'lucide-react'
import { Checkbox } from '../../../components/ui/checkbox'
import useModalContext from '../../../hooks/useModalContext'



export type CategoryColumns = {
    id: string
    name: string
    description: string
}

export const columns: ColumnDef<CategoryColumns>[] = [
    {
        id: "select",
        accessorKey: "id",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'name',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Name <ArrowUpDown className="ml-2 h-4 w-4" /></Button>
            )
        },
    },
    {
        accessorKey: 'description',
        header: 'Description',
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {

            return (
                <ActionButton<CategoryColumns> row={row.original}/>
            )
        },
    }
]

type TActionButton<T extends { id: string }> = {
    row: T
}

function ActionButton<T extends { id: string }>({ row }: TActionButton<T>) {
    const { openModal } = useModalContext();
    return (
        <div className="flex gap-2">
            <Button size="sm" variant="secondary" className="text-white">
                <Pencil />
            </Button>
            <Button
                size="sm"
                variant="destructive"
                onClick={() => openModal({ key: "DELETE_ITEM", initiatorName: row.id })}
            >
                <Trash />
            </Button>
        </div>
    )
}