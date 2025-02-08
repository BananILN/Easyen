import jwt from "jsonwebtoken";

const roles = {
  ADMIN: 2,
  USER: 1
};

const CheckRole = (roleName) => {
  const requiredRoleId = roles[roleName];

  return function authMiddleware(req, res, next) {
    if (req.method === "OPTIONS") {
      return next();
    }

    try {
      const token = req.headers.authorization.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: "Не авторизован" });
      }

      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      console.log("Decoded token:", decoded);

      if (decoded.RoleID !== requiredRoleId) {
        console.log("Access denied. Required role ID:", requiredRoleId, "User role ID:", decoded.RoleID);
        return res.status(403).json({ message: "Нет доступа" });
      }

      req.user = decoded;
      next();
    } catch (e) {
      console.error("Error verifying token:", e);
      res.status(401).json({ message: "Не авторизован" });
    }
  };
};

export default CheckRole;