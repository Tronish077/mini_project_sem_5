import {
    PieChart,
    Pie,
    Tooltip,
    ResponsiveContainer,
    Cell,
    Legend,
} from "recharts";

type SentimentChartProps = {
    sentiment: {
        positive: number;
        negative: number;
        neutral: number;
        mixed: number;
    };
};

const SENTIMENT_CONFIG = [
    { name: "Positive", key: "positive", color: "#10b981", glow: "rgba(16,185,129,0.3)" },
    { name: "Negative", key: "negative", color: "#f43f5e", glow: "rgba(244,63,94,0.3)" },
    { name: "Neutral",  key: "neutral",  color: "#94a3b8", glow: "rgba(148,163,184,0.3)" },
    { name: "Mixed",    key: "mixed",    color: "#f59e0b", glow: "rgba(245,158,11,0.3)" },
];

function CustomTooltip({ active, payload }: any) {
    if (!active || !payload?.length) return null;
    const { name, value } = payload[0];
    const cfg = SENTIMENT_CONFIG.find((c) => c.name === name);
    return (
        <div
            style={{
                background: "rgba(15,23,42,0.92)",
                border: `1px solid ${cfg?.color ?? "#fff"}44`,
                borderRadius: 12,
                padding: "10px 16px",
                backdropFilter: "blur(8px)",
                boxShadow: `0 8px 32px ${cfg?.glow ?? "rgba(0,0,0,0.3)"}`,
            }}
        >
            <p style={{ color: cfg?.color ?? "#fff", fontWeight: 700, fontSize: 13, marginBottom: 2 }}>{name}</p>
            <p style={{ color: "#e2e8f0", fontSize: 13 }}>
                <strong style={{ fontSize: 18 }}>{value}</strong> reviews
            </p>
        </div>
    );
}

function CustomLegend({ payload }: any) {
    return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 18px", justifyContent: "center", marginTop: 8 }}>
            {payload?.map((entry: any) => {
                const cfg = SENTIMENT_CONFIG.find((c) => c.name === entry.value);
                return (
                    <div key={entry.value} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span
                            style={{
                                width: 10,
                                height: 10,
                                borderRadius: "50%",
                                background: cfg?.color ?? entry.color,
                                boxShadow: `0 0 6px ${cfg?.glow ?? "transparent"}`,
                                display: "inline-block",
                                flexShrink: 0,
                            }}
                        />
                        <span style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>{entry.value}</span>
                    </div>
                );
            })}
        </div>
    );
}

function SentimentChart({ sentiment }: SentimentChartProps) {
    const data = SENTIMENT_CONFIG.map((cfg) => ({
        name: cfg.name,
        value: sentiment[cfg.key as keyof typeof sentiment],
        color: cfg.color,
    })).filter((d) => d.value > 0);

    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                borderRadius: 16,
                background: "linear-gradient(145deg, #ffffff 0%, #f8faff 100%)",
                padding: "20px 20px 12px",
                boxShadow: "0 4px 24px rgba(37,99,235,0.08), 0 1px 4px rgba(0,0,0,0.05)",
                border: "1px solid rgba(59,130,246,0.12)",
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
                        color: "#2563eb",
                        background: "rgba(37,99,235,0.08)",
                        padding: "2px 8px",
                        borderRadius: 100,
                    }}
                >
                    Sentiment
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
                Sentiment Distribution
            </h2>

            <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                    <defs>
                        {SENTIMENT_CONFIG.map((cfg) => (
                            <radialGradient key={cfg.key} id={`grad-${cfg.key}`} cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor={cfg.color} stopOpacity={1} />
                                <stop offset="100%" stopColor={cfg.color} stopOpacity={0.75} />
                            </radialGradient>
                        ))}
                    </defs>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={68}
                        outerRadius={105}
                        paddingAngle={4}
                        strokeWidth={0}
                        animationBegin={0}
                        animationDuration={800}
                    >
                        {data.map((entry) => {
                            const cfg = SENTIMENT_CONFIG.find((c) => c.name === entry.name)!;
                            return (
                                <Cell
                                    key={entry.name}
                                    fill={`url(#grad-${cfg.key})`}
                                    stroke="none"
                                />
                            );
                        })}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend content={<CustomLegend />} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

export default SentimentChart;