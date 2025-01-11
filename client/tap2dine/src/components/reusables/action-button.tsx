import { Pencil, Trash } from "lucide-react";
import { Button } from "../ui/button";
import useModalContext from "../../hooks/useModalContext";
import { TDeleteItem } from "../../api/mutations/delete.mutation";
import { TModalKeys } from "../../modals/data";
import { useNavigate } from "react-router";

type TActionButton<T> = {
  row: T;
  edit: {
    key: TModalKeys;
    onPageUrl?: string;
  };
  delete: {
    type: TDeleteItem["type"];
  };
};

export function ActionButton<T extends { id: string }>({
  row,
  edit,
  delete: deleteProps,
}: TActionButton<T>) {
  const { openModal } = useModalContext();
  const navigate = useNavigate();
  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="secondary"
        className="text-white"
        onClick={() => {
          if (edit.onPageUrl) {
            navigate(`${edit.onPageUrl}/${row.id}`);
          } else {
            openModal({
              key: edit.key,
              initiatorName: row.id,
              data: row,
            });
          }
        }}
      >
        <Pencil />
      </Button>
      <Button
        size="sm"
        variant="destructive"
        onClick={() =>
          openModal({
            key: "DELETE_ITEM",
            initiatorName: row.id,
            data: { type: deleteProps.type },
          })
        }
      >
        <Trash />
      </Button>
    </div>
  );
}
