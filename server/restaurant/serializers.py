from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from rest_framework.exceptions import ValidationError
from .utils import notify_order_created
from .models import Table ,Dish, Ingredient, AddOn, Order,Category,OrderItem,DishIngredient

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

class DishIngredientSerializer(serializers.ModelSerializer):
    ingredient = IngredientSerializer(read_only=True)

    class Meta:
        model = DishIngredient
        fields = ['ingredient', 'quantity_required']

class DishSerializer(serializers.ModelSerializer):
    dish_ingredients = DishIngredientSerializer(many=True, read_only=True)
    add_ons = AddOnSerializer(many=True, read_only=True)
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Dish
        fields = ['id', 'name', 'description', 'price', 'dish_ingredients', 'add_ons', 'category']

class DishIngredientWriteSerializer(serializers.Serializer):
    ingredient = serializers.PrimaryKeyRelatedField(queryset=Ingredient.objects.all())  # This handles the reference to Ingredient model
    quantity_required = serializers.IntegerField()

    class Meta:
        fields = ['ingredient', 'quantity_required']


class DishWriteSerializer(serializers.ModelSerializer):
    ingredients = DishIngredientWriteSerializer(many=True, write_only=True)
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())
    add_ons = serializers.PrimaryKeyRelatedField(many=True, queryset=AddOn.objects.all(), required=False)

    class Meta:
        model = Dish
        fields = ['id', 'name', 'description', 'price', 'ingredients', 'add_ons', 'category']

    def create(self, validated_data):
        ingredients_data = validated_data.pop('ingredients')
        add_ons_data = validated_data.pop('add_ons', [])
        
        # Create the dish first
        dish = Dish.objects.create(**validated_data)
        
        # Now create the related DishIngredient entries
        for ingredient_data in ingredients_data:
            ingredient_obj = ingredient_data['ingredient']
            quantity = ingredient_data['quantity_required']
            
            DishIngredient.objects.create(
                dish=dish,
                ingredient=ingredient_obj,
                quantity_required=quantity
            )
        
        # Set many-to-many relationships
        if add_ons_data:
            dish.add_ons.set(add_ons_data)
            
        return dish
    
    def update(self, instance, validated_data):
        # Extract nested data
        ingredients_data = validated_data.pop('ingredients', None)
        add_ons_data = validated_data.pop('add_ons', None)
        
        # Update the dish basic fields
        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        instance.price = validated_data.get('price', instance.price)
        instance.category = validated_data.get('category', instance.category)
        instance.save()
        
        # Update ingredients if provided
        if ingredients_data is not None:
            # Clear existing ingredients
            DishIngredient.objects.filter(dish=instance).delete()
            
            # Create new ingredient relationships
            for ingredient_data in ingredients_data:
                ingredient_obj = ingredient_data['ingredient']
                quantity = ingredient_data['quantity_required']
                
                DishIngredient.objects.create(
                    dish=instance,
                    ingredient=ingredient_obj,
                    quantity_required=quantity
                )
        
        # Update add-ons if provided
        if add_ons_data is not None:
            instance.add_ons.set(add_ons_data)
        
        return instance
    def to_representation(self, instance):
        # Return the dish using the read serializer to avoid the error
        return DishSerializer(instance, context=self.context).data
    
class OrderItemSerializer(serializers.ModelSerializer):
    dish = serializers.PrimaryKeyRelatedField(queryset=Dish.objects.all())
    add_ons = serializers.PrimaryKeyRelatedField(
        many=True, queryset=AddOn.objects.all(), required=False
    )
    quantity = serializers.IntegerField(min_value=1, default=1)

    class Meta:
        model = OrderItem
        fields = ['dish', 'add_ons', 'quantity']


class OrderSerializer(serializers.ModelSerializer):
    table = serializers.PrimaryKeyRelatedField(queryset=Table.objects.all())
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = ['id', 'table', 'items', 'status', 'remarks', 'created_at', 'updated_at']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = super().create(validated_data)

        for item_data in items_data:
            dish = item_data.pop('dish')
            add_ons = item_data.pop('add_ons', [])
            quantity = item_data.get('quantity', 1)

            order_item = OrderItem.objects.create(order=order, dish=dish, quantity=quantity)
            order_item.add_ons.set(add_ons)
            order_item.save()

            # Deduct ingredients based on quantity
            for dish_ingredient in dish.dish_ingredients.all():
                required_qty = dish_ingredient.quantity_required * quantity
                ingredient = dish_ingredient.ingredient

                if ingredient.quantity_available < required_qty:
                    raise serializers.ValidationError(
                        f"Insufficient stock for ingredient {ingredient.name}."
                    )
                ingredient.quantity_available -= required_qty
                ingredient.save()

        notify_order_created(order)
        return order


class OrderItemReadSerializer(serializers.ModelSerializer):
    dish = DishSerializer(read_only=True)
    add_ons = AddOnSerializer(many=True, read_only=True)
    quantity = serializers.IntegerField(min_value=1, default=1)
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ['dish', 'add_ons', 'quantity', 'subtotal']

    def get_subtotal(self, obj):
        # Calculate base price from dish
        subtotal = obj.dish.price * obj.quantity

        # Add the price of any add-ons
        for add_on in obj.add_ons.all():
            subtotal += add_on.price * obj.quantity

        return subtotal

class OrderReadSerializer(serializers.ModelSerializer):
    table = TableSerializer(read_only=True)
    items = OrderItemReadSerializer(many=True, read_only=True)
    total_amount = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ['id', 'table', 'items', 'status', 'remarks',
                 'created_at', 'updated_at', 'total_amount',
                 'checked_out', 'payment_method','customer_name','customer_email','customer_phone']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_total_amount(self, obj):
        return sum(item.dish.price * item.quantity +
                  sum(add_on.price * item.quantity for add_on in item.add_ons.all())
                  for item in obj.items.all())

class CheckOutSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(required=True, max_length=100)
    customer_email = serializers.EmailField(required=True)
    customer_phone = serializers.CharField(required=True, max_length=15)

    class Meta:
        model = Order
        fields = [
            'id', 'checked_out', 'total_amount', 'payment_method',
            'customer_name', 'customer_email', 'customer_phone'
        ]
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
        instance.customer_name = validated_data.get('customer_name', instance.customer_name)
        instance.customer_email = validated_data.get('customer_email', instance.customer_email)
        instance.customer_phone = validated_data.get('customer_phone', instance.customer_phone)
        instance.save()
        return instance

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = [
            'id', 'table', 'total_amount', 'payment_method',
            'customer_name', 'customer_email', 'customer_phone',
            'status', 'created_at', 'updated_at'
        ]
        read_only_fields = fields
