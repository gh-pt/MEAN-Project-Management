"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const index_1 = __importDefault(require("./db/index"));
const User_route_1 = __importDefault(require("./routes/User.route"));
const Project_route_1 = __importDefault(require("./routes/Project.route"));
const Query_route_1 = __importDefault(require("./routes/Query.route"));
const PORT = process.env.PORT || 3000;
const app = (0, express_1.default)();
app.use((0, morgan_1.default)("tiny"));
// Middleware cors
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded());
app.use((0, cookie_parser_1.default)());
app.get("/", (req, res) => {
    res.send("Express + TypeScript Server!!");
});
// MonogDB Connection
(0, index_1.default)()
    .then(() => {
    app.listen(PORT, () => {
        console.log("Server is running on Port: " + PORT);
    });
})
    .catch((error) => {
    console.log("MongoDB Connection Failed !!!", error);
});
app.use("/api/user", User_route_1.default);
app.use("/api/project", Project_route_1.default);
app.use("/api/query", Query_route_1.default);
