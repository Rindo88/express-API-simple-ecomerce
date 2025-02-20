// controllers/orderController.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Membuat order baru
const createOrder = async (req, res) => {
  const { items } = req.body; // items: [{ productId, quantity }]
  const customerId = req.user.userId; // Diambil dari payload JWT

  try {
    let totalAmount = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        return res.status(404).send({ status: 'error', message: `Produk dengan ID ${item.productId} tidak ditemukan` });
      }

      totalAmount += product.price * item.quantity;

      orderItemsData.push({
        quantity: item.quantity,
        price: product.price, // Ambil harga dari database
        productId: item.productId,
      });
    }

    const order = await prisma.order.create({
      data: {
        totalAmount,
        customerId,
        orderItems: {
          create: orderItemsData,
        },
      },
      include: { orderItems: true },
    });

    res.status(201).send({ status: 'success', message: 'Order berhasil dibuat', data: order });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: 'error', message: 'Internal server error' });
  }
};

// const createOrder = async (req, res) => {
//   const { items } = req.body; // items: [{ productId, quantity }]
//   const customerId = req.user.userId; // Diambil dari payload JWT

//   try {
//     // Hitung total amount
//     let totalAmount = 0;
//     for (const item of items) {
//       const product = await prisma.product.findUnique({
//         where: { id: item.productId },
//       });
//       totalAmount += product.price * item.quantity;
//     }

//     // Buat order
//     const order = await prisma.order.create({
//       data: {
//         totalAmount,
//         customerId,
//         orderItems: {
//           create: items.map((item) => ({
//             quantity: item.quantity,
//             price: item.price,
//             productId: item.productId,
//           })),
//         },
//       },
//       include: { orderItems: true }, // Sertakan orderItems di response
//     });
//     res.status(201).send({ status: 'success', message: 'Order berhasil dibuat', data: order });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ status: 'error', message: 'Internal server error' });
//   }
// };

// Mendapatkan daftar order milik pengguna

const getOrders = async (req, res) => {
  const customerId = req.user.userId; // Diambil dari payload JWT

  try {
    const orders = await prisma.order.findMany({
      where: { customerId },
      include: { orderItems: true }, // Sertakan orderItems di response
    });
    res.status(200).send({ status: 'success', message: 'Daftar order berhasil didapatkan', data: orders });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: 'error', message: 'Internal server error' });
  }
};

// Mendapatkan detail order berdasarkan ID
const getOrderById = async (req, res) => {
  const orderId = parseInt(req.params.orderId);
  const customerId = req.user.userId; // Diambil dari payload JWT

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { orderItems: true }, // Sertakan orderItems di response
    });

    if (!order || order.customerId !== customerId) {
      return res.status(404).send({ status: 'error', message: 'Order tidak ditemukan' });
    }

    res.status(200).send({ status: 'success', message: 'Detail order berhasil didapatkan', data: order });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: 'error', message: 'Internal server error' });
  }
};

// Mengupdate status order
const updateOrderStatus = async (req, res) => {
  const orderId = parseInt(req.params.orderId);
  const { status } = req.body;
  const customerId = req.user.userId; // Diambil dari payload JWT

  try {
    // Cek apakah order ada dan milik pengguna yang login
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order || order.customerId !== customerId) {
      return res.status(404).send({ status: 'error', message: 'Order tidak ditemukan' });
    }

    // Update status order
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
    res.status(200).send({ status: 'success', message: 'Status order berhasil diperbarui', data: updatedOrder });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: 'error', message: 'Internal server error' });
  }
};

export { createOrder, getOrders, getOrderById, updateOrderStatus };