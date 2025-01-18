from django.db import models
# Create your models here.
class Table(models.Model):
    name = models.CharField(unique=True, max_length=40)
    qr_code = models.URLField(blank=True, null=True)  # Change to store URL instead of an image
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.name

class Dish(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    ingredients = models.ManyToManyField('Ingredient', related_name='dishes', blank=True)
    add_ons = models.ManyToManyField('AddOn', related_name='dishes', blank=True)
    category = models.ForeignKey('Category', on_delete=models.SET_NULL,null=True, related_name='dishes')
    def __str__(self):
        return self.name


class Ingredient(models.Model):
    name = models.CharField(max_length=100, unique=True)
    quantity_available = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name


class AddOn(models.Model):
    name = models.CharField(max_length=100, unique=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.name

class Order(models.Model):
    table = models.ForeignKey(Table, on_delete=models.CASCADE, related_name='orders')
    status = models.CharField(
        max_length=20,
        choices=[('Pending', 'Pending'), ('Preparing', 'Preparing'), ('Completed', 'Completed')],
        default='Pending'
    )
    remarks = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    checked_out = models.BooleanField(default=False)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    payment_method = models.CharField(max_length=50, null=True, blank=True)

    def __str__(self):
        return f"Order {self.id} for Table {self.table.id}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    dish = models.ForeignKey(Dish, related_name='order_items', on_delete=models.CASCADE)
    add_ons = models.ManyToManyField('AddOn', related_name='order_items', blank=True)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"Item {self.id} for Order {self.order.id}"

class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name
