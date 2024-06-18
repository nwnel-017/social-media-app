const { verify } = require("jsonwebtoken");
const jwt = require("jsonwebtoken"); //testing purposes

const validateToken = (req, res, next) => {
  const accessToken = req.header("accessToken");

  if (!accessToken) return res.json({ error: "User not logged in!" });

  try {
    const validToken = verify(accessToken, "importantsecret");
    console.log("validToken from midware: " + JSON.stringify(validToken));
    req.user = validToken; //creates user variable -> now can access username with req.user.username
    console.log("req.user object from midware: " + JSON.stringify(req.user));
    if (validToken) {
      return next();
    }
  } catch (err) {
    console.log("error from midware: " + err);
    return res.json({ error: err });
  }
};

module.exports = { validateToken };
