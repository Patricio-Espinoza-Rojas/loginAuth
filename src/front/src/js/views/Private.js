import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

function Private() {
  const [name, setName] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/private", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
    })
      .then((response) => {
        if (response.status === 401 || response.status === 422) {
          console.log("UNAUTHORIZED");
          handleLogout();
        } else {
          return response.json();
        }
      })
      .then((data) => console.log(data))
      .catch((error) => console.log(error));

    setName(sessionStorage.getItem("user"));
  }, []);

  let history = useHistory();
  const handleLogout = () => {
    history.push("/login");
    sessionStorage.clear();
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-light">
        <div className="container">
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <div className="dropdown ms-auto">
              <button
                className="btn btn-primary dropdown-toggle px-3"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {name}
              </button>
              <ul className="dropdown-menu dropdown-menu-end text-center">
                <button
                  className="btn btn-danger"
                  onClick={() => handleLogout()}
                >
                  Cerrar sesion
                </button>
              </ul>
            </div>
          </div>
        </div>
      </nav>
      <div className="container d-flex mt-5 flex-column align-items-center">
        <h1>Datos privados</h1>
        <h4>Usuario : {name}</h4>
      </div>
    </div>
  );
}

export default Private;
