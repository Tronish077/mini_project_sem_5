interface LoadingButtonProps {
    label: string;
    loading: boolean;
    className?: string;
}

export default function LoadingButton({
    label,
    loading,
    className = "",
}: LoadingButtonProps) {
    return (
        <button
            type="submit"
            disabled={loading}
            className={`
                flex items-center justify-center gap-2
                px-4 py-3
                rounded-xl
                bg-blue-600
                text-white
                text-sm font-semibold
                transition-all
                ${
                    loading
                        ? "opacity-70 cursor-not-allowed"
                        : "hover:bg-blue-700 active:scale-[0.98] cursor-pointer"
                }
                ${className}
            `}
        >
            {loading && (
                <span
                    className="
                        w-4 h-4
                        border-2
                        border-white/40
                        border-t-white
                        rounded-full
                        animate-spin
                    "
                />
            )}

            <span>
                {loading ? "Processing..." : label}
            </span>
        </button>
    );
}