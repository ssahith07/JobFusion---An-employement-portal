const jwt = require("jsonwebtoken");

// const verifyToken = async (req, res, next) => {
//   try {
//     // Check if authorization header exists
    
//     const authHeader = req.headers['authorization'];
//     console.log("Authorization Header:", req.headers.authorization);
//     console.log("Headers:", req.headers);
//     if (!authHeader) {
//       return res.status(401).json({ message: "No token provided" });
//     }

//     // Verify token format (Bearer <token>)
//     const parts = authHeader.split(' ');
//     if (parts.length !== 2 || parts[0] !== 'Bearer') {
//       return res.status(401).json({ message: "Token error, expected format 'Bearer <token>'" });
//     }

//     const token = parts[1];

//     // Verify token validity
//     try {
//       const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
//       req.user = decoded;

//       // Role validation can be added here, or handled in the next middleware
//       if (!decoded.role) {
//         return res.status(403).json({ message: "Role not specified in the token" });
//       }
//       req.userRole = decoded.role; // Save the role to the request

//       next(); // Proceed to the next middleware or route
//     } catch (err) {
//       return res.status(401).json({ message: "Invalid or expired token" });
//     }
//   } catch (error) {
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

// Role-based middleware
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    // console.log(authHeader);
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ message: "Token error, expected format 'Bearer <token>'" });
    }

    const token = req.headers.authorization?.split(' ')[1]; // Extract token from the header
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWTPRIVATEKEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token error" });
    }

  
    req.user = decoded; // Attach user data from the token to the request object
    next(); // Allow request to proceed to the next middleware or route
  });

  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const authorizeRole = (...roles) => {
  return (req, res, next) => {
    // Check if the user's role matches the allowed roles
    console.log(req.user.role)
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. You need one of the following roles: ${roles.join(", ")}`
      });
    }
    next(); // Proceed to the next middleware or route
  };
};

module.exports = { verifyToken, authorizeRole };


// const jwt = require("jsonwebtoken");

// async function verifyToken(req, res, next) {
//   const token = req.headers.authorization.split(" ")[1];
//   const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
//   // console.log(decoded);
//   req.user = decoded;
//   next();
// }
// module.exports = verifyToken;
