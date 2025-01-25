import { Soup, Download } from 'lucide-react';
import { useOrderContext } from '../../../../hooks/useOrderContext';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../../../../components/ui/sheet';
import OrderSummary from './order-summary';
import { useAddOrderMutation } from '../../../../api/mutations/orders.mutation';
import { Order } from '../../../../context/orderContext';
import { TOrderType } from '../../../../schemas/order';
import { useState } from 'react';
import { toast } from 'sonner';

const OrderSheet = () => {
    const { order, dispatch } = useOrderContext();
    const { mutate } = useAddOrderMutation();
    const [isDownloadable, setIsDownloadable] = useState(false);

    const totalPrice = order.items.reduce((sum, item) => {
        return sum + (item.totalPrice);
    }, 0);

    const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

    const transformOrder = (order: Order): TOrderType => {
        const transformedItems = order.items.map(item => ({
            dish: item.dishId,
            quantity: item.quantity,
            add_ons: item.addons.map(addon => addon.id)
        }));

        const remarks = order.items
            .map(item => {
                const excludedIngredients = item.ingredients
                    .filter(ingredient => !ingredient.include)
                    .map(ingredient => `No ${ingredient.name}`)
                    .join(", ");

                return excludedIngredients ? `${item.name}: ${excludedIngredients}` : "";
            })
            .filter(Boolean)
            .join("; ");
        return {
            table: order.table,
            items: transformedItems,
            remarks
        };
    };

    const handlePlaceOrder = () => {
        const mutableData = transformOrder(order);
        mutate(mutableData, {
            onSuccess: (response) => {
                // Assuming the response contains the order ID
                dispatch({
                    type: 'SET_ORDER_STATUS',
                    payload: 'placed'
                });
                dispatch({
                    type: 'SET_LAST_ORDER_ID',
                    payload: response.data.id
                });
                setIsDownloadable(true);
                toast.success('Order placed successfully!');
            },
            onError: () => {
                toast.error('Failed to place order');
            }
        });
    }

    const handleDownloadBill = () => {
        if (!order.lastOrderId) {
            toast.error('No order to download');
            return;
        }

        const generateBill = () => {
            const billContent = `
Order Estimate Bill
Order ID: ${order.lastOrderId}
Table: ${order.table}

Items:
${order.items.map(item =>
                `${item.name} x ${item.quantity} - Rs. ${item.totalPrice}`
            ).join('\n')}

Total: Rs. ${totalPrice}
            `;

            const blob = new Blob([billContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `order_${order.lastOrderId}_bill.txt`;
            link.click();
            URL.revokeObjectURL(url);
        };

        generateBill();
        dispatch({ type: 'RESET_ORDER' });
        setIsDownloadable(false);
    }

    return (
        <Sheet>
            <SheetTrigger>
                <Button variant="outline" className="relative">
                    <Soup className="mr-2" />
                    My Orders
                    {itemCount > 0 && (
                        <Badge variant="secondary" className="absolute -top-2 -right-2 rounded-full text-white">
                            {itemCount}
                        </Badge>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
                <SheetHeader className="mb-4">
                    <SheetTitle className="text-left">
                        {isDownloadable ? 'Order Placed' : 'My Orders'}
                    </SheetTitle>
                </SheetHeader>

                {!isDownloadable && order.items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[70vh] text-muted-foreground">
                        <Soup className="h-12 w-12 mb-2" />
                        <p>No items in your order yet</p>
                    </div>
                ) : (
                    <div className="space-y-4 pb-32">
                        {!isDownloadable ? (
                            order.items.map((item) => (
                                <OrderSummary key={item.dishId} item={item} />
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center h-[70vh] text-muted-foreground">
                                <Download className="h-12 w-12 mb-2" />
                                <p>Your order has been placed</p>
                                <p className="text-sm">Click below to download your bill</p>
                            </div>
                        )}
                    </div>
                )}

                {!isDownloadable && order.items.length > 0 && (
                    <div className="fixed bottom-0 w-full py-4 bg-background border-t">
                        <div className='w-80'>
                            <p className="pb-2 mb-2 font-semibold border-b border-border">
                                Total Price: Rs. {totalPrice}
                            </p>
                            <Button
                                className="w-full"
                                onClick={handlePlaceOrder}
                            >
                                Place Order
                            </Button>
                        </div>
                    </div>
                )}

                {isDownloadable && (
                    <div className="fixed bottom-0 w-full py-4 bg-background border-t">
                        <div className='w-80'>
                            <Button
                                className="w-full"
                                onClick={handleDownloadBill}
                            >
                                <Download className="mr-2 h-4 w-4" />
                                Download Bill
                            </Button>
                        </div>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
};

export default OrderSheet;