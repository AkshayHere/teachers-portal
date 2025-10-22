import { getTeachers } from "controllers/teacherController";
import { createUser, getUsers } from "controllers/userController";
import { Router } from "express";

const router = Router();
router.get('/users', getUsers);
router.post('/users', createUser);
router.post('/teachers', getTeachers);

export default router;
