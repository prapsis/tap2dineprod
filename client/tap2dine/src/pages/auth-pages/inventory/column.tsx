import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../../../components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "../../../components/ui/checkbox";
import { ActionButton } from "../../../components/reusables/action-button";
import { TIngredientResponseType } from "../../../types/response.types";

export const columns: ColumnDef<TIngredientResponseType>[] = [
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
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "quantity_available",
    header: "Quantity available(in gm/ml)",
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <ActionButton<TIngredientResponseType>
          row={row.original}
          edit={{
            key: "EDIT_INGREDIENT",
          }}
          delete={{
            type: "ingredient",
          }}
        />
      );
    },
  },
];
