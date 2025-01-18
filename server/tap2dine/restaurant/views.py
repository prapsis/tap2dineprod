from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .serializers import CategorySerializer, UserRegistrationSerializer
from rest_framework.permissions import AllowAny
from rest_framework.viewsets import ModelViewSet
from .models import Category, Table, Dish, Ingredient, AddOn,Order
from .serializers import TableSerializer,DishWriteSerializer,DishSerializer, IngredientSerializer, AddOnSerializer,OrderSerializer, CheckOutSerializer,OrderReadSerializer
import qrcode
from io import BytesIO
from django.core.files import File
from rest_framework.decorators import action

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
        qr_url = f"http://192.168.1.78:5173/digi-menu/{table.id}"

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
        if self.action in ['create', 'update']:
            return DishWriteSerializer
        return DishSerializer

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
        if self.action in ['list','get_dishes_by_category']:
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
