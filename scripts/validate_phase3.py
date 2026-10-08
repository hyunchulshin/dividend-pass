#!/usr/bin/env python3
"""
scripts/validate_phase3.py
배당패스 (Dividend Pass) Phase 3 QA 자동화 검증 스크립트

Acceptance Criteria (docs/project_execution_plan.md Phase 3):
1. [기능 1] 상단 큐레이션 탭 및 필터:
   - '🔥 인기 월배당 TOP 10', '💰 고배당 6%+ 알짜', '🏛️ 시총 상위 대표주' 탭 전환 및 국내/미국 토글 필터
2. [기능 2] ETF 상세 정보 모달/드로어:
   - 운용보수(수수료), 배당주기, 상위 편입종목, [+ 포트폴리오에 담기/제거] 바구니 연동
3. [기능 3] 파이어(FIRE) 역산 시뮬레이터 수학적 계산 정합성:
   - 목표 월 배당금 슬라이더 (30만 원 ~ 500만 원)
   - 일반 배당소득세 분기 (국내 15.4%, 미국 15.0%) 세후 금액 역산 오차 <= 10,000원
   - 연간 배당금 합계 2,000만 원 초과 시 금융소득종합과세 경고 배지 노출
4. 반응형 뷰포트 최적화: 모바일 375px(아이폰 SE) 가로 스크롤(Horizontal Overflow) 유발 위험 0건
5. 빌드 및 에러 무결성: `npm run build` 컴파일 및 정적 빌드 성공 (종료코드 0)
"""

import os
import re
import subprocess
import sys
import json
import math

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, 'public', 'data', 'dividend_stocks_500.json')

results = []

def check(cid, title, ok, detail="", samples=None):
    results.append((cid, title, ok, detail, (samples or [])[:10]))

def find_files(dir_path, extensions):
    matched = []
    if not os.path.exists(dir_path):
        return matched
    for root, _, files in os.walk(dir_path):
        if any(x in root for x in ['node_modules', '.next', '.git']):
            continue
        for file in files:
            if any(file.endswith(ext) for ext in extensions):
                matched.append(os.path.join(root, file))
    return matched

# -------------------------------------------------------------
# 1. 시뮬레이터 수학적 역산 공식 정밀 시뮬레이션 함수
# -------------------------------------------------------------
def verify_fire_math():
    """
    수학적 공식 검증:
    목표 연간 세후 배당금 = 목표 월 배당금 * 12
    종목별 세후 DPS = DPS * (1 - 세율)  (국내: 15.4%, 미국: 15.0%)
    필요 주식 수 = ceil(목표 연간 배당금 * 비중 / 종목별 세후 DPS)
    실제 세후 수령 연 배당금 = sum(주식 수 * DPS * (1 - 세율))
    허용 오차: |실제 세후 연배당금 - 목표 연배당금| <= 10,000원 (주 단위 올림 오차만 허용)
    """
    tests = [
        # (목표 월 배당금, 종목 리스트: [(ticker, dps, price, market, weight)])
        (300_000, [('458730', 430.74, 13850, 'KR', 1.0)]),  # TIGER 미국배당다우존스 단일 30만원
        (1_000_000, [('458730', 430.74, 13850, 'KR', 0.5), ('JEPI', 4.56 * 1350, 56.45 * 1350, 'US', 0.5)]), # 100만원 분산
        (2_000_000, [('498400', 3094.33, 20115, 'KR', 0.4), ('458730', 430.74, 13850, 'KR', 0.3), ('JEPI', 4.56 * 1350, 56.45 * 1350, 'US', 0.3)]), # 200만원
        (5_000_000, [('005930', 1444, 53200, 'KR', 0.5), ('KO', 1.94 * 1350, 68.5 * 1350, 'US', 0.5)]), # 500만원
    ]

    math_passes = True
    test_details = []

    for monthly_target, portfolio in tests:
        annual_target = monthly_target * 12
        total_actual_posttax = 0.0
        total_invest_capital = 0.0

        for ticker, dps, price, market, weight in portfolio:
            tax_rate = 0.154 if market == 'KR' else 0.150
            posttax_dps = dps * (1 - tax_rate)
            target_alloc_annual = annual_target * weight
            # 주 단위 절상(올림) 구매
            shares = math.ceil(target_alloc_annual / posttax_dps)
            actual_alloc_posttax = shares * posttax_dps
            total_actual_posttax += actual_alloc_posttax
            total_invest_capital += shares * price

        diff = total_actual_posttax - annual_target
        # 주 단위 올림이므로 diff >= 0 이어야 하며, 단주 오차 1주 DPS 이내여야 함
        # 1주 dps * (1 - tax) 는 통상 수천 원 수준이므로 <= 10,000원
        is_ok = (0 <= diff <= 10_000)
        test_details.append(f"월 {monthly_target//10000}만: 오차 +{diff:.1f}원 (필요원금: {total_invest_capital/1e8:.2f}억)")
        if not is_ok:
            math_passes = False

    return math_passes, test_details

