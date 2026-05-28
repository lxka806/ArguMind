import { useState } from "react";
import API from "../api/api";

function Register() {
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const res = await API.post("/auth/register", {
                fullname,
                email,
                password
            });

            alert(res.data.message);

        } catch (err) {
            console.log(err);

            alert(
                err.response?.data?.message ||
                "Register failed"
            );
        }
    };

    return (
        <div>
            <h1>Register</h1>

            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="Full name"
                    value={fullname}
                    onChange={(e) =>
                        setFullname(e.target.value)
                    }
                />

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
                    Register
                </button>
            </form>
        </div>
    );
}

export default Register;