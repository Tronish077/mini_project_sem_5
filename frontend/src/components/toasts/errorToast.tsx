interface errorToastProps {
    Textmessage: string;
}

export default function ErrorToast({ Textmessage }: errorToastProps) {
    return (
        <div
            className="
                fixed top-6 right-6 z-50
                flex items-center gap-3
                px-4 py-3
                bg-gray-50
                border border-zinc-200
                rounded-sm
                shadow-lg
                text-sm font-medium text-zinc-800
                animate-fadeUp
            "
        >
            <div
                className="
                    flex items-center justify-center
                    w-7 h-7
                    rounded-sm
                    bg-red-100
                    text-red-600
                "
            >
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="12" cy="12" r="9" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
            </div>

            <span>{Textmessage}</span>
        </div>
    );
}