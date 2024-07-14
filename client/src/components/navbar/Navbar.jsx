import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";
import { AuthContext } from "../../context/AuthContext";
import profile from "./profile.png"; // Import your profile image

const Navbar = () => {
  const { user, dispatch } = useContext(AuthContext);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" }); // Dispatch LOGOUT action
    localStorage.removeItem("user"); // Clear user data from localStorage
    setShowPopup(false); // Close the popup after logout
    navigate("/"); // Redirect to home page
  };

  return (
    <div className="navbar">
      <div className="navContainer">
        <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
          <span className="logo">Mcube Booking</span>
        </Link>
        {user ? (
          <div className="navItems">
            <div className="profile" onClick={togglePopup}>
              <img src={profile} alt="Profile" className="profile-img" />
              <span className="username">{user.username}</span>
            </div>
            {showPopup && (
              <div className="popup">
                <div className="popup-content">
                  <button className="close-button" onClick={togglePopup}>X</button>
                  <div className="popup-header">
                    <img src={profile} alt="Profile" className="popup-profile-img" />
                    <div className="popup-user-info">
                      <span className="popup-username">{user.username}</span>
                      <span className="popup-genius-level">Genius Level 1</span>
                    </div>
                  </div>
                  <ul className="popup-menu">
                    <li><Link to="/manage-account">Manage account</Link></li>
                    <li><Link to="/bookings">Bookings & Trips</Link></li>
                    <li><Link to="/loyalty-programme">Genius loyalty programme</Link></li>
                    <li><Link to="/reviews">Reviews</Link></li>
                    <li><button onClick={handleLogout}>Sign out</button></li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="navItems">
            <Link to="/register" style={{ textDecoration: "none" }}>
              <button className="navButton">Register</button>
            </Link>
            <Link to="/login" style={{ textDecoration: "none" }}>
              <button className="navButton">Login</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
