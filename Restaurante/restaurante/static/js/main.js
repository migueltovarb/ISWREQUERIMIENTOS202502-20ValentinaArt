// ========================================
// SISTEMA DE CARRITO - EL CLAUSTRO
// ========================================

// Inicializar carrito
let cart = [];

// Cargar carrito al iniciar
function initCart() {
    try {
        const savedCart = localStorage.getItem("cart");
        cart = savedCart ? JSON.parse(savedCart) : [];
        console.log("Carrito cargado:", cart);
    } catch (error) {
        console.error("Error cargando carrito:", error);
        cart = [];
    }
}

// Guardar carrito
function saveCart() {
    try {
        localStorage.setItem("cart", JSON.stringify(cart));
        console.log("Carrito guardado:", cart);
    } catch (error) {
        console.error("Error guardando carrito:", error);
    }
}

// ========================================
// AGREGAR AL CARRITO
// ========================================
function addToCart(name, price) {
    console.log("Agregando al carrito:", name, price);
    
    // Buscar si el producto ya existe
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
        console.log("Cantidad aumentada:", existingItem);
    } else {
        const newItem = { 
            name: name, 
            price: price,
            quantity: 1,
            id: Date.now()
        };
        cart.push(newItem);
        console.log("Nuevo producto agregado:", newItem);
    }
    
    saveCart();
    showNotification(`✓ ${name} agregado al carrito`);
    updateCartBadge();
}

// ========================================
// ACTUALIZAR BADGE DEL CARRITO
// ========================================
function updateCartBadge() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    // Actualizar elementos de contador existentes
    const selectors = ['.cart-count', '#cart-count', '.cart-badge'];
    let found = false;
    selectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
            el.textContent = totalItems;
            el.style.display = totalItems > 0 ? 'inline-block' : 'none';
            found = true;
        });
    });

    // Crear un botón flotante si no existe (móvil/desktop) y actualizar su contador
    if (!document.querySelector('.floating-cart')) {
        // estilos mínimos para el botón flotante
        const styleId = 'floating-cart-styles';
        if (!document.getElementById(styleId)) {
            const st = document.createElement('style');
            st.id = styleId;
            st.textContent = `
                .floating-cart{position:fixed;right:20px;bottom:20px;background:linear-gradient(135deg,#D87C4A,#9E7B4A);color:#fff;padding:12px 16px;border-radius:999px;display:flex;align-items:center;gap:8px;box-shadow:0 8px 24px rgba(0,0,0,0.18);z-index:10000;text-decoration:none;font-weight:700}
                .floating-cart:hover{transform:translateY(-3px)}
                .floating-cart-count{background:rgba(255,255,255,0.12);padding:4px 8px;border-radius:999px}
            `;
            document.head.appendChild(st);
        }

            const a = document.createElement('a');
            a.className = 'floating-cart';
            a.href = '/carrito/';
        a.setAttribute('aria-label', 'Ver carrito');
        a.innerHTML = `🛒 <span class="floating-cart-count">${totalItems}</span>`;
        a.style.display = totalItems > 0 ? 'flex' : 'none';
        document.body.appendChild(a);
    } else {
        const fc = document.querySelector('.floating-cart-count');
        if (fc) fc.textContent = totalItems;
        const parent = document.querySelector('.floating-cart');
        if (parent) parent.style.display = totalItems > 0 ? 'flex' : 'none';
    }

    console.log("Total items en carrito:", totalItems);
}

// ========================================
// MOSTRAR NOTIFICACIÓN
// ========================================
function showNotification(message) {
    // Remover notificación anterior si existe
    const existing = document.querySelector('.notification-toast');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = 'notification-toast';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 30px;
        right: 30px;
        background: linear-gradient(135deg, #D87C4A 0%, #9E9A6A 100%);
        color: white;
        padding: 18px 30px;
        border-radius: 50px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        font-weight: 600;
        font-size: 1rem;
        animation: slideInRight 0.4s ease, slideOutRight 0.4s ease 2.5s;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 3000);
}

