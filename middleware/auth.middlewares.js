const { User, Role } = require("../model/auth/index.model");

module.exports.requireAuth = async (req, res, next) => {
  const token = req.cookies.tokenUser;
  if (!token) {
    return res.redirect('/auth/login');  
  }

  const user = await User.findOne({
    where: { token },
    include: {
      model: Role, 
      through: { attributes: [] } 
    }
  });

  if (!user) {
    return res.redirect('/auth/login');  
  }

  res.locals.User = user;
  res.locals.Role = user.Roles.map(role => role.RoleName);  
  
  console.log("usser : "+ user);
  console.log("============== ");
  console.log("role : "+ user.Roles.map(role => role.RoleName));
  

  next();
};
  