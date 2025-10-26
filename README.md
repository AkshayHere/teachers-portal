# Teacher portal

## Background

This backend project is created using Node.js with ExpressJS and Typescript for managing students and teachers. We are using the below technologies for development.

1. [ExpressJS Framework](https://expressjs.com/)
2. [Prisma](https://www.prisma.io/) as ORM
3. [MySQL](https://www.mysql.com/) as database 
4. [ZOD](https://zod.dev/) for request validations
5. [Jest](https://jestjs.io/) for creating automated unit tests
6. [ESLint](https://eslint.org/) for making code quality is ensured to make sure stable builds are generated.

The below project can be run locally with by cloning this repo locally and running the below commands in the project folder.
Make sure that u have configured and installed [`Docker`](https://www.docker.com/products/docker-desktop/) in your system.

Once you have successfully done that, run the below command to kick start the project.

```bash
docker compose -f docker-compose.dev.yaml up -d --build
```

The application has also been containerized and deployed in Docker hub. You may have a look at this under [Docker hub](hub.docker.com/repository/docker/akshayhere/teachers-portal-app/). This docker image has been used for deployment in an AWS EC2 instance as well. You may check that out [here](http://ec2-3-19-77-232.us-east-2.compute.amazonaws.com:3000/).



## API Specifications

### Get all teachers

List all teachers registered within the system.

- Endpoint: `GET /api/teachers`
- Success response status: HTTP 200 OK
- Request example: `GET /api/teachers`
- Success response body:

```
[
    "teacherkent@gmail.com",
    "teachercarl@gmail.com"
]
```

### Register new students under teacher

A teacher can register multiple students. A student can only be registered to a single teachers.

- Endpoint: `POST /api/register`
- Headers: `Content-Type: application/json`
- Success response status: HTTP 204 No Content
- Request body example:

```
{
  "teacher": "teacherken@gmail.com"
  "students":
    [
      "studentjon@gmail.com",
      "studenthon@gmail.com"
    ]
}
```

### Get all the students registered under a list of teachers.

- Endpoint: `GET /api/commonstudents`
- Success response status: HTTP 200 OK
- Request example: `GET /api/commonstudents?teacher=hulk%40gmail.com&teacher=odin%40gmail.com` (Pass multiple teacher names as array).
- Success response body:

```
{
  "students" :
    [
      "commonstudent1@gmail.com",
      "commonstudent2@gmail.com",
      "melbrooks@gmail.com"
    ]
}
```

### Suspend a specified student.

- Endpoint: `POST /api/suspend`
- Headers: `Content-Type: application/json`
- Success response status: HTTP 204 No Content
- Request body example:

```
{
  "student" : "studentmary@gmail.com"
}
```

### Retrieve a list of students who can receive a given notification.

A `notification` consists of:

- the teacher who is sending the notification, and
- the text of the notification itself.

To receive notifications from e.g. 'teacherken@gmail.com', a student:

- MUST NOT be suspended,
- AND MUST fulfill _AT LEAST ONE_ of the following:
  1. is registered with “teacherken@gmail.com"
  2. has been @mentioned in the notification

The list of students retrieved should not contain any duplicates/repetitions.

- Endpoint: `POST /api/retrievefornotifications`
- Headers: `Content-Type: application/json`
- Success response status: HTTP 200 OK
- Request body example:

```
{
  "teacher":  "teacherken@gmail.com",
  "notification": "Hello students! @studentagnes@gmail.com @studentmiche@gmail.com"
}
```

- Success response body:

```
{
  "recipients":
    [
      "studentbob@gmail.com",
      "studentagnes@gmail.com",
      "studentmiche@gmail.com"
    ]
}
```

In the example above, `studentagnes@gmail.com` and `studentmiche@gmail.com` can receive the notification from `teacherken@gmail.com`, regardless whether they are registered to him, because they are `@mentioned` in the notification text. `studentbob@gmail.com` however, has to be registered to `teacherken@gmail.com`.

- Request body example:

```
{
  "teacher":  "teacherken@gmail.com",
  "notification": "Hey everybody"
}
```

- Success response body:

```
{
  "recipients":
    [
      "studentbob@gmail.com"
    ]
}
```

### Error Handling

Attached below is the sample error response message

```
{ "message": "Teacher email already exists." }
```

[Reference](https://gist.github.com/d3hiring/4d1415d445033d316c36a56f0953f4ef)
