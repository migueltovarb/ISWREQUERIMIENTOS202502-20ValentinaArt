from django.shortcuts import render

# Create your views here.

from django.shortcuts import render, redirect, get_object_or_404
from .models import Producto, Pedido, ItemPedido

def menu(request):
    productos = Producto.objects.all()
    return render(request, "menu.html", {"productos": productos})


def agregar_carrito(request, producto_id):
    producto = get_object_or_404(Producto, id=producto_id)

    pedido_id = request.session.get("pedido_id", None)

    if pedido_id is None:
        pedido = Pedido.objects.create()
        request.session["pedido_id"] = pedido.id
    else:
        pedido = Pedido.objects.get(id=pedido_id)

    item, creado = ItemPedido.objects.get_or_create(
        pedido=pedido,
        producto=producto,
        defaults={"cantidad": 1},
    )

    if not creado:
        item.cantidad += 1
        item.save()

    return redirect("carrito")


def carrito(request):
    pedido_id = request.session.get("pedido_id", None)
    
    if not pedido_id:
        return render(request, "carrito.html", {"items": [], "total": 0})

    pedido = Pedido.objects.get(id=pedido_id)
    items = pedido.items.all()
    total = sum(i.subtotal() for i in items)

    pedido.total = total
    pedido.save()

    return render(request, "carrito.html", {"items": items, "total": total})


# Vistas simples para páginas estáticas/plantillas sueltas
def confirmar(request):
    return render(request, "confirmar.html")


def checkout(request):
    return render(request, "checkout.html")


def personalizar(request):
    return render(request, "personalizar.html")


def estado(request):
    return render(request, "estado.html")


def status(request):
    return render(request, "status.html")


def login_view(request):
    return render(request, "login.html")


def register_view(request):
    return render(request, "register.html")

from django.shortcuts import render

def index(request):
    return render(request, 'index.html')


def redirect_html(request, any_html_path):
    """Redirect requests for paths that end with .html to the clean route.

    Examples:
    - /confirmar/estado.html  -> /estado/
    - /carrito.html           -> /carrito/
    - /index.html             -> /
    """
    # obtener el último segmento y remover '.html'
    path = any_html_path or request.path
    # Asegurar string
    path = str(path)
    last = path.rstrip('/').split('/')[-1]
    name = last.replace('.html', '')

    if name.lower() in ('index', 'home'):
        return redirect('/')

    return redirect(f'/{name}/')


