
import React, { useState } from 'react';
import { Prompts, PromptItem, StoryboardData } from '../types';

interface PromptsViewProps {
  data: StoryboardData;
  setData: React.Dispatch<React.SetStateAction<StoryboardData | null>>;
}

const CopyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);


const PromptCard: React.FC<{ item: PromptItem; isEditing: boolean; onChange: (field: keyof PromptItem, value: string) => void; }> = ({ item, isEditing, onChange }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(item.englishPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-900/70 p-4 rounded-lg border border-gray-700 space-y-3 flex flex-col">
      <div className="flex justify-between items-start">
        <h4 className="text-lg font-bold text-yellow-400">{item.name}</h4>
        <button
          onClick={handleCopy}
          className="flex items-center space-x-1.5 px-2 py-1 bg-gray-700 text-xs rounded hover:bg-gray-600 transition-colors text-gray-300"
          title="프롬프트 복사"
        >
          <CopyIcon className="w-4 h-4" />
          <span>{copied ? '복사됨!' : '복사'}</span>
        </button>
      </div>
      <div className="flex-grow">
        <p className="text-sm font-semibold text-gray-300 mb-1">프롬프트 (영어)</p>
        {isEditing ? (
            <textarea value={item.englishPrompt} onChange={e => onChange('englishPrompt', e.target.value)} className="w-full h-24 bg-gray-800 text-gray-200 border border-gray-600 rounded p-1 text-sm focus:ring-yellow-400 focus:border-yellow-400" />
        ) : (
            <p className="text-sm text-gray-200 bg-gray-800 p-2 rounded">{item.englishPrompt}</p>
        )}
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-300 mb-1">번역 (한글)</p>
         {isEditing ? (
            <textarea value={item.koreanTranslation} onChange={e => onChange('koreanTranslation', e.target.value)} className="w-full h-16 bg-gray-800 text-gray-200 border border-gray-600 rounded p-1 text-sm focus:ring-yellow-400 focus:border-yellow-400" />
        ) : (
           <p className="text-sm text-gray-400">{item.koreanTranslation}</p>
        )}
      </div>
    </div>
  );
};

const PromptsView: React.FC<PromptsViewProps> = ({ data, setData }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handlePromptChange = (
    category: keyof Prompts,
    index: number,
    field: keyof PromptItem,
    value: string
  ) => {
    setData(currentData => {
      if (!currentData) return null;
      const newData = JSON.parse(JSON.stringify(currentData));
      (newData.prompts[category][index] as any)[field] = value;
      return newData;
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-yellow-300 border-b-2 border-gray-600 pb-2">이미지 생성 프롬프트</h2>
        <label htmlFor="edit-toggle-prompts" className="flex items-center cursor-pointer">
          <span className="mr-2 text-sm font-medium text-gray-300">편집 모드</span>
          <div className="relative">
            <input type="checkbox" id="edit-toggle-prompts" className="sr-only" checked={isEditing} onChange={() => setIsEditing(!isEditing)} />
            <div className={`block w-10 h-6 rounded-full ${isEditing ? 'bg-yellow-400' : 'bg-gray-600'}`}></div>
            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isEditing ? 'transform translate-x-4' : ''}`}></div>
          </div>
        </label>
      </div>
      
      <section>
        <h3 className="text-2xl font-semibold text-gray-200 mb-4">등장인물</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.prompts.characters.map((item, index) => (
            <PromptCard key={`char-${index}`} item={item} isEditing={isEditing} onChange={(field, value) => handlePromptChange('characters', index, field, value)} />
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-2xl font-semibold text-gray-200 mb-4">장소</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.prompts.locations.map((item, index) => (
            <PromptCard key={`loc-${index}`} item={item} isEditing={isEditing} onChange={(field, value) => handlePromptChange('locations', index, field, value)} />
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-2xl font-semibold text-gray-200 mb-4">소품</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.prompts.props.map((item, index) => (
            <PromptCard key={`prop-${index}`} item={item} isEditing={isEditing} onChange={(field, value) => handlePromptChange('props', index, field, value)} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default PromptsView;
