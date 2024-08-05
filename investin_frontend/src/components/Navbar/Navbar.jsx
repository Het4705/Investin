import React, { useState, useEffect } from "react";
import styles from "./Navbar.module.css";
import logo from "../../assets/logo.png";

import { NavLink } from "react-router-dom";
import Cookies from "js-cookie";


export default function Navbar() {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const storedUsername = Cookies.get("username");
    const storedRole = Cookies.get("role");

    if (storedUsername && storedRole) {
      setUsername(storedUsername);
      setRole(storedRole);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogOut = () => {
    Cookies.remove("username");
    Cookies.remove("role");
    Cookies.remove("token");
    Cookies.remove("id");

    window.location.reload();
  };

  return (
    <div
      className={`z-10 bg-white flex justify-between items-center opacity-80 ${styles.navbar}`}
    >
      <div className={styles.navlist1}>
        <img src={logo} alt="Investin" className={styles.logo} />
        <NavLink to="/home">Investin</NavLink>
        <NavLink to="/forinvestors">For Investors</NavLink>
        <NavLink to="/forstartups">For Startups</NavLink>
        <NavLink to="/resources">Resources</NavLink>
      </div>

      {isLoggedIn ? (
        <>
          <div className="flex justify-center items-center gap-1">
            <h3 className="text-lg text-slate-800/90 font-bold">Welcome</h3>
            <button
              onClick={() => setIsDropdownVisible(!isDropdownVisible)}
              className="bg-slate-950 shadow-sm hover:scale-95 border-[2px] border-slate-500  shadow-fuchsia-950 text-white p-1 text-lg rounded-xl overflow-clip"
            >
              {username.split(" ")[0]}
            </button>
            {isDropdownVisible && (
              <div  onClick={() => setIsDropdownVisible(!isDropdownVisible)} className="absolute bg-black text-white flex flex-col rounded-xl justify-evenly items-start right-[-30px] top-[7vh]  p-5 gap-3">
                <NavLink
                  to="/profile"
                  className="hover:border-b-2 border-white w-full p-1"
                >
                  Profile
                </NavLink>
                <NavLink
                  to="/partnerships"
                  className="hover:border-b-2 border-white w-full p-1"
                >
                  Partnerships
                </NavLink>
                {role === "founder" && (
                  <NavLink
                    to="/startupDashboard"
                    className="hover:border-b-2 border-white w-full p-1"
                  >
                    Manage Startup
                  </NavLink>
                )}
                {role === "investor" && (
                  <NavLink
                    to="/companyDashboard"
                    className="hover:border-b-2 border-white w-full p-1"
                  >
                    Manage Company
                  </NavLink>
                )}
                <button
                  className="hover:scale-105 hover:bg-red-500 hover:text-white hover:font-bold border-white w-full p-1 border-2"
                  onClick={handleLogOut}
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center">
          <div className="flex gap-2 justify-center items-center">
            <NavLink
              className="bg-black text-white p-2 rounded-2xl shadow-lg hover:scale-105"
              to="/register"
            >
              Join Us
            </NavLink>
            <NavLink to="/login" className="hover:scale-105">
              Sign In
            </NavLink>
          </div>
        </div>
      )}
    </div>
  );
}
