"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_controller_1 = require("../controllers/User.controller");
const upload_middleware_1 = __importDefault(require("../middlewares/upload.middleware"));
const router = express_1.default.Router();
// Register User
router.post('/', upload_middleware_1.default.single('ProfileImage'), User_controller_1.registerUser);
// Get all Users
router.get('/', User_controller_1.getAllUsers);
// Login User
router.route('/login').post(User_controller_1.loginUser);
// Refresh Token
router.route('/refresh-token').post(User_controller_1.refreshAccessToken);
// Verify Token
router.route('/verify-token').get(User_controller_1.verifyToken);
exports.default = router;
