
import React, { useState } from 'react';
import { UserInput } from '../types';

interface InputFormProps {
  onGenerate: (userInput: UserInput) => void;
}

const InputForm: React.FC<InputFormProps> = ({ onGenerate }) => {
  const [plot, setPlot] = useState('');
  const [storyLength, setStoryLength] = useState<'15초' | '30초' | '1분'>('30초');
  const [shotDuration, setShotDuration] = useState<'3초' | '5초' | '8초'>('3초');
  const [genre, setGenre] = useState<'챌린지' | '정보성/팁' | '코믹/상황극' | '감성/브이로그' | '홍보/광고'>('홍보/광고');
  const [cameraStyle, setCameraStyle] = useState<UserInput['cameraStyle']>('동적 핸드헬드');
  const [characterStyle, setCharacterStyle] = useState<UserInput['characterStyle']>('인플루언서형');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plot.trim()) {
      alert('주제 또는 줄거리를 입력해주세요.');
      return;
    }
    onGenerate({ plot, storyLength, shotDuration, genre, cameraStyle, characterStyle });
  };

  const OptionButton = <T extends string>({ value, selectedValue, setSelectedValue }: { value: T, selectedValue: T, setSelectedValue: (val: T) => void }) => (
    <button
      type="button"
      onClick={() => setSelectedValue(value)}
      className={`px-4 py-2 text-xs sm:text-sm sm:px-5 sm:py-2.5 rounded-full transition-all duration-200 font-semibold whitespace-nowrap ${
        selectedValue === value
          ? 'bg-yellow-400 text-gray-900 shadow-lg scale-105'
          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
      }`}
    >
      {value}
    </button>
  );

  return (
    <div className="max-w-3xl mx-auto bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-2xl border border-gray-700">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label htmlFor="plot" className="block text-xl font-bold mb-3 text-yellow-300">
            1. 주제 또는 줄거리 입력
          </label>
          <textarea
            id="plot"
            value={plot}
            onChange={(e) => setPlot(e.target.value)}
            placeholder="예시) 망고 앱으로 안전하게 명품 가방 중고거래 하는 법"
            className="w-full h-40 p-4 bg-gray-900 border-2 border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors text-gray-200 placeholder-gray-500 text-base"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-lg font-bold mb-4 text-yellow-300 text-center md:text-left">
                2. 스토리 길이
              </label>
              <div className="flex justify-center md:justify-start space-x-2">
                <OptionButton value="15초" selectedValue={storyLength} setSelectedValue={(v) => setStoryLength(v as any)} />
                <OptionButton value="30초" selectedValue={storyLength} setSelectedValue={(v) => setStoryLength(v as any)} />
                <OptionButton value="1분" selectedValue={storyLength} setSelectedValue={(v) => setStoryLength(v as any)} />
              </div>
            </div>

            <div>
              <label className="block text-lg font-bold mb-4 text-yellow-300 text-center md:text-left">
                3. 샷 단위
              </label>
              <div className="flex justify-center md:justify-start space-x-2">
                <OptionButton value="3초" selectedValue={shotDuration} setSelectedValue={(v) => setShotDuration(v as any)} />
                <OptionButton value="5초" selectedValue={shotDuration} setSelectedValue={(v) => setShotDuration(v as any)} />
                <OptionButton value="8초" selectedValue={shotDuration} setSelectedValue={(v) => setShotDuration(v as any)} />
              </div>
            </div>
        </div>

        <div className="space-y-8 bg-gray-900/50 p-6 rounded-xl border border-gray-700">
            <h3 className="block text-xl font-bold text-yellow-300 text-center border-b border-gray-700 pb-3">4. 릴스 디테일 설정</h3>
            
            <div>
                 <label className="block text-sm font-semibold mb-3 text-gray-400 uppercase tracking-wider">카테고리</label>
                 <div className="flex flex-wrap gap-2">
                    <OptionButton value="챌린지" selectedValue={genre} setSelectedValue={(v) => setGenre(v as any)} />
                    <OptionButton value="정보성/팁" selectedValue={genre} setSelectedValue={(v) => setGenre(v as any)} />
                    <OptionButton value="코믹/상황극" selectedValue={genre} setSelectedValue={(v) => setGenre(v as any)} />
                    <OptionButton value="감성/브이로그" selectedValue={genre} setSelectedValue={(v) => setGenre(v as any)} />
                    <OptionButton value="홍보/광고" selectedValue={genre} setSelectedValue={(v) => setGenre(v as any)} />
                 </div>
            </div>

            <div>
                 <label className="block text-sm font-semibold mb-3 text-gray-400 uppercase tracking-wider">카메라 스타일</label>
                 <div className="flex flex-wrap gap-2">
                    <OptionButton value="셀피 모드" selectedValue={cameraStyle} setSelectedValue={(v) => setCameraStyle(v as any)} />
                    <OptionButton value="동적 핸드헬드" selectedValue={cameraStyle} setSelectedValue={(v) => setCameraStyle(v as any)} />
                    <OptionButton value="시네마틱" selectedValue={cameraStyle} setSelectedValue={(v) => setCameraStyle(v as any)} />
                    <OptionButton value="POV(1인칭)" selectedValue={cameraStyle} setSelectedValue={(v) => setCameraStyle(v as any)} />
                    <OptionButton value="드론/탑다운" selectedValue={cameraStyle} setSelectedValue={(v) => setCameraStyle(v as any)} />
                 </div>
            </div>

            <div>
                 <label className="block text-sm font-semibold mb-3 text-gray-400 uppercase tracking-wider">등장인물 성격</label>
                 <div className="flex flex-wrap gap-2">
                    <OptionButton value="인플루언서형" selectedValue={characterStyle} setSelectedValue={(v) => setCharacterStyle(v as any)} />
                    <OptionButton value="친근한 일반인" selectedValue={characterStyle} setSelectedValue={(v) => setCharacterStyle(v as any)} />
                    <OptionButton value="트렌디한 3D" selectedValue={characterStyle} setSelectedValue={(v) => setCharacterStyle(v as any)} />
                    <OptionButton value="전문가/CEO" selectedValue={characterStyle} setSelectedValue={(v) => setCharacterStyle(v as any)} />
                    <OptionButton value="MZ세대 학생" selectedValue={characterStyle} setSelectedValue={(v) => setCharacterStyle(v as any)} />
                 </div>
            </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full py-4 text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
          >
            릴스 스토리보드 생성하기
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputForm;
