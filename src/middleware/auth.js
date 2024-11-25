const adminAuth = (req, res, next) => {
  console.log("Admin Auth is get checked");
  const token = "xyz";
  const isAdminAuthorized = token === "xyz";
  if (!isAdminAuthorized) {
    return res.status(401).send("Unauthorized");
  }
  next();
};

const userAuth = (req, res, next) => {
  console.log("User Auth is get checked");
  const token = "xyz";
  const isUserAuthorized = token === "xyz";
  if (!isUserAuthorized) {
    return res.status(401).send("Unauthorized");
  }
  next();
};

module.exports = { adminAuth, userAuth };
