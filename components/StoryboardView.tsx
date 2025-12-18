
import React, {useState} from 'react';
import { Scene, StoryboardData, Shot } from '../types';

interface StoryboardViewProps {
  data: StoryboardData;
  setData: React.Dispatch<React.SetStateAction<StoryboardData | null>>;
}

const StoryboardView: React.FC<StoryboardViewProps> = ({ data, setData }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleSceneChange = (sceneIndex: number, field: keyof Scene, value: string) => {
    setData(currentData => {
        if (!currentData) return null;
        const newData = JSON.parse(JSON.stringify(currentData));
        (newData.storyboard[sceneIndex] as any)[field] = value;
        return newData;
    });
  };

  const handleShotChange = (sceneIndex: number, shotIndex: number, field: keyof Shot, value: string) => {
    setData(currentData => {
        if (!currentData) return null;
        const newData = JSON.parse(JSON.stringify(currentData));
        (newData.storyboard[sceneIndex].shots[shotIndex] as any)[field] = value;
        return newData;
    });
  };
  

  return (
    <div className="space-y-8">
       <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-yellow-300 border-b-2 border-gray-600 pb-2">스토리보드</h2>
        <label htmlFor="edit-toggle-storyboard" className="flex items-center cursor-pointer">
            <span className="mr-2 text-sm font-medium text-gray-300">편집 모드</span>
            <div className="relative">
              <input type="checkbox" id="edit-toggle-storyboard" className="sr-only" checked={isEditing} onChange={() => setIsEditing(!isEditing)} />
              <div className={`block w-10 h-6 rounded-full ${isEditing ? 'bg-yellow-400' : 'bg-gray-600'}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isEditing ? 'transform translate-x-4' : ''}`}></div>
            </div>
          </label>
       </div>
      {data.storyboard.map((scene, sceneIndex) => (
        <div key={scene.sceneNumber} className="bg-gray-900/50 p-6 rounded-lg border border-gray-700">
          <h3 className="text-2xl font-semibold text-yellow-400 mb-4">
            Scene #{scene.sceneNumber}
          </h3>
          {isEditing ? (
            <textarea
              value={scene.sceneSummary}
              onChange={e => handleSceneChange(sceneIndex, 'sceneSummary', e.target.value)}
              className="w-full bg-gray-800 text-gray-200 border border-gray-600 rounded p-2 mb-6 text-sm focus:ring-yellow-400 focus:border-yellow-400 italic"
            />
          ) : (
            <p className="text-gray-300 mb-6 italic border-l-4 border-yellow-500 pl-4">{scene.sceneSummary}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {scene.shots.map((shot, shotIndex) => (
              <div key={shot.shotNumber} className="bg-gray-800 p-5 rounded-xl border border-gray-700 shadow-inner flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <span className="bg-yellow-400 text-gray-900 font-black rounded-full h-7 w-7 flex items-center justify-center text-sm shadow-md">
                            {shot.shotNumber}
                        </span>
                        <span className="font-bold text-yellow-500 text-sm">SHOT #{shot.shotNumber}</span>
                    </div>
                    <span className="text-xs font-mono text-gray-400 px-2 py-1 bg-gray-900 rounded">{shot.time}</span>
                </div>

                {/* Reels Preview Section */}
                <div className="relative aspect-[9/16] bg-black rounded-lg overflow-hidden border border-gray-600 group max-w-[200px] mx-auto shadow-2xl">
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                        <div className="w-full h-full border-2 border-dashed border-gray-700 flex flex-col items-center justify-center rounded-md">
                             <div className="bg-white/90 text-black px-3 py-1 font-black text-xs uppercase tracking-tighter mb-2 shadow-lg transform -rotate-2">
                                {shot.hookMessage}
                             </div>
                             <p className="text-[10px] text-gray-500 px-2 leading-tight">
                                {shot.reelsPreviewDescription}
                             </p>
                        </div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 h-1 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-400 w-1/3"></div>
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 group-hover:opacity-40 transition-opacity">
                        <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                </div>

                <div className="space-y-3">
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">🎯 훅 메시지</p>
                        {isEditing ? (
                            <input
                                type="text"
                                value={shot.hookMessage}
                                onChange={e => handleShotChange(sceneIndex, shotIndex, 'hookMessage', e.target.value)}
                                className="w-full bg-gray-900 text-yellow-300 border border-gray-600 rounded p-2 text-sm font-bold focus:ring-yellow-400 focus:border-yellow-400"
                            />
                        ) : (
                            <p className="text-yellow-400 font-black text-lg leading-tight">"{shot.hookMessage}"</p>
                        )}
                    </div>

                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">🎬 영상 내용</p>
                        {isEditing ? (
                            <textarea
                                value={shot.description}
                                onChange={e => handleShotChange(sceneIndex, shotIndex, 'description', e.target.value)}
                                className="w-full bg-gray-900 text-gray-200 border border-gray-600 rounded p-2 text-sm min-h-[80px] focus:ring-yellow-400 focus:border-yellow-400"
                            />
                        ) : (
                            <p className="text-gray-300 text-sm leading-relaxed">{shot.description}</p>
                        )}
                    </div>
                    
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">📱 화면 구성</p>
                        {isEditing ? (
                            <textarea
                                value={shot.reelsPreviewDescription}
                                onChange={e => handleShotChange(sceneIndex, shotIndex, 'reelsPreviewDescription', e.target.value)}
                                className="w-full bg-gray-900 text-gray-400 border border-gray-600 rounded p-2 text-xs focus:ring-yellow-400 focus:border-yellow-400"
                            />
                        ) : (
                            <p className="text-gray-500 text-xs italic">{shot.reelsPreviewDescription}</p>
                        )}
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StoryboardView;
