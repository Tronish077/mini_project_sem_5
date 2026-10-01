import { useState, useEffect } from "react";
import { supabase } from "../../utils/supabaseClient";
import { useNavigate } from "react-router-dom";
import LoadingButton from "../../components/loaderButton";
import { EyeOffIcon, EyeOnIcon } from "../../components/icons/svgIcons";

export default function ResetPasswordPage() {
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [indLoading,setIndLoading] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [sessionReady, setSessionReady] = useState(false);

    // Exchange the recovery tokens from the URL hash into a live session.
    // Supabase fires PASSWORD_RECOVERY once the hash tokens are consumed.
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === "PASSWORD_RECOVERY") {
                setSessionReady(true);
            }
        });
        return () => subscription.unsubscribe();
    }, []);

    async function handleReset(event: React.BaseSyntheticEvent) {
        event.preventDefault();
        setIndLoading(true)

        setError("");

        if (password !== confirmPassword) {
            setIndLoading(false)
            setError("Passwords do not match.");
            return;
        }

        const { error } = await supabase.auth.updateUser({
            password: password
        });

        if (error) {
            setIndLoading(false)
            setError(error.message);
            return;
        }

        setTimeout(() => {
            navigate("/");
        }, 1500);
    }

    if (!sessionReady) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center px-4">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-zinc-200 border-t-blue-600 rounded-full animate-spin" />
                    <p className="text-sm font-medium text-zinc-500">Verifying reset link…</p>
                </div>
            </div>
        );
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
                        Reset Password
                    </h1>

                    <p className="text-sm text-zinc-500 mt-1">
                        Enter your new password below
                    </p>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleReset}
                    className="w-full flex flex-col gap-5"
                >

                    {/* New Password */}
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="password"
                            className="text-sm font-semibold text-zinc-800"
                        >
                            New Password
                        </label>

                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your new password"
                                required
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
                            Confirm New Password
                        </label>

                            <input 
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showPassword ? "text":"password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm your new password"
                                required
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
                            />
                    </div>

                    {/* Error */}
                    {error && (
                        <span className="bg-red-100 p-2 rounded-sm">
                            <p className="text-sm text-red-500">
                                {error}
                            </p>
                        </span>
                    )}

                    {/* Submit */}
                    <LoadingButton
                    loading={indLoading}
                    label="Update password"
                    />

                </form>

            </div>
        </div>
    );
}