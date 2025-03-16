import { Minus, Plus, Trash2 } from 'lucide-react';
import { useOrderContext } from '../../../../hooks/useOrderContext';
import { OrderItem } from '../../../../context/orderContext';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import { Avatar } from '../../../../components/reusables/avatar';

const OrderSummary = ({ item }: { item: OrderItem }) => {
    const { dispatch } = useOrderContext();

    const updateQuantity = (newQuantity: number) => {
        if (newQuantity < 1) {
            dispatch({ type: 'REMOVE_ITEM', payload: { dishId: item.dishId } });
            return;
        }
        dispatch({
            type: 'UPDATE_ITEM',
            payload: { dishId: item.dishId, quantity: newQuantity },
        });
    };


    return (
        <div className="bg-background border rounded-md p-3 space-y-2">
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full border-2 border-secondary overflow-hidden">
                    <Avatar name={item.name} size='56px' />
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <p className="font-medium">{item.name}</p>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: { dishId: item.dishId } })}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                    <p className="font-light">Rs.{item.price}</p>
                </div>
            </div>

            {/* Customizations */}
            {item.ingredients.some(ing => !ing.include) && (
                <div className="flex flex-wrap gap-1">
                    {item.ingredients
                        .filter(ing => !ing.include)
                        .map(ing => (
                            <Badge key={ing.id} variant="secondary" className='text-white'>
                                No {ing.name.includes("-") ? ing.name.split("-")[0] : ing.name}
                            </Badge>
                        ))}
                </div>
            )}

            {item.addons.length > 0 && (
                <div className="flex flex-wrap gap-1">
                    {item.addons.map(addon => (
                        <Badge key={addon.id} variant="outline">
                            +{addon.name}
                        </Badge>
                    ))}
                </div>
            )}

            {/* {item.remark && (
                <p className="text-sm text-muted-foreground">Note: {item.remark}</p>
            )} */}

            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => updateQuantity(item.quantity - 1)}
                    >
                        <Minus className="h-4 w-4" />
                    </Button>
                    <span className="font-medium">{item.quantity}</span>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => updateQuantity(item.quantity + 1)}
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
                <p className="font-medium">Total: Rs. {item.totalPrice}</p>
            </div>
        </div>
    );
};

export default OrderSummary;