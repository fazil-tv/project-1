require('dotenv').config();
const userModal = require('../model/userSchema');
const cartSchema = require('../model/cartModel');
const productSchema = require('../model/categoryModel');
const orderSchema = require('../model/orderModel');
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const addressSchema = require('../model/addressModel');
const puppeteer = require('puppeteer')
const path = require("path");
const ejs = require("ejs");
const puppeteerpdf = require("pdf-puppeteer");
let express = require('express');
const ExcelJS = require('exceljs');




// signup
const signup = async (req, res) => {
    try {
        res.render("login");
    } catch (error) {
        console.log(error.message);
    }
}


//logout
const logout = async (req, res) => {
    try {
        req.session.admin_email = null;
        res.redirect('/admin/login')

    } catch (error) {
        console.log(error.message)
    }
}






// users
const users = async (req, res) => {
    try {
        res.render("users");
    } catch (error) {
        console.log(error.message);
    }
}

// users
const orders = async (req, res) => {
    try {
        const cartData = await orderSchema.find({}).populate('products.productId');
        // const id = 1000;
        // const orderId = await orderSchema.countDocuments() + id;
        console.log(cartData, 'hghfg');
        res.render("orders", { cartData });
    } catch (error) {
        console.log(error.message);
    }
}


// Order detail
const orderdetaile = async (req, res) => {
    try {
        const id = req.query.id;
        console.log(id);

        const orders = await orderSchema.findOne({ _id: id }).populate('products.productId');

        console.log(orders);
        const deliveryAddressObjectId = new mongoose.Types.ObjectId(orders.delivery_address);
        console.log(deliveryAddressObjectId);
        const userAddress = await addressSchema.find(
            { 'address._id': deliveryAddressObjectId },
            { 'address.$': 1 }
        );
        console.log(userAddress);

        console.log(orders);
        console.log(userAddress);

        res.render("detaile", { userAddress, orders });
    } catch (error) {
        console.log(error.message);
    }
}











//admin password verification
const adminverifyLogin = async (req, res) => {

    try {
        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;
        const useremail = req.body.email;
        const userpassword = req.body.password;


        if (email == useremail && password == userpassword) {
            req.session.admin_email = email
            res.redirect('index')
        } else {
            const message = "Incorrect username or password";
            res.render('login', { message });
        }
    } catch (error) {
        console.log(error.message);
    }
}

const loaddashbord = async (req, res) => {

    const totalproducts = await productSchema.countDocuments();
    console.log(totalproducts / 2, "%%%%%%okd")


    const totalorers = await orderSchema.countDocuments();

    const revenue = await orderSchema.aggregate([
        {
            $unwind: "$products"
        },
        {
            $group: {
                _id: null,
                revenue: { $sum: "$products.totalPrice" }
            }
        }
    ]);


    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    endOfMonth.setMilliseconds(0);
    endOfMonth.setSeconds(0);
    endOfMonth.setMinutes(59);
    endOfMonth.setHours(23);

    const currentMonthName = new Date().toLocaleString('default', { month: 'long' });


    // const montlyrevenue = await orderSchema.aggregate([
    //     {
    //         $unwind: "$products"
    //     },
    //     {
    //         $match: {
    //             "orderDate": { $gte: startOfMonth, $lt: endOfMonth }
    //         }
    //     },
    //     {
    //         $group: {
    //             _id: null,
    //             monthlyrevenue: {
    //                 $sum: "$products.totalPrice"
    //             }
    //         }
    //     }
    // ]);
    const montlyrevenue = await orderSchema.aggregate([
        {
            $match: {
                "orderDate": { $gte: startOfMonth, $lt: endOfMonth }
            }
        },
        {
            $unwind: "$products"
        },
        {
            $group: {
                _id: { $month: "$orderDate" },
                monthlyrevenue: {
                    $sum: "$products.totalPrice"
                }
            }
        }
    ]);


    console.log("monthly revenue", montlyrevenue);

    const graphValue = Array(12).fill(0);

    montlyrevenue.forEach(entry => {
        const monthIndex = entry._id - 1; // MongoDB months are 1-indexed
        graphValue[monthIndex] = entry.monthlyrevenue;
    });

    console.log(graphValue, "ooooor");

    const cashondelivery = await orderSchema.countDocuments({ "payment": "Cash on delivery" })
    console.log("TOTTEL", cashondelivery)
    const Wallet = await orderSchema.countDocuments({ "payment": "Wallet" })
    console.log("TOTTEL", cashondelivery)
    Razorpay = await orderSchema.countDocuments({ "payment": "Razorpay" })

    try {
        console.log("t", totalproducts, "or", totalorers, "re", revenue, "cur", currentMonthName, "mo", montlyrevenue)
        res.render("index", { totalproducts, totalorers, revenue: revenue[0].revenue, currentMonthName, montlyrevenue: montlyrevenue[0].monthlyrevenue, graphValue, Wallet, cashondelivery, Razorpay });
    } catch (error) {
        console.log(error);
    }
}

