import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
// import "../styles/Register.css";

export default function Register() {
    const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!form.username || !form.email || !form.password || !form.confirm) {
            setError("Please fill all fields");
            return;
        }

        if (form.password !== form.confirm) {
            setError("Passwords don't match");
            return;
        }

        const { data, error } = await supabase.auth.signUp({
            email: form.email,
            password: form.password,
        });

        if (error) {
            setError(error.message);
            return;
        }

        // Создаём профиль в таблице profiles
        await supabase.from("profiles").insert({
            id: data.user.id,
            username: form.username,
        });

        navigate("/login");
    };

    return (
        <div className="auth-container">
            <h2>Registration</h2>
            <form onSubmit={handleSubmit} className="auth-form">
                <input
                    type="text"
                    placeholder="Username"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <input
                    type="password"
                    placeholder="Confirm password"
                    value={form.confirm}
                    onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                />
                {error && <p className="error">{error}</p>}
                <button type="submit" className="btn-primery">Register</button>
                <p className="switch">
                    Have account? <Link to="/login">Login</Link>
                </p>
            </form>
        </div>
    );
}