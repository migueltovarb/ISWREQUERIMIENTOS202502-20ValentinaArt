from django.shortcuts import render, HttpResponseRedirect, get_object_or_404
from .models import Vehiculo
from .forms import VehicleForm

def create_view(request):
    context = {}
    form = VehicleForm(request.POST or None)
    
    if form.is_valid():
        form.save()
        return HttpResponseRedirect("/")  # Esto te redirige al home
    
    context['form'] = form
    return render(request, "create_view.html", context)

def list_view(request):
    context = {}
    context["dataset"] = Vehiculo.objects.all()  # CORREGIDO
    return render(request, "list_view.html", context)
