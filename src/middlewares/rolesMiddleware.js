const isSeller = (req, res, next) => {
  if(req.user.role === 'SELLER' || req.user.role === 'ADMIN'){
    next();
  }else{
    res.status(403).send({message: 'anda bukan seller'});
  }
}

const isAdmin = (req, res, next) => {
  if(req.user.role === 'ADMIN'){
    next();
  }else{
    res.status(403).send({message: 'anda bukan admin'})
  }
}

export { isAdmin, isSeller }