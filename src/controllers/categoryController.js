import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getAllCategory = async (req, res) => {
  try {
    const categories = await prisma.category.findMany()
    res.status(200).send({status: 'success', message: 'data category berhasil didapatkan', categories})
  } catch (error) {
    console.error(error);
    res.status(500).send({status: 'error', message: 'internal server error'});
  }
}

const addCategory = async (req, res) => {
  const { name, description } = req.body;
  try {
    const existsCategory = await prisma.category.findFirst({where: { name }});
    if(existsCategory) return res.status(409).send({message: 'category sudah pernah di daftarkan'});

    const category = await prisma.category.create({
      data: { name, description }
    })
    res.status(200).send({status: 'success', message: 'category berhasil di tambahkan', category});
  } catch (error) {
    console.error(error);
    res.status(500).send({status: 'error', message: 'internal server error'});
  }
}

const updateCategory = async (req, res) => {
  const { name, description } = req.body;
  try {
    const category = await prisma.category.update({
      where: { id: parseInt(req.params.categoryId) },
      data: { name, description }
    })
    res.status(200).send({status: 'success', message: 'category berhasil di perbarui', category});
  } catch (error) {
    console.error(error);
    res.status(500).send({status: 'error', message: 'internal server error'});
  }
}

const deleteCategory = async (req, res) => {
  try {
    const category = await prisma.category.findUnique({where: { id: parseInt(req.params.categoryId) }});
    if(!category) return res.status(404).send({message: 'category tidak di temukan'});

    await prisma.category.delete({
      where: {id: parseInt(req.params.categoryId)}
    })
    res.status(200).send({status: 'success', message: 'category berhasil dihapus'});
  } catch (error) {
    console.error(error);
    res.status(500).send({status: 'error', message: 'internal server error'})
  }
}

export { getAllCategory, addCategory, updateCategory,deleteCategory }