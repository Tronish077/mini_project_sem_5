import { supabase } from "../utils/supabaseClient";

export async function saveAnalysis({
    analysisType,
    feedback,
    fileName,
    totalReviews,
    results,
}: {
    analysisType: "single" | "batch";
    feedback?: string;
    fileName?: string;
    totalReviews?: number;
    results: unknown;
}) {
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
        throw userError;
    }

    if (!user) {
        throw new Error("User is not authenticated.");
    }

    const { error } = await supabase
        .from("analyses")
        .insert({
            user_id: user.id,
            analysis_type: analysisType,
            feedback: feedback ?? null,
            file_name: fileName ?? null,
            total_reviews: totalReviews ?? null,
            results,
        })
        .select()
        .single();

    if (error) {
        return {
            success: false,
            message: error.message
        }
    }

    return {
        success:true
    }
}

export async function getSavedAnalyses() {
    const { data, error } = await supabase
        .from("analyses")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        throw error;
    }

    return data;
}

export async function getAnalysisById(id: string) {
    const { data, error } = await supabase
        .from("analyses")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        throw error;
    }

    return data;
}

export async function getDashboardStats(
    period: string = "all",
    analysisType: string = "all"
) {
    const { data, error } = await supabase
        .rpc("get_dashboard_stats",{
            p_period: period,
            p_analysis_type: analysisType
        });

    if (error) {
        throw error;
    }

    return data;
}

export async function deleteAnalysis(id: string) {
    const { error } = await supabase
        .from("analyses")
        .delete()
        .eq("id", id);

    if (error) {
        throw error;
    }
}