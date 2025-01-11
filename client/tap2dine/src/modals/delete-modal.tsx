import { useQueryClient } from "@tanstack/react-query";
import { useDeleteItem } from "../api/mutations/delete.mutation";
import { Button } from "../components/ui/button";
import { DELETE } from "../constants/images";
import useModalContext from "../hooks/useModalContext";
import { ModalType } from "../types/modal.types";

export default function DeleteModal({
  initiatorName,
  data,
}: ModalType<"DELETE_ITEM">) {
  const { closeModal } = useModalContext();
  const queryClient = useQueryClient();
  const deleteHandler = useDeleteItem(queryClient);
  return (
    <div>
      <p>Are you sure you want to delete this item?</p>
      <div className="flex justify-center items-center">
        <img src={DELETE} alt="delete illustration girl" width={200} />
      </div>
      <div className="flex gap-3">
        <Button
          variant={"destructive"}
          className="w-full mt-4"
          onClick={() =>
            deleteHandler({
              initiatorName: initiatorName || "",
              type: data?.type,
            })
          }
        >
          Delete
        </Button>
        <Button
          variant="ghost"
          className="w-full mt-4"
          onClick={() => closeModal("DELETE_ITEM")}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
