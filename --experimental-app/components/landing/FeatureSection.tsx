const features = [
  {
    icon: "✈️",
    title: "여행 기록",
    description:
      "여행 제목, 날짜, 목적지를 한 번에 기록하세요. 시작일과 종료일을 설정해 여행 일정을 체계적으로 관리할 수 있어요.",
  },
  {
    icon: "⭐",
    title: "리뷰 & 평점",
    description:
      "각 여행마다 상세한 후기와 별점을 남겨보세요. 나중에 언제든지 수정하거나 삭제할 수 있어요.",
  },
  {
    icon: "🖼️",
    title: "사진 갤러리",
    description:
      "여행에서 찍은 사진을 업로드하고 모아보세요. 소중한 여행의 순간들을 사진으로 간직하세요.",
  },
  {
    icon: "📅",
    title: "캘린더 뷰",
    description:
      "캘린더에서 여행 날짜를 한눈에 확인하세요. 어떤 날 어떤 여행을 했는지 바로 파악할 수 있어요.",
  },
];

export default function FeatureSection() {
  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
          TripView로 할 수 있는 것들
        </h2>
        <p className="text-center text-gray-400 mb-16 text-base">
          여행의 모든 순간을 기록하고 추억으로 남기세요.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col items-center text-center p-8 rounded-2xl bg-gray-50 hover:shadow-lg transition-shadow duration-300"
            >
              <span className="text-4xl mb-5">{feature.icon}</span>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
