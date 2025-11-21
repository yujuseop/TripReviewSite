# 🧳 TripView

여행 기록 및 리뷰를 관리할 수 있는 Next.js 기반 웹 애플리케이션입니다.

## ✨ 주요 기능

- 🔐 **사용자 인증**: Supabase Auth를 통한 회원가입/로그인
- 📅 **여행 캘린더**: React Calendar를 활용한 여행 일정 관리
- ✈️ **여행 기록**: 여행 제목, 기간, 설명, 공개/비공개 설정
- 📍 **목적지 관리**: 여행별 여러 목적지 추가 및 관리
- ⭐ **리뷰 시스템**: 5점 만점 평점 및 리뷰 작성
- 👤 **프로필 관리**: 사용자 닉네임, 역할(사용자/관리자) 관리
- 🎨 **반응형 UI**: Tailwind CSS를 활용한 모던한 디자인

## 🛠️ 기술 스택

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **UI Components**: React Calendar, js-toastify
- **Deployment**: Vercel

## 🐛 알려진 이슈

- Node.js 18 이하 버전에서 Supabase 경고 메시지 (Node.js 20+ 권장)
- 새로고침 시 여행 목록이 사라지는 문제 (캐싱 비활성화로 해결)

## 📝 라이선스

MIT License

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해주세요.

