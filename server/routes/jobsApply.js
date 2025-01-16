// routes/jobsApply.js

const express = require("express");
const {verifyToken, authorizeRole } = require("../utils/verifyToken");
const { connectToDatabase } = require("../database");
const { ObjectId } = require("mongodb");
const router = express.Router();

router.get("/api/checking", (req, res) => {
  res.send("Job Apply end point eorking!!");
});

// Using job id applying the job
router.post("/apply-job/:id", verifyToken, authorizeRole('seeker'), async (req, res) => {
  const { jobsCollections, seekersCollection } = await connectToDatabase();
  const { _id } = req.user;
  const id = req.params.id;

  const seeker = await seekersCollection.findOneAndUpdate(
    {
      _id: new ObjectId(_id),
    },
    { $push: { jobsApplied: id } },
    { new: true }
  );
  const updatedJob = await jobsCollections.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $push: { appliedUsers: _id } },
    { new: true }
  );


  res.send(updatedJob);
});

router.post("/acc/:id", verifyToken,authorizeRole('recruiter'), async (req, res) => {
  try {
    const { jobsCollections } = await connectToDatabase();
    const jobId = req.params.id;
    console.log(jobId)
    const seekerId = req.body.seekerId; 
    const action = req.body.action;
    const update = action === 'accept' ? 'accepted' : 'rejected';
    const updjob = await jobsCollections.findOneAndUpdate(
      { _id: new ObjectId(jobId) },
      { $push: { [update] :seekerId } },
      { new: true }
    );

    if (!updjob) {
      console.log("Job not found.");
      return res.status(404).send("Job not found.");
    }

    console.log("Updated Job:", updjob);
    res.send(updjob);
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).send("Internal Server Error");
  }
});



// Using job id to get applied users
router.get("/applied-users/:id", verifyToken, authorizeRole('recruiter'),async (req, res) => {
  try {
    // console.log("looking for appliedUsers");
    const { jobsCollections, profileCollection } = await connectToDatabase();
    const id = req.params.id;
    // console.log(id)
    // Convert id to ObjectId
    const objectId = new ObjectId(id);

    // Find the job document by its id
    const job = await jobsCollections.findOne({ _id: objectId });

    const { appliedUsers } = job;
    const seekersPromises = appliedUsers.map(async (id) => {
      // console.log(id);
      const user = await profileCollection.findOne({
        seekerId: id,
      });
      return user;
    });

    const seekers = await Promise.all(seekersPromises);

    res.send(seekers);
  } catch (error) {
    console.error("Error retrieving job details:", error);
    res.status(500).send("Internal Server Error");
  }
});


router.get("/applied-jobs",verifyToken, authorizeRole('seeker'), async (req, res) => {
  try {
    const { jobsCollections, seekersCollection } = await connectToDatabase();
    const id = req.user._id;
    console.log(id)
    // Convert id to ObjectId
    const objectId = new ObjectId(id);
    // Find the job document by its id
    const seeker = await seekersCollection.findOne({ _id: objectId });

    const { jobsApplied } = seeker;
    const jobPromises = jobsApplied.map(async (id) => {
      // console.log(id);
      const job = await jobsCollections.findOne({
        _id: new ObjectId(id),
      });
      return job;
    });

    const jobs = await Promise.all(jobPromises);

    res.send(jobs);
  } catch (error) {
    console.error("Error retrieving job details:", error);
    res.status(500).send(error.message);
  }
});


router.get("/acc-rej/:id",verifyToken,authorizeRole('recruiter'), async (req, res) => {
  try {
    const { jobsCollections } = await connectToDatabase();
    const id = req.params.id;
    // Convert id to ObjectId
    const objectId = new ObjectId(id);
    const job = await jobsCollections.findOne({ _id: objectId });
    if (!job) {
      console.log("Job not found.");
      return res.status(404).send("Job not found.");
    }
    const { accepted,rejected } = job || { accepted: [] };
    res.send({accepted,rejected});
  } catch (error) {
    console.error("Error retrieving job details:", error);
    res.status(500).send(error.message);
  }
});


router.get("/applied",verifyToken,authorizeRole('seeker'), async (req, res) => {
  try {
    const {seekersCollection} = await connectToDatabase();
    const id = req.user._id;
    // console.log(id)
    const seeker = await seekersCollection.findOne({
      _id : new ObjectId(id),
    })
    const {jobsApplied} = seeker;
    res.send({jobsApplied:jobsApplied});
  } catch (error) {
    console.error("Error retrieving seeker details:", error);
    res.status(500).send(error.message);
  }
});


module.exports = router;
