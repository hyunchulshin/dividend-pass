# 🪙 배당패스 (Dividend Pass)

> **"매달 들어오는 배당금, 3초 만에 설계하세요"**  
> 국내·미국 500개 검증 고배당주/ETF 데이터 기반 **모던 미니멀 배당 큐레이션 & 파이어(FIRE) 역산 시뮬레이터**

[![Build & Validation](https://img.shields.io/badge/QA%20Validation-48%2F48%20ALL%20PASS-emerald?style=flat-square)](docs/project_execution_plan.md)
[![Daily Sync](https://img.shields.io/badge/Data%20Sync-Daily%2007:00%20KST-blue?style=flat-square)](.github/workflows/daily_sync.yml)
[![Next.js](https://img.shields.io/badge/Next.js-14.2%20(App%20Router)-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com)

---

## 📌 서비스 개요 (Overview)

**배당패스 (Dividend Pass)**는 은퇴 준비자와 정기 현금흐름 투자자를 위한 모던 핀테크 웹 서비스입니다.  
국내 250개 + 미국 250개 총 500개의 엄격히 검증된 고배당주/ETF 실측 데이터를 바탕으로, 원하는 월 배당금을 얻기 위해 **각 종목을 몇 주 사야 하고 얼마의 자본이 필요한지 수학적으로 역산**해 드립니다.

- **벤치마크 디자인**: `cheongyak-pass` 스타일의 모바일 퍼스트(`max-w-xl`, 640px) 인터페이스
- **순수 실측치 100%**: 데이터 조작, 인위적 fallback 없는 클린 데이터 파이프라인
- **서버 비용 0원**: GitHub Actions 크론 워크플로우를 통한 1일 1회 무인 자동 갱신 및 Vercel 서버리스 배포

---

## ⚡ 핵심 3대 인터랙티브 기능

### 1. 🔥 3대 큐레이션 탐색 탭 & 필터
- **🔥 인기 월배당 TOP 10**: 전체 ETF 중 월배당(MONTHLY) 종목만을 대상으로 인기 점수 상위 10개 큐레이션 (TIGER 미국배당다우존스, KODEX 커버드콜, JEPI 등)
- **💰 고배당 알짜 (6%+)**: 연 환산 배당수익률 6.0% 이상 종목 내림차순 정렬
- **🏛️ 대표 우량 배당 (시총순)**: 국내/미국 시가총액 최상위 대표 배당주 순차 정렬
- **시장 필터 & 실시간 검색**: `[전체]`, `[🇰🇷 한국]`, `[🇺🇸 미국]` 토글 및 티커/종목명 인스턴트 검색

### 2. 📊 ETF 상세 정보 모달 (EtfModal)
- 종목 카드 클릭 시 바텀시트/모달로 상세 재무 지표 표시
- 배당률(TTM), 주당 배당금(DPS), 주가, 인기점수, 시가총액, 일일 거래량
- **ETF 고유 정보**: 총 운용보수(`expenseRatio`) 및 상위 5대 편입비중(`topHoldings`) 프로그레스 게이지 시각화
- **포트폴리오 연동**: `[+ 파이어 시뮬레이터에 담기]` / `[제거하기]` 원클릭 상태 반영

### 3. 🎯 파이어(FIRE) 배당 역산 시뮬레이터 (FireCalculator)
- **목표 월 실수령액 입력**: 기본 100만 원 (슬라이더 30만 ~ 500만 원, 빠른 버튼 +10만/+50만/+100만/+300만)
- **수학적 정밀 역산**:
  - 환율 1,350원 기준 원화 환산
  - 국가별 배당소득세율 분기 적용: **국내 종목 15.4%**, **미국 종목 15.0%**
  - 단주 구매를 감안한 주 단위 절상(`Math.ceil`) 기반 필요 매수 주식 수 및 필요 원금 역산
  - 실제 세후 수령액 오차 $\le 10,000$원 이내 정합성 보장
- **금융소득종합과세 자동 경고**:
  - 연간 세전 배당소득이 **2,000만 원을 초과**할 경우 `⚠️ 금융소득종합과세 대상 안내` 경고 박스 및 타 소득 누진합산 주의문구 자동 노출

---

## 📐 핵심 계산 공식 및 산출 기준

### 1. 인기 점수 (Popularity Score)
특정 종목에 인위적 가산점 없이 순수 시장 지표로 0~100점 정규화:
$$\text{Popularity Score} = \left(\frac{N - \text{시총 순위}}{N} \times 0.6 + \frac{N - \text{거래대금 순위}}{N} \times 0.4\right) \xrightarrow{\text{정규화}} [0, 100]$$

### 2. TTM 배당수익률 (Trailing Twelve Months)
과거 12개월간 실제로 투자자에게 지급된 현금 분배금(DPS)의 합계를 현재 주가로 나눈 실측치:
$$\text{Dividend Yield (TTM)} = \frac{\text{최근 12개월 누적 DPS}}{\text{현재 주가}} \times 100\ (\%)$$

### 3. 안전 필터링 기준
- **국내 시장**: 시가총액 1,000억 원 미만 제외
- **미국 시장**: 시가총액 $500M(약 6,700억 원) 미만 제외
- **고위험 플래그 (`isHighRisk: true`)**: TTM 배당률이 20.0%를 초과하는 고레버리지/초고배당 상품에 자동 부착

---

## 🛠️ 기술 스택 (Tech Stack)

| 영역 | 사용 기술 |
|:---|:---|
| **Frontend** | Next.js 14.2 (App Router), React 18, TypeScript, Tailwind CSS, Lucide React |
| **Data Pipeline** | Python 3.11, Requests, ThreadPoolExecutor (비동기 병렬 수집) |
| **Automation** | GitHub Actions (Daily 07:00 KST Cron), Git Auto Commit |
| **Deployment** | Vercel Serverless Hosting |

---

## 📂 프로젝트 구조 (Project Structure)

```text
stock/
├── .github/workflows/
│   └── daily_sync.yml             # 1일 1회 무인 자동 갱신 워크플로우 (KST 07:00)
├── app/
│   ├── globals.css                # Tailwind 스타일 및 모바일 터치 최적화
│   ├── layout.tsx                 # 모바일 퍼스트 max-w-xl(640px) 래퍼 레이아웃
│   └── page.tsx                   # SSR 500개 종목 로드 및 메인 앱 마운트
├── components/
│   ├── Header.tsx                 # 모던 핀테크 헤더 & 안전필터 뱃지
│   ├── InfoTooltip.tsx            # 물음표(?) 모바일 터치 팝오버 / 데스크톱 호버
│   ├── StockCard.tsx              # 모던 라운드 카드 (배당률 강조, 인라인 담기)
│   ├── StockExplorer.tsx          # 3대 큐레이션 탭 및 시장/검색 필터
│   ├── EtfModal.tsx               # ETF/주식 상세 모달 (총보수, 편입종목 게이지)
│   ├── FireCalculator.tsx         # 파이어 배당 역산 시뮬레이터 & 종합과세 경고
│   └── MainApp.tsx                # 클라이언트 상태(포트폴리오, 탭) 오케스트레이션
├── docs/                          # Phase별 기획서 및 QA 검수 보고서
├── lib/
│   └── data.ts                    # public/data/dividend_stocks_500.json 파싱 유틸
├── public/
│   ├── data/
│   │   └── dividend_stocks_500.json  # 정제된 500개 고배당 종목 데이터셋
│   └── dividend_stocks_500.json      # 호환용 데이터셋 복제본
├── scripts/
│   ├── collector.py               # 500개 종목 데이터 수집·정제 파이프라인
│   ├── fetch_dividend_stocks.py   # GitHub Actions 연동 실행 래퍼
│   ├── validate_phase1.py         # Phase 1 데이터셋 무결성 검증 (24개 항목)
│   ├── validate_phase2.py         # Phase 2 디자인 시스템 검증 (12개 항목)
│   └── validate_phase3.py         # Phase 3 3대 기능 & 역산 정합성 검증 (12개 항목)
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── vercel.json                    # 프로덕션 배포 설정
└── README.md
```

---

## 🚀 로컬 실행 방법 (Getting Started)

### 1. 환경 설정
```bash
# 레포지토리 클론
git clone https://github.com/your-username/stock.git
cd stock

# Node 패키지 설치
npm install

# Python 가상환경 구성 (데이터 파이프라인 실행 시)
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 2. 데이터 수집 파이프라인 실행 (옵션)
```bash
# 500개 종목 최신 데이터 수집 및 JSON 갱신 (약 1분 소요)
python3 scripts/collector.py

# 전 단계 무결성 검증 스크립트 실행
python3 scripts/validate_phase1.py
```

### 3. 개발 서버 실행
```bash
npm run dev
# 브라우저에서 http://localhost:3000 접속
```

### 4. 프로덕션 빌드 & 테스트
```bash
npm run build
npm run start
```

---

## 🧪 QA 자동화 검증 스위트

본 프로젝트는 각 Phase별 엄격한 자동화 검증 스크립트를 내장하고 있습니다:

```bash
# Phase 1: 500개 데이터셋 무결성 검증 (24개 항목 ALL PASS)
python3 scripts/validate_phase1.py

# Phase 2: 디자인 시스템 & 뷰포트 반응형 검증 (12개 항목 ALL PASS)
python3 scripts/validate_phase2.py

# Phase 3: 3대 기능 및 파이어 역산 수학적 정합성 검증 (12개 항목 ALL PASS)
python3 scripts/validate_phase3.py
```

총 **48개 검증 항목 100% ALL PASS** 상태를 보장합니다.

---

## 📄 라이선스 및 유의사항 (Disclaimer)

- 본 서비스는 투자 참고용 정보를 제공하며, 특정 종목에 대한 투자 권유나 추천이 아닙니다.
- 과거 TTM 실측 배당률이 미래의 배당 수익률이나 주가 상승을 보장하지 않습니다.
- 투자에 따른 손익과 책임은 전적으로 투자자 본인에게 귀속됩니다.

© 2026 Dividend Pass. All rights reserved.
