from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password

from .utils import notify_order_created
from .models import Table ,Dish, Ingredient, AddOn, Order,Category

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model= User
        fields = ['id', 'username', 'email', 'is_staff']

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True,required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required = True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password','password2']

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password":"Password do not match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(
            username = validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password'],
        )
        return user

class TableSerializer(serializers.ModelSerializer):
    class Meta:
        model= Table
        fields=['id','name','qr_code']
        read_only_fields = ['qr_code']

class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ['id', 'name', 'quantity_available']


class AddOnSerializer(serializers.ModelSerializer):
    class Meta:
        model = AddOn
        fields = ['id', 'name', 'price']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']

class DishSerializer(serializers.ModelSerializer):
    ingredients = IngredientSerializer(many=True, read_only=True)
    add_ons = AddOnSerializer(many=True, read_only=True)
    category = CategorySerializer(read_only=True)
    class Meta:
        model = Dish
        fields = ['id', 'name', 'description', 'price', 'ingredients', 'add_ons','category']

class DishWriteSerializer(serializers.ModelSerializer):
    ingredients = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Ingredient.objects.all()
    )
    add_ons = serializers.PrimaryKeyRelatedField(
        many=True, queryset=AddOn.objects.all()
    )
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())
    class Meta:
        model = Dish
        fields = ['id', 'name', 'description', 'price', 'ingredients', 'add_ons','category']



class OrderSerializer(serializers.ModelSerializer):
    table = serializers.PrimaryKeyRelatedField(queryset=Table.objects.all())
    dishes = DishSerializer(many=True, read_only=True)
    dish_ids = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Dish.objects.all(), write_only=True
    )

    class Meta:
        model = Order
        fields = ['id', 'table', 'dishes', 'dish_ids', 'status','remarks', 'created_at', 'updated_at']

    def create(self, validated_data):
        dish_ids = validated_data.pop('dish_ids')
        remarks = validated_data.pop('remarks',None)
        order = super().create(validated_data)
        order.dishes.set(dish_ids)
        if remarks:
            order.remarks = remarks
            order.save()

        for dish in order.dishes.all():
            for ingredient in dish.ingredients.all():
                if ingredient.quantity_available < 1:
                    raise serializers.ValidationError(
                        f"Insufficient stock for ingredient {ingredient.name}."
                    )
                ingredient.quantity_available -= 1
                ingredient.save()

        notify_order_created(order)

        return order

class CheckOutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['id','checked_out','total_amount','payment_method']
        read_only_fields = ['id']

    def validate(self, data):
        if self.instance.status != "Completed":
            raise serializers.ValidationError("Order must be completed before checkout.")
        if self.instance.checked_out:
            raise serializers.ValidationError("Order has already been checked out.")
        return data

    def update(self, instance, validated_data):
        instance.checked_out = True
        instance.total_amount = validated_data.get('total_amount', instance.total_amount)
        instance.payment_method = validated_data.get('payment_method', instance.payment_method)
        instance.save()
        return instance
