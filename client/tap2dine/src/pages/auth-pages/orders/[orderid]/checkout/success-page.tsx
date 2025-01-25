import { useNavigate, useParams } from 'react-router';
import { CheckCircle2, ArrowLeft, Clock, Receipt, CreditCard, User, Phone, Mail } from 'lucide-react';
import { useFetchSingleOrder } from '../../../../../api/queries/orders.query';
import { Button } from '../../../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../components/ui/card';


export default function CheckoutSuccess() {
    const { id: orderId } = useParams();
    const navigate = useNavigate();

    // You can fetch the order details here using the same query as in OrderCheckout
    const { data: order } = useFetchSingleOrder({ orderId: String(orderId) });

    const formatDate = (date:string) => {
        return new Date(date).toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short'
        });
    };

    return (
        <div className="max-w-4xl mt-4">
            <Button
                variant="ghost"
                className="mb-4"
                onClick={() => navigate('/orders')}
            >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Orders
            </Button>

            <div className="flex flex-col items-center mb-8">
                <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
                <h1 className="text-2xl font-bold text-center">Payment Successful!</h1>
                <p className="text-gray-500 text-center mt-2">
                    Your order has been confirmed and payment has been received.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Order Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock className="h-4 w-4" />
                            <span>Order #{orderId}</span>
                            <span>•</span>
                            <span>{formatDate(order?.created_at || new Date())}</span>
                        </div>

                        <div className="border-t pt-4">
                            <div className="space-y-4">
                                {order?.items.map((item:any) => ( //TODO fix types
                                    <div key={item.dish.id}> 
                                        <div className="flex justify-between">
                                            <div>
                                                <p className="font-medium">{item?.dish.name}</p>
                                                <p className="text-sm text-gray-500">Quantity: {item?.quantity}</p>
                                            </div>
                                            <p className="font-medium">Rs. {Number(item?.dish.price).toFixed(2)}</p>
                                        </div>

                                        {item?.add_ons.length > 0 && (
                                            <div className="mt-2 ml-4">
                                                {item.add_ons.map((addon:any) => (
                                                    <div key={addon.id} className="flex justify-between text-sm text-gray-600">
                                                        <span>+ {addon.name}</span>
                                                        <span>Rs. {Number(addon.price).toFixed(2)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}

                                <div className="border-t pt-4">
                                    <div className="flex justify-between font-medium">
                                        <span>Total Amount Paid</span>
                                        <span>Rs. {order?.total_amount.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Payment Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Receipt className="h-4 w-4 text-gray-500" />
                                <span>Payment Status:</span>
                                <span className="text-green-500 font-medium">Paid</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CreditCard className="h-4 w-4 text-gray-500" />
                                <span>Payment Method:</span>
                                <span className="font-medium capitalize">{order?.payment_method}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-gray-500" />
                                <span>Payment Time:</span>
                                <span className="font-medium">{formatDate(order?.updated_at)}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Customer Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-gray-500" />
                                <span>Name:</span>
                                <span className="font-medium">{order?.customer_name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-gray-500" />
                                <span>Phone:</span>
                                <span className="font-medium">{order?.customer_phone}</span>
                            </div>
                            {order?.customer_email && (
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-gray-500" />
                                    <span>Email:</span>
                                    <span className="font-medium">{order?.customer_email}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Button
                        className="w-full"
                        onClick={() => navigate('/orders')}
                    >
                        Return to Orders
                    </Button>
                </div>
            </div>
        </div>
    );
}