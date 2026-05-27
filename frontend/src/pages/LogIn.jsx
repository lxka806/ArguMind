import { useState } from "react";
import API from "../api/api";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const res = await API.post("/login", {
                email,
                password,
            });

            // SAVE TOKEN
            localStorage.setItem("token", res.data.token);

            // SAVE USER
            localStorage.setItem("user", JSON.stringify(res.data.user));

            console.log("Logged in:", res.data);
        } catch (err) {
            console.log("Login error:", err);
        }
    };

    return (
        <div>
            <h1>Login</h1>

            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                />

                <button type="submit">
                    Login
                </button>
            </form>
        </div>
    );
}

export default Login;