import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import "../styles/Login.css";

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const { error } = await supabase.auth.signInWithPassword({
            email: form.email,
            password: form.password,
        });

        if (error) {
            setError("Неверный email или пароль");
            return;
        }

        navigate("/");
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <h1>MiniFeed</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        className="login-input"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="login-input"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />
                    {error && <p className="login-error">{error}</p>}
                    <button className="login-btn">Login</button>
                </form>
                <p className="login-link">
                    No account? <Link to="/register">Registration</Link>
                </p>
            </div>
        </div>
    );
}