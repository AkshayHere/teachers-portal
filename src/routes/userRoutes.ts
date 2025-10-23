import { createTeacher, getCommonStudents, getTeachers } from "controllers/teacherController";
import { createUser, getUsers } from "controllers/userController";
import { Router } from "express";

const router = Router();
router.get('/users', getUsers);
router.post('/users', createUser);

// Teachers API
router.get('/teachers', getTeachers);
router.post('/teachers/register', createTeacher);
router.get('/commonstudents', getCommonStudents);

export default router;
