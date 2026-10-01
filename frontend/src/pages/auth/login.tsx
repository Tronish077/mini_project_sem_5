import { useState } from "react";
import { HandleLogin } from "../../services/supaAuth";
import { useNavigate } from "react-router-dom";
import LoadingButton from "../../components/loaderButton";

export default function LoginPage() {
    const navigate = useNavigate();
    const [errorMssg, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [ indLoading, setIndLoading] = useState(false);

    async function handleSubmit(event) {
        setError("");
        setIndLoading(true)
        const result = await HandleLogin(event);

        if (!result.success) {
            setIndLoading(false);
            setError(result.message)
            return;
        }

        setIndLoading(false)
        navigate("/dashboard")
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center px-4" style={{ minHeight: '100vh' }}>
            <div className="bg-white p-10 w-full max-w-lg shadow-xl rounded-2xl flex flex-col gap-6">

                {/* Logo */}
                <div className="bg-blue-50 p-4 rounded-xl self-center">
                    <img src="/favicon.svg" width={50} />
                </div>

                {/* Heading */}
                <div className="text-center">
                    <h1 className="font-bold text-2xl text-zinc-900">
                        Sign In
                    </h1>

                    <p className="text-sm text-zinc-500 mt-1">
                        Enter your credentials to access your account
                    </p>
                </div>

                {/* Form */}
                <form className="w-full flex flex-col gap-5" onSubmit={handleSubmit}>
                    {errorMssg && (
                        <div className="bg-red-200 p-2 text-red-600 rounded-sm">
                            <h1 className="text-sm text-center mt-2">
                                {errorMssg}
                            </h1>
                        </div>
                    )}
                    {/* Email */}
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="email"
                            className="text-sm font-semibold text-zinc-800"
                        >
                            Email Address
                        </label>

                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            className="
                                w-full px-4 py-3
                                border border-zinc-200
                                rounded-xl
                                outline-none
                                text-sm
                                placeholder:text-zinc-400
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-100
                                transition
                            "
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                            <label
                                htmlFor="password"
                                className="text-sm font-semibold text-zinc-800"
                            >
                                Password
                            </label>

                            <button
                                type="button"
                                className="text-sm font-medium cursor-pointer text-blue-600 hover:text-blue-700"
                                onClick={() => navigate("/forgot-password")}
                            >
                                Forgot password?
                            </button>
                        </div>

                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                className="
                                    w-full px-4 py-3 pr-12
                                    border border-zinc-200
                                    rounded-xl
                                    outline-none
                                    text-sm
                                    placeholder:text-zinc-400
                                    focus:border-blue-500
                                    focus:ring-2
                                    focus:ring-blue-100
                                    transition
                                "
                                required
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="
                                    absolute right-3 top-1/2 -translate-y-1/2
                                    text-zinc-400
                                    hover:text-zinc-600
                                    cursor-pointer
                                    p-1
                                "
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    // Eye-off
                                    <svg
                                        width="19"
                                        height="19"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M3 3l18 18" />
                                        <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                                        <path d="M9.9 4.2A10.8 10.8 0 0 1 12 4c5 0 8.5 4 9.5 6-.4.9-1.3 2.2-2.6 3.4" />
                                        <path d="M6.6 6.6C4.7 7.8 3.5 9.4 2.5 10c1 2 4.5 6 9.5 6 1 0 1.9-.2 2.7-.5" />
                                    </svg>
                                ) : (
                                    // Eye
                                    <svg
                                        width="19"
                                        height="19"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Sign In */}
                    <LoadingButton
                    label="Sign in"
                    loading = {indLoading}
                    />

                </form>

                {/* Register */}
                <p className="text-sm text-zinc-500  text-center">
                    Don't have an account?{" "}
                    <button
                        type="button"
                        onClick={() => navigate("/register")}
                        className="font-semibold cursor-pointer text-blue-600 hover:text-blue-700"
                    >
                        Sign Up
                    </button>
                </p>


            </div>
        </div>
    )
}