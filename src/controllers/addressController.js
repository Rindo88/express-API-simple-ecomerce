import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const addAddress = async (req, res) => {
  const userId = req.user.userId;
  const  { street, city, state, postalCode, country } = req.body;

  try {
    const address = await prisma.address.create({
      data: {
        street,
        city,
        state,
        postalCode,
        country,
        userId
      }
    })
    res.status(200).send({status: 'success', message: 'alamat berhasil ditambahkan', address})
  } catch (error) {
    console.error(error);
    res.status(500).send({status: 'error', message: 'internal server error'});
  }
}

const getAddress = async (req, res) => {
  const userId = req.user.userId;
  
  try {
    const addresses = await prisma.address.findMany({
      where: { userId }
    });
    res.status(200).json({status: 'success', message: 'Daftar alamat berhasil diambil', addresses });
  } catch (error) {
    console.error(error);
    res.status(500).send({status: 'error', message: 'internal server error'});
  }
}

const updateAddress = async (req, res) => {
  const addressId = parseInt(req.params.addressId);
  const userId = req.user.userId;
  const  { street, city, state, postalCode, country } = req.body;

  try {
    const address = await prisma.address.findUnique({
      where: { id: addressId}
    });
    if(!address || address.userId !== userId) return res.status(404).send({status: 'not found', message: 'alamat tidak ditemukan'});

    const updatedAddress = await prisma.address.update({
      where: { id: addressId },
      data: {
        street,
        city,
        state,
        postalCode,
        country
      }
    })
    res.status(200).send({status: 'success', message: 'alamat berhasil diperbarui', updatedAddress})
  } catch (error) {
    console.error(error);
    res.status(500).send({status: 'error', message: 'internal server error'});
  }
}

const deleteAddress = async (req, res) => {
  const addressId = parseInt(req.params.addressId);
  const userId = req.user.userId;
  
  try { 
    const address = await prisma.address.findUnique({where: { addressId }});
    if(!address || address.userid !== userId) return res.send(404).send({status: 'not found', message: 'alamat tidak ditemukan'});

    await prisma.address.delete({
      where: { id: addressId }
    });
    res.status(200).json({ status: 'success', message: 'alamat berhasil dihapus'});
  } catch (error) {
    console.error(error);
    res.status(500).send({status: 'error', message: 'internal server error'});
  }
}

export { addAddress, updateAddress, deleteAddress, getAddress }