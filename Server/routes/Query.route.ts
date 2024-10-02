import express from "express";
import { addQuery, addReplyToQuery, deleteQuery, getAllQueries, getQueriesByProject, getQueryById, updateQuery } from "../controllers/Query.controller";


const router = express.Router();

// Add the Query
router.post("/add-query", addQuery);

// Get all Queries
router.get("/queries", getAllQueries);

// Get Query by id
router.get("/getQueryById/:id", getQueryById);

// Update Query
router.put("/updateQuery/:id", updateQuery);

// Delete Query
router.delete("/deleteQuery/:id", deleteQuery);

// Reply to Query
router.post("/replyToQuery/:id", addReplyToQuery);

// Get all Queries by project
router.get("/queriesByProject/:id", getQueriesByProject);

export default router;
