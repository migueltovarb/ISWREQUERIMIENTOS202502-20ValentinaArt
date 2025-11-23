"""
URL configuration for restaurante project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path
from pedidos import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.register_view, name="home"),
    path('menu/', views.menu, name="menu"),
    path('carrito/', views.carrito, name="carrito"),
    path('agregar/<int:producto_id>/', views.agregar_carrito, name="agregar"),
    path('confirmar/', views.confirmar, name='confirmar'),
    path('checkout/', views.checkout, name='checkout'),
    path('personalizar/', views.personalizar, name='personalizar'),
    path('estado/', views.estado, name='estado'),
    path('status/', views.status, name='status'),
    path('login/', views.login_view, name='login'),
    path('register/', views.register_view, name='register'),
    # Catch requests that reference .html files (e.g. /confirmar/estado.html)
    # and redirect them to clean routes (e.g. /estado/)
    re_path(r'^(?P<any_html_path>.*\.html)$', views.redirect_html),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

