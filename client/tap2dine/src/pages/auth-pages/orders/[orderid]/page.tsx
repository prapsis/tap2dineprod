import { useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";
import { Check, Plus, Clock, Coffee, AlertCircle } from "lucide-react";
import PageHeader from "../../../../components/reusables/page-header";
import { Button } from "../../../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../../../components/ui/card";
import { Badge } from "../../../../components/ui/badge";
import { useFetchSingleOrder } from "../../../../api/queries/orders.query";
import { TOrderResponseType } from "../../../../types/response.types";
import { useUpdateOrderStatusMutation } from "../../../../api/mutations/orders.mutation";

export type OrderStatus = "Pending" | "Preparing" | "Completed";

export default function SingleOrder() {
  const [order, setOrder] = useState<TOrderResponseType | null>(null);
  const { id: orderId } = useParams();
  const { data, isLoading } = useFetchSingleOrder({ orderId: String(orderId) });
  const { mutate } = useUpdateOrderStatusMutation({ orderId: String(orderId) });
  const navigate = useNavigate();

  useEffect(() => {
    if (data) setOrder(data);
  }, [orderId, data]);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "Preparing":
        return "bg-blue-500 hover:bg-blue-600";
      case "Completed":
        return "bg-green-500 hover:bg-green-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const getStatusAction = (currentStatus: OrderStatus) => {
    switch (currentStatus) {
      case "Pending":
        return {
          label: "Start Preparing",
          icon: <Coffee className="h-4 w-4 mr-2" />,
          nextStatus: "Preparing"
        };
      case "Preparing":
        return {
          label: "Mark Completed",
          icon: <Check className="h-4 w-4 mr-2" />,
          nextStatus: "Completed"
        };
      case "Completed":
        return null;
      default:
        return null;
    }
  };

  const handleStatusUpdate = (newStatus: OrderStatus) => {
    mutate({ status: newStatus });
  };
  // const calculateItemTotal = (item: TOrderResponseType['items'][0]) => {
  //   const dishTotal = Number(item.dish.price) * item.quantity;
  //   const addonsTotal = item.add_ons.reduce((sum, addon) => 
  //     sum + (Number(addon.price) * item.quantity), 0
  //   );
  //   return dishTotal + addonsTotal;
  // };

  // // Calculate order total
  // const orderTotal = order?.items?.reduce((total, item) => 
  //   total + calculateItemTotal(item), 0
  // ) ?? 0;

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3" />
        <div className="h-64 bg-gray-200 rounded" />
      </div>
    );
  }

  const statusAction = order?.status ? getStatusAction(order.status as OrderStatus) : null;

  return (
    <>
      <PageHeader
        title={`${order?.table.name} - Order #${orderId}`}
        description={
          <span className="text-sm text-gray-500">
            <Clock className="inline mr-2 h-4 w-4" />
            {new Date(order?.created_at || '').toLocaleString()}
          </span>
        }
      />
      <div>
        <div className="flex justify-between items-center">
          <p className="font-medium">Order Details</p>
          <div>
            {!order?.checked_out && (
              <Button variant="secondary" className="text-white">
                <Plus className="h-4 w-4 mr-2" /> Add New Dishes
              </Button>
            )}
          </div>
        </div>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="flex justify-between items-center text-lg">
              <span>Table: {order?.table.name}</span>
              <Badge className={`${order?.status ? getStatusColor(order.status as OrderStatus) : ''}`}>
                {order?.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order?.items.map((item) => (
                <div key={item.dish.id} className="border-b pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h3 className="text-base font-semibold">{item.dish.name}</h3>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    <span>Rs. {Number(item.dish.price).toFixed(2)}</span>
                  </div>

                  {item.add_ons.length > 0 && (
                    <div className="ml-4 bg-gray-50 p-2 rounded">
                      <h4 className="text-sm font-medium mb-1">Add-ons:</h4>
                      <ul className="space-y-1">
                        {item.add_ons.map((addon) => (
                          <li key={addon.id} className="text-sm flex justify-between">
                            <span>{addon.name}</span>
                            <span>Rs. {Number(addon.price).toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex justify-end mt-2">
                    <p className="text-sm text-gray-600">
                      Subtotal: Rs. {item.subtotal.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {order?.remarks && (
              <div className="border-t pt-4">
                <div className="flex items-start gap-2 text-amber-600">
                  <AlertCircle className="h-4 w-4 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Special Instructions:</p>
                    <p className="text-sm">{order.remarks}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center mt-4 pt-2 border-t">
              <p className="text-lg font-semibold">
                Total: Rs. {order?.total_amount.toFixed(2)}
              </p>
              <div className="flex gap-3">
                {statusAction && (
                  <Button
                    className={getStatusColor(order?.status as OrderStatus)}
                    onClick={() => handleStatusUpdate(statusAction.nextStatus as OrderStatus)}
                  >
                    {statusAction.icon}
                    {statusAction.label}
                  </Button>
                )}
                {order?.status === "Completed" && (
                  <Button onClick={()=>navigate(`/orders/${orderId}/checkout`)}>Checkout</Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}