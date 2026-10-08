# Phase 2 QA 검증 계획서 (Next.js 14 + Tailwind 디자인 시스템 + InfoTooltip)

- **대상 기능:** Phase 2 프론트엔드 프로젝트 셋업, cheongyak-pass 벤치마크 디자인 시스템, InfoTooltip 컴포넌트
- **기준 문서:** [docs/project_execution_plan.md](file:///Users/a5516774/Desktop/stock/docs/project_execution_plan.md#L68-L86) (Phase 2 달성 기준)
- **작성일:** 2026-10-08
- **검증 도구:** [scripts/validate_phase2.py](file:///Users/a5516774/Desktop/stock/scripts/validate_phase2.py) 및 반응형 뷰포트 / 빌드 무결성 자동화 테스트 스위트

---

## 🎯 Phase 2 중점 검수 목표

모바일 퍼스트 핀테크 서비스로서 데스크톱과 모바일(375px~430px) 모두에서 가로 스크롤 없이 앱처럼 정갈하고 매끄러운 사용자 경험을 제공하고, 투명성을 보장하는 핵심 인터랙티브 요소인 **InfoTooltip(물음표 컴포넌트)**이 정교하게 동작하는지 정량적으로 검증합니다.

---

## 📋 세부 검수 항목 및 판정 기준 (Acceptance Criteria)

### 1. 빌드 및 에러 무결성 (Build & Lint Integrity)
- [ ] **체크포인트 1-1:** `npm install` 후 `npm run build` 실행 시 에러 코드 0으로 정상 완료되는가?
- [ ] **체크포인트 1-2:** TypeScript 컴파일 에러 0건 및 ESLint 린트 경고/에러 0건 유지.
- [ ] **체크포인트 1-3:** App Router (`app/layout.tsx`, `app/page.tsx` 등) 라우팅 및 번들링 무결성 확인.

### 2. 반응형 뷰포트 & 가로 스크롤 최적화 (Responsive Viewport)
- [ ] **체크포인트 2-1 (컨테이너 규격):**
  - 최상위 메인 래퍼가 `max-w-xl(640px)` 중앙 정렬(`mx-auto`) 컨테이너로 감싸져 있어 데스크톱에서도 정갈한 모바일 앱 뷰를 유지하는가?
- [ ] **체크포인트 2-2 (가로 스크롤 결함 0건):**
  - 모바일 최소 규격인 **375px (아이폰 SE)**, 390px (아이폰 14), 430px (프로맥스) 뷰포트에서 **가로 스크롤(Horizontal Overflow) 현상이 0건**인가?
  - 360px를 초과하는 고정 픽셀 너비(`w-[400px]`, `min-w-[500px]` 등) 하드코딩이 배제되었는가?

### 3. 디자인 시스템 정합성 (`cheongyak-pass` 스타일 벤치마크)
- [ ] **체크포인트 3-1 (배경색):** 전체 배경에 부드러운 슬레이트 계열(`bg-slate-50`) 적용.
- [ ] **체크포인트 3-2 (모던 카드):** 카드 및 섹션 컨테이너에 부드러운 라운딩(`rounded-2xl`, `bg-white`, `border-slate-100` 또는 `shadow-sm`) 적용.
- [ ] **체크포인트 3-3 (타이포그래피):** 핵심 수치는 강조(`font-bold`, `text-slate-900`), 부가 설명은 안정적인 가독성(`text-slate-500`, `text-sm`) 적용.
- [ ] **체크포인트 3-4 (뱃지 시스템):**
  - 월배당 / 추천: 신뢰감 있는 블루/에메랄드 뱃지 (`bg-blue-50 text-blue-700`, `bg-emerald-50 text-emerald-700`).
  - 위험 배당 (isHighRisk): 경고성 주황/레드 뱃지 (`bg-rose-50 text-rose-700` 또는 `bg-amber-50 text-amber-700`).

### 4. InfoTooltip 컴포넌트 인터랙션 및 설명 완비
- [ ] **체크포인트 4-1 (데스크톱 인터랙션):** 마우스 호버 시 0.1초 내 툴팁/팝오버 부드럽게 노출.
- [ ] **체크포인트 4-2 (모바일 인터랙션):**
  - 모바일 터치(탭) 시 즉시 팝오버가 토글 오픈되는가?
  - 팝오버 외부 영역(배경/백드롭) 탭 시 자연스럽게 닫히는가?
- [ ] **체크포인트 4-3 (3대 핵심 설명 완비):**
  1. **인기 점수(Popularity Score) 계산식:** `시총(AUM) 순위 60% + 일평균 거래대금 순위 40%` 가중치 반영 설명.
  2. **TTM 배당률(Dividend Yield) 개념:** 과거 12개월(Trailing Twelve Months) 실지급 분배금 기준 설명.
  3. **안전 필터링 & 고위험(isHighRisk) 기준:** 시가총액 1,000억 원(미국 $500M) 미만 제외 및 배당수익률 20% 초과 종목 주의 안내.

---

## 🛠️ 검증 도구 및 실행 가이드

### 1. 자동화 스크립트 실행
stock_dev 개발 완료 통보 시 터미널에서 즉시 실행:
```bash
python3 scripts/validate_phase2.py
```
- 총 10개 정량 검사 항목에 대해 `[PASS / FAIL]` 결과를 10초 이내에 자동 판출.

### 2. 가로 스크롤 및 인터랙션 교차 검증
1. `npm run dev` 로컬 서버 기동
2. 브라우저 개발자 도구 Device Emulation:
   - iPhone SE (375 × 667)
   - iPhone 14 (390 × 844)
   - iPhone 14 Pro Max (430 × 932)
   - Desktop (1440 × 900)
3. DOM 요소 검사를 통해 `document.documentElement.scrollWidth > window.innerWidth` 여부 확인 (0px 오차 기준).
4. `InfoTooltip` 컴포넌트 터치 및 외부 탭 이벤트 테스트.

---

## 🚦 검수 완료 후 절차

- 전 항목 합격 시: [docs/phase2_qa_report.md](file:///Users/a5516774/Desktop/stock/docs/phase2_qa_report.md)에 [PASS] 리포트 발행 후 Phase 3(메인 3대 기능: 탐색 탭 + ETF 모달 + 파이어 계산기) 착수 승인.
- 결함 발견 시: 결함 번호(F-1, F-2 등) 및 재현 경로, 코드 수정 권고사항을 명시하여 dev에 즉각 반환.
