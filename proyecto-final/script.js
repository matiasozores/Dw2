let itemsCarrito = [];
let cantidadActual = 1;

const botonCarrito = document.getElementById('botonCarrito');
const botonBuscar = document.getElementById('botonBuscar');
const modalCarrito = document.getElementById('modalCarrito');
const contenedorItemsCarrito = document.getElementById('itemsCarrito');
const contadorCarrito = document.getElementById('contadorCarrito');
const totalCarrito = document.getElementById('totalCarrito');
const subtotalCarrito = document.getElementById('subtotalCarrito');
const envioCarrito = document.getElementById('envioCarrito');

function abrirModal() {
  actualizarCarrito();
  modalCarrito.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function cerrarModal() {
  modalCarrito.style.display = 'none';
  document.body.style.overflow = '';
}

function inicializarModal() {
  botonCarrito.addEventListener('click', abrirModal);
  const botonCerrar = document.querySelector('.modal-header .cerrar');
  if (botonCerrar) {
    botonCerrar.onclick = cerrarModal;
  }

  modalCarrito.onclick = function(evento) {
    if (evento.target === modalCarrito) {
      cerrarModal();
    }
  };

  document.onkeydown = function(evento) {
    if (evento.key === 'Escape' && modalCarrito.style.display === 'block') {
      cerrarModal();
    }
  };
}

document.addEventListener('DOMContentLoaded', inicializarModal);

botonBuscar.addEventListener('click', () => {
  alert('Función de búsqueda en desarrollo');
});

function agregarAlCarrito(boton, titulo, precio) {
  const itemExistente = itemsCarrito.find(item => item.titulo === titulo);
  
  if (itemExistente) {
    itemExistente.cantidad++;
    mostrarNotificacion(`${titulo} agregado nuevamente al carrito`);
  } else {
    itemsCarrito.push({ titulo, precio, cantidad: 1 });
    mostrarNotificacion(`${titulo} agregado al carrito`);
  }

  boton.innerHTML = '<i class="fas fa-check"></i> Agregado';
  boton.style.backgroundColor = '#2ecc71';
  
  setTimeout(() => {
    boton.innerHTML = '<i class="fas fa-cart-plus"></i> Agregar al carrito';
    boton.style.backgroundColor = '';
  }, 2000);

  actualizarCarrito();
  actualizarContadorCarrito();
}

function actualizarCarrito() {
  contenedorItemsCarrito.innerHTML = '';
  let subtotal = 0;

  if (itemsCarrito.length === 0) {
    contenedorItemsCarrito.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío</p>';
    document.querySelector('.boton-comprar').style.display = 'none';
  } else {
    document.querySelector('.boton-comprar').style.display = 'block';
  }

  itemsCarrito.forEach(item => {
    const totalItem = item.precio * item.cantidad;
    subtotal += totalItem;

    const elementoItem = document.createElement('div');
    elementoItem.classList.add('item-carrito');
    elementoItem.innerHTML = `
      <div class="item-info">
        <h4>${item.titulo}</h4>
        <p class="item-precio">$${item.precio.toFixed(2)}</p>
      </div>
      <div class="item-cantidad">
        <button onclick="decrementarCantidad('${item.titulo}')" class="boton-cantidad">-</button>
        <span>${item.cantidad}</span>
        <button onclick="incrementarCantidad('${item.titulo}')" class="boton-cantidad">+</button>
      </div>
      <div class="item-total">
        <p>$${totalItem.toFixed(2)}</p>
        <button onclick="eliminarDelCarrito('${item.titulo}')" class="boton-eliminar">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;

    contenedorItemsCarrito.appendChild(elementoItem);
  });

  const envio = subtotal > 1000 ? 0 : 150;
  const total = subtotal + envio;

  subtotalCarrito.textContent = `$${subtotal.toFixed(2)}`;
  envioCarrito.textContent = envio === 0 ? 'Gratis' : `$${envio.toFixed(2)}`;
  totalCarrito.textContent = `$${total.toFixed(2)}`;
}

function actualizarContadorCarrito() {
  const cantidadTotal = itemsCarrito.reduce((suma, item) => suma + item.cantidad, 0);
  contadorCarrito.textContent = cantidadTotal;
  
  contadorCarrito.classList.add('contador-activo');
  setTimeout(() => {
    contadorCarrito.classList.remove('contador-activo');
  }, 300);
}

function eliminarDelCarrito(titulo) {
  const item = itemsCarrito.find(item => item.titulo === titulo);
  if (item) {
    mostrarNotificacion(`${item.titulo} eliminado del carrito`);
    itemsCarrito = itemsCarrito.filter(item => item.titulo !== titulo);
    actualizarCarrito();
    actualizarContadorCarrito();
  }
}

function incrementarCantidad(titulo) {
  const item = itemsCarrito.find(item => item.titulo === titulo);
  if (item) {
    item.cantidad++;
    actualizarCarrito();
    actualizarContadorCarrito();
  }
}

function decrementarCantidad(titulo) {
  const item = itemsCarrito.find(item => item.titulo === titulo);
  if (item && item.cantidad > 1) {
    item.cantidad--;
    actualizarCarrito();
    actualizarContadorCarrito();
  }
}

function mostrarNotificacion(mensaje) {
  const notificacion = document.createElement('div');
  notificacion.classList.add('notificacion');
  notificacion.textContent = mensaje;
  
  document.body.appendChild(notificacion);
  
  setTimeout(() => {
    notificacion.classList.add('mostrar');
  }, 100);
  
  setTimeout(() => {
    notificacion.classList.remove('mostrar');
    setTimeout(() => {
      notificacion.remove();
    }, 300);
  }, 2000);
}

const estilosNotificacion = document.createElement('style');
estilosNotificacion.textContent = `
  .notificacion {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: var(--color-primario);
    color: white;
    padding: 1rem 2rem;
    border-radius: 4px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    transform: translateY(100px);
    opacity: 0;
    transition: all 0.3s ease;
    z-index: 1000;
  }
  
  .notificacion.mostrar {
    transform: translateY(0);
    opacity: 1;
  }
  
  .contador-activo {
    animation: pulse 0.3s ease;
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }
  
  .carrito-vacio {
    text-align: center;
    color: #666;
    padding: 2rem;
  }
  
  .item-carrito {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    gap: 1rem;
    align-items: center;
  }
  
  .item-info h4 {
    margin: 0;
    color: var(--color-primario);
  }
  
  .item-precio {
    color: #666;
    font-size: 0.9rem;
  }
  
  .item-cantidad {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .boton-cantidad {
    background: none;
    border: 1px solid #ddd;
    width: 30px;
    height: 30px;
    border-radius: 4px;
    cursor: pointer;
    transition: var(--transicion);
  }
  
  .boton-cantidad:hover {
    background-color: #f0f0f0;
  }
  
  .boton-eliminar {
    background: none;
    border: none;
    color: #e74c3c;
    cursor: pointer;
    padding: 0.5rem;
    transition: var(--transicion);
  }
  
  .boton-eliminar:hover {
    color: #c0392b;
  }
`;

document.head.appendChild(estilosNotificacion);
