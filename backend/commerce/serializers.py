import uuid

from rest_framework import serializers

from .models import Lead, MarketingEvent, ModificationGallery, ModificationService, Order, OrderItem, Product, ServicePackage, SiteSettings


class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        fields = '__all__'

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')

        def abs_url(img_field, url_key):
            img = getattr(instance, img_field)
            if img:
                url = img.url
                data[url_key] = request.build_absolute_uri(url) if request else url

        abs_url('logo', 'logo_url')
        abs_url('favicon', 'favicon_url')
        abs_url('og_image', 'og_image_url')
        return data


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')
        if instance.image:
            url = instance.image.url
            data['image_url'] = request.build_absolute_uri(url) if request else url
        return data


class ServicePackageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServicePackage
        fields = '__all__'


class LeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lead
        fields = '__all__'
        read_only_fields = ['created_at']


class MarketingEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketingEvent
        fields = '__all__'
        read_only_fields = ['ip_address', 'user_agent', 'created_at']


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['product_id', 'product_name', 'product_type', 'price', 'quantity', 'image_url']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ['order_number', 'status', 'created_at', 'updated_at']

    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        order_number = uuid.uuid4().hex[:10].upper()
        subtotal = sum(item['price'] * item['quantity'] for item in items_data)
        order = Order.objects.create(
            order_number=order_number,
            subtotal=subtotal,
            total=subtotal,
            **validated_data,
        )
        for item in items_data:
            OrderItem.objects.create(order=order, **item)
        return order


class ModificationServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModificationService
        fields = '__all__'


class ModificationGallerySerializer(serializers.ModelSerializer):
    class Meta:
        model = ModificationGallery
        fields = '__all__'

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')
        if instance.image:
            url = instance.image.url
            data['image_url'] = request.build_absolute_uri(url) if request else url
        return data
