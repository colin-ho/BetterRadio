# Generated by Django 3.2.4 on 2021-07-06 04:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_auto_20210706_0215'),
    ]

    operations = [
        migrations.AlterField(
            model_name='playlist',
            name='creator',
            field=models.CharField(max_length=200),
        ),
        migrations.AlterField(
            model_name='playlist',
            name='name',
            field=models.CharField(max_length=50),
        ),
    ]