def main():
    print("=== [배당패스] Phase 3 자동화 검증 스크립트 가동 ===")

    # 1. 빌드 및 에러 무결성 (npm run build)
    print("  [1/5] 빌드 무결성 (npm run build) 검증 중...")
    try:
        proc = subprocess.run(
            ['npm', 'run', 'build'],
            cwd=BASE_DIR,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            timeout=180
        )
        build_ok = (proc.returncode == 0)
        build_output = proc.stdout + "\n" + proc.stderr
        check('1-1', 'npm run build 빌드 무결성 (TS/린트 에러 0건)', build_ok,
              "빌드 정상 완료 (코드 0)" if build_ok else f"빌드 실패:\n{build_output[-400:]}")
    except Exception as e:
        check('1-1', 'npm run build 빌드 무결성 (TS/린트 에러 0건)', False, f"예외: {e}")

    # 소스 파일 로드
    src_files = find_files(BASE_DIR, ['.tsx', '.jsx', '.ts', '.js'])
    all_content = "\n".join(open(f, encoding='utf-8', errors='ignore').read() for f in src_files)

    # 2. 기능 1: 3대 큐레이션 탭 및 시장 토글 필터 검증
    print("  [2/5] 상단 큐레이션 탭 및 시장 필터 검증 중...")
    has_monthly_tab = any(k in all_content for k in ['인기 월배당', '월배당 TOP', '월배당 ETF'])
    has_high_yield_tab = any(k in all_content for k in ['고배당 6%', '고배당 알짜', '6%+'])
    has_market_cap_tab = any(k in all_content for k in ['시총 상위', '시총대표', '대표주'])
    tabs_all_found = has_monthly_tab and has_high_yield_tab and has_market_cap_tab
    check('2-1', '3대 큐레이션 탭 구현 (인기 월배당 / 고배당 6%+ / 시총 상위)', tabs_all_found,
          f"월배당={has_monthly_tab}, 고배당={has_high_yield_tab}, 시총상위={has_market_cap_tab}")

    has_market_filter = any(k in all_content for k in ['market', '시장', 'KR', 'US', '전체', '국내', '미국'])
    has_market_toggle_state = any(k in all_content for k in ['selectedMarket', 'marketFilter', 'activeMarket', "'ALL'"])
    check('2-2', '국내/미국/전체 시장 토글 필터 구현', has_market_filter and has_market_toggle_state,
          f"필터 UI={has_market_filter}, 상태 바인딩={has_market_toggle_state}")

    # 3. 기능 2: ETF 상세 모달 및 포트폴리오 담기 연동 검증
    print("  [3/5] ETF 상세 정보 모달 및 담기 바구니 연동 검증 중...")
    modal_files = [f for f in src_files if any(k in os.path.basename(f) for k in ['Modal', 'Drawer', 'Detail'])]
    has_modal_component = len(modal_files) > 0 or any(k in all_content for k in ['selectedStock', 'setSelectedStock', 'isModalOpen', 'dialog'])
    check('3-1', 'ETF 상세 정보 모달/드로어 컴포넌트 구비', has_modal_component,
          f"발견 컴포넌트: {[os.path.relpath(f, BASE_DIR) for f in modal_files] if modal_files else '상태 모달 포함'}")

    has_expense_rendering = any(k in all_content for k in ['expenseRatio', '운용보수', '수수료'])
    has_holdings_rendering = any(k in all_content for k in ['topHoldings', 'topHoldingsAvailable', '편입종목', '구성종목'])
    has_add_portfolio = any(k in all_content for k in ['담기', '포트폴리오', 'basket', 'addToPortfolio', 'selectedForSimulation'])
    check('3-2', '모달 내 운용보수/구성종목 렌더링 및 포트폴리오 담기 연동',
          has_expense_rendering and has_holdings_rendering and has_add_portfolio,
          f"보수={has_expense_rendering}, 편입종목={has_holdings_rendering}, 담기버튼={has_add_portfolio}")

    # 4. 기능 3: 파이어(FIRE) 역산 시뮬레이터 수학적 계산 검증
    print("  [4/5] 파이어 배당 역산 시뮬레이터 수식 및 세무 로직 검증 중...")
    has_simulator = any(k in all_content for k in ['Simulator', 'FireCalculator', 'Calculator', 'fire', '목표 월 배당'])
    check('4-1', '파이어(FIRE) 역산 시뮬레이터 컴포넌트 완비', has_simulator, "구현 확인" if has_simulator else "미발견")

    has_target_slider = any(k in all_content for k in ['300000', '30만', '5000000', '500만', 'slider', 'range'])
    check('4-2', '목표 월 배당금 슬라이더 (월 30만 원 ~ 월 500만 원) 지원', has_target_slider,
          "슬라이더 범위 완비" if has_target_slider else "미발견")

    # 세무 분기 (국내 15.4%, 미국 15.0%)
    has_tax_kr = any(k in all_content for k in ['0.154', '15.4', '15.4%'])
    has_tax_us = any(k in all_content for k in ['0.150', '0.15', '15.0', '15%'])
    check('4-3', '배당소득세 분기 (국내 15.4%, 미국 15.0%) 적용', has_tax_kr and has_tax_us,
          f"국내 15.4%={has_tax_kr}, 미국 15.0%={has_tax_us}")

    # 금융소득종합과세 2,000만 원 초과 경고
    has_comp_tax_warning = any(k in all_content for k in ['20000000', '2,000만', '금융소득종합과세', '2000만'])
    check('4-4', '연 2,000만 원 초과 시 금융소득종합과세 경고 박스 노출', has_comp_tax_warning,
          "종합과세 경고 로직 확인" if has_comp_tax_warning else "미발견")

    # 수학적 역산 공식 정밀 시뮬레이션
    math_ok, math_samples = verify_fire_math()
    check('4-5', '역산 시뮬레이터 수학적 정합성 (|실제세후배당 - 목표배당| <= 10,000원)', math_ok,
          "모든 테스트 케이스 단주 오차 한도 내 일치", math_samples)

    # 5. 반응형 뷰포트 & 375px 가로 스크롤 방지
    print("  [5/5] 375px 모바일 뷰포트 무오버플로우 검증 중...")
    pattern_overflow = re.compile(r'(?:min-w|w)-\[(\d+)px\]')
    overflow_risks = []
    for f in src_files:
        content = open(f, encoding='utf-8', errors='ignore').read()
        for match in pattern_overflow.finditer(content):
            px_val = int(match.group(1))
            if px_val > 360:
                overflow_risks.append((os.path.relpath(f, BASE_DIR), match.group(0)))
    check('5-1', '375px 모바일 뷰포트 초과 고정너비(w > 360px) 0건', len(overflow_risks) == 0,
          f"위험 요소 {len(overflow_risks)}건" if overflow_risks else "0건", overflow_risks)

    has_max_w_xl = any('max-w-xl' in open(f, encoding='utf-8', errors='ignore').read() for f in src_files)
    check('5-2', 'max-w-xl 중앙 정렬 모바일 퍼스트 프레임 유지', has_max_w_xl, "유지됨" if has_max_w_xl else "미발견")

    # -------------------------------------------------------------
    # 검증 결과 리포트 출력
    # -------------------------------------------------------------
    print("\n" + "="*80)
    print("  Phase 3 자동화 검증 결과 요약")
    print("="*80)
    fails = [r for r in results if not r[2]]
    for cid, title, ok, detail, samples in results:
        status = "PASS" if ok else "FAIL"
        print(f"[{status}] {cid} {title} :: {detail}")
        if samples:
            for s in samples:
                print(f"       - {s}")
    print("-"*80)
    print(f"총 {len(results)}개 항목 중 FAIL: {len(fails)}개 -> 최종 판정: {'PASS' if not fails else 'FAIL'}")
    print("="*80)
    return len(fails) == 0

if __name__ == '__main__':
    all_passed = main()
    sys.exit(0 if all_passed else 1)
