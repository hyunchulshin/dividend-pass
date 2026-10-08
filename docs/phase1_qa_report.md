# Phase 1 QA 검수 리포트 — 500개 종목 데이터셋 & 파이프라인

- **검수 대상:** [dividend_stocks_500.json](file:///Users/a5516774/Desktop/stock/public/data/dividend_stocks_500.json), [collector.py](file:///Users/a5516774/Desktop/stock/scripts/collector.py)
- **기준 문서:** [project_execution_plan.md](file:///Users/a5516774/Desktop/stock/docs/project_execution_plan.md#L48-L64) (Phase 1 달성 기준)
- **검증 도구:** [validate_phase1.py](file:///Users/a5516774/Desktop/stock/scripts/validate_phase1.py) (21개 자동 검사, 재사용 가능) + 코드 리뷰 + collector 재실행 1회(별도 경로로 출력, 제출 파일은 덮어쓰지 않음)
- **검수일:** 2026-10-08

## 최종 판정: ❌ FAIL (조건부 재제출)

데이터 수량과 표면 스키마는 모두 PASS입니다. 하지만 **안전 필터와 인기 점수가 실제 데이터가 아니라 하드코딩된 보정값 때문에 통과**하고 있습니다. 기준을 형식적으로만 맞춘 상태라 Phase 2로 넘어가면 안 됩니다.

| # | 달성 기준 | 판정 | 비고 |
|---|---|---|---|
| 1 | 총 500개 (KR 150+100 / US 150+100) | ✅ PASS | 중복 0건. 단, ETF/주식 구분 필드 없음 (D-6) |
| 2 | 13개 필드 결측 0건 | ⚠️ 조건부 PASS | null/NaN은 0건. **SPLG는 price·volume·dps가 0이고 name="SPLG"** → 실질 결측 (D-4) |
| 3a | 시총 하한 미달 0건 | ❌ FAIL | 출력값은 0건. 하지만 **미국 ETF 20개는 시총이 1.5B로 덮어써짐** → 필터 우회 (D-1) |
| 3b | 배당률 20% 초과 → `isHighRisk` | ✅ PASS | 32건 모두 true, 오탐 0건 |
| 4 | 인기 점수 1~10위에 대표 월배당 ETF | ❌ FAIL | 겉으로는 PASS. 하지만 **티커별 가산점(+36~47) 덕분**이며, 순수 공식으로 계산하면 대표 ETF 0개 (D-2) |
| 5 | 실행 시간 3분 이내 | ✅ PASS | 재실행 49.1초 |
| 엣지 | 신규 ETF 수용 / TTM 왜곡 | ❌ FAIL | 미국 ETF는 고정 리스트, TTM 보정 로직 없음 (D-7, D-8) |

---

## 1. 결함 목록

### 🔴 Critical (재제출 전 반드시 수정)

**D-1. 시총 필터 우회 — 미달 종목을 탈락시키지 않고 시총 값을 위조함**
- [collector.py L392-393](file:///Users/a5516774/Desktop/stock/scripts/collector.py#L392-L393): `if mcap < 500_000_000: mcap = 1_500_000_000`
- [collector.py L508-509](file:///Users/a5516774/Desktop/stock/scripts/collector.py#L508-L509): 미국 주식도 같은 방식으로 `1_000_000_000` 대입
- **실제 영향 20건 (모두 시총 정확히 1.5B):** CONY, XDTE, YMAG, AIPI, LQDW, FBY, AMZY, YMAX, GOOY, HYGW, KLIP, MSFO, APLY, KBWY, MAXI, SRET, RIET, REM, MORT, SPLG
- 이 중 상당수는 고위험(배당률 30~117%) YieldMax 계열입니다. 기획서의 "부실 종목 차단" 목적에 정면으로 어긋납니다. 위조된 시총은 인기 점수의 AUM 60% 항목에도 그대로 반영됩니다.

**D-2. 인기 점수 랭킹 조작 — 기획서 공식 `(AUM 60% + 거래대금 40%)` 위반**
- [collector.py L605-615](file:///Users/a5516774/Desktop/stock/scripts/collector.py#L605-L615) `TARGET_TOP_ETFS`: SCHD +47, JEPI·TIGER +46, SOL +45 같은 고정 가산점. 순수 공식 점수 범위는 0~55입니다.
- [L632-633](file:///Users/a5516774/Desktop/stock/scripts/collector.py#L632-L633): 그 외 월배당 종목에도 일괄 +15
- **검증 (5-4):** 가산점을 빼고 공식만 적용하면 상위 10위는 삼성전자, SK하이닉스, AAPL, MSFT, TSM, 삼성전기, SPY, VOO, 삼성전자우, LLY이고 대표 월배당 ETF는 0개입니다. 지금의 기준 충족은 결과값을 직접 박아 넣은 것입니다.
- 참고: 거래대금 값으로 시장 비교 없이 시장별 순위를 쓴 점은 합리적이라고 봅니다.

**D-3. 배당률 하드코딩 fallback — 실측 데이터가 아닌 추정값을 실데이터처럼 출력**
- 국내 ETF: [L179-187](file:///Users/a5516774/Desktop/stock/scripts/collector.py#L179-L187) 이름에 키워드가 있으면 8.5 / 3.8 / 1.6 / 1.2% 대입
- 미국 ETF: [L373-383](file:///Users/a5516774/Desktop/stock/scripts/collector.py#L373-L383) 8.5 / 50.0 / 3.5 / 4.2 / 2.0%. 국내 주식 2.1%, 미국 주식 2.5%도 같은 방식
- 미국 ETF 예외 처리: [L411-428](file:///Users/a5516774/Desktop/stock/scripts/collector.py#L411-L428)에서 수집이 실패하면 가짜 레코드(price 50, AUM 2B)를 생성. 이번 데이터에는 0건이지만 언제든 발생할 수 있는 구조입니다.
- **fallback으로 의심되는 12건:** AGG·BND(4.2), SK텔레콤(2.1), KODEX 레버리지·코스닥150레버리지·ACE KRX금현물·TIGER MSCI Korea TR·SOL AI반도체TOP2플러스(1.2), KODEX 200TR(1.6), **RISE 대형고배당10TR(8.5)**, COWZ·SPLG(2.0)
- 분배를 하지 않는 TR(재투자형)·레버리지·금현물 ETF에 1.2~8.5%의 배당률이 붙어 있습니다. 사용자에게 잘못된 정보가 노출됩니다.
- AGG·BND는 이 추정값과 월배당 +15 가산점을 받아 **인기 8·9위**에 올라 있습니다.

### 🟠 Major

**D-4. SPLG 실질 결측:** name="SPLG", price=0, volume=0, dps=0이고 시총 1.5B는 위조값입니다. 수집에 실패했는데 정상 레코드처럼 통과했습니다. 원인은 결측 검사가 None/NaN만 확인하고 0이나 빈 값은 잡지 않는 것입니다. 미국 주식 RTX와 GSK도 name이 티커 그대로라 영문/한글명 조회가 실패한 것으로 보입니다.

**D-5. 비결정적 종목 선정 (재현성 결함)**
- `US_ETF_TICKER_LIST`는 **114개**인데 `as_completed` 완료 순서대로 앞의 100개만 남깁니다 ([L430-449](file:///Users/a5516774/Desktop/stock/scripts/collector.py#L430-L449)). 그래서 실행할 때마다 탈락하는 14개가 달라집니다.
- **재실행 결과:** ANGL·MUB가 빠지고 IWF·USHY가 들어옴 (4건 차이)
- 국내 주식([L296-304](file:///Users/a5516774/Desktop/stock/scripts/collector.py#L296-L304))도 같은 구조입니다. 이번에는 차이가 없었지만 네트워크 지연에 따라 달라질 수 있습니다. 목표가 "시총 상위 배당주"라면 정렬한 뒤 자르는 방식이어야 합니다.

**D-6. 출력 JSON에 ETF/주식 구분 필드 없음:** [L648](file:///Users/a5516774/Desktop/stock/scripts/collector.py#L648)에서 `isEtf`를 지웁니다. 프론트(Phase 3 탐색 탭, ETF 모달)에서 유형별 필터가 불가능하고, QA도 수수료·구성종목 유무로 추정해야 했습니다. `assetType: "STOCK" | "ETF"`로 남겨야 합니다.

### 🟡 Minor
- **m-1.** 기획서는 `yfinance`와 네이버 모바일 API를 쓰라고 했지만 구현은 네이버만 사용합니다. 의존성 파일(requirements.txt)도 없어서 시스템 Python으로 실행하면 `ModuleNotFoundError: requests`가 납니다. `.venv`에서만 동작합니다.
- **m-2.** 국내 주식 후보를 KOSPI 상위 300개에서만 뽑습니다. KOSDAQ 배당주는 빠집니다.
- **m-3.** 상위 ETF의 topHoldings가 실제와 다른 기본값입니다. 예: KODEX 200타겟위클리커버드콜, 미국 ETF 다수에 Broadcom/JPM/XOM이 들어 있음. 실제 데이터가 아니면 비워두거나 "정보 없음" 플래그를 다는 쪽을 권고합니다.
- **m-4.** 배당 주기를 이름 키워드로 판정합니다. 예: '배당'이 들어가면 분기. 국내 주식은 분기배당 14개 외에 모두 연배당으로 처리되어 오분류 가능성이 있습니다.
- **m-5.** PM 요청서에는 "13개 필수 필드"로 되어 있고 기획서 L57에는 11개(`expenseRatio`, `topHoldings` 제외)로 되어 있습니다. QA는 13개 기준으로 검증했고 모두 존재합니다. **기획서 수정을 요청합니다.**

---

## 2. [엣지 케이스] 신규 상장 ETF 수용 구조 분석

### 2-1. 신규 ETF를 자동으로 찾아내는가?
| 구간 | 구조 | 판정 |
|---|---|---|
| 국내 ETF | 네이버 `etfItemList` 전체 목록 → 시총 1,000억 이상 필터 → 키워드 점수로 정렬 ([L125-152](file:///Users/a5516774/Desktop/stock/scripts/collector.py#L125-L152)) | ✅ 자동 탐색. 실제로 2025년 이후 상장 코드(`0xxxx0`) 20개가 포함됨 |
| 미국 ETF | **고정 리스트 `US_ETF_TICKER_LIST` 114개** ([L316-335](file:///Users/a5516774/Desktop/stock/scripts/collector.py#L316-L335)) | ❌ 코드를 고치지 않으면 신규 ETF 진입 불가 |
| 국내 ETF 우선순위 | `PRIORITY_KR_ETF_CODES`에 고정 +1000점 | ⚠️ 신규 대형 ETF가 기존 고정 종목에 밀릴 수 있음 |

### 2-2. TTM이 부족한 신규 ETF의 배당률 왜곡 — **실제로 발생 중**
상장일이나 분배 이력 개수를 확인하는 로직이 전혀 없습니다. 네이버 `dividendYieldTtm` 값을 그대로 쓰고, 값이 없으면 키워드 추정값을 넣습니다.

| 종목 | 출력 배당률 | 문제 |
|---|---|---|
| 0190G0 KODEX 반도체타겟위클리커버드콜 | 3.65% | 목표 분배율이 연 15% 안팎인 상품. 분배 몇 회분 합계 ÷ 현재가로 계산되어 **과소 표시** |
| 0219E0 KODEX 200커버드콜액티브 | 6.01% | 같은 유형, 과소 표시 의심 |
| 0167A0 SOL AI반도체TOP2플러스 | 1.2% | 분배 이력이 없는데 **fallback 1.2%를 위조** |
| 0162Z0 RISE 삼성전자SK하이닉스채권혼합50 | 0.27% | 과소 표시 |

**위험은 두 방향입니다.**
1. **과소 표시:** 분배 횟수가 12개월치보다 적어서 고배당 상품이 저배당처럼 보이고 랭킹에서 밀립니다.
2. **과대 표시와 고위험 누락:** 만약 소스 API가 연환산(최근 분배 × 12)을 쓴다면 첫 분배가 특별 분배일 때 20%를 넘거나 넘지 않는 판정이 흔들립니다. 현재 코드는 이 값이 TTM 합계인지 연환산인지 구분하지 않습니다.

### 2-3. 개선안
```python
# 1) 상장일/분배 이력 기반 분기
listing_date = fetch_listing_date(code)           # 네이버 integration 또는 KRX 상장일
dists = fetch_distributions(code, months=12)       # [(지급일, 금액), ...]
age_m = months_since(listing_date)

if age_m >= 12 and len(dists) >= expected_count(cycle):
    yield_basis, ttm = 'TTM', sum(a for _, a in dists)
elif len(dists) >= 3:                              # 최소 3회 분배 확보 시 연환산
    ttm = sum(a for _, a in dists) / len(dists) * periods_per_year(cycle)
    yield_basis = 'ANNUALIZED'
else:
    ttm, yield_basis = None, 'INSUFFICIENT'        # 추정값 대입 금지

# 2) 출력 스키마 확장
item.update({
  'listingDate': '2025-06-10',
  'yieldBasis': yield_basis,       # TTM | ANNUALIZED | INSUFFICIENT
  'isNewListing': age_m < 12,      # UI 'NEW · 배당 이력 부족' 뱃지 + 툴팁
  'distributionCount': len(dists),
})
```
- **`isHighRisk` 판정:** ANNUALIZED는 연환산 값으로 판정하되, 첫 회 분배는 계산에서 빼 특별 분배 영향을 막습니다. INSUFFICIENT는 배당률 기준 랭킹·필터에서 제외하고 "배당 이력 부족"으로 표시합니다.
- **미국 ETF 자동 탐색:** 고정 리스트를 "시드"로만 두고, 네이버 해외 `exchange/{NYSE,NASDAQ,AMEX}/marketValue`에서 `stockEndType=='etf'` 종목을 받아 AUM ≥ $500M이고 배당률 > 0인 종목을 자동 편입합니다. 이후 결정적 정렬(AUM 내림차순)로 100개를 자릅니다.
- **스냅샷 비교:** 이전 JSON과 비교해 신규 편입·탈락 종목을 로그로 남겨, 다음 검수 때 변동 내역을 볼 수 있게 합니다.

---

## 3. 재제출 조건 (stock_dev 할 일)
1. **D-1:** 시총 미달이거나 시총을 못 받은 종목은 **값을 보정하지 말고 제외**합니다. 빈 자리는 다음 순위 후보로 채웁니다.
2. **D-2:** `TARGET_TOP_ETFS`와 월배당 +15 가산점을 삭제하고 순수 공식으로 점수를 냅니다. 그 결과 대표 월배당 ETF가 10위 밖이라면 **기준 자체를 PM과 다시 협의**합니다. 예: 시장별·ETF 전용 랭킹, 배당 ETF 범위 안에서의 랭킹.
3. **D-3·D-4:** 하드코딩 배당률과 가짜 레코드 생성을 없앱니다. 수집 실패나 분배 없음은 제외하거나 `yieldBasis: INSUFFICIENT`로 표시합니다. 결측 검사 범위를 0, 빈 문자열, name==ticker까지 넓힙니다.
4. **D-5:** 완료 순서가 아니라 정렬 기준(시총 등)으로 결정적으로 선정합니다.
5. **D-6:** `assetType` 필드를 다시 넣습니다.
6. **엣지:** 2-3 개선안(`listingDate`, `yieldBasis`, `isNewListing`, 미국 ETF 자동 탐색)을 반영합니다.
7. `requirements.txt`를 추가하고, 재제출 시 `python scripts/validate_phase1.py` 실행 결과(exit 0)를 첨부합니다.
