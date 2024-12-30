from django.urls import path,include
from .views import CategoryViewSet, TestAuthView
from .views import UserRegistrationView,TableViewSet, DishViewSet, IngredientViewSet, AddOnViewSet,OrderViewSet,CheckoutView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'dishes', DishViewSet, basename='dish')
router.register(r'ingredients', IngredientViewSet, basename='ingredient')
router.register(r'add-ons', AddOnViewSet, basename='addon')
router.register(r'tables',TableViewSet,basename='table')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'categories', CategoryViewSet, basename='category')

urlpatterns = [
    path('test-auth/', TestAuthView.as_view(), name='test_auth'),
    path('register/', UserRegistrationView.as_view(), name='user-registration'),
    path('orders/<int:pk>/checkout/', CheckoutView.as_view(), name='order-checkout'),
    path('',include(router.urls)),
]
