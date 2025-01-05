import { useDeleteItem } from "../api/mutations/delete.mutation";
import { Button } from "../components/ui/button";
import { DELETE } from "../constants/images";
import useModalContext from "../hooks/useModalContext";
import { ModalType } from "../types/types";

export default function DeleteModal({initiatorName}:ModalType) {
  const {closeModal} = useModalContext();
  return (
    <div>
        <p>Are you sure you want to delete this item?</p>
        <div className="flex justify-center items-center">
          <img src={DELETE} alt="delete illustration girl" width={200}/>
        </div>
        <div className='flex gap-3'>
            <Button variant={"destructive"} className="w-full mt-4" onClick={()=>useDeleteItem({initiatorName: initiatorName || "", type:"category"})}>Delete</Button>
            <Button variant="ghost" className="w-full mt-4" onClick={()=>closeModal("DELETE_ITEM")}>Cancel</Button>
        </div>
    </div>
  )
}
