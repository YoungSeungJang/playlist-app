# 🎵 PlayTogether - 협업 플레이리스트 관리 서비스

친구들과 함께 플레이리스트를 만들고 관리할 수 있는 협업 음악 플랫폼입니다.

## ✨ 주요 기능

- 🔐 **사용자 인증**: Supabase 기반 이메일/비밀번호 인증
- 🎵 **협업 플레이리스트**: 초대 코드로 함께 플레이리스트 관리
- 🔗 **초대 코드 시스템**: 6자리 고유 코드로 간편한 플레이리스트 공유
- 🔍 **음악 검색**: Spotify Web API 연동으로 풍부한 음악 데이터 제공
- ⚡ **검색 캐싱**: React Query를 활용한 효율적인 데이터 관리 (5분 캐싱)
- 📱 **반응형 디자인**: 모바일/태블릿/데스크톱 모두 지원

## 🛠 기술 스택

### Frontend
- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** + **Headless UI** (스타일링)
- **Zustand** (클라이언트 상태 관리)
- **React Query** (서버 상태 관리 및 캐싱)
- **React Router v6** (라우팅)

### Backend
- **Express.js** + **TypeScript**
- **Spotify Web API** (음악 메타데이터)

### Database & Auth
- **Supabase PostgreSQL** (데이터베이스)
- **Supabase Auth** (사용자 인증)

### Infrastructure
- **Turborepo** (모노레포 관리)
- **pnpm** (패키지 매니저)
- **AWS Amplify** (프론트엔드 배포)
- **AWS EC2** (백엔드 API 서버)

## 💡 주요 특징

### 1. 모노레포 아키텍처
- Turborepo를 활용한 효율적인 멀티 패키지 관리
- 공통 타입과 UI 컴포넌트 재사용으로 코드 중복 최소화

### 2. 성능 최적화
- React Query를 활용한 서버 상태 캐싱 (검색 결과 5분간 캐시)
- 중복 API 호출 방지 및 백그라운드 데이터 동기화
- Spotify API 호출 최소화로 rate limit 관리

### 3. 사용자 경험
- 직관적인 초대 코드 시스템 (6자리 알파벳+숫자)
- 실시간 검색 및 즉각적인 피드백
- 반응형 디자인으로 모든 디바이스 지원

## 📁 프로젝트 구조

```
playlist/
├── apps/
│   ├── web/              # React 프론트엔드 (Vite)
│   └── api/              # Express 백엔드
├── packages/
│   ├── shared/           # 공통 타입 정의 및 유틸리티
│   └── ui/               # 재사용 가능한 UI 컴포넌트
```

## 🚀 배포 환경

### Frontend (AWS Amplify)
- GitHub 연동 자동 배포
- 빌드 시 환경 변수 주입
- HTTPS 기본 제공

### Backend (AWS EC2)
- Ubuntu Server 환경
- PM2를 통한 프로세스 관리
- Nginx 리버스 프록시
- Let's Encrypt SSL 인증서
