const express = require('express');
const app = express();
const mongoose = require("mongoose")
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config();
const multer = require('multer');
const { ObjectId } = require('mongodb');
const usersRoutes = require("./routes/users");
// const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const { connectToDatabase } = require('./database');
const jwt = require('jsonwebtoken');
const postjob = require('./routes/jobs');
const resumeRouter = require("./routes/resume");
const jobApplyRouter = require("./routes/jobsApply");
const { any } = require('joi');
// const { get } = require('mongoose');

// for multer storage.
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//middleware
app.use(express.json())
const corsOptions = {
  origin: 'http://localhost:5173', // Your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"], // Allow cookies or tokens to be included in requests
};
app.use(express.urlencoded({ extended: true }));
// Apply CORS middleware
app.use(cors(corsOptions));
// ss -->domain  and  sf-->domain2 // we need to use it differently.

// username: sunkarisahith03
// password: mEX0vuRNSE062nEQ

async function run() {
  try {
      const { recruitersCollection, seekersCollection, jobsCollections, resumeCollection } = await connectToDatabase();

      // Instead of this:
      // app.use('/api/users', (req, res, next) => {
      //   userRoutes(req, res, next, recruitersCollection, seekersCollection);
      // });

      // Do this:
      // app.use('/api/users', userRoutes(recruitersCollection, seekersCollection));
      app.use('/api/users', usersRoutes);
      app.use('/api/auth', authRoutes);
      app.use('/', postjob);
      app.use('/', jobApplyRouter);
      app.use('/', resumeRouter);

      console.log("Connected to MongoDB successfully!");
  } finally {
      // Your finally block
      // console.log("Sever error");
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// async function run() {
//   try {
//     const { recruitersCollection, seekersCollection, jobsCollections,resumeCollection } = await connectToDatabase();

//     // Routes for signup and login
//     app.use('/api/users', (req, res, next) => {
//       // Pass the recruiters and seekers collections to the user routes
//       userRoutes(req, res, next, recruitersCollection, seekersCollection);
//     });
//     app.use('/api/auth', authRoutes);
//     app.use('/',postjob);
//     app.use("/", jobApplyRouter);
//     app.use("/", resumeRouter);
//     app.use('/api/fetch', fetch)

//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     //
//   }
// }
// run().catch(console.dir);

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })

