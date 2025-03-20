"use client";

import {useState} from "react";
import {signIn} from "next-auth/react";
import {useRouter} from "next/navigation";
import './style.css';

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const result = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });

        if (result?.error) {
            setError(result.error);
        } else {
            router.push("/dashboard");
        }
    };

    return (
        <div className="main-content">
            <div className="card login-card">
                {/* Left Side: Image (Hidden on Mobile) */}
                <div className="login-image-container">
                    <img src="/images/login.svg" alt="Login Illustration" className="login-image"/>
                </div>

                {/* Right Side: Login Form */}
                <div className="login-form">
                    <h2>Login</h2>
                    {error && <p className="error">{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="submit">Login</button>
                    </form>
                    <p className="signup-link">
                        Don't have an account?{" "}
                        <a href="/register" onClick={(e) => {
                            e.preventDefault(); // Prevent default link behavior
                            router.push("/register"); // Navigate to the sign-up page
                        }}>
                            Sign up instead
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};
