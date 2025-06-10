from django.contrib import admin
from django.apps import apps
from .models import CustomUser,Specialization
from django.utils.html import mark_safe


class IsApprovedFilter(admin.SimpleListFilter):
    """فلتر مخصص لعرض المستخدمين غير الموافق عليهم"""
    title = 'Approval Status'  # عنوان الفلتر في Django Admin
    parameter_name = 'is_approved'

    def lookups(self, request, model_admin):
        """تحديد الخيارات داخل الفلتر"""
        return [
            ('approved', 'Approved'),
            ('not_approved', 'Not Approved'),
        ]

    def queryset(self, request, queryset):
        """تحديد الفلترة بناءً على الخيار المختار"""
        if self.value() == 'approved':
            return queryset.filter(is_approved=True)
        elif self.value() == 'not_approved':
            return queryset.filter(is_approved=False)
        return queryset

@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('id', 'profile_picture_thumbnail', 'profile_certificate_thumbnail', 'username', 'first_name', 'last_name', 'email', 'phone_number', 'age', 'gender', 'bio', 'latitude', 'longitude', 'role', 'specialization', 'is_approved', 'is_active', 'bonus_points', 'date_joined',)
    search_fields = ('username', 'email')
    list_filter = ('is_active', 'gender', 'role', 'specialization', IsApprovedFilter)
    ordering = ('-date_joined',)
    actions = ['approve_doctors']


    fieldsets = (
        (None, {
            'fields': ('username', 'password', 'first_name', 'last_name', 'email', 'phone_number', 'age', 'gender','bonus_points', 'profile_picture')
        }),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'is_approved')
        }),
    )

    def approve_doctors(self, request, queryset):
        doctors = queryset.filter(role='doctor', is_approved=False)
        if doctors.exists():
            count = doctors.count()
            doctors.update(is_approved=True, is_active=True)
            self.message_user(request, f"Successfully approved {count} doctor(s)!")
        else:
            self.message_user(request, "No doctors found that require approval.", level='info')

    approve_doctors.short_description = "Approve selected doctors"

    def profile_picture_thumbnail(self, obj):
        if obj.profile_picture:
            return mark_safe(f'<img src="{obj.profile_picture.url}" width="50" height="50" />')
        return "No image"

    profile_picture_thumbnail.short_description = 'Profile Picture'
    def profile_certificate_thumbnail(self, obj):
        if obj.profile_certificate:
            return mark_safe(f'<img src="{obj.profile_certificate.url}" width="50" height="50" />')
        return "No certificate"

    profile_certificate_thumbnail.short_description = 'Profile Certificate'



@admin.register(Specialization)
class SpecializationAdmin(admin.ModelAdmin):
    list_display = ('image_thumbnail','id', 'name', )
    search_fields = ('name',)

    def image_thumbnail(self, obj):
        """عرض صورة التخصص بشكل مصغر في الواجهة"""
        if obj.image:
            return mark_safe(f'<img src="{obj.image.url}" width="50" height="50" />')
        return "No image"

    image_thumbnail.short_description = 'Specialization Image'
