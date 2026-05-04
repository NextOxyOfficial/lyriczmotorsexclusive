from django.db import models


class SiteSettings(models.Model):
    """Singleton model — only one row (pk=1) ever exists."""
    site_name = models.CharField(max_length=120, default='Lyricz Motors Exclusive')
    tagline = models.CharField(max_length=240, blank=True, default='Ride the Future')
    meta_description = models.CharField(max_length=400, blank=True, default='Premium bikes, performance spare parts, and service center bookings.')

    # Logo
    logo = models.ImageField(upload_to='site/', null=True, blank=True)
    logo_url = models.URLField(max_length=600, blank=True, help_text='External logo URL — used if no file uploaded')

    # Favicon
    favicon = models.ImageField(upload_to='site/', null=True, blank=True)
    favicon_url = models.URLField(max_length=600, blank=True, help_text='External favicon URL — used if no file uploaded')

    # OG Image
    og_image = models.ImageField(upload_to='site/', null=True, blank=True)
    og_image_url = models.URLField(max_length=600, blank=True)

    # Contact
    phone = models.CharField(max_length=40, blank=True, default='+880 17XX-XXXXXX')
    whatsapp = models.CharField(max_length=40, blank=True, help_text='WhatsApp number (digits only, with country code)')
    email = models.EmailField(blank=True)
    address = models.CharField(max_length=240, blank=True, default='Dhaka, Bangladesh')

    # Social media
    facebook_url = models.URLField(max_length=400, blank=True)
    instagram_url = models.URLField(max_length=400, blank=True)
    youtube_url = models.URLField(max_length=400, blank=True)
    tiktok_url = models.URLField(max_length=400, blank=True)
    twitter_url = models.URLField(max_length=400, blank=True)

    copyright_text = models.CharField(max_length=200, blank=True)

    # Hero media — image or YouTube/video for the homepage hero background
    HERO_IMAGE = 'image'
    HERO_VIDEO = 'video'
    HERO_MEDIA_CHOICES = [(HERO_IMAGE, 'Image'), (HERO_VIDEO, 'YouTube / Video')]
    hero_media_type = models.CharField(
        max_length=10, choices=HERO_MEDIA_CHOICES, default=HERO_IMAGE,
        help_text='Image shows a static background; Video embeds a YouTube autoplay loop.',
    )
    hero_image_url = models.URLField(
        max_length=600, blank=True,
        default='https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=2200&q=85',
        help_text='Hero background image URL (used when media type = Image)',
    )
    hero_video_url = models.URLField(
        max_length=600, blank=True,
        help_text='YouTube video URL (e.g. https://youtu.be/XXXX or watch?v=). Autoplay muted loop on homepage hero.',
    )

    # Service page hero
    service_hero_media_type = models.CharField(
        max_length=10, choices=[(HERO_IMAGE, 'Image'), (HERO_VIDEO, 'YouTube / Video')], default=HERO_IMAGE,
    )
    service_hero_image_url = models.URLField(
        max_length=600, blank=True,
        default='https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=2000&q=85',
        help_text='Service page hero background image URL',
    )
    service_hero_video_url = models.URLField(
        max_length=600, blank=True,
        help_text='YouTube URL for service page hero video (autoplay muted loop)',
    )

    # Modification page hero
    modification_hero_media_type = models.CharField(
        max_length=10, choices=[(HERO_IMAGE, 'Image'), (HERO_VIDEO, 'YouTube / Video')], default=HERO_IMAGE,
    )
    modification_hero_image_url = models.URLField(
        max_length=600, blank=True,
        default='https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=2000&q=85',
        help_text='Modification page hero background image URL',
    )
    modification_hero_video_url = models.URLField(
        max_length=600, blank=True,
        help_text='YouTube URL for modification page hero video (autoplay muted loop)',
    )

    # Map location
    map_lat = models.DecimalField(
        max_digits=10, decimal_places=7, null=True, blank=True,
        help_text='Latitude from Google Maps (e.g. 23.7806)',
    )
    map_lng = models.DecimalField(
        max_digits=10, decimal_places=7, null=True, blank=True,
        help_text='Longitude from Google Maps (e.g. 90.4193)',
    )

    class Meta:
        verbose_name = 'Site Settings'
        verbose_name_plural = 'Site Settings'

    def __str__(self):
        return self.site_name

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def get_settings(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class Product(models.Model):
    class ProductType(models.TextChoices):
        BIKE = 'bike', 'Bike'
        SPARE_PART = 'spare_part', 'Spare Part'

    class Status(models.TextChoices):
        IN_STOCK = 'in_stock', 'In Stock'
        LIMITED = 'limited', 'Limited'
        PREORDER = 'preorder', 'Preorder'

    name = models.CharField(max_length=180)
    slug = models.SlugField(max_length=200, unique=True)
    product_type = models.CharField(max_length=20, choices=ProductType.choices)
    category = models.CharField(max_length=80)
    brand = models.CharField(max_length=80)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    compare_at_price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.IN_STOCK)
    image_url = models.URLField(max_length=600, blank=True)
    image = models.ImageField(upload_to='products/', null=True, blank=True, help_text='Upload image file (overrides Image URL if set)')
    power_score = models.PositiveSmallIntegerField(default=80)
    short_description = models.CharField(max_length=240)
    specs = models.JSONField(default=dict, blank=True)
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # ── Bike-specific fields ──────────────────────────────────────────
    engine_cc = models.PositiveSmallIntegerField(null=True, blank=True, help_text='Engine displacement in cc')
    max_power = models.CharField(max_length=40, blank=True, help_text='e.g. 43 bhp @ 9000 rpm')
    max_torque = models.CharField(max_length=40, blank=True, help_text='e.g. 44 Nm @ 7000 rpm')
    transmission = models.CharField(max_length=40, blank=True, help_text='e.g. 6-speed manual')
    fuel_capacity_l = models.DecimalField(max_digits=5, decimal_places=1, null=True, blank=True)
    seat_height_mm = models.PositiveSmallIntegerField(null=True, blank=True)
    weight_kg = models.PositiveSmallIntegerField(null=True, blank=True, help_text='Kerb weight in kg')
    mileage_kmpl = models.DecimalField(max_digits=5, decimal_places=1, null=True, blank=True)
    abs = models.BooleanField(null=True, blank=True)
    color_options = models.JSONField(default=list, blank=True, help_text='List of available color names')
    gallery_images = models.JSONField(default=list, blank=True, help_text='List of additional image URLs for gallery/slider')

    # ── Spare-part-specific fields ────────────────────────────────────
    part_number = models.CharField(max_length=80, blank=True)
    material = models.CharField(max_length=120, blank=True)
    compatible_bikes = models.JSONField(default=list, blank=True, help_text='List of compatible bike models')
    warranty_months = models.PositiveSmallIntegerField(null=True, blank=True)
    fitment_note = models.CharField(max_length=240, blank=True, help_text='Installation note or fitment guide')

    class Meta:
        ordering = ['-is_featured', 'name']

    def __str__(self):
        return self.name


