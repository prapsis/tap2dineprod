import { useEffect, useState } from "react";
import {
    // CreditCard,
    Wallet,
    ArrowLeft,
    Clock,
    AlertCircle,
    User,
    Phone,
    Mail
} from "lucide-react";
import { useNavigate, useParams } from "react-router";

import PageHeader from "../../../../../components/reusables/page-header";
import { Button } from "../../../../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../../../../components/ui/card";
import { Input } from "../../../../../components/ui/input";
import { Label } from "../../../../../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../../../../components/ui/radio-group";
import { KHALTI } from "../../../../../constants/images";
import { useFetchSingleOrder } from "../../../../../api/queries/orders.query";
import { useCheckoutMutation, useInitiatePaymentMutation } from "../../../../../api/mutations/checkout.mutation";


type PaymentMethod = "cash" | "card" | "khalti" | "esewa";

interface CustomerInfo {
    name: string;
    phone: string;
    email?: string;
}

export default function OrderCheckout() {
    const { id: orderId } = useParams();
    const navigate = useNavigate();
    const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>("cash");
    const [isProcessing, setIsProcessing] = useState(false);
    const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
        name: "",
        phone: "",
        email: ""
    });
    const { mutate:checkoutMutate } = useCheckoutMutation({ orderId: String(orderId) });
    const { mutate:khaltiPaymentMutate,data:khaltiResponse, isSuccess:khatiResponseSuccess} = useInitiatePaymentMutation();
    
    useEffect(() => {
        if (selectedPayment === "khalti") {
            khaltiPaymentMutate({
                amount:(order?.total_amount * 100) || 0 ,
                purchase_order_id: orderId || "",
                purchase_order_name: `${order?.table.name} order` || "",
                customer_name: customerInfo.name || "",
                customer_phone:customerInfo.phone || "",
                customer_email:customerInfo?.email || ""
            })
        }
    }, [selectedPayment])

    const handleCustomerInfoChange = (field: keyof CustomerInfo) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setCustomerInfo(prev => ({
            ...prev,
            [field]: e.target.value
        }));
    };

    const { data: order, isFetching } = useFetchSingleOrder({ orderId: String(orderId) });
    const handlePayment = async () => {
        switch (selectedPayment) {
            case 'khalti':
                navigate(`/checkout/${orderId}/khalti`,{
                    state:{
                        pidx: khaltiResponse?.data.pidx,
                        payment_url: khaltiResponse?.data.payment_url,
                        expires_at: khaltiResponse?.data.expires_at,
                        expires_in: khaltiResponse?.data.expires_in,
                        amount: order.total_amount,
                        customerInfo: customerInfo
                    }
                })
                break;
            default:
                handleCheckout();
        }
    };

    const handleCheckout = () => {
        setIsProcessing(true);
        try {
            checkoutMutate({
                total_amount: order.total_amount,
                payment_method: selectedPayment,
                customer_name: customerInfo.name,
                customer_phone: customerInfo.phone, //TODO add zod validation here
                customer_email: customerInfo?.email || ""
            },{
                onSuccess: () => {
                    navigate(`/checkout/${orderId}/success`)
                }
            })
            
        } catch (error) {
            console.error("Checkout failed:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const isDigitalPayment = selectedPayment === 'khalti';
    const isFormValid = customerInfo.name && customerInfo.phone;

    if (isFetching) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mt-4">
            <Button
                variant="ghost"
                className="mb-4"
                onClick={() => navigate(`/orders/${orderId}`)}
            >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Order
            </Button>

            <PageHeader
                title="Checkout"
                description={
                    <span className="text-sm text-gray-500">
                        <Clock className="inline mr-2 h-4 w-4" />
                        Order #{orderId}
                    </span>
                }
            />

            <div className="grid gap-6 md:grid-cols-2">
                {/* Order Summary */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span>Table</span>
                                <span className="font-medium">{order?.table.name}</span>
                            </div>

                            {order?.items?.map((item: any) => ( //TODO: refactor this type.
                                <div key={item.dish.id} className="border-t pt-4">
                                    <div className="flex justify-between">
                                        <div>
                                            <p className="font-medium">{item.dish.name}</p>
                                            <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                        </div>
                                        <p className="font-medium">Rs. {Number(item.dish.price).toFixed(2)}</p>
                                    </div>

                                    {item.add_ons.length > 0 && (
                                        <div className="mt-2 ml-4">
                                            {item.add_ons.map((addon: any) => (
                                                <div key={addon.id} className="flex justify-between text-sm text-gray-600">
                                                    <span>+ {addon.name}</span>
                                                    <span>Rs. {Number(addon.price).toFixed(2)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <p className="text-right text-sm text-gray-600 mt-2">
                                        Subtotal: Rs. {item?.subtotal.toFixed(2)}
                                    </p>
                                </div>
                            ))}

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

                            <div className="border-t pt-4">
                                <div className="flex justify-between font-medium">
                                    <span>Total Amount</span>
                                    <span>Rs. {order?.total_amount.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Payment Method */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Customer Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Name *
                            </Label>
                            <Input
                                id="name"
                                value={customerInfo.name}
                                onChange={handleCustomerInfoChange('name')}
                                placeholder="Enter customer name"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone" className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                Phone *
                            </Label>
                            <Input
                                id="phone"
                                value={customerInfo.phone}
                                onChange={handleCustomerInfoChange('phone')}
                                placeholder="Enter phone number"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={customerInfo.email}
                                onChange={handleCustomerInfoChange('email')}
                                placeholder="Enter email address (optional)"
                            />
                        </div>
                    </CardContent>
                    <CardHeader>
                        <CardTitle className="text-lg">Payment Method</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup
                            defaultValue="cash"
                            className="space-y-4"
                            value={selectedPayment}
                            onValueChange={(value) => setSelectedPayment(value as PaymentMethod)}
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="cash" id="cash" />
                                <Label htmlFor="cash" className="flex items-center gap-2">
                                    <Wallet className="h-4 w-4" />
                                    Cash Payment
                                </Label>
                            </div>
                            {/* <div className="flex items-center space-x-2">
                                <RadioGroupItem value="card" id="card" />
                                <Label htmlFor="card" className="flex items-center gap-2">
                                    <CreditCard className="h-4 w-4" />
                                    Card Payment
                                </Label>
                            </div> */}
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="khalti" id="khalti" />
                                <Label htmlFor="khalti" className="flex items-center gap-2">
                                    <img src={KHALTI} alt="Khalti" className="h-4 w-4" />
                                    Pay with Khalti
                                </Label>
                            </div>
                        </RadioGroup>

                        <div className="mt-6 space-y-4">
                            <div className="border-t pt-4">
                                <div className="flex justify-between font-medium">
                                    <span>Total Amount</span>
                                    <span>Rs. {order?.total_amount.toFixed(2)}</span>
                                </div>
                            </div>
                            {
                                isDigitalPayment ? (
                                    <Button
                                    className="w-full"
                                    onClick={handlePayment}
                                    disabled={!khatiResponseSuccess || !isFormValid }
                                >
                                    {!khatiResponseSuccess ? (
                                        <div className="flex items-center gap-2">
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                            Processing...
                                        </div>
                                    ) : (
                                        <>
                                            Proceed to Payment - Rs. {order?.total_amount.toFixed(2)}
                                        </>
                                    )}
                                </Button>
                                ) : (
                                    <Button
                                    className="w-full"
                                    onClick={handlePayment}
                                    disabled={isProcessing || !isFormValid }
                                >
                                    {isProcessing ? (
                                        <div className="flex items-center gap-2">
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                            Processing...
                                        </div>
                                    ) : (
                                        <>
                                            Complete Payment - Rs. {order?.total_amount.toFixed(2)}
                                        </>
                                    )}
                                </Button>
                                )
                            }
                            {!isFormValid && (
                                <p className="text-sm text-red-500">
                                    * Please fill in required customer information
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}