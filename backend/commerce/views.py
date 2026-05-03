from rest_framework import filters, mixins, viewsets

from .models import Lead, MarketingEvent, Order, Product, ServicePackage
from .serializers import LeadSerializer, MarketingEventSerializer, OrderSerializer, ProductSerializer, ServicePackageSerializer


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'brand', 'category', 'short_description']
    ordering_fields = ['price', 'power_score', 'created_at']

    def get_queryset(self):
        queryset = super().get_queryset()
        product_type = self.request.query_params.get('type')
        featured = self.request.query_params.get('featured')
        if product_type:
            queryset = queryset.filter(product_type=product_type)
        if featured in {'true', '1'}:
            queryset = queryset.filter(is_featured=True)
        return queryset


class ServicePackageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ServicePackage.objects.all()
    serializer_class = ServicePackageSerializer


class LeadViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = Lead.objects.all()
    serializer_class = LeadSerializer


class OrderViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer


class MarketingEventViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = MarketingEvent.objects.all()
    serializer_class = MarketingEventSerializer

    def perform_create(self, serializer):
        forwarded_for = self.request.META.get('HTTP_X_FORWARDED_FOR')
        ip_address = forwarded_for.split(',')[0].strip() if forwarded_for else self.request.META.get('REMOTE_ADDR')
        serializer.save(
            ip_address=ip_address or None,
            user_agent=self.request.META.get('HTTP_USER_AGENT', ''),
        )