// loding admin dashbord
const loadUser = async (req, res) => {
    try {
        const usersData = await userModal.find({})
        console.log(usersData);
        res.render("users", { usersData });
    } catch (error) {
        console.log(error);
    }

}


// block user
const blockUser = async (req, res) => {

    try {
        const userId = req.body.userId;
        console.log(userId)
        await userModal.updateOne({ _id: userId }, { $set: { is_blocked: true } });
        res.status(200).json({ message: 'User blocked successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

// unblock user
const unblockUser = async (req, res) => {
    try {
        const user = req.body.userId;
        await userModal.updateOne({ _id: user }, { $set: { is_blocked: false } });
        res.status(200).json({ message: 'User unblocked successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};


const updatestatus = async (req, res) => {
    try {
        const orderId = req.body.orderId;
        const productId = req.body.productId;
        const newstatus = req.body.newstatus;

        console.log("newstatus ", newstatus);
        console.log("orderId", orderId);
        console.log(" productId ", productId)

        const order = await orderSchema.findOne({ _id: orderId });
        const index = order.products.findIndex((item) => {
            return item._id.toString() === productId;
        });
        order.products[index].productstatus = req.body.newstatus;

        await order.save();
        res.json({ success: true });
    } catch (err) {
        console.log(err);
    }
}



// sales
const sales = async (req, res) => {
    const selectedvalue = req.body.selectedvalue;
    console.log(selectedvalue);

    try {

        if (selectedvalue === "Daily") {

            console.log("dailyyyyy");
            const orderData = await orderSchema.aggregate([
                {
                    $match: {
                        orderStatus: 'placed',
                        $expr: {
                            $eq: [
                                {
                                    $dateToString: {
                                        format: '%Y-%m-%d',
                                        date: '$orderDate',
                                    },
                                },
                                {
                                    $dateToString: {
                                        format: '%Y-%m-%d',
                                        date: new Date(),
                                    },
                                },
                            ],
                        },
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "user",
                        foreignField: "_id",
                        as: "userData"
                    }
                },
                {
                    $unwind: "$products"
                },
                {
                    $lookup: {
                        from: "products",
                        localField: "products.productId",
                        foreignField: "_id",
                        as: "productData"
                    }
                }
            ]);

            console.log(orderData, "11111111");

            res.json({ orderData })


        } else if (selectedvalue === "Weekly") {
            console.log("wekleeeee");
            const orderData = await orderSchema.aggregate([
                {
                    $match: {
                        orderStatus: 'placed',
                        $expr: {
                            $gte: [
                                {
                                    $dateToString: {

                                        date: '$orderDate',
                                    },
                                },
                                {
                                    $dateToString: {
                                        format: '%Y-%m-%d',
                                        date: new Date(new Date().getTime - 86400000 * 6),
                                    },
                                },
                            ],
                        },
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "user",
                        foreignField: "_id",
                        as: "userData"
                    }
                },
                {
                    $unwind: "$products"
                },
                {
                    $lookup: {
                        from: "products",
                        localField: "products.productId",
                        foreignField: "_id",
                        as: "productData"
                    }
                }
            ]);
            res.json({ orderData })

        } else if (selectedvalue === "Monthly") {
            console.log("montlyyyyy");
            const orderData = await orderSchema.aggregate([
                {
                    $match: {
                        orderStatus: 'placed',
                        $expr: {
                            $eq: [
                                {
                                    $month: "$orderDate"
                                },
                                {
                                    $month: new Date(),
                                },
                            ],
                        },
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "user",
                        foreignField: "_id",
                        as: "userData"
                    }
                },
                {
                    $unwind: "$products"
                },
                {
                    $lookup: {
                        from: "products",
                        localField: "products.productId",
                        foreignField: "_id",
                        as: "productData"
                    }
                }
            ]);

            res.json({ orderData })






        } else if (selectedvalue === "Yearly") {
            console.log("yearlyyyyy");
            const orderData = await orderSchema.aggregate([
                {
                    $match: {
                        orderStatus: 'placed',
                        $expr: {
                            $eq: [
                                {
                                    $year: "$orderDate"
                                },
                                {
                                    $year: new Date(),
                                },
                            ],
                        },
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "user",
                        foreignField: "_id",
                        as: "userData"
                    }
                },
                {
                    $unwind: "$products"
                },
                {
                    $lookup: {
                        from: "products",
                        localField: "products.productId",
                        foreignField: "_id",
                        as: "productData"
                    }
                }
            ]);
            res.json({ orderData })

        } else if (selectedvalue === "ALL") {



            const orderData = await orderSchema.aggregate([
                {
                    $match: {
                        orderStatus: 'placed',
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "user",
                        foreignField: "_id",
                        as: "userData"
                    }
                },
                {
                    $unwind: "$products"
                },
                {
                    $lookup: {
                        from: "products",
                        localField: "products.productId",
                        foreignField: "_id",
                        as: "productData"
                    }
                }
            ]);

            console.log('oooooooooo', orderData);
            res.json({ orderData })



        }
        else {

            const orderData = await orderSchema.aggregate([
                {
                    $match: {
                        orderStatus: 'placed',
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "user",
                        foreignField: "_id",
                        as: "userData"
                    }
                },
                {
                    $unwind: "$products"
                },
                {
                    $lookup: {
                        from: "products",
                        localField: "products.productId",
                        foreignField: "_id",
                        as: "productData"
                    }
                }
            ]);

            res.render("sales", { orderData });

        }

    } catch (error) {
        console.log(error.message);
    }
}


const salesreport = async (req, res) => {

    const orderDatas = await orderSchema.aggregate([
        {
            $match: {
                orderStatus: 'placed',
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "userData"
            }
        },
        {
            $unwind: "$products"
        },
        {
            $lookup: {
                from: "products",
                localField: "products.productId",
                foreignField: "_id",
                as: "productData"
            }
        }
    ]);



    console.log(orderDatas, "OOOOOI");
    const selectedformat = req.body.selectedformat;
    console.log(selectedformat, "hoiiiiiii")


    if (selectedformat === "PDF") {

        try {
            // const orderData = req.body.datas
            const orderData = req.body.datas !== undefined && req.body.datas.length !== 0 ? req.body.datas : orderDatas;

            console.log("orderData", orderData)

            const ejsPagePath = path.join(__dirname, '../views/admin/report.ejs');
            const ejsPage = await ejs.renderFile(ejsPagePath, { orderData });

            const browser = await puppeteer.launch({ headless: "new" });
            const page = await browser.newPage();
            await page.setContent(ejsPage);
            const pdfBuffer = await page.pdf();
            await browser.close();

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');
            res.send(pdfBuffer);

        } catch (error) {
            console.log(error);

        }

    } else {

        try {
            const orderData = req.body.datas !== undefined && req.body.datas.length !== 0 ? req.body.datas : orderDatas;
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Sales Report');

            worksheet.addRow(["NO", "ID", "PRODUCT NAME", "QUANTITY SOLD", "PRICE", "TOTTEL SALES", "ORDER DATE", "CUSTOMER", "PAYMENT METHODE"]);

            console.log(orderData, "*********");

            orderData.forEach((order, index) => {
                worksheet.addRow([
                    index + 1,
                    order.orderId,
                    order.productData[0].name,
                    order.products.count,
                    order.products.price,
                    order.products.totalPrice,
                    order.orderDate.toString().slice(-4) ? order.orderDate.toString().slice(0, 10) : '',
                    order.userData[0].email,
                    order.payment,

                ])
            })

            const buffer = await workbook.xlsx.writeBuffer();

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=sales_report.xlsx');
            res.send(buffer);



        } catch (error) {

            console.log(error)

        }


    }

}


module.exports = {
    adminverifyLogin,
    signup,
    loadUser,
    users,
    loaddashbord,
    blockUser,
    unblockUser,
    logout,
    orders,
    orderdetaile,
    updatestatus,
    sales,
    salesreport
}