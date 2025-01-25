import { Dot } from "lucide-react";
import { TOrderResponseType } from "../../../../types/response.types";
import { format } from "date-fns";

export type TSingleOrderCardProps = {
    onClick?: () => void
    data: TOrderResponseType
}
export default function SingleOrderCard({ data, onClick }: TSingleOrderCardProps) {
    const orderTime = format(new Date(data.created_at), 'hh:mm a');

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'text-yellow-600';
            case 'completed':
                return 'text-green-600';
            case 'cancelled':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

    return (
        <div 
            className="w-full h-fit border rounded-md p-2 hover:scale-105 transition-all cursor-pointer shadow-sm hover:shadow-md" 
            onClick={() => {if(onClick) onClick();}}
        >
            <div className="flex items-center justify-between">
                <p className={`text-sm font-medium flex items-center ${getStatusColor(data.status)}`}>
                    {data.table.name} Order
                </p>
                <span className="text-xs text-gray-500">{orderTime}</span>
            </div>

            {/* Order items list */}
            <div className="overflow-y-auto h-48 border-b border-gray-100 my-1">
                <ul className="space-y-1">
                    {data.items.slice(0, 8).map((item) => (
                        <li key={item.dish.id} className="flex justify-between text-xs font-light text-gray-600">
                            <p className="flex items-center justify-start truncate max-w-[70%]">
                                <Dot className="text-secondary" />
                                {item.dish.name}
                                {item.add_ons.length > 0 && (
                                    <span className="text-xs text-gray-400 ml-1">+{item.add_ons.length}</span>
                                )}
                            </p>
                            <p>{item.quantity}</p>
                        </li>
                    ))}
                    {data.items.length > 8 && (
                        <li className="text-xs text-gray-400 italic px-4">
                            +{data.items.length - 8} more items
                        </li>
                    )}
                </ul>
            </div>

            {/* Order footer */}
            <div className="mt-1 flex justify-between items-center">
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-sm font-medium">Rs {data.total_amount.toLocaleString()}</p>
            </div>
        </div>
    );
}