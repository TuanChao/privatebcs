import React, { useState } from "react";
import "./Login.css";
import Backgroundimg from "src/assets/bcs-banner-soc2.jpg";
// import { FaUserCircle } from "react-icons/fa";
// import logo from "src/assets/images/bcs-layout-1.png"

const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [honeypot, setHoneypot] = useState("");
    const [otp, setOtp] = useState("");
    // const [showPassword, setShowPassword] = useState(false);

    const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!validateEmail(email)) {
            setError("Email không hợp lệ");
            setLoading(false); 
            return;
        }

        // setTimeout(() => {
        // window.location.href = "/admin";
        // setLoading(false);
        // }, 1200);

       try {
            const response = await fetch("/api/Manage/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // Quan trọng: để nhận session cookie
                body: JSON.stringify({ email, password, website: honeypot, otp }), // <-- thêm otp ở đây
            });
            if (response.ok) {
                const data = await response.json();
                // Store JWT token, role and login status in localStorage
                if (data.token) localStorage.setItem("token", data.token);
                if (data.role) localStorage.setItem("role", data.role);
                localStorage.setItem("isAdminLoggedIn", "true");
                window.location.href = "/admin";
            } else {
                let message = "Đăng nhập thất bại";
                try {
                    const data = await response.json();
                    message = data.message || message;
                } catch {
                }
                setError(message);
            }
        } catch {
            setError("Không thể kết nối máy chủ");
        }
        setLoading(false);
    };

    return (
        <div
            className="container"
            style={{
                backgroundImage: `url(${Backgroundimg})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                minHeight: "100vh",
                width: "100vw",
            }}
        >
            <div className="glass-container">
                {/* <FaUserCircle className="login-icon" size={56} /> */}
                <h2 className="login-title">Đăng nhập</h2>
                <form className="login-form" onSubmit={handleSubmit}>
                    {error && <div className="login-error">{error}</div>}
                    <div className="input-field">
                        <label htmlFor="email">Email</label>
                        <input
                            type="text"
                            id="email"
                            autoFocus
                            placeholder="Nhập email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-field">
                        <label htmlFor="password">Mật khẩu</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Nhập mật khẩu"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            minLength={6}
                            maxLength={48}
                            required
                        />
                    </div>
                    <div className="input-field">
                        <label htmlFor="otp">Mã xác thực (tùy chọn)</label>
                        <input
                            type="text"
                            id="otp"
                            placeholder="Nhập mã xác thực 6 số (nếu đã bật 2FA)"
                            value={otp}
                            onChange={e => setOtp(e.target.value)}
                        />
                    </div>

                    <div className="remember-me">
                        <input
                            type="checkbox"
                            id="rememberMe"
                            checked={rememberMe}
                            onChange={e => setRememberMe(e.target.checked)}
                        />
                        <label htmlFor="rememberMe">Ghi nhớ đăng nhập</label>
                    </div>
                    <div style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", overflow: "hidden" }}>
                        <label>
                        Nếu bạn là robot, hãy điền vào đây:
                        <input
                            type="text"
                            name="website"
                            value={honeypot}
                            onChange={e => setHoneypot(e.target.value)}
                            tabIndex={-1}
                            autoComplete="off"
                        />
                        </label>
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? <span className="spinner"></span> : "Đăng nhập"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;

