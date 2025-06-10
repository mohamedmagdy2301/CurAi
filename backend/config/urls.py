from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions
from django.contrib import admin
from django.urls import path,include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

schema_view = get_schema_view(
    openapi.Info(
        title="My API",
        default_version='v1',
        description="Test API",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="mostafa.3mad.salah@gmail.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)
urlpatterns = [
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0),
             name='schema-swagger-ui'),
    path('swagger.yaml/', schema_view.without_ui(cache_timeout=0), name='swagger-yaml'),
    path('admin/', admin.site.urls),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', include('register_user.urls',namespace='register_user')),
    path('',include('rating.urls',namespace='rating')),
    path('',include('appointments.urls',namespace='appointments')),



    # path('', include('model_ai.urls'), name='model_ai'),

]
