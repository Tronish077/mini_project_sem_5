import { useNavigate } from "react-router-dom";
import { HandleRegister } from "../../services/supaAuth";
import { useState } from "react";
import { EyeOffIcon, EyeOnIcon } from "../../components/icons/svgIcons";
import LoadingButton from "../../components/loaderButton";

export default function RegisterPage() {
    const navigate = useNavigate();
    const [errorMsg, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    async function handleSubmit(event) {
        setError("")
        setLoading(true)
        const result = await HandleRegister(event);

        if (!result.success) {
            setLoading(false)
            setError(result.message)
            return;
        }
        setLoading(false)
        navigate("/dashboard")
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center px-4">
            <div className="bg-white p-10 w-full max-w-lg shadow-xl rounded-2xl flex flex-col gap-6">

                {/* Logo */}
                <div className="bg-blue-50 p-4 rounded-xl self-center">
                    <img src="/favicon.svg" width={50} />
                </div>

                {/* Heading */}
                <div className="text-center">
                    <h1 className="font-bold text-2xl text-zinc-900">
                        Create an Account
                    </h1>

                    <p className="text-sm text-zinc-500 mt-1">
                        Create your account to start analyzing feedback
                    </p>
                </div>

                {/* Form */}
                <form
                    className="w-full flex flex-col gap-5"
                    onSubmit={handleSubmit}
                >
                    {errorMsg && (
                        <div className="bg-red-200 p-2 text-red-600 rounded-sm">
                            <h1 className="text-sm text-center mt-2">
                                {errorMsg}
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
                            name="email"
                            type="email"
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
                                    <EyeOffIcon />
                                ) : (
                                    // Eye
                                    <EyeOnIcon />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="confirmPassword"
                            className="text-sm font-semibold text-zinc-800"
                        >
                            Confirm Password
                        </label>

                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showPassword ? "text" : "password"}
                            placeholder="Confirm your password"
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

                    {/* Register */}
                    <LoadingButton
                    label="Create account"
                    loading={loading}
                    />

                </form>

                {/* Login */}
                <p className="text-sm text-zinc-500 text-center">
                    Already have an account?{" "}
                    <button
                        type="button"
                        className="cursor-pointer font-semibold text-blue-600 hover:text-blue-700"
                        onClick={() => navigate("/")}
                    >
                        Sign In
                    </button>
                </p>

            </div>
        </div>
    );
}