from decimal import Decimal

from django.core.management.base import BaseCommand

from commerce.models import Product, ServicePackage


PRODUCTS = [
    {
        'name': 'Shadowblade R9 Hyper Sport',
        'slug': 'shadowblade-r9-hyper-sport',
        'product_type': Product.ProductType.BIKE,
        'category': 'Hyper Sport',
        'brand': 'Lyricz Motors',
        'price': Decimal('1450000'),
        'compare_at_price': Decimal('1580000'),
        'status': Product.Status.LIMITED,
        'image_url': 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=1400&q=85',
        'power_score': 96,
        'short_description': 'Track-ready premium sport bike with aggressive street tuning and elite braking setup.',
        'specs': {'engine': '998cc', 'mode': 'Track / Street', 'stock': '2 units', 'warranty': '2 years'},
        'is_featured': True,
    },
    {
        'name': 'Neon Raider 300 Street Kit',
        'slug': 'neon-raider-300-street-kit',
        'product_type': Product.ProductType.BIKE,
        'category': 'Street Fighter',
        'brand': 'Yamaha',
        'price': Decimal('520000'),
        'compare_at_price': None,
        'status': Product.Status.IN_STOCK,
        'image_url': 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1400&q=85',
        'power_score': 88,
        'short_description': 'Urban performance build for fast commutes, weekend rides, and sharp night presence.',
        'specs': {'engine': '321cc', 'mode': 'City Boost', 'stock': '6 units', 'warranty': '1 year'},
        'is_featured': True,
    },
    {
        'name': 'Titan Touring GT-X',
        'slug': 'titan-touring-gt-x',
        'product_type': Product.ProductType.BIKE,
        'category': 'Touring',
        'brand': 'Honda',
        'price': Decimal('875000'),
        'compare_at_price': Decimal('910000'),
        'status': Product.Status.PREORDER,
        'image_url': 'https://images.unsplash.com/photo-1558980664-769d59546b3d?w=1400&q=85',
        'power_score': 91,
        'short_description': 'Long-distance comfort package with loaded luggage support and premium road protection.',
        'specs': {'engine': '745cc', 'mode': 'Touring', 'stock': 'preorder', 'warranty': '2 years'},
        'is_featured': False,
    },
    {
        'name': 'Carbon Apex Exhaust System',
        'slug': 'carbon-apex-exhaust-system',
        'product_type': Product.ProductType.SPARE_PART,
        'category': 'Performance Exhaust',
        'brand': 'Apex Works',
        'price': Decimal('68000'),
        'compare_at_price': Decimal('76000'),
        'status': Product.Status.IN_STOCK,
        'image_url': 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=1400&q=85',
        'power_score': 84,
        'short_description': 'Lightweight carbon exhaust tuned for deeper tone and improved throttle response.',
        'specs': {'fitment': '250cc-650cc', 'material': 'Carbon fiber', 'install': 'Service center'},
        'is_featured': True,
    },
    {
        'name': 'Racing Brake Armor Kit',
        'slug': 'racing-brake-armor-kit',
        'product_type': Product.ProductType.SPARE_PART,
        'category': 'Brake System',
        'brand': 'Brembo Style',
        'price': Decimal('42500'),
        'compare_at_price': None,
        'status': Product.Status.LIMITED,
        'image_url': 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=1400&q=85',
        'power_score': 89,
        'short_description': 'Premium brake upgrade bundle for confident high-speed control and heat resistance.',
        'specs': {'fitment': 'Sport / Naked', 'includes': 'Pads, lines, rotors', 'install': '90 min'},
        'is_featured': False,
    },
]

SERVICES = [
    {
        'title': 'Pit Boss Premium Tune',
        'slug': 'pit-boss-premium-tune',
        'tier': 'Performance',
        'price': Decimal('12500'),
        'duration': '3 hours',
        'description': 'Full diagnostic, oil, chain, brake, throttle, and ride-mode calibration for premium bikes.',
        'perks': ['Digital inspection report', 'Priority bay', 'Road test', 'Ad-ready service reminder'],
        'is_featured': True,
    },
    {
        'title': 'Armor Wash and Ceramic Shield',
        'slug': 'armor-wash-ceramic-shield',
        'tier': 'Detailing',
        'price': Decimal('8500'),
        'duration': '2 hours',
        'description': 'Premium wash, degrease, polish, and ceramic shield for showroom-level delivery.',
        'perks': ['Ceramic finish', 'Chain clean', 'Photo-ready delivery', 'Pickup slot'],
        'is_featured': False,
    },
    {
        'title': 'Track Day Readiness Check',
        'slug': 'track-day-readiness-check',
        'tier': 'Race Prep',
        'price': Decimal('18500'),
        'duration': 'Half day',
        'description': 'Suspension, brake, tire, cooling, and safety inspection for aggressive performance riding.',
        'perks': ['Torque audit', 'Suspension baseline', 'Brake heat check', 'Mechanic notes'],
        'is_featured': True,
    },
]


class Command(BaseCommand):
    help = 'Seed Lyricz Motors ecommerce demo products and service packages.'

    def handle(self, *args, **options):
        for product_data in PRODUCTS:
            Product.objects.update_or_create(slug=product_data['slug'], defaults=product_data)

        for service_data in SERVICES:
            ServicePackage.objects.update_or_create(slug=service_data['slug'], defaults=service_data)

        self.stdout.write(self.style.SUCCESS('Commerce catalog seeded successfully.'))