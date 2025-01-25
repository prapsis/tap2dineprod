import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../components/ui/card';
import { Alert, AlertDescription } from '../../../../../components/ui/alert';
import QRCode from "react-qr-code";
import { useCheckoutMutation, useCheckPaymentStatus } from '../../../../../api/mutations/checkout.mutation';


export default function KhaltiPayment() {
    const { id: orderId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const paymentData = location.state;

    // Redirect if no payment data is present
    useEffect(() => {
        if (!paymentData) {
            navigate(`/orders/${orderId}`);
        }
    }, [paymentData, navigate, orderId]);

    const [timeLeft, setTimeLeft] = useState(paymentData?.expires_in || 1800);
    const [isChecking, setIsChecking] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState('pending');
    const { mutate: paymentStatusMutate } = useCheckPaymentStatus();
    const { mutate: checkoutMutate } = useCheckoutMutation({orderId: String(orderId) });
    // Timer countdown effect
    useEffect(() => {
        if (!timeLeft) return;

        const timer = setInterval(() => {
            setTimeLeft((prevTime: any) => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const checkPaymentStatus = async () => {
        if (!paymentData?.pidx) return;

        setIsChecking(true);
        try {
            paymentStatusMutate(paymentData?.pidx, {
                onSuccess: (response) => {
                    if (response.data.status === 'Completed') {
                        setPaymentStatus('success');

                        const checkoutData = {
                            total_amount: paymentData.amount,
                            payment_method: 'khalti',
                            customer_name: paymentData.customerInfo.name,
                            customer_phone: paymentData.customerInfo.phone,
                            customer_email: paymentData.customerInfo.email || ''
                        };

                        checkoutMutate(checkoutData, {
                            onSuccess: () => {                   
                                navigate(`/checkout/${orderId}/success`);
                            },
                            onError: (error:any) => {
                                console.error('Checkout failed:', error);
                               
                            }
                        });
                    }
                },
                onError: (error) => {
                    console.error('Payment status check failed:', error);
                   
                }
            });
        } catch (error) {
            console.error('Error checking payment status:', error);
        } finally {
            setIsChecking(false);
        }
    };
    const formatTime = (seconds: any) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    // If no payment data, show loading or redirect
    if (!paymentData) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-lg mx-auto mt-4">
            <Button
                variant="ghost"
                className="mb-4"
                onClick={() => navigate(`/orders/${orderId}`)}
            >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Order
            </Button>

            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Scan QR Code to Pay</CardTitle>
                    <p className="text-sm text-gray-500 mt-2">
                        Time remaining: {formatTime(timeLeft)}
                    </p>
                </CardHeader>
                <CardContent className="space-y-6">
                    {timeLeft === 0 ? (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                Payment session has expired. Please return to checkout and try again.
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <>
                            <div className="flex justify-center">
                                <div className="border-2 border-dashed border-gray-200 p-4 rounded-lg">
                                    <QRCode value={paymentData.payment_url} />
                                </div>
                            </div>

                            <div className="text-center space-y-2">
                                <p className="text-sm text-gray-500">
                                    Scan this QR code using Khalti app to make the payment
                                </p>
                                <a
                                    href={paymentData.payment_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-500 hover:text-blue-600"
                                >
                                    Or click here to pay online
                                </a>
                            </div>

                            {paymentStatus === 'success' ? (
                                <Alert className="bg-green-50 text-green-700 border-green-200">
                                    <AlertDescription>
                                        Payment successful! Redirecting to order confirmation...
                                    </AlertDescription>
                                </Alert>
                            ) : (
                                <Button
                                    className="w-full"
                                    onClick={() => checkPaymentStatus()}
                                    disabled={isChecking || timeLeft === 0}
                                >
                                    {isChecking ? (
                                        <div className="flex items-center gap-2">
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                            Checking Payment Status...
                                        </div>
                                    ) : (
                                        'Check Payment Status'
                                    )}
                                </Button>
                            )}
                        </>
                    )}

                    <div className="text-center">
                        <Button
                            variant="ghost"
                            className="text-sm"
                            onClick={() => navigate(`/orders/${orderId}`)}
                        >
                            Cancel Payment
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}