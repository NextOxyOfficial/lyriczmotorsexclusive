from django import forms
from django.contrib import admin
from django.urls import reverse
from django.utils.html import format_html
from django.http import HttpResponseRedirect

from .models import Lead, MarketingEvent, ModificationGallery, ModificationService, Order, OrderItem, Product, ProductImage, ServicePackage, SiteSettings


# ── Custom widgets for JSON fields ───────────────────────────────────────────

class LinesWidget(forms.Textarea):
    """Textarea that stores each non-blank line as a JSON list item."""
    def __init__(self, *args, **kwargs):
        kwargs.setdefault('attrs', {}).update({'rows': 4, 'style': 'width:100%;font-family:monospace;font-size:13px;'})
        super().__init__(*args, **kwargs)

    def format_value(self, value):
        if isinstance(value, list):
            return '\n'.join(str(v) for v in value)
        return value or ''

    def value_from_datadict(self, data, files, name):
        raw = super().value_from_datadict(data, files, name) or ''
        return [line.strip() for line in raw.splitlines() if line.strip()]


class KeyValueWidget(forms.Textarea):
    """Textarea that stores 'Key: Value' lines as a JSON dict."""
    def __init__(self, *args, **kwargs):
        kwargs.setdefault('attrs', {}).update({
            'rows': 4,
            'style': 'width:100%;font-family:monospace;font-size:13px;',
            'placeholder': 'Engine: 998 cc\nPower: 189 bhp\nWeight: 193 kg',
        })
        super().__init__(*args, **kwargs)

    def format_value(self, value):
        if isinstance(value, dict):
            return '\n'.join(f'{k}: {v}' for k, v in value.items())
        return value or ''

    def value_from_datadict(self, data, files, name):
        raw = super().value_from_datadict(data, files, name) or ''
        result = {}
        for line in raw.splitlines():
            line = line.strip()
            if ':' in line:
                key, _, val = line.partition(':')
                key, val = key.strip(), val.strip()
                if key:
                    result[key] = val
        return result


class LinesField(forms.CharField):
    widget = LinesWidget

    def prepare_value(self, value):
        if isinstance(value, list):
            return '\n'.join(str(v) for v in value)
        return value or ''

    def to_python(self, value):
        if isinstance(value, list):
            return value
        if not value:
            return []
        return [line.strip() for line in value.splitlines() if line.strip()]


class KeyValueField(forms.CharField):
    widget = KeyValueWidget

    def prepare_value(self, value):
        if isinstance(value, dict):
            return '\n'.join(f'{k}: {v}' for k, v in value.items())
        return value or ''

    def to_python(self, value):
        if isinstance(value, dict):
            return value
        if not value:
            return {}
        result = {}
        for line in str(value).splitlines():
            line = line.strip()
            if ':' in line:
                key, _, val = line.partition(':')
                key, val = key.strip(), val.strip()
                if key:
                    result[key] = val
        return result


class ProductAdminForm(forms.ModelForm):
    specs = KeyValueField(
        required=False,
        label='Specs',
        help_text='প্রতি লাইনে: Key: Value — যেমন: Engine: 998 cc',
    )
    color_options = LinesField(
        required=False,
        label='Color Options',
        help_text='প্রতি লাইনে একটা রঙের নাম — যেমন: Matte Black',
    )
    gallery_images = LinesField(
        required=False,
        label='Gallery Images',
        help_text='প্রতি লাইনে একটা image URL',
    )
    compatible_bikes = LinesField(
        required=False,
        label='Compatible Bikes',
        help_text='প্রতি লাইনে একটা bike model নাম',
    )

    class Meta:
        model = Product
        fields = '__all__'


class ServicePackageAdminForm(forms.ModelForm):
    perks = LinesField(
        required=False,
        label='Perks',
        help_text='প্রতি লাইনে একটা perk — যেমন: Free oil change',
    )

    class Meta:
        model = ServicePackage
        fields = '__all__'


class ModificationServiceAdminForm(forms.ModelForm):
    perks = LinesField(
        required=False,
        label='Perks',
        help_text='প্রতি লাইনে একটা perk',
    )

    class Meta:
        model = ModificationService
        fields = '__all__'


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
        ('Homepage Hero', {
            'description': 'Controls the hero background on the homepage.',
            'fields': ('hero_media_type', 'hero_image_url', 'hero_video_url'),
        }),
        ('Service Page Hero', {
            'description': 'Controls the hero background on the /service page.',
            'fields': ('service_hero_media_type', 'service_hero_image_url', 'service_hero_video_url'),
        }),
        ('Modification Page Hero', {
            'description': 'Controls the hero background on the /modification page.',
            'fields': ('modification_hero_media_type', 'modification_hero_image_url', 'modification_hero_video_url'),
        }),
        ('Map Location', {
            'description': 'Paste the latitude and longitude from Google Maps to show the exact shop location in the footer.',
            'fields': ('map_lat', 'map_lng'),
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


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ('sort_order', 'image', 'image_preview_inline', 'image_url')
    readonly_fields = ('image_preview_inline',)

    def image_preview_inline(self, obj):
        url = obj.image.url if obj.image else obj.image_url
        if url:
            return format_html('<img src="{}" style="max-height:60px;max-width:120px;object-fit:cover;border-radius:3px;" />', url)
        return '—'
    image_preview_inline.short_description = 'Preview'


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    form = ProductAdminForm
    inlines = [ProductImageInline]
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
    form = ServicePackageAdminForm
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


@admin.register(ModificationService)
class ModificationServiceAdmin(admin.ModelAdmin):
    form = ModificationServiceAdminForm
    list_display = ('title', 'tag', 'price_display', 'duration', 'accent_color', 'sort_order', 'is_active')
    list_editable = ('sort_order', 'is_active')
    list_filter = ('is_active', 'accent_color')
    search_fields = ('title', 'description')


@admin.register(ModificationGallery)
class ModificationGalleryAdmin(admin.ModelAdmin):
    list_display = ('label', 'media_type', 'sort_order', 'is_active', 'gallery_preview')
    list_editable = ('sort_order', 'is_active')
    list_filter = ('media_type', 'is_active')
    readonly_fields = ('gallery_preview',)

    fieldsets = (
        ('Info', {'fields': ('label', 'media_type', 'sort_order', 'is_active')}),
        ('Image', {
            'description': 'Upload a file OR provide an external URL.',
            'fields': ('image', 'gallery_preview', 'image_url'),
        }),
        ('Video', {
            'fields': ('video_url',),
        }),
    )

    def gallery_preview(self, obj):
        url = obj.image.url if obj.image else obj.image_url
        if obj.media_type == 'image' and url:
            return format_html('<img src="{}" style="max-height:80px;max-width:160px;object-fit:cover;border-radius:4px;" />', url)
        if obj.media_type == 'video' and obj.video_url:
            return format_html('<a href="{}" target="_blank">▶ Preview Video</a>', obj.video_url)
        return '—'
    gallery_preview.short_description = 'Preview'
