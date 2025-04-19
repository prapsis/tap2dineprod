import { Avatar } from "../../../../components/reusables/avatar";
import { Button } from "../../../../components/ui/button";
import useModalContext from "../../../../hooks/useModalContext";
import { TDishResponseType } from "../../../../types/response.types";

type TDishCardProps = {
  data:TDishResponseType
}
export default function DishCard({data}:TDishCardProps) {
  const { openModal } = useModalContext();
  const isOutOfStock = data?.dish_ingredients?.some(ing => ing.quantity_required > ing.ingredient.quantity_available);

  return (
    <div className="bg-background border rounded-md p-2">
      <div className="w-20 h-20 rounded-full border-2 border-secondary overflow-hidden">
        <Avatar name={data?.name} size="80px" />
      </div>
      <div>
        <div className="flex items-center justify-between">
        <p className="font-medium text-lg">{data?.name}</p>
        <p className="font-light text-sm">{data?.category?.name}</p>
        </div>
        <p className="break-all line-clamp-1 text-sm text-gray-600 capitalize">{data.description}</p>
        <p className="font-light">Rs. {data?.price}</p>
      </div>
      <Button
        variant="destructive"
        className="w-full mt-2"
        onClick={() => openModal({ key: "ADD_ORDER", data: data })}
        disabled={isOutOfStock}
      >
        {isOutOfStock ? "Out of Stock" : "Order Now"}
      </Button>
    </div>
  );
}
