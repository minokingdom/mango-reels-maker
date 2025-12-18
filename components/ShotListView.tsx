
import React, { useState } from 'react';
import { Scene, StoryboardData, Shot } from '../types';
import PromptModal from './PromptModal';

interface ShotListViewProps {
  data: StoryboardData;
  setData: React.Dispatch<React.SetStateAction<StoryboardData | null>>;
}

const secondsToSRTTime = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
  const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
  const seconds = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
  const milliseconds = Math.round((totalSeconds - Math.floor(totalSeconds)) * 1000).toString().padStart(3, '0');
  return `${hours}:${minutes}:${seconds},${milliseconds}`;
};

const ShotListView: React.FC<ShotListViewProps> = ({ data, setData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [promptModalShot, setPromptModalShot] = useState<Shot | null>(null);

  const headers = [
    '#', '시간', '프롬프트', '훅 메시지', '화면 구성', '인물', '장소', '소품', '계절/시간', '자연현상', '표정/행동', '카메라', '샷 종류', '나레이션', '자막/대사', '효과', '내용'
  ];

  const handleDownloadCSV = () => {
    const csvHeaders = [
      "Scene", "Shot #", "Time", "Hook Message", "Reels Preview", "Character", "Location", "Props", 
      "Season/Time of Day", "Natural Phenomena", "Expression/Action", 
      "Camera Angle", "Shot Type", "Narration", "Subtitle/Dialogue", "SFX", "Description"
    ];

    const formatValue = (value: any) => {
        if (typeof value === 'number') return value;
        return `"${String(value ?? '').replace(/"/g, '""')}"`;
    };

    const csvRows = data.storyboard.flatMap(scene => 
        scene.shots.map(shot => {
            const row = [
                scene.sceneNumber,
                shot.shotNumber,
                shot.time,
                shot.hookMessage,
                shot.reelsPreviewDescription,
                shot.character,
                shot.location,
                shot.props,
                `${shot.season} / ${shot.timeOfDay}`,
                shot.naturalPhenomena,
                `${shot.expression} / ${shot.action}`,
                shot.cameraAngle,
                shot.shotType,
                shot.narration,
                shot.subtitle,
                shot.sfx,
                shot.description
            ];
            return row.map(formatValue).join(",");
        })
    );

    const csvContent = [csvHeaders.join(","), ...csvRows].join("\r\n");
    const bom = "\uFEFF";
    const blob = new Blob([bom + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "mango_reels_shot_list.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const handleDownloadJSON = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "mango_reels_storyboard_data.json";
    link.click();
  };

  const handleDownloadSRT = () => {
    let srtContent = "";
    let subtitleIndex = 1;

    data.storyboard.forEach(scene => {
        scene.shots.forEach(shot => {
            if (shot.subtitle && shot.subtitle.trim() !== '' && shot.subtitle.trim() !== '없음') {
                const timeParts = shot.time.replace(/s/g, '').split('-').map(s => parseInt(s.trim(), 10));
                
                if (timeParts.length === 2 && !isNaN(timeParts[0]) && !isNaN(timeParts[1])) {
                    const [startTime, endTime] = timeParts;
                    srtContent += `${subtitleIndex}\r\n`;
                    srtContent += `${secondsToSRTTime(startTime)} --> ${secondsToSRTTime(endTime)}\r\n`;
                    srtContent += `${shot.subtitle}\r\n\r\n`;
                    subtitleIndex++;
                }
            }
        });
    });

    if (!srtContent) {
        alert("다운로드할 자막/대사 내용이 없습니다.");
        return;
    }

    const blob = new Blob([srtContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "mango_reels_subtitles.srt");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadScript = () => {
    let scriptContent = "";
    let hasAnyDialogue = false;

    data.storyboard.forEach(scene => {
        const sceneDialogues = scene.shots
            .filter(shot => shot.character && shot.character.trim() !== '' && shot.character.trim() !== '없음' &&
                             shot.subtitle && shot.subtitle.trim() !== '' && shot.subtitle.trim() !== '없음')
            .map(shot => `${shot.character}: ${shot.subtitle}`);

        if (sceneDialogues.length > 0) {
            hasAnyDialogue = true;
            scriptContent += `# Scene ${scene.sceneNumber}\r\n`;
            scriptContent += sceneDialogues.join('\r\n');
            scriptContent += `\r\n\r\n`;
        }
    });

    if (!hasAnyDialogue) {
        alert("다운로드할 대본 내용이 없습니다.");
        return;
    }

    const blob = new Blob([scriptContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "mango_reels_script.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };


  const handleShotChange = (sceneIndex: number, shotIndex: number, field: keyof Shot, value: string) => {
    setData(currentData => {
        if (!currentData) return null;
        const newData = JSON.parse(JSON.stringify(currentData));
        (newData.storyboard[sceneIndex].shots[shotIndex] as any)[field] = value;
        return newData;
    });
  };

  const EditableCell: React.FC<{ value: string; onChange: (newValue: string) => void }> = ({ value, onChange }) => {
    return isEditing ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-24 bg-gray-900 text-gray-200 border border-gray-600 rounded p-1 text-sm focus:ring-yellow-400 focus:border-yellow-400"
      />
    ) : (
      <span className="whitespace-pre-wrap">{value}</span>
    );
  };


  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-3xl font-bold text-yellow-300 border-b-2 border-gray-600 pb-2">샷리스트</h2>
        <div className="flex items-center gap-2">
            <label htmlFor="edit-toggle" className="flex items-center cursor-pointer">
              <span className="mr-2 text-sm font-medium text-gray-300">편집 모드</span>
              <div className="relative">
                <input type="checkbox" id="edit-toggle" className="sr-only" checked={isEditing} onChange={() => setIsEditing(!isEditing)} />
                <div className={`block w-10 h-6 rounded-full ${isEditing ? 'bg-yellow-400' : 'bg-gray-600'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isEditing ? 'transform translate-x-4' : ''}`}></div>
              </div>
            </label>
            <button
                onClick={handleDownloadScript}
                className="px-3 py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-500 transition-colors text-xs"
            >
                대본
            </button>
            <button
                onClick={handleDownloadSRT}
                className="px-3 py-2 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-400 transition-colors text-xs"
            >
                SRT
            </button>
            <button
                onClick={handleDownloadJSON}
                className="px-3 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 transition-colors text-xs"
            >
                JSON
            </button>
            <button
                onClick={handleDownloadCSV}
                className="px-3 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-500 transition-colors text-xs"
            >
                CSV
            </button>
        </div>
      </div>

      {data.storyboard.map((scene, sceneIndex) => (
        <div key={scene.sceneNumber} className="mb-8">
          <div className="bg-gray-900/50 p-4 rounded-t-lg border-t border-x border-gray-700">
            <h3 className="text-2xl font-semibold text-yellow-400">Scene #{scene.sceneNumber}</h3>
            <p className="text-gray-300 mt-1 italic text-sm">{scene.sceneSummary}</p>
          </div>
          <div className="overflow-x-auto border-x border-b border-gray-700 rounded-b-lg">
            <table className="w-full min-w-[2200px] text-sm text-left text-gray-300">
              <thead className="text-xs text-yellow-300 uppercase bg-gray-700">
                <tr>
                  {headers.map((header) => (
                    <th key={header} scope="col" className={`px-4 py-3 whitespace-nowrap`}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {scene.shots.map((shot, shotIndex) => (
                  <tr key={shot.shotNumber} className={`border-b border-gray-700 ${shotIndex % 2 === 0 ? 'bg-gray-800' : 'bg-gray-800/50'}`}>
                    <td className="px-4 py-3 font-bold text-yellow-400">{shot.shotNumber}</td>
                    <td className="px-4 py-3 whitespace-nowrap"><EditableCell value={shot.time} onChange={v => handleShotChange(sceneIndex, shotIndex, 'time', v)} /></td>
                    <td className="px-4 py-3 text-center">
                      <button 
                        onClick={() => setPromptModalShot(shot)}
                        className="px-2 py-1 bg-gray-600 text-yellow-300 rounded hover:bg-gray-500 text-xs font-semibold whitespace-nowrap"
                      >
                        보기
                      </button>
                    </td>
                    <td className="px-4 py-3 min-w-[150px]"><EditableCell value={shot.hookMessage} onChange={v => handleShotChange(sceneIndex, shotIndex, 'hookMessage', v)} /></td>
                    <td className="px-4 py-3 min-w-[200px] text-gray-400 italic"><EditableCell value={shot.reelsPreviewDescription} onChange={v => handleShotChange(sceneIndex, shotIndex, 'reelsPreviewDescription', v)} /></td>
                    <td className="px-4 py-3"><EditableCell value={shot.character} onChange={v => handleShotChange(sceneIndex, shotIndex, 'character', v)} /></td>
                    <td className="px-4 py-3"><EditableCell value={shot.location} onChange={v => handleShotChange(sceneIndex, shotIndex, 'location', v)} /></td>
                    <td className="px-4 py-3"><EditableCell value={shot.props} onChange={v => handleShotChange(sceneIndex, shotIndex, 'props', v)} /></td>
                    <td className="px-4 py-3"><EditableCell value={`${shot.season} / ${shot.timeOfDay}`} onChange={v => {
                      const [season, timeOfDay] = v.split(' / ');
                      handleShotChange(sceneIndex, shotIndex, 'season', season || '');
                      handleShotChange(sceneIndex, shotIndex, 'timeOfDay', timeOfDay || '');
                    }} /></td>
                    <td className="px-4 py-3"><EditableCell value={shot.naturalPhenomena} onChange={v => handleShotChange(sceneIndex, shotIndex, 'naturalPhenomena', v)} /></td>
                    <td className="px-4 py-3"><EditableCell value={`${shot.expression} / ${shot.action}`} onChange={v => {
                      const [expression, action] = v.split(' / ');
                      handleShotChange(sceneIndex, shotIndex, 'expression', expression || '');
                      handleShotChange(sceneIndex, shotIndex, 'action', action || '');
                    }} /></td>
                    <td className="px-4 py-3"><EditableCell value={shot.cameraAngle} onChange={v => handleShotChange(sceneIndex, shotIndex, 'cameraAngle', v)} /></td>
                    <td className="px-4 py-3"><EditableCell value={shot.shotType} onChange={v => handleShotChange(sceneIndex, shotIndex, 'shotType', v)} /></td>
                    <td className="px-4 py-3"><EditableCell value={shot.narration} onChange={v => handleShotChange(sceneIndex, shotIndex, 'narration', v)} /></td>
                    <td className="px-4 py-3"><EditableCell value={shot.subtitle} onChange={v => handleShotChange(sceneIndex, shotIndex, 'subtitle', v)} /></td>
                    <td className="px-4 py-3"><EditableCell value={shot.sfx} onChange={v => handleShotChange(sceneIndex, shotIndex, 'sfx', v)} /></td>
                    <td className="px-4 py-3 w-1/4"><EditableCell value={shot.description} onChange={v => handleShotChange(sceneIndex, shotIndex, 'description', v)} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
      <PromptModal shot={promptModalShot} onClose={() => setPromptModalShot(null)} />
    </div>
  );
};

export default ShotListView;
