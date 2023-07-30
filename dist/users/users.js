"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRouter = void 0;
const express_1 = __importDefault(require("express"));
const useRouter = express_1.default.Router();
exports.useRouter = useRouter;
useRouter.use((req, res, next) => {
    console.log('Обработчик users');
    next();
});
useRouter.post('/login', (req, res) => {
    res.send('login');
});
useRouter.post('/register', (req, res) => {
    res.send('register');
});
