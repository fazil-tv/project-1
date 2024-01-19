
const placeOrder = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const { address, payment } = req.body;
        const userData = await User.findOne({ _id: userId }).populate('cart.product').exec()
        const product = await products.find({});
        const userAddress = userData?.address[address];
        const cartProducts = userData?.cart;
        let totalPrice = 60;
        for (let i = 0; i < cartProducts.length; i++) {
            for (let k = 0; k < product.length; k++) {
                if (product[k].productName == cartProducts[i].product.productName) {
                    if(product[k].quantity < cartProducts[i].quantity){
                        return res.json({status:'failed',message:"insufficient products in inventory"})
                    }
                    product[k].quantity = cartProducts[i].quantity - product[k].quantity;
                }
                totalPrice = cartProducts[i].product.price * cartProducts[i].quantity;
                await product[k].save();
            }
        }
        const order = new Orders({
            user: userId,
            products: cartProducts,
            orderedDate: new Date(),
            address: userAddress,
            totalAmount: totalPrice,
            status: 'Placed',
            paymentStatus: payment
        })
        const placed = await order.save();
        if(placed) {
            userData.cart= [];
            userData.save();
            res.json({ status: 'success',message:"product placed succesfully" });
        }
    } catch (error) {
        console.log("error on postOrder", error)
    }
}

