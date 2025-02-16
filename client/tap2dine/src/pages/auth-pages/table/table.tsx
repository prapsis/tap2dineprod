import { Plus } from "lucide-react";
import { DataTable } from "../../../components/reusables/data-table";
import { Button } from "../../../components/ui/button";
import { columns } from "./column";
import { useFetchTables } from "../../../api/queries/table.query";
import useModalContext from "../../../hooks/useModalContext";
import TableFetchLoader from "../../../components/reusables/table-fetch-loader";

export default function TableTable() {
  const { openModal } = useModalContext();
  const { data ,isLoading } = useFetchTables();
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
            placeholder: "Search by Table Name...",
          },
          add: {
            node: (
              <Button
                onClick={() =>
                  openModal({
                    key: "ADD_TABLE",
                  })
                }
              >
                <Plus />
                Add Table
              </Button>
            ),
          },
        }}
      />
    </div>
  );
}
