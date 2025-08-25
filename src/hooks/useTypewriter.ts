import { useState, useEffect, useRef } from 'react';
import { useTypeSound } from './useTypeSound';

interface UseTypewriterOptions {
  text: string;
  delay?: number;
  onComplete?: () => void;
  enableSound?: boolean;
}

export const useTypewriter = ({ text, delay = 50, onComplete, enableSound = true }: UseTypewriterOptions) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const onCompleteRef = useRef(onComplete);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const currentIndexRef = useRef(0);
  const { playBeep } = useTypeSound();

  // onCompleteの参照を更新
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!text) {
      setDisplayText('');
      setIsTyping(false);
      return;
    }

    // 既存のタイマーをクリア
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }

    // 状態を初期化
    setDisplayText('');
    setIsTyping(true);
    currentIndexRef.current = 0;

    const typeWriter = () => {
      if (currentIndexRef.current < text.length) {
        setDisplayText(text.substring(0, currentIndexRef.current + 1));
        
        // ビープ音を再生（スペースや改行以外の文字の場合のみ）
        if (enableSound && text[currentIndexRef.current] !== ' ' && text[currentIndexRef.current] !== '\n') {
          playBeep();
        }
        
        currentIndexRef.current++;
        timeoutIdRef.current = setTimeout(typeWriter, delay);
      } else {
        setIsTyping(false);
        timeoutIdRef.current = null;
        onCompleteRef.current?.();
      }
    };

    // 最初の文字を表示
    typeWriter();

    // クリーンアップ関数
    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }
    };
  }, [text, delay]);

  return { displayText, isTyping };
};