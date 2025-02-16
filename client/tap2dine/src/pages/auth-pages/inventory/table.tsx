import { Plus } from "lucide-react";
import { DataTable } from "../../../components/reusables/data-table";
import { Button } from "../../../components/ui/button";
import { columns } from "./column";
import useModalContext from "../../../hooks/useModalContext";
import { useFetchIngredients } from "../../../api/queries/ingredients.query";
import TableFetchLoader from "../../../components/reusables/table-fetch-loader";

export default function InventoryTable() {
  const { openModal } = useModalContext();
  const { data,isLoading } = useFetchIngredients();
  return isLoading ? (
      <TableFetchLoader/>
    ) :(
    <div>
      <DataTable
        columns={columns}
        data={data || []}
        functions={{
          search: {
            name: "name",
            placeholder: "Search by name...",
          },
          add: {
            node: (
              <Button onClick={() => openModal({ key: "ADD_INGREDIENT" })}>
                <Plus />
                Add Ingredient
              </Button>
            ),
          },
        }}
      />
    </div>
  );
}