// ========================================
// CARGAR CARRITO EN PÁGINA
// ========================================
function loadCart() {
    const container = document.getElementById("cart-container");
    if (!container) return;

    initCart();

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <div style="font-size: 5rem; margin-bottom: 20px;">🛒</div>
                <h2>Tu carrito está vacío</h2>
                <p style="color: #9E9A6A; margin: 20px 0;">Agrega algunos deliciosos platillos del menú</p>
                    <a href="/menu/" class="btn">Explorar Menú</a>
            </div>
        `;
        return;
    }

    container.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p class="item-price">$${item.price.toLocaleString()} c/u</p>
            </div>
            <div class="cart-controls">
                <div class="qty-control">
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                    <span class="qty-display">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Eliminar</button>
            </div>
        </div>
    `).join("");
}

// ========================================
// ACTUALIZAR CANTIDAD
// ========================================
function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(id);
        return;
    }
    
    saveCart();
    loadCart();
}

// ========================================
// ELIMINAR DEL CARRITO
// ========================================
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    loadCart();
    showNotification("Producto eliminado del carrito");
}

// ========================================
// CARGAR TOTALES
// ========================================
function loadTotals() {
    initCart();
    
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const impuestos = Math.round(subtotal * 0.10);
    const total = subtotal + impuestos;
    
    const subtotalEl = document.getElementById("subtotal");
    const impuestosEl = document.getElementById("impuestos");
    const totalEl = document.getElementById("total");
    
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toLocaleString()}`;
    if (impuestosEl) impuestosEl.textContent = `$${impuestos.toLocaleString()}`;
    if (totalEl) totalEl.textContent = `$${total.toLocaleString()}`;
}

// ========================================
// CONFIRMAR PEDIDO
// ========================================
function confirmarPedido() {
    if (cart.length === 0) {
        alert("Tu carrito está vacío");
        return;
    }
    // En lugar de finalizar el pedido aquí, llevar al usuario al flujo de pago/entrega (checkout)
    try{
        window.location.href = '/checkout/';
    }catch(e){
        console.error('No se pudo redirigir a checkout', e);
    }
}

// Finalizar orden desde la página de checkout: leer método de pago y entrega, guardar y redirigir a estado
function finalizeOrder(){
    console.log('finalizeOrder() invoked');
    initCart();
    if(cart.length === 0){
        alert('Tu carrito está vacío');
        return;
    }

    const delivery = document.querySelector('input[name="delivery"]:checked');
    const payment = document.querySelector('input[name="payment"]:checked');

    if(!delivery){
        alert('Por favor selecciona si vas a recoger o deseas entrega');
        return;
    }
    if(!payment){
        alert('Por favor selecciona un método de pago');
        return;
    }

    const deliveryVal = delivery.value;
    const paymentVal = payment.value;

    localStorage.setItem('deliveryMethod', deliveryVal);
    localStorage.setItem('paymentMethod', paymentVal);
    localStorage.setItem('pedidoConfirmado', 'true');
    localStorage.setItem('fechaPedido', new Date().toLocaleString('es-CO', {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    }));

    // Limpiar carrito y guardar
    cart = [];
    saveCart();

    // Redirigir a página de estado/seguimiento
    try{
        window.location.href = '/estado/';
    }catch(e){
        console.error('No se pudo redirigir a estado', e);
    }
}

// ========================================
// ANIMACIONES CSS
// ========================================
function addAnimations() {
    if (document.getElementById("notification-animations")) return;
    
    const style = document.createElement("style");
    style.id = "notification-animations";
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// ========================================
// RENDER ADMINISTRACIÓN DE USUARIO (HEADER)
// ========================================
function signOut() {
    try {
        localStorage.removeItem('user');
    } catch (e) { console.error('Error signing out', e); }
    // Redirigir al inicio para que el usuario quede en la página principal después de cerrar sesión
        window.location.href = '/menu/';
}

function renderUserControls() {
    // Buscar un nav dentro del header o un contenedor apropiado
    const nav = document.querySelector('header nav') || document.querySelector('nav') || document.querySelector('.navbar');
    let container = nav;

    if (!container) {
        // Si no hay nav, crear pequeño contenedor en header si existe
        const header = document.querySelector('header') || document.querySelector('.container');
        if (header) {
            container = document.createElement('nav');
            header.appendChild(container);
        } else {
            // fallback: crear en body (fixed top-right)
            container = document.createElement('div');
            container.style.position = 'fixed';
            container.style.top = '12px';
            container.style.right = '18px';
            document.body.appendChild(container);
        }
    }

    // Limpiar contenido previo
    const prev = container.querySelector('.user-controls');
    if (prev) prev.remove();

    const userJson = localStorage.getItem('user');
    const controls = document.createElement('div');
    controls.className = 'user-controls';

    if (userJson) {
        try {
            const user = JSON.parse(userJson);
            const username = (user.email || '').split('@')[0] || 'Usuario';
            controls.innerHTML = `<span class="user-badge">Hola, ${username}</span> <button class="btn small" id="signout-btn">Cerrar sesión</button>`;
        } catch (e) {
            controls.innerHTML = `<a class="btn" href="/login/">Iniciar</a> <a class="btn" href="/register/">Registro</a>`;
        }
    } else {
            controls.innerHTML = `<a class="btn" href="/login/">Iniciar</a> <a class="btn" href="/register/" style="margin-left:8px">Registro</a>`;
    }

    container.appendChild(controls);

    const signoutBtn = document.getElementById('signout-btn');
    if (signoutBtn) signoutBtn.addEventListener('click', signOut);
}

// ========================================
// INICIALIZACIÓN
// ========================================
document.addEventListener("DOMContentLoaded", () => {
    console.log("Página cargada");
    
    initCart();
    addAnimations();
    updateCartBadge();
    renderUserControls();
    loadCart();
    loadTotals();
    
    // Verificar botón de confirmar
    const confirmBtn = document.getElementById("confirm-btn");
    if (confirmBtn && cart.length === 0) {
        confirmBtn.style.opacity = "0.5";
        confirmBtn.style.pointerEvents = "none";
    }
});

// Normalizar enlaces relativos a archivos .html que puedan existir en las plantillas
function normalizeRelativeHtmlLinks(){
    const map = {
        'menu.html':'/menu/',
        'carrito.html':'/carrito/',
        'confirmar.html':'/confirmar/',
        'checkout.html':'/checkout/',
        'personalizar.html':'/personalizar/',
        'estado.html':'/estado/',
        'status.html':'/status/',
        'login.html':'/login/',
        'register.html':'/register/',
        'index.html':'/'
    };

    // Anchors
    document.querySelectorAll('a[href]').forEach(a=>{
        try{
            const h = a.getAttribute('href');
            if(!h) return;
            // href like "estado.html" or "./estado.html" or "../estado.html"
            const name = h.replace(/^\.\/?|^\.\.\//,'');
            if(map[name]){
                a.setAttribute('href', map[name]);
            }
        }catch(e){}
    });

    // onclick attributes that set location.href
    document.querySelectorAll('[onclick]').forEach(el=>{
        try{
            const code = el.getAttribute('onclick');
            if(!code) return;
            Object.keys(map).forEach(k=>{
                if(code.includes(k)){
                    const newCode = code.split(k).join(map[k]);
                    el.setAttribute('onclick', newCode);
                }
            });
        }catch(e){}
    });

    // Intercept clicks on anchors with relative .html hrefs as a last resort
    document.addEventListener('click', function(ev){
        const a = ev.target.closest && ev.target.closest('a[href]');
        if(!a) return;
        const h = a.getAttribute('href');
        if(!h) return;
        const name = h.replace(/^\.\/?|^\.\.\//,'');
        if(map[name] && a.getAttribute('data-normalized')!=='1'){
            ev.preventDefault();
            a.setAttribute('data-normalized','1');
            window.location.href = map[name];
        }
    }, true);
}

// Ejecutar normalización temprana para evitar peticiones relativas
document.addEventListener('DOMContentLoaded', normalizeRelativeHtmlLinks);

// Exponer funciones globalmente
window.addToCart = addToCart;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.confirmarPedido = confirmarPedido;
window.finalizeOrder = finalizeOrder;
window.signOut = signOut;