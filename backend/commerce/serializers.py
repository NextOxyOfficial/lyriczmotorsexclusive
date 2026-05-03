import uuid

from rest_framework import serializers

from .models import Lead, MarketingEvent, Order, OrderItem, Product, ServicePackage


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'


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
