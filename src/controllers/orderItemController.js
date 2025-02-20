// controllers/orderItemController.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Menambahkan item ke order
const addOrderItem = async (req, res) => {
  const orderId = parseInt(req.params.orderId);
  const { productId, quantity } = req.body;

  try {
    // Cek apakah order ada
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return res.status(404).send({ status: 'error', message: 'Order tidak ditemukan' });
    }

    // Cek apakah produk ada
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).send({ status: 'error', message: 'Produk tidak ditemukan' });
    }

    // Tambahkan item ke order
    const orderItem = await prisma.orderItem.create({
      data: {
        quantity,
        price: product.price,
        orderId,
        productId,
      },
    });
    res.status(201).send({ status: 'success', message: 'Item berhasil ditambahkan ke order', data: orderItem });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: 'error', message: 'Internal server error' });
  }
};

// Mengupdate item di order
const updateOrderItem = async (req, res) => {
  const itemId = parseInt(req.params.itemId);
  const { quantity } = req.body;

  try {
    // Cek apakah item ada
    const orderItem = await prisma.orderItem.findUnique({ where: { id: itemId } });
    if (!orderItem) {
      return res.status(404).send({ status: 'error', message: 'Item tidak ditemukan' });
    }

    // Update item
    const updatedOrderItem = await prisma.orderItem.update({
      where: { id: itemId },
      data: { quantity },
    });
    res.status(200).send({ status: 'success', message: 'Item berhasil diperbarui', data: updatedOrderItem });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: 'error', message: 'Internal server error' });
  }
};

// Menghapus item dari order
const deleteOrderItem = async (req, res) => {
  const itemId = parseInt(req.params.itemId);

  try {
    // Cek apakah item ada
    const orderItem = await prisma.orderItem.findUnique({ where: { id: itemId } });
    if (!orderItem) {
      return res.status(404).send({ status: 'error', message: 'Item tidak ditemukan' });
    }

    // Hapus item
    await prisma.orderItem.delete({ where: { id: itemId } });
    res.status(200).send({ status: 'success', message: 'Item berhasil dihapus dari order' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: 'error', message: 'Internal server error' });
  }
};

export { addOrderItem, updateOrderItem, deleteOrderItem };