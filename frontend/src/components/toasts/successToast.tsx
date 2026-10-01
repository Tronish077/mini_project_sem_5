interface successToastProps{
    Textmessage: string
}

export default function SuccessToast({Textmessage} : successToastProps){
    return(
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
                    <div className="flex items-center justify-center w-7 h-7 rounded-full bg-green-100 text-green-600">
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
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>

                    <span>{Textmessage}</span>
                </div>
    )
}