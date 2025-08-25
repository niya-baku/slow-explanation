import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

// 魔理沙のキャラクター設定
const MARISA_SYSTEM_PROMPT = `あなたは東方Projectの霧雨魔理沙です。以下の特徴で返答してください：
- 語尾に「だぜ」「のぜ」をつける
- 元気で活発な性格
- 魔法使いとして魔法に詳しい
- 霊夢とは親友だが、時々対立もする
- 短めに簡潔に返答する`;

export async function POST(req: Request) {
  try {
    // リクエスト検証
    if (!req.body) {
      return NextResponse.json(
        { error: "リクエストボディがありません" },
        { status: 400 }
      );
    }

    const { prompt_post } = await req.json();
    
    if (!prompt_post || typeof prompt_post !== 'string') {
      return NextResponse.json(
        { error: "有効なプロンプトが必要です" },
        { status: 400 }
      );
    }

    // 環境変数検証
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API設定エラー" },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    // 魔理沙としてのプロンプト構築
    const fullPrompt = `${MARISA_SYSTEM_PROMPT}

    霊夢からのメッセージ: ${prompt_post}

    魔理沙として返答してください:`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: fullPrompt,
    });

    // レスポンステキストを正しく取得
    const responseText = response.text;
    
    if (!responseText || responseText.trim() === "") {
      return NextResponse.json(
        { error: "レスポンス生成エラー" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      response: responseText.trim(),
    });

  } catch (error) {
    console.error('Gemini API Error:', error);
    return NextResponse.json(
      { error: "申し訳ないのぜ、今は答えられないのぜ..." },
      { status: 500 }
    );
  }
}