class ServicePackage(models.Model):
    title = models.CharField(max_length=140)
    slug = models.SlugField(max_length=180, unique=True)
    tier = models.CharField(max_length=60)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration = models.CharField(max_length=80)
    description = models.CharField(max_length=260)
    perks = models.JSONField(default=list, blank=True)
    is_featured = models.BooleanField(default=False)

    class Meta:
        ordering = ['price']

    def __str__(self):
        return self.title


class Lead(models.Model):
    class Intent(models.TextChoices):
        BUY_BIKE = 'buy_bike', 'Buy Bike'
        BUY_PART = 'buy_part', 'Buy Spare Part'
        SERVICE = 'service', 'Book Service'
        FINANCE = 'finance', 'Finance'
        GENERAL = 'general', 'General Enquiry'

    name = models.CharField(max_length=120)
    phone = models.CharField(max_length=40)
    email = models.EmailField(blank=True)
    intent = models.CharField(max_length=30, choices=Intent.choices)
    message = models.TextField(blank=True)
    source = models.CharField(max_length=120, blank=True)
    utm_source = models.CharField(max_length=120, blank=True)
    utm_medium = models.CharField(max_length=120, blank=True)
    utm_campaign = models.CharField(max_length=160, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.name} - {self.intent}'


class Order(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        CONFIRMED = 'confirmed', 'Confirmed'
        PROCESSING = 'processing', 'Processing'
        SHIPPED = 'shipped', 'Shipped'
        DELIVERED = 'delivered', 'Delivered'
        CANCELLED = 'cancelled', 'Cancelled'

    class PaymentMethod(models.TextChoices):
        BKASH = 'bkash', 'bKash'
        NAGAD = 'nagad', 'Nagad'
        COD = 'cod', 'Cash on Delivery'
        BANK = 'bank', 'Bank Transfer'

    class DeliveryMethod(models.TextChoices):
        PICKUP = 'pickup', 'Showroom Pickup'
        DELIVERY = 'delivery', 'Home Delivery'

    order_number = models.CharField(max_length=30, unique=True)
    customer_name = models.CharField(max_length=120)
    customer_phone = models.CharField(max_length=40)
    customer_email = models.EmailField(blank=True)
    address = models.TextField(blank=True)
    delivery_method = models.CharField(max_length=20, choices=DeliveryMethod.choices, default=DeliveryMethod.PICKUP)
    payment_method = models.CharField(max_length=20, choices=PaymentMethod.choices, default=PaymentMethod.COD)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    subtotal = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    notes = models.TextField(blank=True)
    utm_source = models.CharField(max_length=120, blank=True)
    utm_medium = models.CharField(max_length=120, blank=True)
    utm_campaign = models.CharField(max_length=160, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'#{self.order_number} – {self.customer_name}'


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product_id = models.PositiveIntegerField()
    product_name = models.CharField(max_length=180)
    product_type = models.CharField(max_length=20)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    quantity = models.PositiveSmallIntegerField(default=1)
    image_url = models.URLField(max_length=600, blank=True)

    def __str__(self):
        return f'{self.product_name} x{self.quantity}'


class MarketingEvent(models.Model):
    event_name = models.CharField(max_length=80)
    event_id = models.CharField(max_length=120, blank=True)
    page_url = models.URLField(max_length=800, blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    fbp = models.CharField(max_length=220, blank=True)
    fbc = models.CharField(max_length=220, blank=True)
    gclid = models.CharField(max_length=220, blank=True)
    user_agent = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.event_name


class ModificationService(models.Model):
    """A modification service offered (e.g. Full Wrap, Custom Paint)."""
    title = models.CharField(max_length=140)
    tag = models.CharField(max_length=60, blank=True, help_text='e.g. Most Popular, Premium')
    price_display = models.CharField(max_length=40, help_text='e.g. 8,500 or 25,000+')
    duration = models.CharField(max_length=60, help_text='e.g. 1 day, Half day')
    description = models.CharField(max_length=300)
    perks = models.JSONField(default=list, blank=True, help_text='List of perk strings')
    accent_color = models.CharField(
        max_length=30, blank=True, default='volt',
        help_text='Accent colour key: volt | ignition | boost | slate',
    )
    sort_order = models.PositiveSmallIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['sort_order', 'id']
        verbose_name = 'Modification Service'
        verbose_name_plural = 'Modification Services'

    def __str__(self):
        return self.title


class ModificationGallery(models.Model):
    """Gallery item for the Modification Center page — image or video."""
    MEDIA_TYPE_CHOICES = [
        ('image', 'Image'),
        ('video', 'Video'),
    ]
    label = models.CharField(max_length=120)
    media_type = models.CharField(max_length=10, choices=MEDIA_TYPE_CHOICES, default='image')
    # For images: upload or URL
    image = models.ImageField(upload_to='modification/', null=True, blank=True)
    image_url = models.URLField(max_length=600, blank=True, help_text='External image URL (used if no file uploaded)')
    # For videos: YouTube/Vimeo embed URL or direct mp4
    video_url = models.URLField(max_length=600, blank=True, help_text='YouTube/Vimeo embed URL or direct video link')
    sort_order = models.PositiveSmallIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['sort_order', 'id']
        verbose_name = 'Modification Gallery Item'
        verbose_name_plural = 'Modification Gallery'

    def __str__(self):
        return self.label
