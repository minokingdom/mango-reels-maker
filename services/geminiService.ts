import { GoogleGenAI, Type } from "@google/genai";
import { UserInput, StoryboardData } from '../types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
if (!API_KEY) {
    throw new Error("VITE_GEMINI_API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    storyboard: {
      type: Type.ARRAY,
      description: "스토리보드를 씬 단위로 나눈 배열입니다. 릴스 형식에 맞게 빠른 호흡으로 구성합니다.",
      items: {
        type: Type.OBJECT,
        properties: {
          sceneNumber: { type: Type.INTEGER, description: "씬 번호" },
          sceneSummary: { type: Type.STRING, description: "해당 씬의 전체적인 요약" },
          shots: {
            type: Type.ARRAY,
            description: "씬을 구성하는 샷들의 배열입니다.",
            items: {
              type: Type.OBJECT,
              properties: {
                shotNumber: { type: Type.INTEGER, description: "샷 번호 (전체 스토리에서 순차적)" },
                time: { type: Type.STRING, description: "샷의 시간 범위 (예: '0s - 3s')" },
                description: { type: Type.STRING, description: "샷에 대한 시각적 묘사" },
                reelsPreviewDescription: { type: Type.STRING, description: "릴스 화면 내 자막 위치, UI 요소 배치 등 예상 화면 구성에 대한 설명" },
                hookMessage: { type: Type.STRING, description: "시청자의 시선을 끌기 위해 화면에 크게 노출될 짧고 강렬한 훅(Hook) 메시지" },
                character: { type: Type.STRING, description: "등장인물 (없으면 '없음')" },
                location: { type: Type.STRING, description: "장소" },
                props: { type: Type.STRING, description: "중요 소품 (없으면 '없음')" },
                season: { type: Type.STRING, description: "계절" },
                timeOfDay: { type: Type.STRING, description: "시간대 (예: 낮, 밤, 해질녘)" },
                naturalPhenomena: { type: Type.STRING, description: "자연 현상 (예: 비, 바람, 눈, 없으면 '없음')" },
                expression: { type: Type.STRING, description: "인물의 표정" },
                action: { type: Type.STRING, description: "인물의 행동" },
                cameraAngle: { type: Type.STRING, description: "카메라 앵글 (예: 하이 앵글, 로우 앵글)" },
                shotType: { type: Type.STRING, description: "샷 종류 (예: 클로즈업, 풀샷, 롱샷)" },
                narration: { type: Type.STRING, description: "나레이션 (없으면 '없음')" },
                subtitle: { type: Type.STRING, description: "자막 또는 대사 (없으면 '없음')" },
                sfx: { type: Type.STRING, description: "특수효과 또는 음향효과 (없으면 '없음')" },
                startImagePrompt: {
                  type: Type.OBJECT,
                  description: "샷의 시작 이미지를 생성하기 위한 프롬프트. 한국적 배경과 9:16 비율 필수.",
                  properties: {
                    englishPrompt: { type: Type.STRING, description: "상세한 영어 프롬프트. 반드시 'Korean'을 포함하고 'ratio 9:16'으로 끝나야 함." },
                    koreanTranslation: { type: Type.STRING, description: "영어 프롬프트의 한글 번역. 반드시 끝에 '비율 9:16'을 포함해야 함." },
                  },
                  required: ["englishPrompt", "koreanTranslation"]
                },
                videoPrompt: {
                  type: Type.OBJECT,
                  description: "샷의 전체 영상을 생성하기 위한 프롬프트. 한국적 배경과 9:16 비율 필수.",
                  properties: {
                    englishPrompt: { type: Type.STRING, description: "상세한 영어 프롬프트. 반드시 'Korean'을 포함하고 'ratio 9:16'을 포함해야 함." },
                    koreanTranslation: { type: Type.STRING, description: "영어 프롬프트의 한글 번역. 반드시 끝에 '비율 9:16'을 포함해야 함." },
                  },
                  required: ["englishPrompt", "koreanTranslation"]
                },
              },
              required: ["shotNumber", "time", "description", "reelsPreviewDescription", "hookMessage", "character", "location", "props", "season", "timeOfDay", "naturalPhenomena", "expression", "action", "cameraAngle", "shotType", "narration", "subtitle", "sfx", "startImagePrompt", "videoPrompt"]
            }
          }
        },
        required: ["sceneNumber", "sceneSummary", "shots"]
      }
    },
    prompts: {
      type: Type.OBJECT,
      description: "이미지 생성을 위한 에셋 프롬프트 목록입니다.",
      properties: {
        characters: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "등장인물 이름" },
              englishPrompt: { type: Type.STRING, description: "상세한 영어 프롬프트. 'Korean' 키워드와 'ratio 9:16' 필수." },
              koreanTranslation: { type: Type.STRING, description: "영어 프롬프트의 한글 번역. 반드시 '비율 9:16' 포함." },
            },
             required: ["name", "englishPrompt", "koreanTranslation"]
          }
        },
        locations: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "장소 이름" },
              englishPrompt: { type: Type.STRING, description: "상세한 영어 프롬프트. 'Korea' 키워드와 'ratio 9:16' 필수." },
              koreanTranslation: { type: Type.STRING, description: "영어 프롬프트의 한글 번역. 반드시 '비율 9:16' 포함." },
            },
            required: ["name", "englishPrompt", "koreanTranslation"]
          }
        },
        props: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "소품 이름" },
              englishPrompt: { type: Type.STRING, description: "상세한 영어 프롬프트. 'ratio 9:16' 필수." },
              koreanTranslation: { type: Type.STRING, description: "영어 프롬프트의 한글 번역. 반드시 '비율 9:16' 포함." },
            },
            required: ["name", "englishPrompt", "koreanTranslation"]
          }
        }
      },
      required: ["characters", "locations", "props"]
    }
  },
  required: ["storyboard", "prompts"]
};


