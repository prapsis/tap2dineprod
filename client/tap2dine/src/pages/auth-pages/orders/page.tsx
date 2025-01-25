import PageHeader from "../../../components/reusables/page-header";
import SingleOrderCard from "./_components/single-order-card";
import { useNavigate } from "react-router";
import { useFetchOrders } from "../../../api/queries/orders.query";
import { TOrderResponseType } from "../../../types/response.types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';

export default function Orders() {
  const navigate = useNavigate();
  const { data, isLoading } = useFetchOrders();

  const checkedOutOrders = data?.filter((order:any) => order?.checked_out) || []; //TODO FIX TYPES
  const pendingOrders = data?.filter((order:any) => !order?.checked_out) || [];

  const OrderGrid = ({ orders }: { orders: TOrderResponseType[] }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {orders.map((item: TOrderResponseType, i: number) => (
        <div key={item.id || i} className="w-full">
          <SingleOrderCard 
            data={item} 
            onClick={() => navigate(`${item.id || i}`)}
          />
        </div>
      ))}
    </div>
  );

  const LoadingGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div 
          key={index}
          className="w-full h-60 border rounded-md animate-pulse bg-gray-100"
        />
      ))}
    </div>
  );

  const EmptyState = () => (
    <div className="text-center py-12">
      <p className="text-gray-500">No orders found</p>
    </div>
  );

  return (
    <div className="container mx-auto px-4">
      <PageHeader title="Orders" />
      
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="pending" className="flex gap-2">
            Pending Orders
            {pendingOrders.length > 0 && (
              <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs">
                {pendingOrders.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex gap-2">
            Completed Orders
            {checkedOutOrders.length > 0 && (
              <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs">
                {checkedOutOrders.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <p className="font-medium text-lg">Pending Orders</p>
            </div>
            
            {isLoading ? (
              <LoadingGrid />
            ) : pendingOrders.length === 0 ? (
              <EmptyState />
            ) : (
              <OrderGrid orders={pendingOrders} />
            )}
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <p className="font-medium text-lg">Completed Orders</p>
            </div>
            
            {isLoading ? (
              <LoadingGrid />
            ) : checkedOutOrders.length === 0 ? (
              <EmptyState />
            ) : (
              <OrderGrid orders={checkedOutOrders} />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}