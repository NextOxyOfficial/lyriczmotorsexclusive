# Generated manually – adds gallery_images field to Product

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('commerce', '0003_bike_and_part_fields'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='gallery_images',
            field=models.JSONField(blank=True, default=list, help_text='List of additional image URLs for gallery/slider'),
        ),
    ]
