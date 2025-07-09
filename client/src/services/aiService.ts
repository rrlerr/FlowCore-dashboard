import { apiRequest } from "@/lib/queryClient";

export interface AIResponse {
  action: "navigate" | "create" | "respond" | "open_modal";
  module?: string;
  type?: string;
  data?: any;
  message?: string;
}

export async function sendAIMessage(message: string): Promise<AIResponse> {
  try {
    const response = await apiRequest("POST", "/api/ai/chat", { message });
    return await response.json();
  } catch (error) {
    console.error("AI service error:", error);
    return {
      action: "respond",
      message: "I'm sorry, I encountered an error. Please try again.",
    };
  }
}
