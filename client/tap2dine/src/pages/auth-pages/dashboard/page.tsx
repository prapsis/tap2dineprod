import { useFetchDishes } from "../../../api/queries/dish.query";
import { useFetchOrders } from "../../../api/queries/orders.query";
import PageHeader from "../../../components/reusables/page-header";
import { DailyStats } from "./_components/daily-stats";
import { MenuManagement } from "./_components/menu-management";
import { OrdersOverview } from "./_components/orders-overview";

export default function Dashboard() {
  const { data: dishData } = useFetchDishes();
  const { data: orders } = useFetchOrders();
  return (
    <div>
      <PageHeader title="Dashboard" />
      <div>
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
          {
            dishData &&
            <MenuManagement data={dishData} />
          }
        </div>
      </div>
    </div>
  )
}
