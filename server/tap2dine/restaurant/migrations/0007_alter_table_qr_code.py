# Generated by Django 5.1.4 on 2025-01-09 01:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('restaurant', '0006_category_dish_category'),
    ]

    operations = [
        migrations.AlterField(
            model_name='table',
            name='qr_code',
            field=models.URLField(blank=True, null=True),
        ),
    ]
