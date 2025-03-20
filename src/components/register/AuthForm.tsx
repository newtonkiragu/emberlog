"use client";

import {useState} from "react";
import {signIn} from "next-auth/react";
import {useRouter} from "next/navigation";
import './style.css';

export const AuthForm = ({type}) => {
    const isLogin = type === "login";
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState(null);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (isLogin) {
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
        } else {
            try {
                const response = await fetch("/api/auth/register", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({name, email, password}),
                });
                if (!response.ok) {
                    throw new Error("Failed to register");
                }
                router.push("/login");
            } catch (err) {
                setError(err.message);
            }
        }
    };

    return (
        <div className="container main-content">
            <div className="auth-card">
                {/* Image (Hidden on Mobile) */}
                <div className="auth-image-container">
                    <img src="/images/register.svg" alt="Authentication" className="auth-image"/>
                </div>

                {/* Form Section */}
                <div className="auth-form">
                    <h2>{isLogin ? "Login" : "Register"}</h2>
                    {error && <p className="error">{error}</p>}
                    <form onSubmit={handleSubmit}>
                        {!isLogin && (
                            <input
                                type="text"
                                placeholder="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        )}
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
                        <button type="submit">{isLogin ? "Login" : "Register"}</button>
                    </form>
                    <p className="login -link">
                        Already have an account?{" "}
                        <a href="/login" onClick={(e) => {
                            e.preventDefault(); // Prevent default link behavior
                            router.push("/login"); // Navigate to the sign-up page
                        }}>
                            LogIn instead
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};
