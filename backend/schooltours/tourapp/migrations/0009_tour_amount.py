# Generated by Django 5.2.3 on 2025-07-01 08:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tourapp', '0008_booking_amount_payment_booking'),
    ]

    operations = [
        migrations.AddField(
            model_name='tour',
            name='amount',
            field=models.IntegerField(default=0),
        ),
    ]
