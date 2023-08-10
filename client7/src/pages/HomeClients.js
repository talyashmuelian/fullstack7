import { Outlet, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { requestsGet } from "../requestsFromServer.js";
import { useNavigate, NavLink } from "react-router-dom";

import "../css/HomeClients.css"; // Styles for the redesigned component

const HomeClients = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  var userID = JSON.parse(localStorage.getItem("currentUserID"));

  useEffect(async () => {
    if (!userID) {
      navigate("/Login");
    }

    // const response = await requestsGet(`/customer/${userID}/info`);
    // let data = await response.json();
    // setUser(data.name);
  }, []);

  return (
    <div className="users-container">
      <h1 className="user-name">Hello, {user.name}</h1>
      <Link to="/Login">
        <button
          className="logout-button"
          onClick={() => {
            localStorage.removeItem("currentUserID");
          }}
        >
          Logout
        </button>
      </Link>
      <nav className="user-navigation">
        <ul>
          <li>
            <Link>Appointments</Link>
            <ul className="sub-menu">
              <li>
                <Link to={`/Users/${userID}/Appointments/MakeAppointment`}>
                  Making an Appointment
                </Link>
              </li>
              <li>
                <Link to={`/Users/${userID}/Appointments/History`}>
                  My Appointment History
                </Link>
              </li>
              <li>
                <Link to={`/Users/${userID}/Appointments/Future`}>
                  My Future Appointments
                </Link>
              </li>
            </ul>
          </li>
          <li>
            <Link to={`/Users/${userID}/Payments`}>Payments</Link>
          </li>
          <li>
            <Link to={`/Users/${userID}/Messages`}>Messages</Link>
          </li>
          <li>
            <Link>Replacement Requests</Link>
            <ul className="sub-menu">
              <li>
                <Link to={`/Users/${userID}/Requests/MyRequests`}>
                  Requests I Created
                </Link>
              </li>
              <li>
                <Link to={`/Users/${userID}/Requests/RequestsForMe`}>
                  Requests For Me
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
};

export default HomeClients;

// import { Outlet, Link } from "react-router-dom";
// import "./Users.css";
// import { useEffect, useState } from "react";
// import { requestsGet } from "../requestsFromServer.js";

// const HomeClients = () => {
//     const [user,setUser]=useState({});
//   var userID = JSON.parse(localStorage.getItem("currentUserID"));
//   console.log("line6 " + user.id);
//   useEffect(async()=>{
//     const response = await requestsGet(
//         `/customer/${userID}/info`
//       );
//       let data=await response.json();
//       setUser(data.name)

//   },[]
//   );
//   return (
//     <div className="users-container">
//       <h1 className="user-name">hello {user.name}</h1>
//       <Link to="/Login">
//         <button
//           className="logout-button"
//           onClick={() => {
//             localStorage.removeItem("currentUserID");
//           }}
//         >
//           Logout
//         </button>
//       </Link>
//       <nav className="user-navigation">
//         <ul>
//           <li>
//             <Link to={`/Users/${userID}/Posts`}>Posts</Link>
//           </li>

//         </ul>
//       </nav>
//       <Outlet />
//     </div>
//   );
// };

// export default HomeClients;
