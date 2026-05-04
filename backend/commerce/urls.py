from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import LeadViewSet, MarketingEventViewSet, OrderViewSet, ProductViewSet, ServicePackageViewSet, SiteSettingsView

router = DefaultRouter()
router.register('products', ProductViewSet, basename='products')
router.register('services', ServicePackageViewSet, basename='services')
router.register('leads', LeadViewSet, basename='leads')
router.register('orders', OrderViewSet, basename='orders')
router.register('marketing-events', MarketingEventViewSet, basename='marketing-events')

urlpatterns = [
    path('', include(router.urls)),
    path('site-settings/', SiteSettingsView.as_view(), name='site-settings'),
]
