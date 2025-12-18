
import React from 'react';

const LoadingSpinner: React.FC = () => {
    const messages = [
        "스토리 구조를 분석하고 있어요...",
        "창의적인 아이디어를 구상 중입니다...",
        "샷 리스트를 꼼꼼하게 정리하고 있어요...",
        "이미지 프롬프트를 생성하는 중...",
        "거의 다 되었어요! 잠시만 기다려주세요."
    ];
    
    const [message, setMessage] = React.useState(messages[0]);

    React.useEffect(() => {
        const intervalId = setInterval(() => {
            setMessage(prev => {
                const currentIndex = messages.indexOf(prev);
                const nextIndex = (currentIndex + 1) % messages.length;
                return messages[nextIndex];
            });
        }, 3000);

        return () => clearInterval(intervalId);
    }, [messages]);


  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6 bg-gray-800 rounded-lg">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-yellow-400"></div>
      <h2 className="text-xl font-semibold text-gray-200">AI가 열심히 작업 중입니다!</h2>
      <p className="text-gray-400 text-center">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
