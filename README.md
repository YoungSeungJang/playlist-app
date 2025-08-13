# 🎵 협업 플레이리스트 관리 앱

친구들과 함께 실시간으로 플레이리스트를 만들고 관리할 수 있는 웹 애플리케이션입니다.

## ✨ 주요 기능

- 🔐 **사용자 인증**: 이메일/비밀번호 기반 회원가입/로그인
- 🎵 **협업 플레이리스트**: 실시간으로 여러 명이 함께 편집
- 🔗 **초대 코드**: 간단한 6자리 코드로 플레이리스트 공유
- 🎯 **실시간 동기화**: Socket.io를 통한 실시간 업데이트
- 🔍 **음악 검색**: Spotify API 연동으로 풍부한 음악 데이터
- 👥 **온라인 상태**: 현재 접속 중인 사용자 표시
- 📱 **반응형 디자인**: 모바일/데스크톱 모두 지원

## 🛠 기술 스택

### Frontend
- React 18 + TypeScript + Vite
- Tailwind CSS + Headless UI
- Zustand (상태 관리)
- React Query (서버 상태)
- Socket.io Client

### Backend
- Express.js + TypeScript
- Socket.io (실시간 통신)
- Prisma ORM
- Spotify Web API

### Database & Auth
- Supabase (PostgreSQL + Auth + Real-time)

### Infrastructure
- Turborepo (모노레포)
- pnpm (패키지 매니저)

## 🚀 빠른 시작

### 1. 환경 변수 설정

\`\`\`bash
cp .env.example .env
\`\`\`

환경 변수를 설정하세요:
- **Supabase**: https://supabase.com 에서 프로젝트 생성
- **Spotify API**: https://developer.spotify.com 에서 앱 등록

### 2. 의존성 설치

\`\`\`bash
pnpm install
\`\`\`

### 3. 데이터베이스 설정

\`\`\`bash
# Prisma 마이그레이션 실행
npx prisma migrate dev

# Prisma Client 생성
npx prisma generate
\`\`\`

### 4. 개발 서버 시작

\`\`\`bash
# 프론트엔드 + 백엔드 동시 시작
pnpm dev
\`\`\`

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## 📁 프로젝트 구조

\`\`\`
playlist-app/
├── apps/
│   ├── web/              # React 프론트엔드
│   └── api/              # Express 백엔드
├── packages/
│   ├── shared/           # 공통 타입 및 유틸리티
│   └── ui/               # 재사용 가능한 UI 컴포넌트
├── prisma/               # 데이터베이스 스키마
└── docs/                 # 문서
\`\`\`

## 📝 개발 스크립트

\`\`\`bash
# 모든 앱 빌드
pnpm build

# 린트 검사
pnpm lint

# 코드 포맷팅
pnpm format

# 타입 검사
pnpm type-check

# 클린 빌드
pnpm clean
\`\`\`

## 🔧 개발 환경 설정

### VSCode 추천 확장

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Prisma

### 코드 품질

- ESLint + Prettier로 코드 스타일 통일
- Husky를 통한 pre-commit 검사
- TypeScript strict 모드 활성화

## 📚 다음 단계

1. **2단계 - 사용자 인증 시스템** 구현
2. **3단계 - 플레이리스트 CRUD** 구현  
3. **4단계 - Spotify API 연동** 구현
4. **5단계 - 실시간 협업 기능** 구현

## 🤝 기여

이슈나 개선 사항이 있다면 언제든지 PR을 보내주세요!

## 📄 라이선스

MIT License