import { useTypewriter } from '@/hooks/useTypewriter';

interface TypewriterMessageProps {
  text: string;
  className?: string;
  delay?: number;
  onComplete?: () => void;
  enableSound?: boolean;
}

export const TypewriterMessage = ({ 
  text, 
  className = '', 
  delay = 50, 
  onComplete,
  enableSound = true
}: TypewriterMessageProps) => {
  const { displayText, isTyping } = useTypewriter({ text, delay, onComplete, enableSound });

  return (
    <div className={className}>
      {displayText}
      {isTyping && <span className="animate-pulse">|</span>}
    </div>
  );
};