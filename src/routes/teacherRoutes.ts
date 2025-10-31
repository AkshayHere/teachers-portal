import {
  createTeacher,
  getCommonStudents,
  getTeachers,
  sendNotificationForStudents,
  suspendStudentByEmail,
} from "controllers/teacherController";
import { Router } from "express";

const router = Router();
// Teachers API
/**
 * @swagger
 * tags:
 *   - name: Teachers
 *     description: Teacher management and student registration
 *   - name: Students
 *     description: Student management and suspension
 *   - name: Notifications
 *     description: Sending and retrieving notifications
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Teacher:
 *       type: object
 *       required:
 *         - teacher
 *         - students
 *       properties:
 *         teacher:
 *           type: string
 *           format: email
 *           example: tir@nizumwup.my
 *         students:
 *           type: array
 *           items:
 *             type: string
 *             format: email
 *           example: [ "recuzli@lew.gp", "bruce-banner@gmail.com" ]
 *     SuspendRequest:
 *       type: object
 *       required:
 *         - student
 *       properties:
 *         student:
 *           type: string
 *           format: email
 *           example: recuzli@lew.gp
 *     NotificationRequest:
 *       type: object
 *       required:
 *         - teacher
 *         - notification
 *       properties:
 *         teacher:
 *           type: string
 *           format: email
 *           example: tir@nizumwup.my
 *         notification:
 *           type: string
 *           example: "Hello students! @loki@gmail.com @bruce-banner@gmail.com"
 */

/**
 * @swagger
 * /api/teachers:
 *   get:
 *     summary: Retrieve all registered teachers
 *     tags: [Teachers]
 *     responses:
 *       200:
 *         description: List of teachers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 teachers:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: tir@nizumwup.my
 */

/**
 * @swagger
 * /api/teachers/register:
 *   post:
 *     summary: Register students under a teacher
 *     tags: [Teachers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Teacher'
 *     responses:
 *       204:
 *         description: Registration successful (no content returned)
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /api/commonstudents:
 *   get:
 *     summary: Retrieve common students for one or more teachers
 *     tags: [Teachers]
 *     parameters:
 *       - in: query
 *         name: teacher
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             format: email
 *         required: true
 *         description: Email(s) of teacher(s)
 *         example: [ "tir@nizumwup.my", "odin@gmail.com" ]
 *     responses:
 *       200:
 *         description: List of common students
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 students:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: [ "bruce-banner@gmail.com", "recuzli@lew.gp" ]
 */

/**
 * @swagger
 * /api/suspend:
 *   post:
 *     summary: Suspend a student
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SuspendRequest'
 *     responses:
 *       204:
 *         description: Student suspended successfully
 *       400:
 *         description: Invalid student email
 */

/**
 * @swagger
 * /api/retrievefornotifications:
 *   post:
 *     summary: Retrieve recipients eligible for a notification
 *     tags: [Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NotificationRequest'
 *     responses:
 *       200:
 *         description: List of recipients to receive the notification
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 recipients:
 *                   type: array
 *                   items:
 *                     type: string
 *                     format: email
 *                     example: [ "bruce-banner@gmail.com", "loki@gmail.com" ]
 */
router.get("/teachers", getTeachers);
router.post("/teachers/register", createTeacher);
router.get("/commonstudents", getCommonStudents);
router.post("/suspend", suspendStudentByEmail);
router.post("/retrievefornotifications", sendNotificationForStudents);

export default router;
