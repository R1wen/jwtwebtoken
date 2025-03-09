module.exports.checkPermissions = (req, res, next) => {
  if (!req.user) {
    return res.status(403).json({ error: "Access denied" });
  }
  next();
};
