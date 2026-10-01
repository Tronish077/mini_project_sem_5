import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Cell,
} from "recharts";

type EmotionChartProps = {
    emotions: Record<string, number>;
};

// Color palette cycling for emotion bars
const EMOTION_COLORS = [
    { bar: "#6366f1", glow: "rgba(99,102,241,0.35)" },
    { bar: "#f43f5e", glow: "rgba(244,63,94,0.35)" },
    { bar: "#10b981", glow: "rgba(16,185,129,0.35)" },
    { bar: "#f59e0b", glow: "rgba(245,158,11,0.35)" },
    { bar: "#0ea5e9", glow: "rgba(14,165,233,0.35)" },
    { bar: "#a855f7", glow: "rgba(168,85,247,0.35)" },
    { bar: "#ec4899", glow: "rgba(236,72,153,0.35)" },
    { bar: "#14b8a6", glow: "rgba(20,184,166,0.35)" },
];

function EmotionTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null;
    return (
        <div
            style={{
                background: "rgba(15,23,42,0.92)",
                border: "1px solid rgba(99,102,241,0.3)",
                borderRadius: 12,
                padding: "10px 16px",
                backdropFilter: "blur(8px)",
                boxShadow: "0 8px 32px rgba(99,102,241,0.25)",
            }}
        >
            <p style={{ color: "#a5b4fc", fontWeight: 700, fontSize: 12, textTransform: "capitalize", marginBottom: 2 }}>
                {label}
            </p>
            <p style={{ color: "#e2e8f0", fontSize: 13 }}>
                <strong style={{ fontSize: 18 }}>{payload[0].value}</strong> reviews
            </p>
        </div>
    );
}

function EmotionChart({ emotions }: EmotionChartProps) {
    const data = Object.entries(emotions)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                borderRadius: 16,
                background: "linear-gradient(145deg, #ffffff 0%, #fafaff 100%)",
                padding: "20px 20px 12px",
                boxShadow: "0 4px 24px rgba(99,102,241,0.08), 0 1px 4px rgba(0,0,0,0.05)",
                border: "1px solid rgba(99,102,241,0.12)",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <div style={{ marginBottom: 4 }}>
                <span
                    style={{
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "#6366f1",
                        background: "rgba(99,102,241,0.08)",
                        padding: "2px 8px",
                        borderRadius: 100,
                    }}
                >
                    Emotions
                </span>
            </div>
            <h2
                style={{
                    fontFamily: "'Space Grotesk', system-ui, sans-serif",
                    fontWeight: 700,
                    fontSize: 17,
                    color: "#0f172a",
                    marginTop: 6,
                    marginBottom: 0,
                    letterSpacing: "-0.02em",
                }}
            >
                Customer Emotion
            </h2>

            <ResponsiveContainer width="100%" style={{ flex: 1, marginTop: 16 }}>
                <BarChart data={data} barCategoryGap="30%" margin={{ top: 6, right: 10, bottom: 0, left: -10 }}>
                    <defs>
                        {data.map((_, i) => {
                            const c = EMOTION_COLORS[i % EMOTION_COLORS.length];
                            return (
                                <linearGradient key={i} id={`em-grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={c.bar} stopOpacity={1} />
                                    <stop offset="100%" stopColor={c.bar} stopOpacity={0.5} />
                                </linearGradient>
                            );
                        })}
                    </defs>
                    <CartesianGrid vertical={false} stroke="rgba(148,163,184,0.15)" />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#64748b", fontSize: 11, fontWeight: 500 }}
                        style={{ textTransform: "capitalize" }}
                    />
                    <YAxis
                        allowDecimals={false}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#94a3b8", fontSize: 11 }}
                        width={28}
                    />
                    <Tooltip content={<EmotionTooltip />} cursor={{ fill: "rgba(99,102,241,0.06)", radius: 6 }} />
                    <Bar dataKey="value" name="Reviews" radius={[6, 6, 0, 0]} animationBegin={0} animationDuration={700}>
                        {data.map((_, i) => (
                            <Cell key={i} fill={`url(#em-grad-${i})`} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default EmotionChart;