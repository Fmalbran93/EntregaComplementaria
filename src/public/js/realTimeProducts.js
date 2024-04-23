	const socket = io();

	const form = document.querySelector('#formProduct');
	const productsContainer = document.querySelector('#products-container');
	const goToStaticButton = document.querySelector('#goToStaticButton');
	socket.emit('load');

	form.addEventListener('submit', event => {
		event.preventDefault();
		const dataForm = new FormData(event.target);
		const product = Object.fromEntries(dataForm);
		Swal.fire({
			title: '¡Producto creado!',
			text: 'El producto ha sido creado exitosamente.',
			icon: 'success',
			showCancelButton: false,
			confirmButtonColor: 'rgb(184, 125, 192)',
			confirmButtonText: 'Aceptar'
		});
		socket.emit('newProduct', product);
	});


	socket.on('products', products => {
		productsContainer.innerHTML = '';
		products.forEach(prod => {
			productsContainer.innerHTML += `
		<div class="product-container">
		<p>Id: ${prod.id}</p>
		<p>Title: ${prod.title}</p>
		<p>Description: ${prod.description}</p>
		<p>Price: ${prod.price}</p>
		<p>Status: ${prod.status}</p>
		<p>Code: ${prod.code}</p>
		<p>Stock: ${prod.stock}</p>
		<button class="delete-button" onclick="deleteProduct('${prod.id}')">Eliminar</button>
		</div>
	
		`;
		});

		e.target.reset();
	});

	// Agregue el evento al botón de redirección a static
goToStaticButton.addEventListener('click', () => {
	window.location.href = '/';
});

// Agregue evento para eliminar un producto
function deleteProduct(productId) {
	socket.emit('deleteProduct', productId); 
}