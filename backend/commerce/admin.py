from django.contrib import admin
from django.urls import reverse
from django.utils.html import format_html
from django.http import HttpResponseRedirect

from .models import Lead, MarketingEvent, Order, OrderItem, Product, ServicePackage, SiteSettings


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    readonly_fields = ('logo_preview', 'favicon_preview')

    fieldsets = (
        ('Site Identity', {
            'fields': ('site_name', 'tagline', 'meta_description')
        }),
        ('Logo', {
            'description': 'Upload a file OR enter an external URL. Uploaded file takes priority.',
            'fields': ('logo', 'logo_preview', 'logo_url'),
        }),
        ('Favicon', {
            'fields': ('favicon', 'favicon_preview', 'favicon_url'),
        }),
        ('OG / Share Image', {
            'fields': ('og_image', 'og_image_url'),
        }),
        ('Contact Information', {
            'fields': ('phone', 'whatsapp', 'email', 'address'),
        }),
        ('Social Media Links', {
            'fields': ('facebook_url', 'instagram_url', 'youtube_url', 'tiktok_url', 'twitter_url'),
        }),
        ('Footer', {
            'fields': ('copyright_text',),
        }),
    )

    def logo_preview(self, obj):
        url = obj.logo.url if obj.logo else obj.logo_url
        if url:
            return format_html('<img src="{}" style="max-height:60px;max-width:200px;object-fit:contain;border-radius:4px;background:#1a1a2e;padding:6px;" />', url)
        return '—'
    logo_preview.short_description = 'Logo Preview'

    def favicon_preview(self, obj):
        url = obj.favicon.url if obj.favicon else obj.favicon_url
        if url:
            return format_html('<img src="{}" style="max-height:48px;max-width:48px;object-fit:contain;" />', url)
        return '—'
    favicon_preview.short_description = 'Favicon Preview'

    def has_add_permission(self, request):
        return not SiteSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False

    def changelist_view(self, request, extra_context=None):
        """Redirect list view directly to the single settings object."""
        obj, _ = SiteSettings.objects.get_or_create(pk=1)
        return HttpResponseRedirect(
            reverse('admin:commerce_sitesettings_change', args=[obj.pk])
        )


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'product_type', 'brand', 'price', 'status', 'is_featured', 'image_preview')
    list_filter = ('product_type', 'status', 'is_featured', 'brand')
    search_fields = ('name', 'brand', 'category')
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ('image_preview',)

    fieldsets = (
        ('Basic Info', {
            'fields': ('name', 'slug', 'product_type', 'category', 'brand', 'status', 'is_featured', 'short_description')
        }),
        ('Pricing', {
            'fields': ('price', 'compare_at_price')
        }),
        ('Image', {
            'description': 'Upload an image file OR provide an external Image URL. Uploaded file takes priority.',
            'fields': ('image', 'image_preview', 'image_url'),
        }),
        ('Details', {
            'fields': ('power_score', 'specs', 'gallery_images')
        }),
        ('Bike-Specific Fields', {
            'classes': ('collapse',),
            'fields': ('engine_cc', 'max_power', 'max_torque', 'transmission',
                       'fuel_capacity_l', 'seat_height_mm', 'weight_kg', 'mileage_kmpl',
                       'abs', 'color_options')
        }),
        ('Spare Part-Specific Fields', {
            'classes': ('collapse',),
            'fields': ('part_number', 'material', 'compatible_bikes', 'warranty_months', 'fitment_note')
        }),
    )

    def image_preview(self, obj):
        url = None
        if obj.image:
            url = obj.image.url
        elif obj.image_url:
            url = obj.image_url
        if url:
            return format_html('<img src="{}" style="max-height:100px;max-width:180px;object-fit:contain;border-radius:4px;" />', url)
        return '—'
    image_preview.short_description = 'Preview'


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
