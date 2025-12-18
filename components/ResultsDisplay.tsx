
import React, { useState } from 'react';
import { StoryboardData } from '../types';
import PromptsView from './PromptsView';
import ShotListView from './ShotListView';
import StoryboardView from './StoryboardView';

interface ResultsDisplayProps {
  data: StoryboardData;
  setData: React.Dispatch<React.SetStateAction<StoryboardData | null>>;
}

type Tab = 'storyboard' | 'prompts' | 'shotlist';

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 sm:px-6 text-sm sm:text-base font-bold rounded-t-lg transition-colors focus:outline-none ${
      active
        ? 'bg-gray-800 text-yellow-400 border-b-2 border-yellow-400'
        : 'bg-transparent text-gray-400 hover:text-yellow-300'
    }`}
  >
    {children}
  </button>
);


const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ data, setData }) => {
  const [activeTab, setActiveTab] = useState<Tab>('shotlist');

  return (
    <div className="w-full">
      <div className="border-b border-gray-700 flex space-x-2 sm:space-x-4">
        <TabButton active={activeTab === 'shotlist'} onClick={() => setActiveTab('shotlist')}>
          🎬 샷리스트
        </TabButton>
        <TabButton active={activeTab === 'prompts'} onClick={() => setActiveTab('prompts')}>
          🎨 프롬프트
        </TabButton>
        <TabButton active={activeTab === 'storyboard'} onClick={() => setActiveTab('storyboard')}>
          📖 스토리보드
        </TabButton>
      </div>

      <div className="mt-6 bg-gray-800 p-4 sm:p-6 rounded-b-lg rounded-tr-lg shadow-xl">
        {activeTab === 'storyboard' && <StoryboardView data={data} setData={setData} />}
        {activeTab === 'prompts' && <PromptsView data={data} setData={setData} />}
        {activeTab === 'shotlist' && <ShotListView data={data} setData={setData} />}
      </div>
    </div>
  );
};

export default ResultsDisplay;
