"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { TypewriterMessage } from "@/components/TypewriterMessage";
import { useChatMessage } from "@/hooks/useChatMessage";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [isTypewriterActive, setIsTypewriterActive] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // チャットメッセージ管理フック
  const {
    messages,
    isAiTyping,
    sendMessage,
    handleTypingComplete,
  } = useChatMessage({
    onStartTyping: () => setIsTypewriterActive(true),
    onStopTyping: () => setIsTypewriterActive(false),
  });

  // 新しいメッセージが追加されたら最下部にスクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isAiTyping || isTypewriterActive) {
      return;
    }

    const currentInput = inputValue;
    setInputValue("");
    await sendMessage(currentInput);
  };

  return (
    <div
      className="min-h-screen flex relative"
      style={{
        backgroundImage: "url('/tatami-room2.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* 左側: ゆっくり魔理沙 */}
      <div className="absolute left-16 bottom-6 z-10">
        <Image
          src="/slow-marisa.png"
          alt="ゆっくり魔理沙"
          width={200}
          height={200}
          className="drop-shadow-lg"
        />
      </div>

      {/* 右側: ゆっくり霊夢 */}
      <div className="absolute right-4 bottom-4 z-10">
        <Image
          src="/slow-reimu.png"
          alt="ゆっくり霊夢"
          width={200}
          height={200}
          className="drop-shadow-lg"
        />
      </div>

      {/* 中央: チャット画面 */}
      <div className="flex-1 flex flex-col">
        {/* チャット履歴エリア */}
        <div className="flex-1 max-w-4xl mx-auto w-full p-4">
          <div className="bg-gray-950/90 backdrop-blur-sm rounded-lg shadow-lg flex flex-col h-[80vh]">
            <div className="flex-1 p-6 overflow-y-auto min-h-0">
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 mt-8">
                    ゆっくりしていってね
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "reimu" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-md px-4 py-3 rounded-lg bg-white border-2 ${
                          message.sender === "reimu"
                            ? "border-red-500 text-gray-800"
                            : "border-yellow-500 text-gray-800"
                        }`}
                      >
                        {/* キャラクター名プレフィックス */}
                        <div
                          className={`font-bold text-sm mb-1 ${
                            message.sender === "reimu"
                              ? "text-red-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {message.sender === "reimu" ? "霊夢" : "魔理沙"} &gt;
                        </div>

                        {/* メッセージ内容 */}
                        <div>
                          {message.sender === "marisa" && messages.length > 0 && messages[messages.length - 1].id === message.id && isTypewriterActive ? (
                            <TypewriterMessage 
                              text={message.text}
                              delay={50}
                              onComplete={handleTypingComplete}
                            />
                          ) : (
                            message.text
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                {/* 自動スクロール用の要素 */}
                <div ref={messagesEndRef} />
              </div>
            </div>
          </div>
        </div>

        {/* 分離されたテキスト入力エリア */}
        <div className="max-w-4xl mx-auto w-full p-4 pb-8">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4">
            <div className="flex items-center space-x-3">
              {/* 霊夢ラベル */}
              <div className="flex-shrink-0">
                <span className="text-red-600 font-bold text-lg">
                  霊夢 &gt;
                </span>
              </div>

              {/* テキスト入力 */}
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="メッセージを入力してね..."
                disabled={isAiTyping || isTypewriterActive}
                className="flex-1 px-4 py-3  border text-red-400 border-red-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 disabled:bg-white disabled:cursor-not-allowed"
              />

              {/* 送信ボタン */}
              <button
                type="button"
                onClick={handleSendMessage}
                disabled={isAiTyping || isTypewriterActive}
                className={`px-6 py-3 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-red-400 transition-colors ${
                  isAiTyping || isTypewriterActive
                    ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
              >
                {isAiTyping || isTypewriterActive ? "..." : "送信"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
