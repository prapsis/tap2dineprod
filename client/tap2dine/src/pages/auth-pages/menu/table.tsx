import { Plus } from "lucide-react";
import { DataTable } from "../../../components/reusables/data-table";
import { Button } from "../../../components/ui/button";
import { columns } from "./column";
import { useFetchDishes } from "../../../api/queries/dish.query";
import { useNavigate } from "react-router";
import TableFetchLoader from "../../../components/reusables/table-fetch-loader";

export default function MenuTable() {
  const navigate = useNavigate();
  const { data,isLoading } = useFetchDishes();
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
              <Button onClick={() => navigate("/menu/add-dish")}>
                <Plus />
                Add Dishes
              </Button>
            ),
          },
        }}
      />
    </div>
  );
}
