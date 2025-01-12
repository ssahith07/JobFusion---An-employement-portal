// routes/jobs.js

const express = require("express");
const router = express.Router();
const { verifyToken, authorizeRole } = require("../utils/verifyToken");
const port = process.env.PORT || 5000;
require("dotenv").config();
// const multer = require('multer');
const { ObjectId } = require("mongodb");
const { connectToDatabase } = require("../database");
// const jwt = require('jsonwebtoken');

// Posting a job`
router.post("/post-job", verifyToken, authorizeRole('recruiter'), async (req, res) => {
  const { jobsCollections } = await connectToDatabase();
  const body = req.body;
  body.appliedUsers = [];
  body.accepted = [];
  body.rejected = [];
  body.createAt = new Date();
  // console.log(body)
  const result = await jobsCollections.insertOne(body);
  if (result.insertedId) {
    return res.status(200).send(result);
  } else {
    return res.status(404).send({
      message: "cannot insert try again later!",
      status: false,
    });
  }
});
router.post("/post-gjob", verifyToken, authorizeRole('recruiter'), async (req, res) => {
  const { govtCollection } = await connectToDatabase();
  const body = req.body;
  body.createAt = new Date();
  // console.log(body)
  const gresult = await govtCollection.insertOne(body);
  if (gresult.insertedId) {
    return res.status(200).send(gresult);
  } else {
    return res.status(404).send({
      message: "cannot insert try again later!",
      status: false,
    });
  }
});

// importing all jobs
router.get("/all-jobs",verifyToken,authorizeRole('seeker'), async (req, res) => {
  const { jobsCollections } = await connectToDatabase();
  const jobs = await jobsCollections.find({}).toArray();
  // const jobs = [...pjobs, ...gjobs];
  res.send(jobs);
});

router.get("/all-gjobs",verifyToken,authorizeRole('seeker'), async (req, res) => {
  const { govtCollection } = await connectToDatabase();
  const gjobs = await govtCollection.find({}).toArray();
  res.send(gjobs);
});

// importing single job.
router.get("/all-jobs/:id", verifyToken, authorizeRole('seeker'), async (req, res) => {
  // console.log("Route params:", req.params);
  const { id } = req.params;  // Ensure id is retrieved correctly from route params
  // console.log("Job ID:", id);  // Verify if the id is correctly logged

  // Check if the id is a valid ObjectId
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Job ID format" });
  }

  const {
    recruitersCollection,
    seekersCollection,
    jobsCollections,
    resumeCollection,
  } = await connectToDatabase();

  try {
    const job = await jobsCollections.findOne({
      _id: new ObjectId(id),
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.send(job);
  } catch (error) {
    console.error("Error retrieving job details:", error);
    res.status(500).json({ message: "Error retrieving job details" });
  }
});



router.get("/all-gjobs/:id",verifyToken, authorizeRole('seeker'), async (req, res) => {
  const { govtCollection } = await connectToDatabase();
  const id = req.params.id;
  const job = await govtCollection.findOne({
    _id: new ObjectId(id),
  });
  res.send(job);
});

// importing jobs by email.
router.get("/mypJobs/:email",verifyToken, authorizeRole('recruiter'), async (req, res) => {
  const { jobsCollections } = await connectToDatabase();
  // console.log(req.params.email)
  const jobs = await jobsCollections
    .find({ postedBy: req.params.email })
    .toArray();
  res.send(jobs);
});
router.get("/mygJobs/:email",verifyToken, authorizeRole('recruiter'), async (req, res) => {
  const { govtCollection } = await connectToDatabase();
  // console.log(req.params.email)
  const jobs = await govtCollection
    .find({ postedBy: req.params.email })
    .toArray();
  res.send(jobs);
});

// deleting a job by using job id

router.delete("/job/:id",verifyToken, authorizeRole('recruiter'), async (req, res) => {
  const { seekersCollection, jobsCollections } = await connectToDatabase();
  const jobId = req.params.id;
  const filter = { _id: new ObjectId(jobId) };
  //console.log(id);
  try {
    const job = await jobsCollections.findOne(filter);
    const { appliedUsers } = job;
    if (appliedUsers) {
      try {
        const seekersPromises = appliedUsers.map(async (id) => {
          const newId = new ObjectId(id); // MongoDB id
          const user = await seekersCollection.findOne({ _id: newId });

          if (user) {
            const { jobsApplied } = user;
            const index = jobsApplied.indexOf(jobId);
            if (index !== -1) {
              jobsApplied.splice(index, 1); // Remove the jobId from the array
              await seekersCollection.updateOne(
                { _id: newId },
                { $set: { jobsApplied } }
              );
            }
          } else {
            console.log(`User with ID ${id} not found.`);
          }
        });

        await Promise.all(seekersPromises);
        const result = await jobsCollections.deleteOne(filter);
        return res.send(result);
      } catch (error) {
        console.error("Error occurred while processing:", error);
        return res.status(500).send("Internal Server Error");
      }
    } else {
      const result = await jobsCollections.deleteOne(filter);
      return res.send(result);
    }
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).send({
      message: "Internal server error",
      status: false,
    });
  }
});

router.delete("/gjob/:id",verifyToken, authorizeRole('recruiter'), async (req, res) => {
  const { govtCollection } = await connectToDatabase();
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };

  try {
    const result = await govtCollection.deleteOne(filter);
    console.log(result);
    res.send(result);
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).send({
      message: "Internal server error",
      status: false,
    });
  }
});

// Editing Jobs

router.patch("/edit-job/:id",verifyToken, authorizeRole('recruiter'), async (req, res) => {
  const {
    recruitersCollection,
    seekersCollection,
    jobsCollections,
    resumeCollection,
  } = await connectToDatabase();
  const id = req.params.id;
  const jobData = req.body;
  const filter = { _id: new ObjectId(id) };
  const options = { upsert: true };
  const updateDoc = {
    $set: {
      ...jobData,
    },
  };

  const result = await jobsCollections.updateOne(filter, updateDoc, options);
  res.send(result);
});
router.patch("/edit-gjob/:id",verifyToken, authorizeRole('recruiter'), async (req, res) => {
  const { govtCollection } = await connectToDatabase();
  const id = req.params.id;
  const jobData = req.body;
  const filter = { _id: new ObjectId(id) };
  const options = { upsert: true };
  const updateDoc = {
    $set: {
      ...jobData,
    },
  };

  const result = await govtCollection.updateOne(filter, updateDoc, options);
  res.send(result);
});

module.exports = router;
