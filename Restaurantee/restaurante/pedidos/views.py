from django.shortcuts import render

# Create your views here.

from django.shortcuts import render, redirect, get_object_or_404
from .models import Producto, Pedido, ItemPedido
from django.views.decorators.http import require_http_methods

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


def eliminar_item(request, item_id):
    item = get_object_or_404(ItemPedido, id=item_id)
    pedido = item.pedido
    item.delete()
    # actualizar total
    items = pedido.items.all()
    pedido.total = sum(i.subtotal() for i in items)
    pedido.save()
    return redirect('carrito')


def incrementar(request, item_id):
    item = get_object_or_404(ItemPedido, id=item_id)
    item.cantidad += 1
    item.save()
    pedido = item.pedido
    pedido.total = sum(i.subtotal() for i in pedido.items.all())
    pedido.save()
    return redirect('carrito')


def decrementar(request, item_id):
    item = get_object_or_404(ItemPedido, id=item_id)
    if item.cantidad > 1:
        item.cantidad -= 1
        item.save()
    else:
        item.delete()
    pedido = item.pedido
    # si el pedido no tiene items, borrar session
    items = pedido.items.all()
    if items:
        pedido.total = sum(i.subtotal() for i in items)
        pedido.save()
    else:
        try:
            del request.session['pedido_id']
        except KeyError:
            pass
        pedido.delete()
    return redirect('carrito')


def confirmar_pedido(request):
    pedido_id = request.session.get('pedido_id')
    if not pedido_id:
        return redirect('menu')
    pedido = get_object_or_404(Pedido, id=pedido_id)
    # recalcular total por seguridad
    pedido.total = sum(i.subtotal() for i in pedido.items.all())
    pedido.estado = 'recibido'
    pedido.save()
    # marcar como confirmado en sesión
    request.session['pedido_confirmado'] = True
    return render(request, 'confirmacion.html', {'pedido': pedido})


def estado_pedido(request):
    pedido_id = request.session.get('pedido_id')
    if not pedido_id:
        return redirect('menu')
    pedido = get_object_or_404(Pedido, id=pedido_id)

    estados_orden = ['recibido', 'preparacion', 'listo', 'camino']

    # permitir avanzar estado mediante query param ?accion=avanzar para simular
    accion = request.GET.get('accion')
    if accion == 'avanzar':
        try:
            idx = estados_orden.index(pedido.estado)
            if idx < len(estados_orden) - 1:
                pedido.estado = estados_orden[idx + 1]
                pedido.save()
        except ValueError:
            pass

    return render(request, 'estado.html', {'pedido': pedido, 'estados_orden': estados_orden})


def login_simulado(request):
    # inicio de sesión simulado: almacena el nombre de usuario en sesión
    if request.method == 'POST':
        nombre = request.POST.get('nombre')
        telefono = request.POST.get('telefono')
        request.session['usuario_simulado'] = {'nombre': nombre, 'telefono': telefono}
        return redirect('menu')
    return render(request, 'login.html')


def register_simulado(request):
    # registro simulado: no guarda en DB, solo guarda en sesión y redirige
    if request.method == 'POST':
        nombre = request.POST.get('nombre')
        correo = request.POST.get('correo')
        telefono = request.POST.get('telefono')
        request.session['usuario_simulado'] = {'nombre': nombre, 'correo': correo, 'telefono': telefono}
        return redirect('menu')
    return render(request, 'register.html')


@require_http_methods(["GET", "POST"])
def checkout(request):
    pedido_id = request.session.get('pedido_id')
    if not pedido_id:
        return redirect('menu')
    pedido = get_object_or_404(Pedido, id=pedido_id)
    items = pedido.items.all()
    total = sum(i.subtotal() for i in items)

    if request.method == 'POST':
        nombre = request.POST.get('nombre') or request.session.get('usuario_simulado', {}).get('nombre')
        telefono = request.POST.get('telefono') or request.session.get('usuario_simulado', {}).get('telefono')
        metodo_pago = request.POST.get('metodo_pago')
        tipo_entrega = request.POST.get('tipo_entrega')

        # guardar datos básicos en sesión (simulación)
        request.session['ultimo_pago'] = {'nombre': nombre, 'telefono': telefono, 'metodo_pago': metodo_pago, 'tipo_entrega': tipo_entrega}

        # actualizar pedido
        pedido.total = total
        pedido.estado = 'recibido'
        pedido.save()

        return redirect('confirmar_pedido')

    # GET -> mostrar formulario de checkout con resumen
    usuario = request.session.get('usuario_simulado', {})
    return render(request, 'checkout.html', {'pedido': pedido, 'items': items, 'total': total, 'usuario': usuario})
