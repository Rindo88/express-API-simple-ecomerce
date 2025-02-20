import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()


const products = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { category : true }
    })
    res.status(200).send({message: 'data product berhasil didapatkan', products});
  } catch (error) {
    console.error(error);
    res.status(500).send({message: 'internal server error'});
  }
}

const searchProductName = async (req, res) => {
  const { productName } = req.query;

  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          {name: {
            contains: productName,
            mode: 'insensitive'
          }},
          {brand: {
            contains: productName,
            mode: 'insensitive'
          }}
        ]
      }
    })

    res.status(200).send({status: 'success', message: 'pencarian berhasil', products});
  } catch (error) {
    res.status(500).send({status: 'error', message: 'internal server error'});
    console.log(error);
  }
}

const getProductId = async (req, res) => {
  try {
    const id = parseInt(req.params.productId)
    const products = await prisma.product.findMany({
      where: {id},
      include: { category : true }
    })
    res.status(200).send({message: 'data product berhasil didapatkan', products});
  } catch (error) {
    console.error(error);
    res.status(500).send({message: 'internal server error'});
  }
}


const getAllProduct = async (req, res) => {
  const sellerId = req.user.userId;

  try {
    const products = await prisma.product.findMany({
      where: { sellerId },
      include: { category : true }
    })
    res.status(200).send({message: 'data product berhasil didapatkan', products});
  } catch (error) {
    console.error(error);
    res.status(500).send({message: 'internal server error'});
  }
}

const addProduct = async (req, res) => {
  const { name, imageUrl, brand, description, price, stock, categoryId } = req.body;

  try {
    const product = await prisma.product.create({
      data: {
        name,
        imageUrl,
        brand,
        description,
        price,
        stock,
        categoryId,
        sellerId: req.user.userId
      }})
    res.status(200).send({message: 'product berhasil ditambahkan', product});
  } catch (error) {
    console.log(error)
    res.status(500).send({message: 'internal server error'});
  }
}

const updateProduct = async (req, res) => {
  const { name, imageUrl, brand, description, price, stock, categoryId } = req.body;
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.params.productId) }
    });

    if (!product || product.sellerId !== req.user.userId) {
      return res.status(404).json({ message: 'Produk tidak ditemukan atau Anda tidak memiliki akses.' });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(req.params.productId) },
      data: {
        name,
        imageUrl,
        brand,
        description,
        price,
        stock,
        categoryId,
      }
    })
    res.status(200).send({message: 'product berhasil diperbarui', updatedProduct});
  } catch (error) {
    console.log(error)
    res.status(500).send({message: 'internal server error'});
  }
}

const deleteProduct = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.params.productId) },
    });

    if (!product || product.sellerId !== req.user.userId) {
      return res.status(404).json({ message: 'Produk tidak ditemukan atau Anda tidak memiliki akses.' });
    }

    await prisma.product.delete({
      where: { id: parseInt(req.params.productId) }
    })
    res.status(200).send({message: 'product berhasil dihapus', product});
  } catch (error) {
    console.error(error)
    res.status(500).send({message: 'internal server error'});
  }
}

export { getAllProduct, addProduct, updateProduct, deleteProduct, products, getProductId, searchProductName }