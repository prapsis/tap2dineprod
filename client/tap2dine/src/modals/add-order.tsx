import { Minus, Plus } from "lucide-react";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import { useState } from "react";
import useModalContext from "../hooks/useModalContext";
import { Avatar } from "../components/reusables/avatar";
import { ModalType } from "../types/modal.types";
import { useOrderContext } from "../hooks/useOrderContext";

export default function AddOrder({ data: dish }: ModalType<"ADD_ORDER">) {
  const { closeModal } = useModalContext();
  const {dispatch} = useOrderContext();
  const [quantity, setQuantity] = useState(1);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>(
    dish?.dish_ingredients?.map((ing) => ing.ingredient.id) || []
  );
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  const handleIngredientToggle = (ingredientId: string) => {
    setSelectedIngredients((prev) =>
      prev.includes(ingredientId)
        ? prev.filter((id) => id !== ingredientId)
        : [...prev, ingredientId],
    );
  };

  const handleAddonToggle = (addonId: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId)
        ? prev.filter((id) => id !== addonId)
        : [...prev, addonId],
    );
  };

  const totalPrice = (
    (Number(dish?.price) || 0) * quantity +
    selectedAddons.reduce((sum, addonId) => {
      const addon = dish?.add_ons?.find((a) => a.id === addonId);
      return sum + (addon ? Number(addon.price) * quantity : 0);
    }, 0)
  ).toFixed(2);

  const handleAddToOrder = () => {
    const orderItem = {
      dishId: dish?.id || "",
      name: dish?.name || "",
      quantity: quantity,
      price: Number(dish?.price),
      totalPrice:Number(totalPrice),
      ingredients: dish?.dish_ingredients?.map(ing => ({
        id: ing.ingredient.id,
        name: ing.ingredient.name,
        include: selectedIngredients.includes(ing.ingredient.id)
      })) || [],
      addons: dish?.add_ons?.filter(addon => selectedAddons.includes(addon.id))
        .map(addon => ({
          id: addon.id,
          name: addon.name,
          price: Number(addon.price)
        })) || [],
    };

    dispatch({
      type: "ADD_ITEM",
      payload: orderItem
    });

    closeModal("ADD_ORDER");
  };

  return (
    <>
      <div className="grid gap-4 py-4">
        <div className="flex items-center gap-4">
          <Avatar name={dish?.name} />
          <p className="capitalize font-semibold">{dish?.name}</p>
        </div>
        <p className="text-gray-600">{dish?.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold">Rs. {(Number(dish?.price).toFixed(2) || 0)}</span>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-xl font-semibold">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity(quantity + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Customize Ingredients</h3>
          <div className="space-y-2">
            {dish?.dish_ingredients?.length ? (
              dish.dish_ingredients.map((ing) => (
                <div key={ing.ingredient.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`ingredient-${ing.ingredient.id}`}
                    checked={selectedIngredients.includes(ing.ingredient.id)}
                    onCheckedChange={() => handleIngredientToggle(ing.ingredient.id)}
                  />
                  <label
                    htmlFor={`ingredient-${ing.ingredient.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {ing.ingredient.name}
                  </label>
                </div>
              ))
            ) : (
              <p className="text-sm italic text-gray-600">No ingredients available.</p>
            )}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Add-ons</h3>
          <div className="space-y-2">
            {dish?.add_ons?.length ? (
              dish.add_ons.map((addon) => (
                <div key={addon.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`addon-${addon.id}`}
                      checked={selectedAddons.includes(addon.id)}
                      onCheckedChange={() => handleAddonToggle(addon.id)}
                    />
                    <label
                      htmlFor={`addon-${addon.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {addon.name}
                    </label>
                  </div>
                  <span className="text-sm font-semibold">
                    Rs. {Number(addon.price).toFixed(2)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm italic text-gray-600">No add-ons available.</p>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center pt-4 border-t">
          <span className="text-lg font-semibold">Total:</span>
          <span className="text-2xl font-bold">Rs. {totalPrice}</span>
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => closeModal("ADD_ORDER")}>
          Cancel
        </Button>
        <Button
          onClick={handleAddToOrder}
        >
          Add to Order
        </Button>
      </div>
    </>
  );
}
