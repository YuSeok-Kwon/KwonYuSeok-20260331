# 다이소 뷰티 AI 컨시어지

> 다이소에서 판매하는 뷰티 제품의 성분과 리뷰를 AI가 분석하여 피부 고민에 맞는 제품을 추천하는 웹 서비스입니다.

## 프로젝트 개요

다이소몰에서 크롤링한 **950개 뷰티 제품**, **393K개 리뷰**, **1,741개 성분** 데이터를 기반으로 구축한 AI 뷰티 컨시어지 서비스입니다.

### 핵심 기능
- **피부 고민 기반 필터링**: 주름, 보습, 트러블, 미백, 모공, 진정, 자외선차단, 각질 8가지 고민별 제품 검색
- **성분 분석**: 제품별 전성분 표시 및 피부 고민과 연관된 핵심 성분 하이라이트
- **ABSA 리뷰 분석**: Aspect-Based Sentiment Analysis로 9개 측면(가격, 사용감, 디자인 등)별 긍정/부정 비율 시각화
- **AI 대화 추천**: ChatGPT 기반 대화형 제품 추천 (Function Calling으로 실제 데이터 검색)

## 기술 스택

| 영역 | 기술 |
|---|---|
| Frontend | React 19, Recharts, Axios |
| Backend | Node.js, Express |
| AI | OpenAI GPT-4o-mini (Function Calling) |
| Data | BigQuery → JSON (크롤링 데이터) |
| Deploy | Vercel (Frontend) + Render (Backend) |

## 아키텍처

```
[사용자] → [React Frontend (Vercel)]
               │
               ↓
         [Node.js Backend (Render)]
               │
         ┌─────┼─────┐
         ↓     ↓     ↓
     /products  /chat  /skin-concerns
         │       │
    [JSON Data] [ChatGPT API]
                  │
            [Function Calling]
              → searchProducts
              → getProductDetail
              → getProductReviews
```

## 설치 및 실행

### 사전 요구사항
- Node.js 18+
- OpenAI API Key

### 백엔드

```bash
cd server
npm install
cp ../.env.example ../.env  # OPENAI_API_KEY 입력
npm start                   # http://localhost:4000
```

### 프론트엔드

```bash
cd client
npm install
npm start                   # http://localhost:3000
```

### 환경 변수

```
OPENAI_API_KEY=sk-...       # OpenAI API 키
PORT=4000                   # 서버 포트 (기본: 4000)
CORS_ORIGIN=*               # CORS 허용 오리진
REACT_APP_API_URL=http://localhost:4000/api  # API 서버 주소
```

## 데이터 파이프라인

```
BigQuery (daiso-analysis.daiso)
    ↓  scripts/export-bq.js
server/data/raw/ (원시 JSON)
    ↓  scripts/transform-data.js
server/data/ (가공 JSON)
    ├── products.json      : 제품 마스터 + skin_concerns 태그
    ├── ingredients.json   : 제품별 성분 목록
    ├── ingredients_dic.json : 성분 사전
    ├── absa.json          : 제품별 ABSA 감성 분석 결과
    ├── reviews.json       : 대표 긍정/부정 리뷰
    └── skin-concerns.json : 피부 고민-성분 매핑 정의
```

## 피부 고민-성분 매핑

| 고민 | 핵심 성분 |
|---|---|
| 주름/노화 | 레티놀, 아데노신, 나이아신아마이드, 펩타이드, 콜라겐 |
| 보습/건조 | 히알루론산, 글리세린, 세라마이드, 스쿠알란, 판테놀 |
| 트러블 | 살리실산(BHA), 티트리, 어성초, 병풀(시카) |
| 미백/톤업 | 나이아신아마이드, 비타민C, 알부틴, 글루타치온 |
| 모공 | 살리실산(BHA), 나이아신아마이드, PHA, AHA |
| 진정/민감 | 병풀(시카), 알란토인, 판테놀, 녹차, 감초 |
| 자외선차단 | 티타늄디옥사이드, 징크옥사이드 등 UV 필터 |
| 각질/피부결 | AHA, BHA, PHA, 우레아 |

## API 엔드포인트

| Method | Path | 설명 |
|---|---|---|
| GET | `/api/products` | 제품 목록 (필터, 정렬, 페이지네이션) |
| GET | `/api/products/:code` | 제품 상세 + 성분 |
| GET | `/api/products/:code/absa` | ABSA 리뷰 감성 분석 |
| GET | `/api/products/:code/reviews` | 대표 리뷰 텍스트 |
| GET | `/api/skin-concerns` | 피부 고민-성분 매핑 |
| GET | `/api/ingredients/search?q=` | 성분명 검색 |
| POST | `/api/chat` | AI 대화 (ChatGPT) |

## 설계 의도

### 과제1과의 연결
과제1에서 설계한 "다이소 뷰티 AI 컨시어지" MVP의 핵심 기능을 구현했습니다.
- ABSA 분석 결과를 제품별 리뷰 요약에 활용
- 피부 고민-성분 매핑을 데이터 기반으로 정의
- ChatGPT Function Calling으로 대화형 추천 구현

### 데이터 퍼스트 전략
BQ에 적재된 크롤링 데이터를 JSON으로 export하여 서버 메모리에 로딩하는 방식을 선택했습니다.
- 별도 DB 없이 빠른 조회 가능
- 950개 제품 규모에서 충분한 성능
- 배포 환경에서 외부 DB 의존성 제거

### 아쉬운 점 & 개선 여지
- 이미지 URL 미포함 (다이소몰 직접 크롤링 시 추가 가능)
- 실시간 가격/재고 반영 미지원
- 사용자별 대화 히스토리 저장 미구현 (세션 기반)
- 모바일 앱 대응 미흡

## 프로젝트 구조

```
├── client/                   # React 프론트엔드
│   └── src/
│       ├── api/index.js      # API 클라이언트
│       ├── context/AppContext.js  # 전역 상태
│       └── components/
│           ├── Header.js     # 헤더
│           ├── Footer.js     # 푸터
│           ├── FilterBar.js  # 필터 바
│           ├── ProductCard.js    # 제품 카드
│           ├── ProductGrid.js    # 제품 그리드
│           ├── ProductModal.js   # 제품 상세 모달
│           ├── IngredientSection.js  # 성분 표시
│           ├── ReviewSummary.js  # ABSA 차트
│           └── ChatPanel.js  # AI 대화
├── server/                   # Node.js 백엔드
│   ├── index.js              # Express 진입점
│   ├── data/
│   │   ├── loader.js         # 데이터 로딩 모듈
│   │   └── *.json            # 가공 데이터
│   └── routes/
│       ├── products.js       # 제품 API
│       ├── ingredients.js    # 성분/피부고민 API
│       └── chat.js           # ChatGPT API
├── scripts/
│   ├── export-bq.js          # BQ → JSON 추출
│   └── transform-data.js     # 데이터 변환
└── .env.example              # 환경 변수 템플릿
```

---

**권유석** | 레브잇 채용 과제 2
