import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/register.css"


export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState ({username: "", password: "", confirm: ""});
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        if (!form.username || !form.password || !form.confirm) {
            setError("please enter all line");
            return;
        }

        if (form.password !== form.confirm ) {
            setError("password not correct");
            return;
        }

        const users = JSON.parse(localStorage.getItem("users")) || [];
        if (users.some((u) => u.username === form.username)) {
            setError("This username already exists");
            return;
        }

        const newUser = { username: form.username, password: form.password };
        localStorage.setItem("users", JSON.stringify([...users, newUser]));

        alert('Регистрация прошла успешно!');
        navigate("/login")
    };

    return (
        <div className="auth-container">
            <h2>Registration</h2>
            <form onSubmit={handleSubmit} className="auth-form">
                <input type="text" 
                placeholder="username"
                name="username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                />
                <input type="password"
                placeholder="password"
                name="password"
                value={form.password}
                onChange={(e) => setForm({...form, password: e.target.value })}
                />
                <input type="password"
                placeholder="confirm passwrod"
                name="confirm"
                value={form.confirm}
                onChange={(e) => setForm({...form, confirm: e.target.value })}
                />

                {error && <p className="error">{error}</p>}

                <button type="submit" className="btn-primery">Registration</button>

                <p className="switch">
                    You have account ? <Link to="/login">login</Link>
                </p>
            </form>
        </div>
    );
}