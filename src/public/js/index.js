const socket = io();

const productsContainer = document.querySelector('#products-container');
const goToRealTimeProds = document.querySelector('#goToRealTimeProds');

socket.emit('load');

function deleteProduct(productId) {
	socket.emit('deleteProduct', productId);
}
socket.on('products', products => {
	if (products.length === 0) {
		productsContainer.innerHTML = '<h3> No hay productos agregados al momento, ve a <a href="/realtimeproducts">/realtimeproducts</a> para agregarlos!.</h3>';
	} else {
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
	}
});


	// Agregue el evento al botón de redirección a realtimeprods
  goToRealTimeProds.addEventListener('click', () => {
    window.location.href = '/realtimeproducts';
  });