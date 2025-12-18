
export interface UserInput {
  plot: string;
  storyLength: '15초' | '30초' | '1분';
  shotDuration: '3초' | '5초' | '8초';
  genre: '챌린지' | '정보성/팁' | '코믹/상황극' | '감성/브이로그' | '홍보/광고';
  cameraStyle: '셀피 모드' | '동적 핸드헬드' | '시네마틱' | 'POV(1인칭)' | '드론/탑다운';
  characterStyle: '인플루언서형' | '친근한 일반인' | '트렌디한 3D' | '전문가/CEO' | 'MZ세대 학생';
}

export interface ShotPromptItem {
  englishPrompt: string;
  koreanTranslation: string;
}

export interface Shot {
  shotNumber: number;
  time: string;
  description: string;
  reelsPreviewDescription: string;
  hookMessage: string;
  character: string;
  location: string;
  props: string;
  season: string;
  timeOfDay: string;
  naturalPhenomena: string;
  expression: string;
  action: string;
  cameraAngle: string;
  shotType: string;
  narration: string;
  subtitle: string;
  sfx: string;
  startImagePrompt: ShotPromptItem;
  videoPrompt: ShotPromptItem;
}

export interface Scene {
  sceneNumber: number;
  sceneSummary: string;
  shots: Shot[];
}

export interface PromptItem {
  name: string;
  englishPrompt: string;
  koreanTranslation: string;
}

export interface Prompts {
  characters: PromptItem[];
  locations: PromptItem[];
  props: PromptItem[];
}

export interface StoryboardData {
  storyboard: Scene[];
  prompts: Prompts;
}
