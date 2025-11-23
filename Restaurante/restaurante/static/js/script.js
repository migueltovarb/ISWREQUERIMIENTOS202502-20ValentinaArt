let carrito = [];

function agregar(id) {
    const prod = productos.find(p => p.id === id);
    const item = carrito.find(i => i.id === id);

    if (item) {
        item.cantidad++;
    } else {
        carrito.push({ ...prod, cantidad: 1 });
    }

    alert("Producto agregado al carrito 🧺");
}

function mostrarCarrito() {
    const cont = document.getElementById("carrito");
    const subtotalSpan = document.getElementById("subtotal");

    cont.innerHTML = "";
    let subtotal = 0;

    carrito.forEach(i => {
        subtotal += i.precio * i.cantidad;

        cont.innerHTML += `
            <div class="cart-item">
                <strong>${i.nombre}</strong>
                <span>$${i.precio * i.cantidad}</span>
            </div>
        `;
    });

    subtotalSpan.textContent = subtotal;
}

function cambiarEstado(estado) {
    const estados = ["recibido", "preparacion", "listo", "camino"];
    estados.forEach(e => {
        document.getElementById(e).classList.remove("active");
    });

    document.getElementById(estado).classList.add("active");
}
