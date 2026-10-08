# [배당패스 / Dividend Pass] 모바일 가로 스크롤 완전 박멸 & 청약패스 색감 동기화 QA 검증 계획서

- **문서 목적:** 청약패스(`cheongyak-pass.vercel.app`) 벤치마크 기반의 375px 모바일(iPhone SE) 가로 스크롤 완전 박멸, 100% 내추럴 핀테크 색감 동기화 및 첫 화면(Above the Fold) 즉시 탐색 개선 작업 검증 기준 수립
- **작성 주체:** stock_qa (수석 품질 보증 엔지니어)
- **대상 컴포넌트:** [components/MainApp.tsx](file:///Users/a5516774/Desktop/stock/components/MainApp.tsx), [components/Header.tsx](file:///Users/a5516774/Desktop/stock/components/Header.tsx), [components/InfoTooltip.tsx](file:///Users/a5516774/Desktop/stock/components/InfoTooltip.tsx), [components/StockExplorer.tsx](file:///Users/a5516774/Desktop/stock/components/StockExplorer.tsx), [components/FireCalculator.tsx](file:///Users/a5516774/Desktop/stock/components/FireCalculator.tsx), [app/layout.tsx](file:///Users/a5516774/Desktop/stock/app/layout.tsx)
- **자동화 검증 도구:** [scripts/validate_responsive.py](file:///Users/a5516774/Desktop/stock/scripts/validate_responsive.py)

---

## 📐 1. 4대 핵심 검증 기준 (Acceptance Criteria)

### ① 모바일 가로 스크롤 완전 박멸 (375px iPhone SE)
1. **고정 너비 제한:** 360px 초과 고정 픽셀 너비(`w-[...px]`, `min-w-[...px]`) 0건.
2. **비제어 음수 마진 방지:** `-mr-`, `-ml-`, `-mx-` 대형 음수 마진(4 이상)에 의한 뷰포트 탈출 결함 0건.
3. **우측 끝 툴팁 탈출(Escaping Tooltip) 방지:** 우측 끝 아이콘의 툴팁 팝오버가 375px 모바일 뷰포트 우측 밖으로 삐져나가지 않도록 모바일 너비 가드 및 반응형 정렬(`max-w-[calc(100vw-32px)]` 또는 `right-0`) 적용.
4. **최상위 오버플로우 가드:** [app/layout.tsx](file:///Users/a5516774/Desktop/stock/app/layout.tsx) `body`에 `overflow-x-hidden` 및 `viewport: Viewport (width: 'device-width')` 메타태그 완비.

### ② 청약패스(cheongyak-pass) 100% 내추럴 핀테크 색감 동기화
1. **어둡고 무거운 그라데이션 박스 전면 제거:**
   - `from-blue-600 via-indigo-600 to-slate-900` 등 묵직한 어두운 박스를 전면 제거.
2. **산뜻한 `bg-white` 베이스 & `bg-slate-100` 탭/버튼:**
   - 밝고 신뢰감 있는 화이트 카드 베이스(`bg-white border border-slate-200/80 rounded-2xl/3xl`) 채택.
   - 탭 및 필터 버튼에 부드러운 슬레이트 필 스타일(`bg-slate-100 / bg-slate-50`) 적용.

### ③ 첫 화면(Above the Fold) 콘텐츠 가독성 및 카드 품질
1. **첫 화면 즉시 탐색 진입성:**
   - 지나치게 큰 세로 여백을 차지하는 히어로 섹션을 컴팩트화하여, 첫 화면 진입 시 메인 탐색 탭과 상위 배당 종목 카드가 스크롤 없이 즉시 시야에 들어오도록 최적화.
2. **고대비 타이포그래피 & 배지 가독성:**
   - 텍스트 대비(`text-slate-900`, `text-slate-500`) 확보 및 직관적인 배당률 배지 스타일 유지.

### ④ 데스크탑 대화면 및 빌드/기능 무결성 보존
1. **`max-w-7xl` 대화면 컨테이너 및 3열 그리드:** [StockExplorer.tsx](file:///Users/a5516774/Desktop/stock/components/StockExplorer.tsx) `sm:grid-cols-2 / lg:grid-cols-3` 그리드 유지.
2. **FireCalculator `lg:grid-cols-12` 2컬럼 레이아웃:** 좌측 5열 Sticky 패널 + 우측 7열 독립 스크롤 유지.
3. **빌드 무결성:** `npm run build` 종료코드 0 및 TypeScript 타입 오류 0건.
4. **기존 데이터 및 수학적 역산 정밀도:** 500개 종목 데이터셋 및 단주 올림 오차 $\le 10,000$원 보존.

---

## 🧪 2. 자동화 검증 항목 정의서 ([scripts/validate_responsive.py](file:///Users/a5516774/Desktop/stock/scripts/validate_responsive.py))

| 검증 ID | 검증 항목 | 합격 기준 | 현재 상태 |
|---|---|---|:---:|
| **1-1** | 375px 모바일 초과 고정너비 0건 | `(?:min-w\|w)-\[(\d+)px\]` 추출 후 360px 초과 요소 0건 | **PASS** |
| **1-2** | 모바일 반응형 Viewport 메타태그 | [app/layout.tsx](file:///Users/a5516774/Desktop/stock/app/layout.tsx) 내 `device-width` 구성 | **PASS** |
| **1-3** | 가로 스크롤 방지 가드 | 최상위 `overflow-x-hidden` 가드 완비 | **PASS** |
| **1-4** | 비제어 음수 마진 오버플로우 0건 | 대형 음수 마진(-mr, -ml, -mx >= 4)에 의한 화면 탈출 0건 | *[DEV 대기]* |
| **1-5** | 우측 끝 툴팁 탈출 방지 가드 | 375px 화면 밖으로 툴팁 팝오버 탈출 방지 처리 | **PASS** |
| **2-1** | 어둡고 무거운 그라데이션 박스 제거 | `from-blue-600 via-indigo-600 to-slate-900` 등 전면 제거 | *[DEV 대기]* |
| **2-2** | 청약패스 내추럴 핀테크 스타일 | 산뜻한 `bg-white` 베이스 및 `bg-slate-100` 탭/필터 스타일 적용 | **PASS** |
| **3-1** | 첫 화면(Above the Fold) 즉시 탐색 | 컴팩트 헤더/히어로 및 첫 화면 내 즉각 탐색 진입 배치 | **PASS** |
| **3-2** | 종목 카드 고대비 가독성 품질 | 고대비 타이포그래피(`text-slate-900`) 및 배당률 배지 | **PASS** |
| **4-1** | 대화면 `max-w-7xl` 컨테이너 | `max-w-7xl` 또는 `max-w-6xl` & `mx-auto` 적용 | **PASS** |
| **4-2** | 종목 리스트 다열 그리드 | `sm:grid-cols-2` 및 `lg:grid-cols-3` 클래스 확인 | **PASS** |
| **4-3** | FIRE 역산기 2컬럼 레이아웃 | `lg:grid-cols-12` (좌측 5열 / 우측 7열 분할) 확인 | **PASS** |
| **4-4** | 좌측 입력 패널 Sticky 고정 | `lg:sticky lg:top-*` 스크롤 고정 지원 확인 | **PASS** |
| **5-1** | 프로덕션 빌드 무결성 | `npm run build` 클린 빌드 종료코드 0 확인 | **PASS** |
| **5-2** | 500개 데이터 정합성 보존 | 총 500개(KR 250 + US 250) 스키마 결측치 0건 보존 | **PASS** |
| **5-3** | 역산 수학적 오차 한도 보존 | 목표 배당금(30만/100만/200만/500만) 오차 $\le 10,000$원 | **PASS** |
| **5-4** | 배당세율 & 종합과세 보존 | KR 15.4%, US 15.0%, 종합과세 2,000만 원 초과 경고 보존 | **PASS** |
| **6-1** | Phase 1 리그레션 0건 | [scripts/validate_phase1.py](file:///Users/a5516774/Desktop/stock/scripts/validate_phase1.py) 24개 전 항목 ALL PASS | **PASS** |
| **6-2** | Phase 2 리그레션 0건 | [scripts/validate_phase2.py](file:///Users/a5516774/Desktop/stock/scripts/validate_phase2.py) 12개 전 항목 ALL PASS | **PASS** |
| **6-3** | Phase 3 리그레션 0건 | [scripts/validate_phase3.py](file:///Users/a5516774/Desktop/stock/scripts/validate_phase3.py) 12개 전 항목 ALL PASS | **PASS** |

---

## 🔍 3. stock_dev 조치 대기 항목 요약

1. **[항목 2-1 & 1-4] [components/MainApp.tsx](file:///Users/a5516774/Desktop/stock/components/MainApp.tsx) 히어로 배너 개선:**
   - `bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900` 및 내부 장식용 `-mr-12` 요소 제거.
   - 청약패스 스타일의 밝고 산뜻한 `bg-white` 카드 또는 라이트 슬레이트(`bg-slate-100/bg-slate-50`) 컴팩트 배너로 교체.
2. 교체 완료 시 `scripts/validate_responsive.py` 20개 전 항목 100% ALL PASS 달성 예정.
