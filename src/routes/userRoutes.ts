import {
  createTeacher,
  getCommonStudents,
  getTeachers,
  sendNotificationForStudents,
  suspendStudentByEmail,
} from "controllers/teacherController";
import { createUser, getUsers } from "controllers/userController";
import { Router } from "express";

const router = Router();
router.get("/users", getUsers);
router.post("/users", createUser);

// Teachers API
router.get("/teachers", getTeachers);
router.post("/teachers/register", createTeacher);
router.get("/commonstudents", getCommonStudents);
router.post("/suspend", suspendStudentByEmail);
router.post("/retrievefornotifications", sendNotificationForStudents);

export default router;
