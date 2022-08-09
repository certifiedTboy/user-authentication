##This is a simple Node Js Express Framework USER AUTHENTICATION API
##with JSONWEBTOEKN
##It is created strictly following the MVC design pattern.

// Run npm install at the root folder to install all API dependencies
// Start API at the root folder using ==== npm start || npm run dev

=== npm run dev starts the server with nodemon.
The API runs on PORT 3000

The root page is served on http://localhost:3000

##DATABASE \
Mongo Db community

##BASIC ROUTES
// User Registeration Route
http Verb = POST

http://localhost:3000/api/auth/register

// User Login
http Verb = POST

http://localhost:3000/api/auth/login

##User Roles

// The app possess the functionality to assign roles to each users based on their selected

##Available Roles

// 1. Staff 2. Managers 3 Admin
// roles are defaultly set to not assigned when not provided at registeration
// Users are restricted on certain pages and routes based on the roles assigned
// only Managers can visit the managers page and pages of other users and can also view the details of other users
// admins cannot view the Managers page and profile but can visit or view profile of other staff
// staff do not have access to other users profiles and cannot visit other users pages

User Roles Route

// all routes under the role routes are protected with the jsonwebtoken middle
// the generated jsonwebtoken must be passed as a header in all request as "auth-token" to view protected routes for authorized access

// Managers page Route
http Verb = Get
http://localhost:3000/api/user/managerpage
// http response = managers profile details and all available and registered users

// Managers page Route
http Verb = Get
http://localhost:3000/api/user/adminpage
//http response = admin profile details and all registered staff

// Staff page Route
http Verb = Get
http://localhost:3000/api/user/staffpage
http response = Staff's profile details only

##PassWord Reset
//The app supports a password reset functionality

##request for password reset
hhtp Verb = POST
http://localhost:3000/api/auth/resetpassword

// it takes a body data of email
// a token for password reset is added to the user profile
// token is generated using the cryto module

##Password change
http verb = POST
http://localhost:3000/api/auth/resetpassword/:token

// the password change data takes of body of newPassword

below is a link to all api codes and functionalities
