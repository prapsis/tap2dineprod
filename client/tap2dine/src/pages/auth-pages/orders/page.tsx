import { Plus } from "lucide-react";
import PageHeader from "../../../components/reusables/page-header";
import { Button } from "../../../components/ui/button";
import SingleOrderCard from "./_components/single-order-card";
import { useNavigate } from "react-router";
import { useFetchOrders } from "../../../api/queries/orders.query";
import { TOrderResponseType } from "../../../types/response.types";

export default function Orders() {
  const navigate = useNavigate();
  const { data, isLoading } = useFetchOrders();

  return (
    <div className="container mx-auto px-4">
      <PageHeader title="Orders" />
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="font-medium text-lg">Current Orders</p>
          <Button className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add New Order
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div 
                key={index}
                className="w-full h-60 border rounded-md animate-pulse bg-gray-100"
              />
            ))}
          </div>
        ) : data?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No orders found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {data?.map((item: TOrderResponseType, i: number) => (
              <div key={item.id || i} className="w-full">
                <SingleOrderCard 
                  data={item} 
                  onClick={() => navigate(`${item.id || i}`)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}