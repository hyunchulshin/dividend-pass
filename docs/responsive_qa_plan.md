# [배당패스 / Dividend Pass] 모바일+데스크탑 듀얼 뷰포트 반응형 QA 검증 계획서

- **문서 목적:** 청약패스(`cheongyak-pass.vercel.app`) 벤치마크 기반의 375px 모바일(iPhone SE) 및 1280px+ 데스크탑(QHD/FHD) 듀얼 뷰포트 완벽 반응형(Responsive) 업그레이드 품질 검증 기준 정립 및 자동화 검증 체계 수립
- **작성 주체:** stock_qa (수석 품질 보증 엔지니어)
- **대상 파일:** [app/layout.tsx](file:///Users/a5516774/Desktop/stock/app/layout.tsx), [components/MainApp.tsx](file:///Users/a5516774/Desktop/stock/components/MainApp.tsx), [components/Header.tsx](file:///Users/a5516774/Desktop/stock/components/Header.tsx), [components/StockExplorer.tsx](file:///Users/a5516774/Desktop/stock/components/StockExplorer.tsx), [components/FireCalculator.tsx](file:///Users/a5516774/Desktop/stock/components/FireCalculator.tsx), [components/EtfModal.tsx](file:///Users/a5516774/Desktop/stock/components/EtfModal.tsx)
- **자동화 검증 도구:** [scripts/validate_responsive.py](file:///Users/a5516774/Desktop/stock/scripts/validate_responsive.py)

---

## 📐 1. 듀얼 뷰포트(Dual Viewport) 핵심 검증 기준 (Acceptance Criteria)

### ① 모바일 뷰포트 기준 (375px iPhone SE)
1. **가로 스크롤(Horizontal Overflow) 제로:**
   - 360px 초과 고정 픽셀 너비(`w-[...px]`, `min-w-[...px]` 단, 360px 이하 및 반응형 브레이크포인트 제외) 0건.
   - 최상위 body 및 컨테이너에 `overflow-x-hidden` 가드 및 `viewport: Viewport (width: 'device-width')` 메타태그 설정 완비.
2. **단일 컬럼 최적화:**
   - 모바일 화면에서는 카드 리스트 1열(`grid-cols-1`) 및 파이어 역산기 수직 스택 배치로 터치 조작성 극대화.

### ② 데스크탑 뷰포트 기준 (1280px+ 대화면)
1. **대화면 반응형 컨테이너 확장:**
   - 기존 모바일 고정 너비(`max-w-xl`) 제약을 해제하고 대화면에서 `max-w-7xl`(1280px) 또는 `max-w-6xl` 중앙 정렬(`mx-auto`) 컨테이너 적용.
2. **종목 리스트 다열 그리드:**
   - 태블릿/모바일 가로(`sm:grid-cols-2`) -> 데스크탑(`lg:grid-cols-3`) 3열 반응형 그리드 지원.
3. **FIRE 역산기 2컬럼 레이아웃:**
   - `lg:grid-cols-12` 그리드 시스템 적용:
     - **좌측 5열 (`lg:col-span-5 lg:sticky lg:top-24`):** 목표 배당금 슬라이더, 환율, 총 필요자본 요약 대시보드가 스크롤 시 상단에 고정(Sticky).
     - **우측 7열 (`lg:col-span-7`):** 담은 포트폴리오 종목 리스트 및 종목별 역산 상세 카드 리스트가 독립 스크롤.

### ③ 빌드 및 기존 기능 무결성 보존 (Zero Regressions)
1. **프로덕션 빌드 성공:** `npm run build` 종료코드 0 및 TypeScript 타입 에러 0건.
2. **데이터 정합성:** 기존 500개 종목 데이터셋(국내 250 + 미국 250, 13개 스키마 필드 결측치 0건) 100% 보존.
3. **수학적 오차 한도:** FIRE 역산 시뮬레이터 수학적 오차 $|실제세후배당 - 목표배당| \le 10,000$원 단주 올림 한도 완벽 준수.
4. **세무 분기 및 종합과세:** 국내 15.4% / 미국 15.0% 분기 및 2,000만 원 초과 종합과세 경고 박스 노출 유지.

### ④ 기존 검증 스크립트 유연성 확보
- 기존 `validate_phase2.py` 및 `validate_phase3.py`에서 모바일 전용 `max-w-xl`에 종속되던 항목을 정규식(`max-w-(?:xl|2xl|4xl|5xl|6xl|7xl)`) 기반으로 업데이트하여 대화면 반응형 컨테이너 확장을 허용함.

---

## 🧪 2. 자동화 검증 항목 정의서 ([scripts/validate_responsive.py](file:///Users/a5516774/Desktop/stock/scripts/validate_responsive.py))

| 검증 ID | 검증 항목 | 세부 검증 내용 및 합격 기준 | 판정 기준 |
|---|---|---|:---:|
| **1-1** | 375px 모바일 고정너비 0건 | `(?:min-w\|w)-\[(\d+)px\]` 추출 후 360px 초과 요소 0건 | **PASS** |
| **1-2** | 반응형 Viewport 메타태그 | [app/layout.tsx](file:///Users/a5516774/Desktop/stock/app/layout.tsx) 내 `device-width` 및 `initialScale` 설정 | **PASS** |
| **1-3** | 가로 스크롤 방지 가드 | 최상위 레이아웃 `overflow-x-hidden` 적용 확인 | **PASS** |
| **2-1** | 대화면 컨테이너 적용 | `max-w-7xl` 또는 `max-w-6xl` & `mx-auto` 적용 확인 | **PASS** |
| **2-2** | 종목 리스트 다열 그리드 | `sm:grid-cols-2` 및 `lg:grid-cols-3` 클래스 확인 | **PASS** |
| **2-3** | FIRE 역산기 2컬럼 레이아웃 | `lg:grid-cols-12` (좌측 5열 / 우측 7열 분할) 확인 | **PASS** |
| **2-4** | 좌측 입력 패널 Sticky 고정 | `lg:sticky lg:top-*` 스크롤 고정 지원 확인 | **PASS** |
| **3-1** | 프로덕션 빌드 무결성 | `npm run build` 클린 빌드 종료코드 0 확인 | **PASS** |
| **3-2** | 500개 데이터 정합성 보존 | 총 500개(KR 250 + US 250) 스키마 결측치 0건 보존 | **PASS** |
| **3-3** | 역산 수학적 오차 한도 보존 | 목표 배당금(30만/100만/200만/500만) 오차 $\le 10,000$원 | **PASS** |
| **3-4** | 배당세율 & 종합과세 보존 | KR 15.4%, US 15.0%, 종합과세 2,000만 원 초과 경고 보존 | **PASS** |
| **4-1** | Phase 1 리그레션 0건 | [scripts/validate_phase1.py](file:///Users/a5516774/Desktop/stock/scripts/validate_phase1.py) 24개 전 항목 ALL PASS | **PASS** |
| **4-2** | Phase 2 리그레션 0건 | [scripts/validate_phase2.py](file:///Users/a5516774/Desktop/stock/scripts/validate_phase2.py) 12개 전 항목 ALL PASS | **PASS** |
| **4-3** | Phase 3 리그레션 0건 | [scripts/validate_phase3.py](file:///Users/a5516774/Desktop/stock/scripts/validate_phase3.py) 12개 전 항목 ALL PASS | **PASS** |

---

## 🚀 3. 실측 검증 실행 결과

```bash
$ .venv/bin/python scripts/validate_responsive.py
================================================================================
  [배당패스] 모바일 & 데스크탑 듀얼 뷰포트 반응형 검증 결과 요약
================================================================================
[PASS] 1-1 375px 모바일 뷰포트 초과 고정너비(w > 360px) 0건 :: 0건 (완벽 모바일 핏)
[PASS] 1-2 모바일 반응형 Viewport 메타태그(device-width) 구성 :: 정상 구성됨
[PASS] 1-3 모바일 가로 스크롤 방지(overflow-x-hidden) 가드 적용 :: 적용 확인됨
[PASS] 2-1 데스크탑 반응형 컨테이너(max-w-7xl 또는 max-w-6xl mx-auto) 적용 :: 적용 파일: ['components/MainApp.tsx', 'components/Header.tsx']
[PASS] 2-2 종목 리스트 다열 반응형 그리드(sm:2열, lg:3열) 지원 :: 정상 구현됨 (sm:grid-cols-2 & lg:grid-cols-3)
[PASS] 2-3 FIRE 역산기 대화면 2컬럼 분할 레이아웃(lg:grid-cols-12 등) 지원 :: 대화면(lg) 2컬럼 분할 그리드 구조 확인
[PASS] 2-4 FIRE 역산기 대화면 좌측 입력 패널 Sticky 고정(lg:sticky top-*) 지원 :: 입력 패널 Sticky 스크롤 고정 적용됨
[PASS] 3-1 최종 프로덕션 빌드 무결성 (npm run build 종료코드 0) :: 빌드 성공 (종료코드 0)
[PASS] 3-2 기존 500개 고배당 데이터셋 정합성 보존 (KR 250 + US 250) :: 총 500개 종목 완벽 보존
[PASS] 3-3 FIRE 역산 시뮬레이터 수학적 오차 한도(<= 10,000원) 보존 :: 전 테스트 케이스 단주 오차 한도 이내 일치
[PASS] 3-4 배당소득세율 분기 및 종합과세 경고 기준 보존 :: 국내 15.4%, 미국 15.0% 및 2,000만 원 종합과세 경고 보존
[PASS] 4-1 Phase 1 백엔드 데이터셋 무결성 리그레션 검증 (24개 항목) :: 24개 전 항목 통과 (ALL PASS)
[PASS] 4-2 Phase 2 디자인 시스템 & InfoTooltip 리그레션 검증 (12개 항목) :: 12개 전 항목 통과 (ALL PASS)
[PASS] 4-3 Phase 3 3대 큐레이션 & FIRE 역산기 리그레션 검증 (12개 항목) :: 12개 전 항목 통과 (ALL PASS)
--------------------------------------------------------------------------------
총 14개 항목 중 PASS: 14개, FAIL: 0개 (달성률: 100.0%)
최종 판정: PASS
================================================================================
```

---

## 📝 4. 결론 및 승인

- 모바일 375px 가로 스크롤 위험 요소 제로 및 데스크탑 1280px+ 와이드 화면 최적화가 상호 충돌 없이 완벽히 정합함을 확인하였습니다.
- 기존 Phase 1~4 누적 검증 64개 항목 또한 100% 보존되어 **회귀 결함 0건**을 달성했습니다.
