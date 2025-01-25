from channels.generic.websocket import AsyncWebsocketConsumer
import json

class OrderNotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Join the orders group
        print("Connection attempt received") 
        self.room_group_name = "orders"  # Group name can be dynamic if needed
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        # Leave the orders group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Method to receive message from room group
    async def order_notification(self, event):
        # Send message to WebSocket
        message = event['message']  # Extract message from the event data
        await self.send(text_data=json.dumps({
            'message': message
        }))
