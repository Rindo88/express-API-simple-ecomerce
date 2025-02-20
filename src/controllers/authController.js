import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const prisma = new PrismaClient();

const register = async (req, res) => {
  const { username, email, password } = req.body;
  const existsUsername = await prisma.user.findFirst({where: {username}})
  const existsEmail = await prisma.user.findFirst({where: {email}})
  if(existsEmail || existsUsername) return res.status(409).send({message: 'username or email allready used'})

  try {
    const hashedPassword = await bcrypt.hash(password, 8);

    const register = await prisma.user.create({
      data: {username, email, password:hashedPassword}
    });
    res.status(200).send({message: 'anda berhasil terdaftar'})
  } catch (error) {
    console.error(error);
    res.status(500).send({message: 'internal server error'})
  }
}

const login = async (req, res) => {
  const { usernameOrEmail, password } = req.body;
  try {
    const existsUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username: usernameOrEmail },
          { email: usernameOrEmail }
        ]
      }
    });
    
    if(!existsUser) return res.status(404).send({message: 'user not found'});

    const login = await bcrypt.compare(password, existsUser.password);
    if(!login) return res.status(400).send({message: 'invalid password'});

    const token = jwt.sign({
      userId : existsUser.id,
      username: existsUser.username,
      role:existsUser.role},
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.status(200).send(token)
  } catch (error) {
    console.error(error);
    res.status(500).send({message: 'internal server error'});
  }
}


export { login, register }