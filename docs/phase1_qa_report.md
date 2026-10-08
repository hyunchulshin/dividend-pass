# Phase 1 QA 3차 최종 검수 리포트

- **검수 대상:** [dividend_stocks_500.json](file:///Users/a5516774/Desktop/stock/public/data/dividend_stocks_500.json), [collector.py](file:///Users/a5516774/Desktop/stock/scripts/collector.py), [validate_phase1.py](file:///Users/a5516774/Desktop/stock/scripts/validate_phase1.py)
- **검수일:** 2026-10-08 (3차 최종)
- **검증 환경:** Python 3.11 (.venv), 자동 검증 스크립트 전수 실행(24개 항목), 수집 파이프라인 실측 벤치마크, 2회 연속 실행 간 무결성/재현성 교차 분석
- **기준 문서:** [project_execution_plan.md](file:///Users/a5516774/Desktop/stock/docs/project_execution_plan.md#L48-L64) (Phase 1 달성 기준) 및 PM 2차 보완 지시서

---

## 🎯 최종 판정: ✅ ALL PASS (Phase 1 개발 완료 승인)

stock_dev가 1차 및 2차 검수에서 지적된 7대 결함 및 데이터 변조·더미 복붙·종목 풀 역선택 문제를 전면 폐기하고, 실측 API 기반 데이터 복원 및 투명한 메타데이터 설계를 완료했습니다. `scripts/validate_phase1.py`의 24개 검증 항목 전수 합격(24/24 PASS)과 파이프라인 재현성(100% 일치), 성능(61.89초)을 확인하였으므로 **Phase 1 최종 합격(PASS)**을 선언하며 Phase 2 진입을 승인합니다.

---

## 1. 종합 달성 기준 검증 요약 (1차 ~ 3차 추적)

| 검수 항목 | 1차 판정 | 2차 판정 | 3차 최종 판정 | 상세 검증 결과 |
|---|:---:|:---:|:---:|---|
| **1. 데이터 볼륨 및 균형** | ⚠️ 조건부 | ✅ PASS | **✅ PASS** | 총 500개 (국내 주식 150 + 국내 ETF 100 / 미국 주식 150 + 미국 ETF 100), 티커 중복 0건 |
| **2. 스키마 무결성 (결측치 0건)** | ⚠️ 조건부 | ✅ PASS | **✅ PASS** | 필수 13개 필드 + 확장 5개 필드(`assetType`, `isEtf`, `topHoldingsAvailable`, `isNewListing`, `yieldBasis`) 결측 0건 |
| **3. 안전 필터링 작동** | ❌ FAIL | ✅ PASS | **✅ PASS** | 시총 하한(KR 1,000억, US $500M) 미달 0건, 인위적 시총 보정 0건, 배당률 > 20% 6건 예외 없이 `isHighRisk: true` 부착 (오탐 0건) |
| **4. 데이터 진정성 및 복원** | ❌ FAIL | ❌ FAIL | **✅ PASS** | +0.04 변조 및 fallback 의심값 완전 제거, SPY/VOO/AAPL/MSFT/O/MAIN 등 대표 우량주 100% 복원, 더미 topHoldings 복붙 전면 제거 |
| **5. 인기 점수 및 월배당 큐레이션** | ❌ FAIL | ❌ FAIL | **✅ PASS** | 순수 공식 (AUM 60% + 일평균 거래대금 40%) 100% 적용, 월배당 ETF 풀(31개) 상위 15위 내 TIGER(#2), JEPI(#12), SOL(#15) 자연 안착 |
| **6. 신규 ETF 엣지 케이스** | ❌ FAIL | ❌ FAIL | **✅ PASS** | `isNewListing`, `yieldBasis` 스키마 확장 반영 완료, 정합성 검증 완료 |
| **7. 실행 성능 및 재현성** | ✅ PASS | ✅ PASS | **✅ PASS** | 수집 파이프라인 실행 시간 **61.89초** (기준: 3분 이내), 2회 연속 실행 간 티커 집합 일치율 **100% (0건 차이)** |

---

## 2. 2차 결함(N-1 ~ N-3) 조치 및 개선 상세

### ① [N-1 해소] 데이터 변조 및 +0.04 트릭 전면 삭제
- **조치 내용:** `SUSPECT_YIELDS` 목록 및 `+0.04`를 임의 가산하던 `sanitize_yield()` 함수를 완전히 삭제했습니다.
- **검증 결과:** 네이버 증권 모바일 API 실측 DPS 및 배당수익률을 직접 반영하였으며, 검증 스크립트 4-3, 4-4 검사에서 변조 의심 패턴 **0건**을 확인했습니다.

### ② [N-2 해소] 대표 우량주 전면 복원 및 순수 랭킹 체계 확립
- **조치 내용:** 대표 ETF(SOL, JEPI)의 특정 수치(`sol_cap`, `jepi_cap`)에 종목 풀을 억지로 맞추던 역선택 로직을 폐기하고, 국내외 대표 우량주 및 배당주를 정상 복원했습니다.
- **복원 확인 종목:**
  - **미국 주식:** `AAPL` (애플), `MSFT` (마이크로소프트), `JPM` (JP모건), `O` (리얼티인컴), `MAIN` (메인스트리트), `KO` (코카콜라), `JNJ` (존슨앤존슨) 등
  - **미국 ETF:** `SPY` (S&P 500), `VOO` (뱅가드 S&P 500), `QQQ` (나스닥 100), `DIA` (다우존스), `SCHD`, `JEPI`, `JEPQ` 등
  - **국내 주식/ETF:** `005930` (삼성전자), `000660` (SK하이닉스), `088980` (맥쿼리인프라), `069500` (KODEX 200), `458730` (TIGER 미국배당다우존스), `446720` (SOL 미국배당다우존스) 등
- **전체 인기 순위 (TOP 5):**
  1. `005930` 삼성전자 (인기점수 100.0)
  2. `000660` SK하이닉스 (인기점수 99.9)
  3. `AAPL` 애플 (인기점수 99.8)
  4. `MSFT` 마이크로소프트 (인기점수 99.4)
  5. `SPY` State Street SPDR S&P 500 ETF Trust (인기점수 98.9)
  → 시가총액과 거래대금이 가장 큰 시장 대표 우량주들이 상위권을 자연스럽게 형성하여 데이터의 현실 시장 정합성이 확보되었습니다.

### ③ [N-3 해소] topHoldings 더미 일괄 복붙 전면 제거 및 정보 투명성 확보
- **조치 내용:** 확인되지 않은 180개 ETF에 브로드컴·홈디포 등을 일괄 기재하던 기만적 더미 데이터를 전면 삭제했습니다.
- **구조 개선:**
  - 실제 검증된 20개 대표 ETF: 실제 구성종목 기재 + `topHoldingsAvailable: true`
  - 세부 구성종목 미연동 ETF(180개) 및 일반 주식(300개): `topHoldings: []` + `topHoldingsAvailable: false`
- **검증 결과:** 더미 복붙 0건(4-5 PASS), 정보 부재 상태를 숨기지 않고 플래그로 명확히 공시하여 Phase 3 프론트엔드 모달에서 안내 문구 렌더링이 가능해졌습니다.

---

## 3. 핵심 기능: 인기 월배당 ETF TOP 15 큐레이션 정합성 검증

기획서 핵심 기능인 **'인기 월배당 ETF 큐레이션'**(`assetType == "ETF" & dividendCycle == "MONTHLY"`, 총 31개 종목) 풀에 대한 순수 공식 순위 산출 결과입니다.

| 순위 | 티커 | 종목명 | 시장 | 배당수익률 | 순수 인기점수 | 대표 ETF 여부 |
|:---:|:---:|---|:---:|:---:|:---:|:---:|
| 1 | `498400` | KODEX 200타겟위클리커버드콜 | KR | 15.41% | 86.4 | 월배당 커버드콜 |
| **2** | **`458730`** | **TIGER 미국배당다우존스** | **KR** | **3.11%** | **78.3** | **시장 대표 월배당 ETF** |
| 3 | `472150` | TIGER 배당커버드콜액티브 | KR | 22.86% | 76.9 | 월배당 고배당 (HighRisk) |
| 4 | `486290` | TIGER 미국나스닥100타겟데일리커버드콜 | KR | 15.49% | 67.6 | 월배당 커버드콜 |
| 5 | `DIA` | SPDR Dow Jones Industrial Average ETF | US | 1.40% | 60.1 | 미국 대표 월배당 지수 |
| 6 | `441640` | KODEX 미국배당커버드콜액티브 | KR | 9.72% | 56.2 | 월배당 커버드콜 |
| 7 | `0219E0` | KODEX 200커버드콜액티브 | KR | 6.01% | 52.1 | 월배당 커버드콜 |
| 8 | `JEPQ` | JPMorgan Nasdaq Equity Premium Income ETF | US | 11.24% | 46.3 | 미국 대표 인컴 ETF |
| 9 | `498410` | KODEX 금융고배당TOP10타겟위클리커버드콜 | KR | 16.49% | 45.9 | 월배당 커버드콜 |
| 10 | `494300` | KODEX 미국나스닥100데일리커버드콜OTM | KR | 22.36% | 44.2 | 월배당 고배당 (HighRisk) |
| 11 | `0177R0` | TIGER 반도체TOP10커버드콜액티브 | KR | 7.75% | 42.7 | 월배당 커버드콜 |
| **12** | **`JEPI`** | **JPMorgan Equity Premium Income ETF** | **US** | **8.07%** | **42.3** | **시장 대표 월배당 ETF** |
| 13 | `490590` | RISE 미국AI밸류체인데일리고정커버드콜 | KR | 19.78% | 40.8 | 월배당 커버드콜 |
| 14 | `475720` | RISE 200위클리커버드콜 | KR | 20.47% | 39.4 | 월배당 커버드콜 (HighRisk) |
| **15** | **`446720`** | **SOL 미국배당다우존스** | **KR** | **3.19%** | **37.7** | **시장 대표 월배당 ETF** |

> **판정 결과:** 인위적인 티커별 가산점 없이도, 기획서가 요구한 시장 대표 월배당 ETF 3종(`TIGER 미국배당다우존스` 2위, `JEPI` 12위, `SOL 미국배당다우존스` 15위)이 월배당 ETF 큐레이션 상위권에 완벽하게 안착했습니다.

---

## 4. `validate_phase1.py` 24개 검증 항목 전수 실행 결과

```text
[PASS] 1-1 총 종목 수 = 500 :: 500개
[PASS] 1-2 티커 중복 0건 :: 0건
[PASS] 1-3 시장/유형 균형 (KR 150+100 / US 150+100) :: KR-ETF=100, KR-STOCK=150, US-ETF=100, US-STOCK=150
[PASS] 1-4 ETF/주식 구분 필드 존재 (isEtf/assetType) :: 정상 완비
[PASS] 2-1 13개 필수 필드 존재 :: 0건
[PASS] 2-2 null/NaN/undefined/빈문자열 0건 :: 0건
[PASS] 2-3 필드 타입 정합성 :: 0건
[PASS] 2-4 market/dividendCycle enum 정합성 :: 0건
[PASS] 2-5 price/volume/dps/yield 0 이하 0건 (실질 결측) :: 0건
[PASS] 2-6 ETF topHoldings 필수 제공 (정보 미제공 시 topHoldingsAvailable: false 명시) :: 0건
[PASS] 2-7 대표 월배당 ETF 3종 topHoldings 필수 완비 :: 누락 []
[PASS] 3-1 시총 하한 미달 0건 (KR 1,000억 / US $500M) :: 0건
[PASS] 3-2 배당률>20% -> isHighRisk=true (누락 0건) :: 누락 0건 (6건 부착)
[PASS] 3-3 배당률<=20% -> isHighRisk=false (오탐 0건) :: 오탐 0건
[PASS] 3-4 dpsTtm/price 와 dividendYield 일치 (오차 10%/0.5%p 이내) :: 0건
[PASS] 4-1 US ETF 예외 fallback(가짜 price=50/AUM=2B) 0건 :: 0건
[PASS] 4-2 US 시총 강제 보정값(1.5B/1.0B 정확히 일치) 0건 :: 0건
[PASS] 4-3 배당률 하드코딩 fallback 의심값 0건 :: 0건
[PASS] 4-4 배당률 +0.04 우회 변조 패턴 0건 :: 0건
[PASS] 4-5 ETF topHoldings 더미 일괄 복붙 0건 (동일 구성 10개 이상 금지) :: 0종류 적발
[PASS] 5-1 popularityScore 0~100 범위 :: 0건 (min=0.0, max=100.0)
[PASS] 5-2 인기 월배당 ETF 큐레이션 상위권 내 대표 ETF(TIGER, SOL, JEPI) 정상 배치 :: TOP 15 내 전원 포함
[PASS] 5-3 월배당 ETF 큐레이션 풀 수량 (최소 20개 이상 확보) :: 31개 확보
[PASS] 5-4 순수 공식 재현 시에도 월배당 ETF 상위권 내 대표 ETF 유지 (가산점 의존도 검사) :: 순수공식 TOP 15 내 전원 일치
---------------------------------------------------------------------------------------------------------
총 24개 항목 중 FAIL 0개 -> 최종 판정: PASS (100% 달성)
```

---

## 5. Phase 2 (프론트엔드 UI 셋업) 인계 및 권고사항

1. **데이터셋 활용 준비:**
   - 최종 생성된 [public/data/dividend_stocks_500.json](file:///Users/a5516774/Desktop/stock/public/data/dividend_stocks_500.json) 파일을 Next.js 클라이언트/서버 컴포넌트의 기본 데이터 소스로 즉시 연결 가능합니다.
2. **UI 렌더링 팁:**
   - **월배당 ETF 큐레이션 캐러셀:** `stocks.filter(s => s.assetType === 'ETF' && s.dividendCycle === 'MONTHLY')`로 필터링 후 `popularityScore` 기준 상위 10~15개를 노출하면 TIGER, JEPI, SOL 등이 자연스럽게 추천 리스트에 표출됩니다.
   - **ETF 상세 모달 topHoldings 처리:** `item.topHoldingsAvailable === true`인 경우 상위 5대 종목 칩(badge)을 렌더링하고, `false`인 경우 "상세 구성 종목 정보 준비 중" 안내 문구를 깔끔하게 렌더링하도록 구현해주세요.
   - **고위험 배당 뱃지:** `isHighRisk === true`인 종목(총 6개)에는 주황/빨강 경고 뱃지 및 "원금 손실 주의" 툴팁을 연결해주세요.
3. **배포 주기 권고:**
   - 수집 파이프라인의 총 실행 시간이 약 1분(61.89초)으로 매우 가벼우므로, 향후 GitHub Actions 크론(예: 매일 자정 1회)을 통한 자동 갱신 파이프라인으로 무리 없이 확장 가능합니다.
