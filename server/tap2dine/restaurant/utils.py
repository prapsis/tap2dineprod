from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import Order

def notify_order_created(order: Order):
    # Get the channel layer
    channel_layer = get_channel_layer()

    # Prepare the notification message
    message = f"New order created for table {order.table.id} with {order.items.count()} dishes"

    # Send a message to the "orders" group
    async_to_sync(channel_layer.group_send)(
        "orders",  # Group name
        {
            "type": "order_notification",  # The method to call in the consumer
            "message": message  # The message to send
        }
    )
