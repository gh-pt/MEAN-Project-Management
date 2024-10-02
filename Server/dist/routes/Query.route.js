"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Query_controller_1 = require("../controllers/Query.controller");
const router = express_1.default.Router();
// Add the Query
router.post("/add-query", Query_controller_1.addQuery);
// Get all Queries
router.get("/queries", Query_controller_1.getAllQueries);
// Get Query by id
router.get("/getQueryById/:id", Query_controller_1.getQueryById);
// Update Query
router.put("/updateQuery/:id", Query_controller_1.updateQuery);
// Delete Query
router.delete("/deleteQuery/:id", Query_controller_1.deleteQuery);
// Reply to Query
router.post("/replyToQuery/:id", Query_controller_1.addReplyToQuery);
// Get all Queries by project
router.get("/queriesByProject/:id", Query_controller_1.getQueriesByProject);
exports.default = router;
