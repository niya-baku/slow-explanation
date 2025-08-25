import { useCallback, useRef } from 'react';

interface TypeSoundOptions {
  frequency?: number;
  duration?: number;
  volume?: number;
}

export const useTypeSound = ({ 
  frequency = 800, 
  duration = 0.05, 
  volume = 0.05 
}: TypeSoundOptions = {}) => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const initializeAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (error) {
        console.warn('Web Audio API not supported:', error);
        return null;
      }
    }
    return audioContextRef.current;
  }, []);

  const playBeep = useCallback(() => {
    const audioContext = initializeAudioContext();
    if (!audioContext) return;

    try {
      // AudioContextが停止している場合は再開
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      // オシレーター（音源）を作成
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      // 接続: オシレーター → ゲイン → スピーカー
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // 音の設定
      oscillator.type = 'square'; // 矩形波でレトロなビープ音
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      
      // 音量の設定（フェードアウト効果付き）
      gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

      // 音を再生
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
      console.warn('Failed to play beep sound:', error);
    }
  }, [frequency, duration, volume, initializeAudioContext]);

  return { playBeep };
};