import { useNavigate } from "react-router-dom";
import { HandlePasswordReset } from "../../services/supaAuth";
import { useEffect, useState } from "react";
import LoadingButton from "../../components/loaderButton";

export default function ForgotPasswordPage() {
    const navigate = useNavigate();
    const [errorMsg, setErrMsg] = useState("");
    const [indLoading, setIndLoading] = useState(false);

    //toast timeout func
    useEffect(() => {
        if (!errorMsg) return;

        const timer = setTimeout(() => {
            setErrMsg("");
        }, 3000);

        return () => clearTimeout(timer);
    }, [errorMsg]);

    async function handleSubmit(event) {
        setIndLoading(true)
        const result = await HandlePasswordReset(event)
        if (!result.success) {
            setIndLoading(false)
            setErrMsg(result.message)
            return;
        }
        setIndLoading(false)
        navigate("/email-sent",{replace: true})
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center px-4">
            <div className="bg-white p-10 w-full max-w-lg shadow-xl rounded-2xl flex flex-col gap-6">

                <div className="bg-blue-50 p-4 rounded-xl self-center">
                    <img src="/favicon.svg" width={50} />
                </div>

                <div className="text-center">
                    <h1 className="font-bold text-2xl text-zinc-900">
                        Forgot Password?
                    </h1>

                    <p className="text-sm text-zinc-500 mt-1">
                        Enter your email and we'll send you a password reset link.
                    </p>
                </div>

                <form
                    className="w-full flex flex-col gap-5"
                    onSubmit={handleSubmit}
                >
                    {/* Error handler */}
                    {errorMsg && (
                        <div className="bg-red-200 p-2 text-red-600 rounded-sm">
                            <h1 className="text-sm text-center mt-2">
                                {errorMsg}
                            </h1>
                        </div>
                    )}

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

                    <LoadingButton
                        label="Send Link"
                        loading={indLoading}
                    />

                </form>

                <p className="text-sm text-zinc-500 text-center">
                    Remember your password?{" "}
                    <button
                        type="button"
                        className="font-semibold cursor-pointer text-blue-600 hover:text-blue-700"
                        onClick={() => navigate("/",{replace: true})}
                    >
                        Sign In
                    </button>
                </p>

            </div>

        </div>
    );
}