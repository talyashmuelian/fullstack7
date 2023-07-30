import "./App.css";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signin from "./pages/Signin";
import LoginAdmin from "./pages/LoginAdmin";
import HomeClients from "./pages/HomeClients";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="/" element={<Navigate to="/Login" />} />
        <Route path="/Signin" element={<Signin />} />
        <Route path="/LoginAdmin" element={<LoginAdmin />} />
        <Route path="/HomeClients" element={<HomeClients />} />
        {/* <Route path="Users" element={<Users />}>
          <Route path=":id/Posts" element={<Posts />} />
          <Route path=":id/Todos" element={<Todos />} />
          <Route path=":id/Info" element={<Info />} />
        </Route> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;

// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
