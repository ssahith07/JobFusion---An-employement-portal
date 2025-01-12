const router = require("express").Router();
const { Seeker, Recruiter } = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const { connectToDatabase } = require("../database");
const jwt = require("jsonwebtoken");

// Validatation
const validate = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required().label("Password"),
  });
  return schema.validate(data);
};

router.post("/", async (req, res) => {
  try {
    const { recruitersCollection, seekersCollection } =
      await connectToDatabase();

    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const { email, password } = req.body;

    console.log("Searching for email:", email);

    const seekerData = await seekersCollection.findOne({ email });
    const recruiterData = await recruitersCollection.findOne({ email });

    // const role = seekerData.role || recruiterData.role;
    const role = recruiterData ? recruiterData.role : seekerData.role;
    const id = recruiterData ? recruiterData._id : seekerData._id;

    // console.log("Before finding email.")
    if (!seekerData && !recruiterData) {
      return res.status(401).send({ message: "Invalid Email or Password" });
    }
    // console.log("After finding email.")

    // instance of  Seeker model and recruiter model.
    const seeker = seekerData ? new Seeker(seekerData) : null;
    const recruiter = recruiterData ? new Recruiter(recruiterData) : null;

    const validPassword = await bcrypt.compare(
      password,
      seeker ? seeker.password : recruiter.password
    );
    // console.log("Before Hashing Password.")

    if (!validPassword)
      return res.status(401).send({ message: "Invalid Email or Password" });

    // console.log("After Hashing Password.")
    const token = jwt.sign(
      {
        _id: id,
        email: email,
        role: role, // Include role in the payload
      },
      process.env.JWTPRIVATEKEY, // The secret key for signing
      { expiresIn: '1h' } // Optional: Set the token expiration time
    );

    res.status(200).json({
      token: token,
      role: role,
      email,
      id: id,
      message: "Logged in successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = router;


// // routes/auth.js
// const jwt = require('jsonwebtoken');
// require('dotenv').config();

// // Custom error class for authentication errors
// class AuthError extends Error {
//     constructor(message, statusCode = 401) {
//         super(message);
//         this.statusCode = statusCode;
//         this.name = 'AuthError';
//     }
// }

// // Standardized error response
// const sendErrorResponse = (res, error) => {
//     const statusCode = error.statusCode || 500;
//     return res.status(statusCode).json({
//         success: false,
//         message: error.message || 'Internal server error',
//         error: process.env.NODE_ENV === 'development' ? error.stack : undefined
//     });
// };

// // Token verification middleware
// const verifyTokens = async (req, res, next) => {
//     try {
//         const authHeader = req.headers.authorization;
        
//         if (!authHeader) {
//             throw new AuthError('Access denied. No token provided.');
//         }

//         const parts = authHeader.split(' ');
//         if (parts.length !== 2 || parts[0] !== 'Bearer') {
//             throw new AuthError('Invalid token format. Use Bearer <token>');
//         }

//         const token = parts[1];
        
//         try {
//             const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
//             if (!decoded._id || !decoded.role) {
//                 throw new AuthError('Invalid token payload');
//             }

//             // Add user info to request
//             req.user = {
//                 id: decoded._id,
//                 role: decoded.role,
//                 email: decoded.email
//             };
            
//             next();
//         } catch (error) {
//             if (error.name === 'TokenExpiredError') {
//                 throw new AuthError('Token has expired');
//             }
//             throw new AuthError('Invalid token');
//         }
//     } catch (error) {
//         sendErrorResponse(res, error);
//     }
// };

// // Role-based authorization middleware
// const authorizeRole = (...allowedRoles) => {
//     return (req, res, next) => {
//         try {
//             if (!req.user || !req.user.role) {
//                 throw new AuthError('Role verification failed', 403);
//             }

//             if (!allowedRoles.includes(req.user.role)) {
//                 throw new AuthError('Insufficient permissions to access this resource', 403);
//             }

//             next();
//         } catch (error) {
//             sendErrorResponse(res, error);
//         }
//     };
// };

// // Middleware for seeker routes
// const isSeeker = (req, res, next) => {
//     return authorizeRole('seeker')(req, res, next);
// };

// // Middleware for recruiter routes
// const isRecruiter = (req, res, next) => {
//     return authorizeRole('recruiter')(req, res, next);
// };

// // Middleware to check if user owns the resource
// const isResourceOwner = (resourceId) => {
//     return (req, res, next) => {
//         try {
//             if (req.user.id !== resourceId) {
//                 throw new AuthError('Unauthorized access to this resource', 403);
//             }
//             next();
//         } catch (error) {
//             sendErrorResponse(res, error);
//         }
//     };
// };

// module.exports = {
//     verifyTokens,
//     authorizeRole,
//     isSeeker,
//     isRecruiter,
//     isResourceOwner,
//     AuthError,
//     sendErrorResponse
// };



