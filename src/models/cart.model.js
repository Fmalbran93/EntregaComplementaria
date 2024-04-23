import mongoose from "mongoose";

const { Schema, model } = mongoose;

const cartSchema = new Schema({
    products: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ]
});

const CartModel = model("carts", cartSchema);

export default CartModel;
