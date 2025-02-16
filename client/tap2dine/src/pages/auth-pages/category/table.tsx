import { DataTable } from "../../../components/reusables/data-table";
import { Button } from "../../../components/ui/button";
import { columns } from "./column";
import { Plus } from "lucide-react";
import { useFetchCategories } from "../../../api/queries/category.query";
import useModalContext from "../../../hooks/useModalContext";
import TableFetchLoader from "../../../components/reusables/table-fetch-loader";

export default function CategoryTable() {
  const { openModal } = useModalContext();

  const { data,isLoading } = useFetchCategories();
  return isLoading ? (
      <TableFetchLoader/>
    ) : (
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
              <Button onClick={() => openModal({ key: "ADD_CATEGORY" })}>
                <Plus />
                Add Category
              </Button>
            ),
          },
        }}
      />
    </div>
  );
}
