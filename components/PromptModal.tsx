
import React, { useState } from 'react';
import { Shot } from '../types';

const CopyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

interface PromptDisplayProps {
    title: string;
    prompt: string;
}

const PromptDisplay: React.FC<PromptDisplayProps> = ({ title, prompt }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(prompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <h4 className="text-lg font-semibold text-gray-200">{title}</h4>
                <button
                    onClick={handleCopy}
                    className="flex items-center space-x-1.5 px-2 py-1 bg-gray-700 text-xs rounded hover:bg-gray-600 transition-colors text-gray-300"
                    title="프롬프트 복사"
                    >
                    <CopyIcon className="w-4 h-4" />
                    <span>{copied ? '복사됨!' : '복사'}</span>
                </button>
            </div>
            <p className="text-sm text-gray-300 bg-gray-900 p-3 rounded-md border border-gray-700 whitespace-pre-wrap">{prompt}</p>
        </div>
    );
};


const PromptModal: React.FC<{ shot: Shot | null; onClose: () => void; }> = ({ shot, onClose }) => {
  if (!shot) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 text-gray-200 rounded-lg shadow-xl p-6 sm:p-8 max-w-3xl w-full mx-4 border border-gray-700 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-yellow-400">Shot #{shot.shotNumber} 프롬프트</h2>
            <p className="text-sm text-gray-400 mt-1">{shot.description}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
            aria-label="닫기"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-yellow-300 border-b border-gray-600 pb-2">시작 이미지 프롬프트 (Midjourney)</h3>
            <PromptDisplay title="프롬프트 (영어)" prompt={shot.startImagePrompt?.englishPrompt ?? 'N/A'} />
            <div>
                 <h4 className="text-lg font-semibold text-gray-200 mb-2">번역 (한글)</h4>
                 <p className="text-sm text-gray-400">{shot.startImagePrompt?.koreanTranslation ?? 'N/A'}</p>
            </div>
        </div>

        <div className="space-y-4">
            <h3 className="text-xl font-bold text-yellow-300 border-b border-gray-600 pb-2">영상 생성 프롬프트 (Veo 3.1)</h3>
            <PromptDisplay title="프롬프트 (영어)" prompt={shot.videoPrompt?.englishPrompt ?? 'N/A'} />
             <div>
                 <h4 className="text-lg font-semibold text-gray-200 mb-2">번역 (한글)</h4>
                 <p className="text-sm text-gray-400">{shot.videoPrompt?.koreanTranslation ?? 'N/A'}</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PromptModal;