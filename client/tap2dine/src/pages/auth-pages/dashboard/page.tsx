import { useFetchDishes } from "../../../api/queries/dish.query";
import { useFetchIngredients } from "../../../api/queries/ingredients.query";
import { useFetchOrders } from "../../../api/queries/orders.query";
import PageHeader from "../../../components/reusables/page-header";
import { DailyStats } from "./_components/daily-stats";
import IngredientStock from "./_components/inventory";
import { MenuManagement } from "./_components/menu-management";
import { OrdersOverview } from "./_components/orders-overview";

export default function Dashboard() {
  const { data: dishData , isLoading:dishFetching } = useFetchDishes();
  const { data: orders, isLoading:ordersFetching } = useFetchOrders();
  const {data: ingredients, isLoading:ingredientsFetching} = useFetchIngredients();
  console.log(ingredients)
  const isLoading = dishFetching || ordersFetching || ingredientsFetching
  return (
    <div>
      <PageHeader title="Dashboard" />
      <div>
        {
          isLoading ? (
            <div className="space-y-4">
              <div className="flex space-x-4">
                  <div className="h-48 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-48 w-full bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="flex space-x-4">
                  <div className="h-48 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-48 w-full bg-gray-200 rounded animate-pulse" />
                </div>
                <div>
                <div className="h-72 w-full bg-gray-200 rounded animate-pulse" />
                </div>
            </div>
          ) : (
            <>
            <div className="flex gap-4">
          {
            orders &&
            <>
              <DailyStats data={orders} />
              <OrdersOverview data={orders} />
            </>
          }
        </div>
          
        <div className="mt-4">
          <IngredientStock data={ingredients||[]}/>
        </div>
        <div className="mt-4">
          {
            dishData &&
            <MenuManagement data={dishData} />
          }
        </div>
        </>
          )
        }
        
      </div>
    </div>
  )
}
