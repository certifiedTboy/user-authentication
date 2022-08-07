let colDiv = document.querySelector(".col-div");
let loginButtonDiv = document.querySelector(".login-button-div");
let regButtonDiv = document.querySelector(".reg-button-div");
let errorMessage = document.querySelector(".error-message");

// render registration form on first load
const loadPage = () => {
  loginButtonDiv.classList.remove("d-none");
  regButtonDiv.classList.add("d-none");

  colDiv.innerHTML = `<div>
    <h4>Register Here</h4>
    <p>Enter valid information to registers as a new user</p> <br>
</div>

<form id="register-form" onsubmit="registerUser()">
  <div class="form-group">
    <input class="form-control first-name" name="firstName" type="text" placeholder="First Name" required>
  </div>  <br>
  <div class="form-group">
    <input class="form-control last-name" name="lastName" type="text" placeholder="Last Name">
  </div> <br>
  <div class="form-group">
    <input class="form-control email" name="email" type="email" placeholder="Email Address">
</div><br>
<div class="form-group">
    <select name="userRole" class="user-role form-select form-select-lg mb-3" aria-label=".form-select-lg example">
        <option value="tutor">Tutor</option>
        <option value="student">Stduent</option>
        <option value="admin">Admin</option>
    </select>
</div> 

    <input class="form-control password" name="password" type="password" placeholder="Password"> <br>

    <button class="btn btn-success" type="submit">Submit</button>
</form>

`;
};

// runs when user logs in successfully
const LoginSuccessPage = (userData) => {
  console.log(userData);
  colDiv.innerHTML = `<div>
  <h5>This is a simple User Authentication App</h5> 
<p>Below are your basic details</p>
    <h4>Welcome ${userData.firstName} - ${userData.lastName}</h4>
        <div>
            <h5>email : ${userData.email}</h5>
                <h5>Role : ${userData.userRole}</h5>
            </div>
        <br>
    <div>
${(() => {
  if (userData.userRole === "admin") {
    return `
        <a href="#">Admin Page</a>
        <a href="#">Tutor Dashboard</a>
        <a href="#">Student Dashboard </a>
            `;
  } else if (userData.userRole === "tutor") {
    return `
    
    <a href="#">Tutor Dashboard</a>
   
            `;
  } else {
    return ` 
    <a href="#">Student Dashboard </a>`;
  }
})()}
   
    </div>
</div>`;
};

const loginPage = () => {
  colDiv.innerHTML = "";
  regButtonDiv.classList.remove("d-none");
  loginButtonDiv.classList.add("d-none");

  colDiv.innerHTML = `<div>
      <h4>Login Here</h4>
      <p>Enter valid information to login</p> <br>
  </div>
  <form id="login-form" onsubmit="loginUser()">
      <div class="form-group">
      <input class="form-control email" name="email" type="email" placeholder="Email Address">
  </div><br>

      <input class="form-control password" name="password" type="password" placeholder="Password"> <br>

      <button class="btn btn-success" type="submit">Login</button>
  </form>
 `;
};

//call load page function
loadPage();

// home page DOM manipulation
const regForm = document.getElementById("register-form");
const loginForm = document.getElementById("login-form");
const loginButton = document.querySelector(".login");
const regButton = document.querySelector(".register");

// submit form data to backend server // register user function
const registerUser = () => {
  const firstNameData = document.querySelector(".first-name");
  const lastNameData = document.querySelector(".last-name");
  const emailData = document.querySelector(".email");
  const userRoleData = document.querySelector(".user-role");
  const passwordData = document.querySelector(".password");

  const data = {
    firstName: firstNameData.value,
    lastName: lastNameData.value,
    email: emailData.value,
    userRole: userRoleData.value,
    password: passwordData.value,
  };
  fetch("http://localhost:3000/api/auth/register", {
    method: "POST",
    mode: "cors",
    body: JSON.stringify(data),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.errors) {
        console.log(data.errors.email);

        return (errorMessage.innerHTML = `<p> ${
          data.errors.email || data.errors.email
        } </p>`);
      }

      loginPage();
      errorMessage.innerHTML = `<p>Registeration successfull, login with your credentials </p>`;
    })
    .catch((error) => {
      console.log(error);
    });
};

// login user function
const loginUser = () => {
  const emailData = document.querySelector(".email");
  const passwordData = document.querySelector(".password");

  const data = {
    email: emailData.value,
    password: passwordData.value,
  };
  fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    mode: "cors",
    body: JSON.stringify(data),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        return (errorMessage.innerHTML = `<p> ${data.error} </p>`);
      }

      console.log(data.user);
      regButtonDiv.classList.add("d-none");
      loginButtonDiv.classList.add("d-none");
      LoginSuccessPage(data.user);
    })
    .catch((error) => {
      console.log(error);
    });
};

//switch between login form and registeration form
loginButton.addEventListener("click", loginPage);
regButton.addEventListener("click", loadPage);
