import { PhoneCall } from "lucide-react";
import { Button } from "../../../components/ui/button";
import DishCard from "./_components/dish-card";
import { toast } from "sonner";
import { DIGITAL_MENU_LOGO } from "../../../constants/images";
import PoweredBy from "./_components/powered-by";
import { useFetchDishes } from "../../../api/queries/dish.query";
import { useFetchCategories, useFetchDishesByCategory } from "../../../api/queries/category.query";
import { TCategoryResopnseType, TDishResponseType, TTableResponseType } from "../../../types/response.types";
import { useEffect, useState } from "react";
import OrderSheet from "./_components/order-sheet";
import { useParams } from "react-router";
import { useFetchTables } from "../../../api/queries/table.query";
import { useOrderContext } from "../../../hooks/useOrderContext";

export default function DigitalMenu() {
  const {tableId} = useParams();
  const {dispatch} = useOrderContext();
  const [isValidTable, setIsValidTable] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<TCategoryResopnseType | null>(null);
  const { data: allDishesData,isLoading:isLoadingDishes } = useFetchDishes();
  const { data: categoriesData,isLoading:isLoadingCategories } = useFetchCategories();
  const { data: dishesByCategory } = useFetchDishesByCategory({
    categoryId: selectedCategory?.id || '',
  });
  const { data: tables, isLoading: isLoadingTables } = useFetchTables();

  useEffect(()=>{
    if(isValidTable){
      dispatch({type:"SET_TABLE",payload:{tableId:tableId || "0"}});
    }
  },[isValidTable])
  
  useEffect(() => {
    if (tables && tableId) {
      const tableExists = tables.some((table: TTableResponseType) => String(table.id) === tableId);
      setIsValidTable(tableExists);
    }
  }, [tables, tableId]);


  const isLoading = isLoadingDishes || isLoadingCategories || isLoadingTables;

  const handleCategoryClick = (category: TCategoryResopnseType) => {
    setSelectedCategory(category);
  };

  const displayedDishes = selectedCategory ? dishesByCategory : allDishesData;
  return (
    <div className="w-full min-h-screen bg-primary flex justify-center">
    {isLoading ? (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full size-10 border-b-2 border-white"></div>
      </div>
    ) : (
      <div className="w-full max-w-md min-h-screen p-4 bg-background relative">
        <PoweredBy />
        
        {/* Logo section */}
        <div className="flex flex-col items-center justify-center pt-4">
          <div className="size-16 sm:size-20 object-contain">
            <img src={DIGITAL_MENU_LOGO} alt="LOGO" className="w-full h-full object-contain" />
          </div>
          <p className="text-base sm:text-lg text-stone-950 font-medium pt-2 text-center">
            Motomania Cafe & Workshop
          </p>
        </div>

        {/* Sticky header with actions and categories */}
        <div className="sticky top-0 bg-background pt-4 pb-2 z-10">
          {/* Action buttons */}
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="secondary"
              className="text-white text-sm"
              onClick={() =>
                toast("Waiter called.", {
                  position: "top-right",
                  duration: 3000,
                  description: "Please wait. A waiter will be at your service soon.",
                })
              }
            >
              <PhoneCall className="size-4 mr-2" />
              Call Waiter
            </Button>
            <OrderSheet />
          </div>

          {/* Categories */}
          <div className="mt-4 overflow-x-auto pb-2">
            <div className="flex gap-2 min-w-min py-2 px-1">
              <div
                onClick={() => setSelectedCategory(null)}
                className={`px-3 py-1.5 rounded-full shrink-0 transition-all duration-200 shadow-sm hover:shadow-md 
                  ${!selectedCategory
                    ? 'bg-primary text-white ring-2 ring-primary ring-offset-2'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  } 
                  cursor-pointer select-none active:scale-95`}
              >
                <p className="text-nowrap text-sm font-medium">All Dishes</p>
              </div>
              {categoriesData?.map((category: TCategoryResopnseType, i: number) => (
                <div
                  key={i}
                  onClick={() => handleCategoryClick(category)}
                  className={`px-3 py-1.5 rounded-full shrink-0 transition-all duration-200 shadow-sm hover:shadow-md
                    ${selectedCategory?.id === category.id
                      ? 'bg-primary text-white ring-2 ring-primary ring-offset-2'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    } 
                    cursor-pointer select-none active:scale-95`}
                >
                  <p className="text-nowrap text-sm font-medium">{category.name}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Selected category heading */}
          <p className="text-lg sm:text-xl font-semibold mt-4">
            {selectedCategory ? selectedCategory.name : 'All Dishes'}
          </p>
        </div>

        {/* Content section */}
        <div className="mt-4">
          {!isValidTable ? (
            <div className="flex flex-col items-center justify-center p-8">
              <PhoneCall className="size-12 text-red-500 mb-2" />
              <p className="text-center font-semibold text-lg">
                No such table found
              </p>
            </div>
          ) : displayedDishes?.length === 0 ? (
            <div className="flex items-center justify-center p-8">
              <p className="text-center font-semibold text-lg">
                No dishes found
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-4">
              {displayedDishes?.map((dish: TDishResponseType) => (
                <DishCard key={dish.id} data={dish} />
              ))}
            </div>
          )}
        </div>
      </div>
    )}
  </div>
  );
}

