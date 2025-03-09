import { useFetchIngredients } from "../../../../api/queries/ingredients.query";


import PageHeader from "../../../../components/reusables/page-header";
import { Link, useParams } from "react-router";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useFetchCategories } from "../../../../api/queries/category.query";
import { useFetchAddons } from "../../../../api/queries/addons.query";
import { useFetchSingleDish } from "../../../../api/queries/dish.query";
import EditDishForm from "./edit-dish-form";

export default function EditDish() {
  const { id: dishId } = useParams();
  const { data: dishData, isFetching: isDishLoading } = useFetchSingleDish({
    queryParams: dishId!,
  });
  const { data: ingredientsData, isFetching: isIngredientsLoading } =
    useFetchIngredients();
  const { data: addonsData, isFetching: isAddonsLoading } = useFetchAddons();
  const { data: categories, isFetching: isCategoriesLoading } =
    useFetchCategories();

  // const [ingredients, setIngredients] = useState<
  //   {
  //     label: string;
  //     value: string;
  //     icon?: React.ComponentType<{ className?: string }>;
  //   }[]
  // >([]);
  // const [addons, setAddons] = useState<
  //   {
  //     label: string;
  //     value: string;
  //     icon?: React.ComponentType<{ className?: string }>;
  //   }[]
  // >([]);
  console.log(ingredientsData);
  console.log(dishData);
  const isLoading =
    isDishLoading ||
    isIngredientsLoading ||
    isAddonsLoading ||
    isCategoriesLoading;


  if (isLoading) {
    return (
      <div className="w-full h-[50vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-gray-500">Loading dish details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-4">
        <Link to="/menu">
          <ChevronLeft className="text-primary border rounded-md" />
        </Link>
        <PageHeader title="Edit Dish" />
      </div>
      <div className="max-w-2xl border rounded-md p-4">
        {
        dishData && ingredientsData && addonsData && categories &&
        <EditDishForm 
          dishId={dishId || ""}
          dishData={dishData}
          categories={categories}
          addons={addonsData}
          ingredients={ingredientsData}
        />
        }
      </div>
    </div>
  );
}
