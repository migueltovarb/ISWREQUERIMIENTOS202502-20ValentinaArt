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
from django.urls import path
from pedidos import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.menu, name="menu"),
    path('carrito/', views.carrito, name="carrito"),
    path('agregar/<int:producto_id>/', views.agregar_carrito, name="agregar"),
    path('eliminar/<int:item_id>/', views.eliminar_item, name='eliminar_item'),
    path('incrementar/<int:item_id>/', views.incrementar, name='incrementar'),
    path('decrementar/<int:item_id>/', views.decrementar, name='decrementar'),
    path('confirmar/', views.confirmar_pedido, name='confirmar_pedido'),
    path('estado/', views.estado_pedido, name='estado_pedido'),
    path('login/', views.login_simulado, name='login_simulado'),
    path('registro/', views.register_simulado, name='register_simulado'),
    path('checkout/', views.checkout, name='checkout'),
]
