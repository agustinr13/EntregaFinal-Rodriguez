//La primera parte es un mini formulario que captura dos datos a traves de inputs (nombre y correo) y al hacer click en Suscribirse genera un mensaje utilizando la librería Sweet Alert

let newsletter = document.querySelector("#newsletter")
//Creo una variable asociada al formulario de registro y le asigno la funcion enviarDatos
const bienvenida = newsletter.addEventListener("submit",(e)=>{
    e.preventDefault()
    enviarDatos()
    newsletter.reset()
})
//La funcion enviarDatos capta los input y devuelve una alerta utilizando Swal
function enviarDatos() {
    let nombre = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    Swal.fire({
        title: "¡Gracias " + nombre + " por suscribirte a nuestro newsletter!",
        text: "Recibirás semanalmente en tu correo " + email + " un folleto con nuestras mejores promociones",
        icon: "success",
    })

}

//SECCIÓN DE COMPRA

//Le llamo grilla al espacio reservado en el HTML para mostrar los productos disponibles
const grilla = document.querySelector("#store")

//Inicializo la variable carrito, que leerá los objetos del local storage. En caso de estar vacío, se inicializa como un array vacio
let carrito = JSON.parse(localStorage.getItem("cart")) || []

//Con la funcion mostrarCatalogo traigo utilizando fetch los datos almacenados en mi data.json y los pinto en el HTML en forma de tarjetas.
const mostrarCatalogo = async()=>{
    const resp = await fetch("./data.json")
    const data = await resp.json()
    data.forEach((producto)=>{
        const card = document.createElement("div")
        card.innerHTML=`
        <div class="product">
        <h2 class="nombre">${producto.nombre}</h2>
        <p>${producto.descripcion}</p>
        <p class="price">${producto.precio}</p>
        <button class="add" data-id="${producto.id}">Agregar al carrito</button>
        </div>
        `
        grilla.append(card)       
    })
    //Declaro addButton para agregar al carrito y asigno la funcion newItem al clickear el boton 
    const addButton = document.querySelectorAll(".product")
    addButton.forEach(el =>{
        el.addEventListener("click",(e)=>{
            newItem(e.target.parentElement)
        })
    })
    addToCart()
}

//La funcion newItem lee la informacion contenida en la tarjeta de producto clickeada y la guarda en el array "carrito"
const newItem = (producto)=>{
    const dataItem = {
        nombre: producto.querySelector(".nombre").textContent,
        precio: producto.querySelector(".price").textContent,
        id: producto.querySelector(".add").getAttribute("data-id"),
    }
    carrito = [...carrito,dataItem]
    addToCart()
}

mostrarCatalogo() 

//Asigno la variable cart al espacio reservado en el HTML para mostrar el carrito
const cart = document.querySelector("#cart")

const addToCart = () =>{
    //Primero ejecuto la funcion limpiarCarrito, que limpia del HTML los elementos ya agregados, para evitar que se superpongan al agregar uno nuevo
    limpiarCarrito()
    //Utilizando forEach pinto en el HTML las tarjetas correspondientes a los items del carrito con su respectivo boton de eliminar
    carrito.forEach((p)=>{
        const item = document.createElement("div")
        item.innerHTML=`
        <div class="cartItem">
            <h4>${p.nombre}</h4>
            <p>$${p.precio}</p>
            <button class="delete" id="${p.id}">Eliminar</button>
        </div>
        `
        cart.appendChild(item)
        //Ejecuto la funcion carritoJSON, que almacena el contenido del carrito en el local storage
        carritoJSON()
    })
    //Asigno la funcion de eliminar del carrito al evento click
    cart.addEventListener("click",eliminarDelCarrito)
}
//limpiarCarrito evita que al agregar un item nuevo se superponga y me agregue elementos repetidos
const limpiarCarrito = ()=>{
    cart.innerHTML = ""
}

//Configuro el boton Eliminar del carrito, que filtra los elementos del array segun su id y elimina el seleccionado
const eliminarDelCarrito = (i)=>{
    if (i.target.classList.contains("delete")){
        let itemID = i.target.getAttribute("id")
        carrito = carrito.filter(
            (p)=>p.id !== itemID
            )
            addToCart()
        }
    }

//Declaro la funcion que almacena los items del carrito en el local storage
const carritoJSON = ()=>{
    localStorage.setItem("cart",JSON.stringify(carrito))
}

//Asigno la variable emptyBTN al boton de Vaciar Carrito del HTML
const emptyBtn = document.querySelector(".vaciar")
//Al clickear el botón, borra todos los items tanto del carrito como del local storage y recarga la pagina
const vaciarCarrito = emptyBtn.addEventListener("click",(e)=>{
    localStorage.removeItem("cart")
    limpiarCarrito()
    location.reload()
})

//Inicializo en 0 la variable total, que calculará el precio total de los items del carrito
let total = 0
const calcularTotalCompra = ()=>{
    carrito.forEach((producto)=>{
        total += parseInt(producto.precio)
    })
}

//Asigno la variable comprar al boton de Finalizar Compra del HTML
const comprar = document.querySelector(".comprar")
//Al clickear en el botón, genero un mensaje con Sweet Alert que confirma la compra y muestra el total
comprar.addEventListener("click", ()=>{
    calcularTotalCompra()
    Swal.fire({
        title: "¡Gracias por su compra!",
        text: "El total de su compra es $"+ total +" . Gracias por confiar en nosotros",
        icon: "warning",
        icon: "success",
    })
})





