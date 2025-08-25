import { useState, useCallback } from 'react';

export interface Message {
  text: string;
  sender: "reimu" | "marisa";
  id: string;
}

export interface UseChatMessageOptions {
  onStartTyping: () => void;
  onStopTyping: () => void;
}

export const useChatMessage = ({ onStartTyping, onStopTyping }: UseChatMessageOptions) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAiTyping, setIsAiTyping] = useState(false);

  const sendMessage = useCallback(async (inputText: string) => {
    if (!inputText.trim() || isAiTyping) {
      return;
    }

    // ユーザーメッセージを追加
    const userMessage: Message = {
      text: inputText,
      sender: "reimu",
      id: `user-${Date.now()}`,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsAiTyping(true);

    try {
      // Gemini API呼び出し
      const response = await fetch("/api/gemini-api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt_post: inputText,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // 魔理沙の返答を追加
      const marisaMessage: Message = {
        text: data.response,
        sender: "marisa",
        id: `marisa-${Date.now()}`,
      };
      setMessages((prev) => [...prev, marisaMessage]);
      
      // タイプライター効果開始
      onStartTyping();
      
    } catch (error) {
      console.error("API Error:", error);
      
      // エラー時のフォールバック返答
      const errorMessage: Message = {
        text: "申し訳ないのぜ、今は答えられないのぜ...",
        sender: "marisa",
        id: `marisa-error-${Date.now()}`,
      };
      setMessages((prev) => [...prev, errorMessage]);
      
      // タイプライター効果開始
      onStartTyping();
    }
  }, [isAiTyping, onStartTyping]);

  const handleTypingComplete = useCallback(() => {
    setIsAiTyping(false);
    onStopTyping();
  }, [onStopTyping]);

  return {
    messages,
    isAiTyping,
    sendMessage,
    handleTypingComplete,
  };
};