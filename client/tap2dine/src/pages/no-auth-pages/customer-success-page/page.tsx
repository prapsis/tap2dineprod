import { useLocation } from 'react-router';
import queryString from 'query-string';
import { CheckCircle, FileText, Phone, DollarSign, Package, ShoppingCart } from 'lucide-react';

const SuccessPage = () => {
    const location = useLocation();
    const queryParams = queryString.parse(location.search);

    const {
        transaction_id,
        pidx,
        amount,
        total_amount,
        mobile,
        purchase_order_name,
    } = queryParams;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="bg-white shadow-md rounded-lg max-w-md w-full p-6 text-center">
                <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4" />
                <h1 className="text-2xl font-semibold text-gray-800">Payment Successful 🎉</h1>
                <p className="text-gray-600 mt-2">Thank you for your purchase! Your payment has been completed successfully.</p>

                <div className="mt-6 text-left">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Payment Details:</h3>
                    <ul className="space-y-2">
                        <li className="flex items-center text-gray-700">
                            <FileText className="w-5 h-5 mr-2 text-gray-500" />
                            <span><strong>Transaction ID:</strong> {transaction_id}</span>
                        </li>
                        <li className="flex items-center text-gray-700">
                            <Package className="w-5 h-5 mr-2 text-gray-500" />
                            <span><strong>PIDX:</strong> {pidx}</span>
                        </li>
                        <li className="flex items-center text-gray-700">
                            <DollarSign className="w-5 h-5 mr-2 text-gray-500" />
                            <span><strong>Amount Paid:</strong> NPR {Number(amount)/100}</span>
                        </li>
                        <li className="flex items-center text-gray-700">
                            <DollarSign className="w-5 h-5 mr-2 text-gray-500" />
                            <span><strong>Total Amount:</strong> NPR {Number(total_amount)/100}</span>
                        </li>
                        <li className="flex items-center text-gray-700">
                            <Phone className="w-5 h-5 mr-2 text-gray-500" />
                            <span><strong>Mobile Number:</strong> {mobile}</span>
                        </li>
                        <li className="flex items-center text-gray-700">
                            <ShoppingCart className="w-5 h-5 mr-2 text-gray-500" />
                            <span><strong>Purchase Order Name:</strong> {decodeURIComponent(String(purchase_order_name) ?? "")}</span>
                        </li>
                    </ul>
                </div>

            </div>
        </div>
    );
};

export default SuccessPage;
