
import React, { useState, useCallback } from 'react';
import { UserInput, StoryboardData } from './types';
import { generateStoryboardAndAssets } from './services/geminiService';
import InputForm from './components/InputForm';
import LoadingSpinner from './components/LoadingSpinner';
import ResultsDisplay from './components/ResultsDisplay';
import HelpModal from './components/HelpModal';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [storyboardData, setStoryboardData] = useState<StoryboardData | null>(null);
  const [showHelp, setShowHelp] = useState<boolean>(false);

  const handleGenerate = useCallback(async (userInput: UserInput) => {
    setIsLoading(true);
    setError(null);
    setStoryboardData(null);
    try {
      const data = await generateStoryboardAndAssets(userInput);
      setStoryboardData(data);
    } catch (err) {
      setError(err instanceof Error ? `생성 중 오류가 발생했습니다: ${err.message}` : '알 수 없는 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleReset = useCallback(() => {
    setStoryboardData(null);
    setError(null);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8 relative">
          <h1 className="text-4xl sm:text-5xl font-bold text-yellow-400 tracking-tight">망고 릴스 스토리보드 생성기</h1>
          <p className="mt-4 text-lg text-gray-400">망고 홍보 아이디어를 입력하고, 9:16 비율에 최적화된 전문적인 릴스 스토리보드를 받아보세요.</p>
           <button
            onClick={() => setShowHelp(true)}
            className="absolute top-0 right-0 mt-2 mr-2 px-3 py-1.5 bg-gray-700 text-gray-300 rounded-full hover:bg-gray-600 transition-colors text-sm font-semibold"
            aria-label="사용 방법"
           >
            📘 사용 방법
           </button>
        </header>

        <main>
          {!storyboardData && !isLoading && (
            <InputForm onGenerate={handleGenerate} />
          )}
          
          {isLoading && <LoadingSpinner />}
          
          {error && (
            <div className="text-center p-8 bg-red-900/50 rounded-lg">
              <p className="text-red-400">{error}</p>
              <button
                onClick={handleReset}
                className="mt-4 px-6 py-2 bg-yellow-500 text-gray-900 font-bold rounded-lg hover:bg-yellow-400 transition-colors"
              >
                다시 시도하기
              </button>
            </div>
          )}

          {storyboardData && (
            <div>
              <ResultsDisplay data={storyboardData} setData={setStoryboardData} />
              <div className="text-center mt-8">
                <button
                  onClick={handleReset}
                  className="px-8 py-3 bg-yellow-500 text-gray-900 font-bold rounded-lg hover:bg-yellow-400 transition-colors shadow-lg"
                >
                  새로운 릴스 기획하기
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
      <HelpModal show={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
};

export default App;
