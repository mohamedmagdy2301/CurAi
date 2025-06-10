import django_filters
from django.db.models import Count
from .models import Specialization, CustomUser
from rating.models import DoctorReview
from django.db.models import Count, Avg

class SpecializationFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(field_name='name', lookup_expr='icontains', label="Specialization Name")
    min_doctors = django_filters.NumberFilter(method='filter_min_doctor_count', label="Min Doctor Count")  # الحد الأدنى لعدد الأطباء

    class Meta:
        model = Specialization
        fields = ['name']

    def filter_min_doctor_count(self, queryset, name, value):
        """فلترة التخصصات بناءً على الحد الأدنى لعدد الأطباء الموافق عليهم"""
        return queryset.annotate(doctor_count=Count('customuser')).filter(doctor_count__gte=value)

class DoctorFilter(django_filters.FilterSet):
    specialization = django_filters.CharFilter(field_name='specialization__name', lookup_expr='icontains',label="Specialization")
    min_price = django_filters.NumberFilter(field_name='consultation_price', lookup_expr='gte', label="Min Price")  # البحث بالسعر الأدنى
    max_price = django_filters.NumberFilter(field_name='consultation_price', lookup_expr='lte', label="Max Price")  # البحث بالسعر الأعلى
    location = django_filters.CharFilter(field_name='location', lookup_expr='icontains')  # البحث بالموقع
    min_rating = django_filters.NumberFilter(method='filter_min_rating', label="Min Rating")  # فلترة بناءً على الحد الأدنى للتقييم
    max_rating = django_filters.NumberFilter(method='filter_max_rating', label="Max Rating")  # فلترة بناءً على الحد الأقصى للتقييم

    class Meta:
        model = CustomUser
        fields = ['specialization', 'min_price', 'max_price', 'location', 'min_rating', 'max_rating']

    def filter_min_rating(self, queryset, name, value):
        """فلترة الأطباء بناءً على الحد الأدنى للتقييم"""
        return queryset.annotate(avg_rating=Avg('doctor_reviews__rating')).filter(avg_rating__gte=value)

    def filter_max_rating(self, queryset, name, value):
        """فلترة الأطباء بناءً على الحد الأقصى للتقييم"""
        return queryset.annotate(avg_rating=Avg('doctor_reviews__rating')).filter(avg_rating__lte=value)