import axios from "axios";
import type { FeedbackRequest, FeedbackResponse, CsvUploadResponse } from "../types/feedback";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

export async function analyzeFeedback(
    data: FeedbackRequest
): Promise<FeedbackResponse> {
    const response = await api.post<FeedbackResponse>("/feedback/analyze", data);
    return response.data;
}

export async function uploadCsvFeedback(file: File): Promise<CsvUploadResponse> {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post<CsvUploadResponse>("/feedback/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
}