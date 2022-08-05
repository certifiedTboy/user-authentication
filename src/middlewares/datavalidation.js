const userRoles = ["Admin", "Tutor", "Student"];

const checkUserRoleData = (req, res, next) => {
  let { userRole } = req.body;

  if (!userRole) {
    userRole = "";
  }

  const convertedUserRole = userRole
    .toLowerCase()
    .replace(/(^|\s)\S/g, (L) => L.toUpperCase());

  console.log(convertedUserRole);

  if (!userRole || userRoles.includes(convertedUserRole)) {
    next();
  } else {
    return res.status(400).json({
      statusCode: 400,
      message: `invalid user role, use either of ${userRoles}`,
    });
  }
};

module.exports = { checkUserRoleData };