export const generateStoryboardAndAssets = async (userInput: UserInput): Promise<StoryboardData> => {
  const { plot, storyLength, storyDuration, shotDuration, genre, cameraStyle, characterStyle } = userInput;

  const lengthSeconds = storyLength === '15초' ? 15 : storyLength === '30초' ? 30 : 60;
  const durationSeconds = parseInt(shotDuration);
  const totalShotsRequired = Math.ceil(lengthSeconds / durationSeconds);

  const prompt = `
    당신은 전문 시나리오 작가이자 릴스(Reels) 전문 영상 감독입니다. '망고(Mango)'라는 안전한 신용카드 중고거래 앱의 홍보를 위한 최적화된 릴스 스토리보드를 작성하세요.

    ## 서비스 정보 (망고 - Mango)
    - 특징: 안전한 신용카드 중고거래, 에스크로(Escrow) 시스템, 위치 기반 매칭, 지출 증빙 가능, 제로 웨이스트 실천.
    - 핵심 메시지: "사기 걱정 없는 중고거래, 망고!"

    ## 사용자 요청 및 분량 지침 (매우 중요)
    - **주제/줄거리:** ${plot}
    - **목표 영상 총 길이:** ${storyLength} (${lengthSeconds}초)
    - **기본 샷 단위:** ${shotDuration} (${durationSeconds}초)
    - **필수 작업:** 총 **${totalShotsRequired}개의 샷**을 생성하여 전체 영상 길이가 정확히 **${lengthSeconds}초**가 되도록 구성하십시오.
    - 각 샷의 시간(time)은 "${durationSeconds}s 단위"로 순차적으로 할당하십시오.

    ## 스타일 가이드 (릴스 특화)
    - **장르/카테고리:** ${genre}
    - **카메라 스타일:** ${cameraStyle} (예를 들어 POV(1인칭)인 경우 시청자의 시점에서 촬영되는 구도를 적극 반영)
    - **등장인물 성격:** ${characterStyle} (이 성격에 맞는 대사 톤과 행동을 지시)

    ## 릴스 최적화 지침 (필수)
    1. 모든 샷에는 **'릴스 예상 화면(reelsPreviewDescription)'**과 **'훅 메시지(hookMessage)'**가 포함되어야 합니다.
    2. 모든 시각적 묘사와 프롬프트는 '한국(Korea, Korean)' 배경과 인물을 기준으로 합니다.
    
    ## 프롬프트 비율 설정 지침 (매우 중요)
    3. **모든 영어 이미지 및 영상 프롬프트(englishPrompt)**의 끝에는 반드시 '--ar 9:16', 'ratio 9:16' 문구를 포함하세요.
    4. **모든 한글 번역 프롬프트(koreanTranslation)**의 끝에는 반드시 '비율 9:16' 문구를 포함하세요.

    출력은 반드시 정의된 JSON 형식이어야 합니다.
    `;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7,
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText.startsWith('{') && !jsonText.startsWith('[')) {
        throw new Error("AI returned an invalid format.");
    }
    const data: StoryboardData = JSON.parse(jsonText);
    return data;
  } catch (error) {
    console.error("Error generating storyboard:", error);
    throw new Error("AI 스토리보드 생성에 실패했습니다. 다시 시도해주세요.");
  }
};
