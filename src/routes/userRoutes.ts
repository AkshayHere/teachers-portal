import { createUser, getUsers } from "controllers/userController";
import { Router } from "express";

const router = Router();
router.get('/users', getUsers);
router.post('/users', createUser);

export default router;
