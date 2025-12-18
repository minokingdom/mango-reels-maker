
import React from 'react';

interface HelpModalProps {
  show: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ show, onClose }) => {
  if (!show) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 text-gray-200 rounded-lg shadow-xl p-6 sm:p-8 max-w-2xl w-full mx-4 border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-yellow-400">📘 릴스 스토리보드 생성기 안내</h2>
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
        <div className="space-y-4 text-gray-300">
          <p>이 앱은 중고거래 서비스 '망고'의 홍보 릴스 제작을 위해 최적화되었습니다.</p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>
              <strong className="text-yellow-300">🇰🇷 한국적 맥락:</strong> 모든 프롬프트에는 'Korean' 또는 'Korea' 키워드가 포함되어 국내 홍보 영상에 적합한 결과를 생성합니다.
            </li>
            <li>
              <strong className="text-yellow-300">📱 9:16 비율 최적화:</strong> 이미지 프롬프트는 <code className="text-blue-400">--ar 9:16</code>, 영상 프롬프트는 <code className="text-blue-400">ratio 9:16</code>이 자동으로 포함됩니다.
            </li>
            <li>
              <strong className="text-yellow-300">🥭 망고 홍보 특화:</strong> 입력하신 줄거리를 바탕으로 망고의 안전한 결제 및 에스크로 시스템을 강조하는 릴스 구성을 제안합니다.
            </li>
            <li>
              <strong className="text-yellow-300">⚡ 빠른 호흡의 샷 구성:</strong> 숏폼 트렌드에 맞춰 3~8초 단위의 몰입감 있는 샷 구성을 제공합니다.
            </li>
          </ul>
          <p className="pt-4 font-semibold text-yellow-400">지금 바로 망고 홍보를 위한 첫 번째 릴스를 기획해보세요!</p>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
