import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Login.css"


export default function Login() {
    const [form, setForm] = useState({username: "", password: ""});
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        const users = JSON.parse(localStorage.getItem("users")) || [];
        const user = users.find(
            (u) => u.username === form.username && u.password === form.password
        );

        if(!user) {
            setError("Login or password not correct");
            return;
        }
        localStorage.setItem("user" , JSON.stringify(user));
        window.location.href = "/";
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <h1>MiniFeed</h1>
                <form onSubmit={handleSubmit}>
                    <input type="text"
                    placeholder="Username..."
                    onChange={(e) => setForm({...form, username: e.target.value})}
                    value={form.username}
                    className="login-input"
                     />
                     <input type="password"
                     placeholder="Password"
                     onChange={(e) => setForm({...form, password: e.target.value})}
                     value={form.password}
                     className="login-input"
                      />

                      {error && <p className="login-error">{error}</p>}

                      <button className="login-btn">
                        Login
                      </button>
                </form>

                <p className="login-link">
                    No account ? <Link to="/register">Registration</Link>
                </p>
            </div>
        </div>
    )
};