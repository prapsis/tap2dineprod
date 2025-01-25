import json
import requests
from decouple import config
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .serializers import CategorySerializer, TransactionSerializer, UserRegistrationSerializer
from rest_framework.permissions import AllowAny
from rest_framework.viewsets import ModelViewSet,ReadOnlyModelViewSet
from .models import Category, Table, Dish, Ingredient, AddOn,Order
from .serializers import TableSerializer,DishWriteSerializer,DishSerializer, IngredientSerializer, AddOnSerializer,OrderSerializer, CheckOutSerializer,OrderReadSerializer
from rest_framework.decorators import action
from django.http import JsonResponse

# Create your views here.

class TestAuthView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self, request):
        return Response({'message':"You are authenticated", 'user':str(request.user)})

class UserRegistrationView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = UserRegistrationSerializer(data= request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"User Registered Successfully."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TableViewSet(ModelViewSet):
    queryset = Table.objects.all()
    serializer_class = TableSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        table = serializer.save()

        # Generate the URL for the QR code
        qr_url = f"{config('DIGI_MENU_URL')}{table.id}"

        # Save the URL in the qr_code field
        table.qr_code = qr_url
        table.save()

        headers = self.get_success_headers(serializer.data)
        
        return Response(
            {"message": "Table created successfully.", "qr_code_url": qr_url},
            status=status.HTTP_201_CREATED,
            headers=headers,
        )

    def get_permissions(self):
        if self.action in ['list']:
            return [AllowAny()]
        return [IsAuthenticated()]


class DishViewSet(ModelViewSet):
    queryset = Dish.objects.all()

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return DishWriteSerializer
        return DishSerializer

    def get_serializer(self, *args, **kwargs):
        # Dynamically call the serializer class
        serializer_class = self.get_serializer_class()
        return serializer_class(*args, **kwargs)

    @action(detail=False, methods=['get'], url_path='category/(?P<category_id>\d+)/dishes')
    def get_dishes_by_category(self, request, category_id=None):
        # Filter dishes by category
        dishes = Dish.objects.filter(category_id=category_id)
        page = self.paginate_queryset(dishes)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(dishes, many=True)
        return Response(serializer.data)

    def get_permissions(self):
        if self.action in ['list','get_dishes_by_category','retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]

class IngredientViewSet(ModelViewSet):
    queryset = Ingredient.objects.all()
    serializer_class = IngredientSerializer


class AddOnViewSet(ModelViewSet):
    queryset = AddOn.objects.all()
    serializer_class = AddOnSerializer

class CategoryViewSet(ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    def get_permissions(self):
        if self.action == 'list':
            return [AllowAny()]
        return [IsAuthenticated()]


class OrderViewSet(ModelViewSet):
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class = OrderSerializer

    @action(detail=True, methods=['patch'])
    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return OrderReadSerializer
        return OrderSerializer

    @action(detail=True, methods=['patch'], url_path='update_status')
    def update_status(self, request, pk=None):
        try:
            order = self.get_object()
            new_status = request.data.get('status')
            if new_status not in ['Pending','Preparing','Completed']:
                return Response({'error':'Invalid Status'},status=status.HTTP_400_BAD_REQUEST)
            order.status = new_status
            order.save()
            return Response({"message":"Order status updated successfully","status":order.status})
        except Exception as e:
            return Response({"error":str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get_permissions(self):
        if self.action in ["create","list"]:
            return [AllowAny()]
        return [IsAuthenticated()]


class CheckoutView(APIView):
    def patch(self, request, pk):
        """Handle order checkout."""
        try:
            order = Order.objects.get(pk=pk)
        except Order.DoesNotExist:
            return Response({"error": "Order not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = CheckOutSerializer(order, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "Order checked out successfully.",
                "order": serializer.data
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class InitiatePaymentView(APIView):
    def post(self, request,*args, **kwargs):
        khalti_secret_key = config('KHALTI_SECRET_KEY')
        payment_url = 'https://dev.khalti.com/api/v2/epayment/initiate/'

        data = json.loads(request.body)
        # config('FRONTEND_URL')
        payload={
                "return_url": config('PAYMENT_SUCCESS'),
                "website_url": config('FRONTEND_URL'),
                "amount": data.get('amount'),
                "purchase_order_id": data.get('purchase_order_id'),
                "purchase_order_name": data.get('purchase_order_name'),
                "customer_info": {
                    "name": data.get('customer_name'),
                    "email": data.get('customer_email'),
                    "phone": data.get('customer_phone')
                },
            }
        
        headers = {
            'Authorization': f'key {khalti_secret_key}',
            'Content-Type': 'application/json',
        }
        response = requests.post(payment_url, json=payload, headers=headers)
        if response.status_code == 200:
            return JsonResponse(response.json())
        else:
            return JsonResponse({'error': 'Failed to initiate payment'}, status=response.status_code)
        
class VerifyPaymentView(APIView):
    def post(self, request, *args, **kwargs):
        # Replace with your secret key
        khalti_secret_key = config('KHALTI_SECRET_KEY')
        lookup_url = 'https://dev.khalti.com/api/v2/epayment/lookup/'

        # Get pidx from the request
        pidx = request.data.get('pidx')
        if not pidx:
            return Response({'error': 'pidx is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Payload for lookup
        payload = {'pidx': pidx}
        headers = {
            'Authorization': f'Key {khalti_secret_key}',
        }

        # Send request to Khalti
        response = requests.post(lookup_url, json=payload, headers=headers)
        if response.status_code == 200:
            # Payment details from Khalti
            payment_data = response.json()
            return Response(payment_data, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Failed to verify payment', 'details': response.json()}, status=response.status_code)

class TransactionViewSet(ReadOnlyModelViewSet):
    queryset = Order.objects.filter(status='Completed', checked_out=True)
    serializer_class = TransactionSerializer