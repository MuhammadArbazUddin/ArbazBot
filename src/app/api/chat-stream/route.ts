import { ragChat } from "@/lib/rag-chat";
import { aiUseChatAdapter } from "@upstash/rag-chat/nextjs";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { messages, sessionId } = await req.json();

    if (!messages || !sessionId) {
      return new Response(
        JSON.stringify({ error: "Invalid request payload" }),
        { status: 400 }
      );
    }

    const lastMessage = messages[messages.length - 1]?.content;

    if (!lastMessage) {
      return new Response(
        JSON.stringify({ error: "No message content provided" }),
        { status: 400 }
      );
    }

    const response = await ragChat.chat(lastMessage, {
      streaming: true,
      sessionId,
    });

    return aiUseChatAdapter(response);
  } catch (error) {
    console.error("Error in POST /api/chat-stream:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
};
