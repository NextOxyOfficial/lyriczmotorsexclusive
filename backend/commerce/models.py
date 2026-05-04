from django.db import models


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
    image_url = models.URLField(max_length=600)
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
