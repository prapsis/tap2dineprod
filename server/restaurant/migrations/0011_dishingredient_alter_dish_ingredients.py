# Generated by Django 5.1.4 on 2025-03-09 13:02

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('restaurant', '0010_order_customer_email_order_customer_name_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='DishIngredient',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity_required', models.PositiveIntegerField(default=1)),
                ('dish', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='dish_ingredients', to='restaurant.dish')),
                ('ingredient', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='dish_ingredients', to='restaurant.ingredient')),
            ],
        ),
        migrations.AlterField(
            model_name='dish',
            name='ingredients',
            field=models.ManyToManyField(related_name='dishes', through='restaurant.DishIngredient', to='restaurant.ingredient'),
        ),
    ]
