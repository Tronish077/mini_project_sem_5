import { useNavigate } from "react-router-dom";

export default function EmailConfirmationPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen w-full bg-zinc-50 flex flex-col gap-6 items-center justify-center px-6">
            {/* Icon */}
            <div className="mx-auto mb-6 flex items-center justify-center w-22 h-22 rounded-full bg-blue-100 text-blue-600">
                <svg
                    width="36"
                    height="36"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <rect
                        x="3"
                        y="5"
                        width="18"
                        height="14"
                        rx="2"
                    />
                    <polyline points="3 7 12 13 21 7" />
                </svg>
            </div>
            <div className="w-full flex flex-col gap-8 max-w-md text-center">
                <span className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold text-zinc-900">
                        Password Reset Email Sent
                    </h1>

                    {/* Description */}
                    <p className="mt-5 text-sm leading-5 text-zinc-500">
                        We've sent a password reset link to your email address.
                        Please check your inbox and click the link to reset your password.
                    </p>
                </span>

                {/* Action */}
                <button
                    onClick={() => navigate("/",{replace:true})}
                    className="
                        mt-7
                        w-full
                        px-4 py-3
                        rounded-xl
                        bg-blue-600
                        text-white
                        text-sm
                        font-semibold
                        hover:bg-blue-700
                        active:scale-[0.98]
                        transition-all
                        cursor-pointer
                        shadow-sm
                    "
                >
                    Back to Sign In
                </button>

                {/* Note */}
                <p className="mt-4 text-xs text-zinc-400">
                    Didn't receive the email? Check your spam or junk folder.
                </p>

            </div>
        </div>
    );
}