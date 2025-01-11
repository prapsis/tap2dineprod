import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../../../components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "../../../components/ui/checkbox";
import { ActionButton } from "../../../components/reusables/action-button";
import { TDishResponseType } from "../../../types/response.types";

export const columns: ColumnDef<TDishResponseType>[] = [
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
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "category.name",
    header: "Category",
  },
  {
    accessorKey: "ingredients",
    header: "Ingredients",
    cell: ({ row }) =>
      row.original.ingredients
        .map((item) => <span>{item.name},&nbsp;</span>)
        .slice(0, 4),
  },
  {
    accessorKey: "add_ons",
    header: "Add ons",
    cell: ({ row }) =>
      row.original.add_ons
        .map((item) => <span>{item.name},&nbsp;</span>)
        .slice(0, 4),
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <ActionButton<TDishResponseType>
          row={row.original}
          edit={{
            key: "EDIT_ADDON", //* THIS IS JUST A RANDOM KEY AS PROVIDING ONPAGEURL REDIRECTS TO A PAGE INSTEAD OF OPENING MODAL. NEED TO FIX THSI
            onPageUrl: "/menu/edit-dish",
          }}
          delete={{
            type: "dish",
          }}
        />
      );
    },
  },
];
