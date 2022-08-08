This is a simple Node Js Express Framework USER AUTHENTICATION API
with JSONWEBTOEKN
It is created strictly following the MVC design pattern.

// Run npm install at the root folder to install all API dependencies
// Start API at the root folder using ==== npm start || npm run dev

=== npm run dev starts the server with nodemon.
The API runs on PORT 3000

The root page is served on http://localhost:3000

======= DATABASE ==========
Mongo Db community

======= BASIC ROUTES =========
// User Registeration Route
http Verb = POST

http://localhost:3000/api/auth/register

// User Login
http Verb = POST

http://localhost:3000/api/auth/login

User Roles

// The app possess the functionality to assign roles to each users based on their selected

Available Roles

// 1. tutor 2. student 3 admin
// roles are defaultly set to not assigned when not provided at registeration
// Users are restricted on certain pages and routes based on the roles assigned
// only admins can visit the admin page and pages of other users and can also view the details of other users
// tutors cannot view the admin page and profile but can visit or view profile of students
// students do not have access to other users profiles and cannot visit other users pages

User Roles Route

// all routes under the role routes are protected with the jsonwebtoken middle
// the generated jsonwebtoken must be passed as a header in all request as "auth-token" to view protected routes for authorized access

// Admin page Route
http Verb = Get
http://localhost:3000/api/auth/adminpage
// http response = admin profile details and all available and registered users

// Tutor page Route
http Verb = Get
http://localhost:3000/api/auth/tutorpage
//http response = tutor profile details and all registered students

// Student page Route
http Verb = Get
http://localhost:3000/api/auth/studentpage
http response = Student's profile details only

below is a link to all api codes and functionalities
