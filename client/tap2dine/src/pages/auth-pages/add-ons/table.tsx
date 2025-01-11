import { DataTable } from "../../../components/reusables/data-table";
import { Button } from "../../../components/ui/button";
import { columns } from "./column";
import { Plus } from "lucide-react";
import useModalContext from "../../../hooks/useModalContext";
import { useFetchAddons } from "../../../api/queries/addons.query";

export default function AddonTable() {
  const { openModal } = useModalContext();

  const { data } = useFetchAddons();
  return (
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
              <Button onClick={() => openModal({ key: "ADD_ADDON" })}>
                <Plus />
                Add Addon
              </Button>
            ),
          },
        }}
      />
    </div>
  );
}
