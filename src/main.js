import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io"; // Importamos 'Server' desde 'socket.io'
import "./database.js";

import productsRouter from "./routes/productos.routes.js";
import cartsRouter from "./routes/cart.routes.js";
import viewsRouter from "./routes/views.routes.js";

const app = express();
const PUERTO = 8080;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./src/public"));

// Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

app.get('/static', (req, res) => {
    res.render('index', {
        rutaCSS: 'index',
        rutaJS: 'index',
    });
});

app.get('/realtimeproducts', (req, res) => {
    res.render('realtimeproducts', { 
        rutaCSS: "realTimeProducts",
        rutaJS: "realTimeProducts"
    });
});

app.get('/api/products', (req, res) => {
    res.render('realtimeproducts', { 
        rutaCSS: "index",
        
    });
});

const httpServer = app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en el puerto ${PUERTO}`);
});

// chat en el ecommerce
import MessageModel from "./models/message.model.js";

const io = new Server(httpServer); // Creamos una nueva instancia de 'Server' con 'httpServer'

io.on("connection", (socket) => {
    console.log("Nuevo usuario conectado");

    socket.on("message", async (data) => {
		try{
        // Guardar el mensaje en MongoDB
        await MessageModel.create(data);

        // Obtener los mensajes de MongoDB y enviarlos al cliente
        const messages = await MessageModel.find();
        console.log(messages);
        io.sockets.emit("message", messages);
		console.log("Mensaje guardado en la base de datos:", data);
	} catch (error) {
		console.error("Error al guardar el mensaje:", error);
	}
		
    });
	// Manejo del evento 'newProduct'
	socket.on("products", async (Data) => {
		try {
			// Crear un nuevo producto utilizando los datos recibidos
			const products = new ProductModel(Data);
			await products.save();
	
			// Emitir una señal a todos los clientes para actualizar la lista de productos
			io.emit("productAdded", products);
	
			console.log("Producto creado y guardado en la base de datos:", newProduct);
		} catch (error) {
			console.error("Error al crear y guardar el producto:", error);
		}
	});
});

 