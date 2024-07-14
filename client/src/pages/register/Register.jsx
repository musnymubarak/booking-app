import { useContext, useState } from "react";
import "./register.css";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../hooks/axiosInstance";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [credentials, setCredentials] = useState({
        username: "",
        email: "",
        country: "",
        city: "",
        phone: "",
        password: ""
    });

    const { loading, error, dispatch } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials(prev => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleClick = async (e) => {
        e.preventDefault();
        dispatch({ type: "REGISTER_START" });
        try {
            const res = await axiosInstance.post("/auth/register", credentials);
            dispatch({ type: "REGISTER_SUCCESS", payload: res.data });
            navigate("/login");
        } catch (err) {
            dispatch({ type: "REGISTER_FAILURE", payload: err.response.data });
        }
    };

    return (
        <div className="register">
            <div className="rContainer">
                <input
                    type="text"
                    placeholder="Username"
                    id="username"
                    onChange={handleChange}
                    className="rInput"
                />
                <input
                    type="email"
                    placeholder="Email"
                    id="email"
                    onChange={handleChange}
                    className="rInput"
                />
                <input
                    type="text"
                    placeholder="Country"
                    id="country"
                    onChange={handleChange}
                    className="rInput"
                />
                <input
                    type="text"
                    placeholder="City"
                    id="city"
                    onChange={handleChange}
                    className="rInput"
                />
                <input
                    type="text"
                    placeholder="Phone"
                    id="phone"
                    onChange={handleChange}
                    className="rInput"
                />
                <input
                    type="password"
                    placeholder="Password"
                    id="password"
                    onChange={handleChange}
                    className="rInput"
                />
                <button disabled={loading} onClick={handleClick} className="rButton">Register</button>
                {error && <span>{error.message}</span>}
            </div>
        </div>
    );
};

export default Register;
