import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

interface TravelHistory {
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: Request) {
  const { messages, travelHistory } = await req.json();

  const systemPrompt = `당신은 여행지 추천 전문 AI 어시스턴트입니다. 사용자의 여행 기록을 바탕으로 맞춤형 여행지를 추천하고, 여행 관련 질문에 친절하게 답변합니다.

답변 규칙:
- 한국어로 답변합니다.
- 구체적인 장소명, 음식점, 관광지를 추천할 때는 이름을 명확히 적어주세요.
- 여행 일정, 예산, 교통편에 대한 실용적인 정보를 포함해주세요.
- 답변은 간결하고 읽기 쉽게 작성해주세요.

${
  travelHistory && travelHistory.length > 0
    ? `사용자의 여행 기록:
${travelHistory
  .map(
    (t: TravelHistory) =>
      `- ${t.title} (${t.destination}, ${t.start_date} ~ ${t.end_date})`
  )
  .join("\n")}

위 여행 기록을 참고해서 사용자의 취향에 맞는 추천을 해주세요.`
    : "사용자의 여행 기록이 없습니다. 일반적인 여행지 추천을 제공해주세요."
}`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    stream: true,
    messages: [
      { role: "system", content: systemPrompt },
      ...messages.map((m: Message) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      })),
    ],
  });

  const stream = OpenAIStream(response as unknown as Parameters<typeof OpenAIStream>[0]);
  return new StreamingTextResponse(stream);
}
