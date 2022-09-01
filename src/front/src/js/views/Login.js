import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);

  const sendDatabase = (userdata) => {
    fetch("http://127.0.0.1:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userdata),
    })
      .then((response) => {
        if (response.status === 401) {
          alert("Usuario incorrecto!");
        } else {
          return response.json();
        }
      })
      .then((data) => {
        console.log(data);
        data.status === "success"
          ? (setLoginSuccess(true),
            sessionStorage.setItem(
              "token",
              data.data.access_token,
              sessionStorage.setItem("user", data.data.user.email)
            ))
          : null;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    var userData = {
      email: email,
      password: password,
    };
    sendDatabase(userData);
  };

  if (loginSuccess) {
    let history = useHistory();
    history.push("/private");
  }

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-12 d-flex justify-content-center">
            <form
              className="m-5"
              style={{ width: "450px" }}
              onSubmit={(e) => handleSubmit(e)}
            >
              <div className="col-md-12 text-center mb-4">
                <h3>Login</h3>
              </div>
              <div className="row mb-3">
                <label
                  htmlFor="inputEmail3"
                  className="col-sm-2 col-form-label"
                >
                  Email:
                </label>
                <div className="col-sm-10">
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="row mb-3">
                <label
                  htmlFor="inputPassword3"
                  className="col-sm-2 col-form-label"
                >
                  Password:
                </label>
                <div className="col-sm-10">
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="d-grid">
                <button type="submit" className="btn btn-primary gap-2">
                  Sign in
                </button>
              </div>
              <div className="mt-3 d-flex justify-content-center">
                <h5>
                  <Link to="/register">Register</Link>
                </h5>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
