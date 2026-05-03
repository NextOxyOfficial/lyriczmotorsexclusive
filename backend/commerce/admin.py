from django.contrib import admin

from .models import Lead, MarketingEvent, Order, OrderItem, Product, ServicePackage


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'product_type', 'brand', 'price', 'status', 'is_featured')
    list_filter = ('product_type', 'status', 'is_featured', 'brand')
    search_fields = ('name', 'brand', 'category')
    prepopulated_fields = {'slug': ('name',)}


@admin.register(ServicePackage)
class ServicePackageAdmin(admin.ModelAdmin):
    list_display = ('title', 'tier', 'price', 'duration', 'is_featured')
    list_filter = ('tier', 'is_featured')
    prepopulated_fields = {'slug': ('title',)}


@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone', 'intent', 'source', 'utm_campaign', 'created_at')
    list_filter = ('intent', 'source', 'utm_source', 'utm_campaign')
    search_fields = ('name', 'phone', 'email', 'message')


@admin.register(MarketingEvent)
class MarketingEventAdmin(admin.ModelAdmin):
    list_display = ('event_name', 'event_id', 'gclid', 'created_at')
    list_filter = ('event_name', 'created_at')
    search_fields = ('event_name', 'event_id', 'page_url', 'gclid')


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('product_id', 'product_name', 'product_type', 'price', 'quantity')


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_number', 'customer_name', 'customer_phone', 'payment_method', 'delivery_method', 'status', 'total', 'created_at')
    list_filter = ('status', 'payment_method', 'delivery_method')
    search_fields = ('order_number', 'customer_name', 'customer_phone', 'customer_email')
    inlines = [OrderItemInline]
