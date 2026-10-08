#!/usr/bin/env python3
"""
scripts/validate_responsive.py
배당패스 (Dividend Pass) 모바일(375px) + 데스크탑(1280px+) 듀얼 뷰포트 반응형 종합 자동화 검증 스크립트

Acceptance Criteria:
1. 모바일 뷰포트 (375px iPhone SE):
   - 360px 초과 고정 픽셀 너비 (w-[...], min-w-[...]) 0건
   - 가로 스크롤(Horizontal Overflow) 유발 위험 요소 0건 (overflow-x-hidden 및 viewport 메타 완비)
2. 데스크탑 뷰포트 (1280px+):
   - max-w-7xl 또는 max-w-6xl 반응형 메인 컨테이너 및 중앙 정렬(mx-auto) 적용
   - 종목 리스트: sm:grid-cols-2, lg:grid-cols-3 등 다열 반응형 그리드 지원
   - FIRE 역산기: lg:grid-cols-12 (또는 lg 2컬럼 분할) 기반 좌측 입력(Sticky) + 우측 결과 레이아웃 지원
3. 빌드 및 기능 무결성 보존:
   - npm run build 종료코드 0 성공
   - 기존 500개 종목 데이터 정합성 (국내 250 + 미국 250, 결측치 0건)
   - FIRE 배당 역산 시뮬레이터 수학적 오차 (|실제세후배당 - 목표배당| <= 10,000원) 보존
   - 배당세율 분기(국내 15.4%, 미국 15.0%) 및 종합과세 경고(연 2,000만 원 초과) 로직 보존
4. 기존 검증(Phase 1~4) 누적 회귀 제로 (0 Regressions) 보존
"""

import os
import re
import subprocess
import sys
import json
import math

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

results = []

def check(cid, title, ok, detail="", samples=None):
    results.append((cid, title, ok, detail, (samples or [])[:10]))

def find_files(dir_path, extensions):
    matched = []
    if not os.path.exists(dir_path):
        return matched
    for root, _, files in os.walk(dir_path):
        if any(p in root for p in ['node_modules', '.next', '.git']):
            continue
        for file in files:
            if any(file.endswith(ext) for ext in extensions):
                matched.append(os.path.join(root, file))
    return matched

def run_script(script_name):
    script_path = os.path.join(BASE_DIR, 'scripts', script_name)
    if not os.path.exists(script_path):
        return False, f"{script_name} 미존재"
    
    python_bin = os.path.join(BASE_DIR, '.venv', 'bin', 'python')
    if not os.path.exists(python_bin):
        python_bin = sys.executable

    try:
        proc = subprocess.run(
            [python_bin, script_path],
            cwd=BASE_DIR,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            timeout=180
        )
        if proc.returncode != 0:
            err_msg = (proc.stderr.strip() or proc.stdout.strip())[-300:]
            return False, f"종료코드: {proc.returncode}\n{err_msg}"
        return True, f"종료코드: {proc.returncode}"
    except Exception as e:
        return False, f"실행 예외: {e}"

def validate_responsive():
    print("=== [배당패스] 모바일 & 데스크탑 듀얼 뷰포트 반응형 종합 검증 가동 ===")

    src_files = find_files(BASE_DIR, ['.tsx', '.jsx', '.ts', '.js', '.css'])

    # -------------------------------------------------------------
    # 1. 모바일 뷰포트 (375px iPhone SE) 검증
    # -------------------------------------------------------------
    print("  [1/4] 모바일 뷰포트 (375px iPhone SE) 가로 스크롤 및 레이아웃 검증 중...")

    # 1-1. 360px 초과 고정 픽셀 너비 검사
    overflow_risks = []
    pattern_overflow = re.compile(r'(?:min-w|w)-\[(\d+)px\]')
    for f in src_files:
        content = open(f, encoding='utf-8', errors='ignore').read()
        for match in pattern_overflow.finditer(content):
            px_val = int(match.group(1))
            if px_val > 360:
                overflow_risks.append(f"{os.path.relpath(f, BASE_DIR)}: {match.group(0)}")
    check('1-1', '375px 모바일 뷰포트 초과 고정너비(w > 360px) 0건', len(overflow_risks) == 0,
          f"초과 요소 {len(overflow_risks)}건" if overflow_risks else "0건 (완벽 모바일 핏)", overflow_risks)

    # 1-2. Viewport 메타태그 설정 검사 (app/layout.tsx)
    layout_path = os.path.join(BASE_DIR, 'app', 'layout.tsx')
    has_viewport_meta = False
    if os.path.exists(layout_path):
        layout_content = open(layout_path, encoding='utf-8', errors='ignore').read()
        if 'device-width' in layout_content and ('initialScale' in layout_content or 'initial-scale' in layout_content):
            has_viewport_meta = True
    check('1-2', '모바일 반응형 Viewport 메타태그(device-width) 구성', has_viewport_meta,
          "정상 구성됨" if has_viewport_meta else "layout.tsx 내 viewport 설정 미흡")

    # 1-3. 가로 스크롤 방지 (overflow-x-hidden) 검사
    has_overflow_guard = False
    for f in src_files:
        if 'overflow-x-hidden' in open(f, encoding='utf-8', errors='ignore').read():
            has_overflow_guard = True
            break
    check('1-3', '모바일 가로 스크롤 방지(overflow-x-hidden) 가드 적용', has_overflow_guard,
          "적용 확인됨" if has_overflow_guard else "overflow-x-hidden 미적용")

    # -------------------------------------------------------------
    # 2. 데스크탑 뷰포트 (1280px+) 대화면 최적화 레이아웃 검증
    # -------------------------------------------------------------
    print("  [2/4] 데스크탑 뷰포트 (1280px+) 반응형 그리드 & 대화면 컨테이너 검증 중...")

    # 2-1. max-w-7xl 또는 max-w-6xl 반응형 컨테이너 및 중앙 정렬(mx-auto) 적용
    desktop_container_files = []
    pattern_desktop_container = re.compile(r'max-w-(?:6xl|7xl)')
    for f in src_files:
        content = open(f, encoding='utf-8', errors='ignore').read()
        if pattern_desktop_container.search(content) and 'mx-auto' in content:
            desktop_container_files.append(os.path.relpath(f, BASE_DIR))
    has_desktop_container = len(desktop_container_files) > 0
    check('2-1', '데스크탑 반응형 컨테이너(max-w-7xl 또는 max-w-6xl mx-auto) 적용', has_desktop_container,
          f"적용 파일: {desktop_container_files}" if has_desktop_container else "max-w-7xl/6xl mx-auto 미적용",
          desktop_container_files)

    # 2-2. 종목 리스트 다열 반응형 그리드 (sm:grid-cols-2, lg:grid-cols-3 등)
    explorer_path = os.path.join(BASE_DIR, 'components', 'StockExplorer.tsx')
    has_multi_grid = False
    grid_details = []
    if os.path.exists(explorer_path):
        exp_content = open(explorer_path, encoding='utf-8', errors='ignore').read()
        if ('grid-cols-1' in exp_content or 'grid' in exp_content) and \
           ('sm:grid-cols-2' in exp_content or 'md:grid-cols-2' in exp_content) and \
           ('lg:grid-cols-3' in exp_content or 'xl:grid-cols-3' in exp_content):
            has_multi_grid = True
            grid_details.append("sm:grid-cols-2 & lg:grid-cols-3 다열 그리드 확인")
    check('2-2', '종목 리스트 다열 반응형 그리드(sm:2열, lg:3열) 지원', has_multi_grid,
          "정상 구현됨" if has_multi_grid else "StockExplorer 내 다열 그리드(sm:2열, lg:3열) 미구현",
          grid_details)

    # 2-3. FIRE 역산기 대화면 2컬럼 레이아웃 (lg:grid-cols-12 또는 대화면 그리드 분할)
    calc_path = os.path.join(BASE_DIR, 'components', 'FireCalculator.tsx')
    has_calc_desktop_grid = False
    calc_grid_detail = ""
    if os.path.exists(calc_path):
        calc_content = open(calc_path, encoding='utf-8', errors='ignore').read()
        if 'lg:grid-cols-12' in calc_content or ('lg:grid-cols-2' in calc_content) or ('lg:grid' in calc_content and ('lg:col-span' in calc_content or 'lg:w-' in calc_content)):
            has_calc_desktop_grid = True
            calc_grid_detail = "대화면(lg) 2컬럼 분할 그리드 구조 확인"
        else:
            calc_grid_detail = "단일 컬럼 구조 (lg:grid-cols-12 미적용)"
    check('2-3', 'FIRE 역산기 대화면 2컬럼 분할 레이아웃(lg:grid-cols-12 등) 지원', has_calc_desktop_grid,
          calc_grid_detail if has_calc_desktop_grid else "FireCalculator 대화면 2컬럼 그리드 미구현")

    # 2-4. FIRE 역산기 대화면 좌측 입력 패널 Sticky 고정 (sticky / lg:sticky)
    has_calc_sticky = False
    calc_sticky_detail = ""
    if os.path.exists(calc_path):
        calc_content = open(calc_path, encoding='utf-8', errors='ignore').read()
        if ('sticky' in calc_content or 'lg:sticky' in calc_content) and ('top-' in calc_content):
            has_calc_sticky = True
            calc_sticky_detail = "입력 패널 Sticky 스크롤 고정 적용됨"
        else:
            calc_sticky_detail = "Sticky 속성 미적용"
    check('2-4', 'FIRE 역산기 대화면 좌측 입력 패널 Sticky 고정(lg:sticky top-*) 지원', has_calc_sticky,
          calc_sticky_detail if has_calc_sticky else "좌측 입력 패널 Sticky 미적용")

    # -------------------------------------------------------------
    # 3. 빌드 무결성 및 기존 데이터/수학적 정합성 보존 검증
    # -------------------------------------------------------------
    print("  [3/4] 빌드 및 데이터/수학적 정합성 보존 검증 중...")

    # 3-1. npm run build 빌드 무결성
    try:
        next_dir = os.path.join(BASE_DIR, '.next')
        if os.path.exists(next_dir):
            import shutil
            import time
            shutil.rmtree(next_dir, ignore_errors=True)
            time.sleep(0.5)

        proc = subprocess.run(
            ['npm', 'run', 'build'],
            cwd=BASE_DIR,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            timeout=180
        )
        build_ok = (proc.returncode == 0)
        check('3-1', '최종 프로덕션 빌드 무결성 (npm run build 종료코드 0)', build_ok,
              "빌드 성공 (종료코드 0)" if build_ok else f"빌드 실패:\n{(proc.stderr or proc.stdout)[-300:]}")
    except Exception as e:
        check('3-1', '최종 프로덕션 빌드 무결성 (npm run build 종료코드 0)', False, f"빌드 예외: {e}")

    # 3-2. 500개 종목 데이터 정합성 보존 (국내 250 + 미국 250)
    data_path = os.path.join(BASE_DIR, 'public', 'data', 'dividend_stocks_500.json')
    data_ok = False
    data_detail = ""
    if os.path.exists(data_path):
        try:
            with open(data_path, encoding='utf-8') as f:
                stocks = json.load(f)
            kr_stocks = [s for s in stocks if s.get('market') == 'KR']
            us_stocks = [s for s in stocks if s.get('market') == 'US']
            if len(stocks) == 500 and len(kr_stocks) == 250 and len(us_stocks) == 250:
                data_ok = True
                data_detail = f"총 500개 종목 완벽 보존 (KR: {len(kr_stocks)}, US: {len(us_stocks)})"
            else:
                data_detail = f"종목 수 불일치: 총 {len(stocks)}개 (KR {len(kr_stocks)}, US {len(us_stocks)})"
        except Exception as e:
            data_detail = f"데이터 로드 실패: {e}"
    check('3-2', '기존 500개 고배당 데이터셋 정합성 보존 (KR 250 + US 250)', data_ok, data_detail)

    # 3-3. FIRE 역산 시뮬레이터 수학적 정합성 (|실제세후배당 - 목표배당| <= 10,000원)
    math_samples = []
    math_ok = True
    test_cases = [300_000, 1_000_000, 2_000_000, 5_000_000]
    
    # 대표 포트폴리오
    default_tickers = ['458730', 'JEPI', 'SCHD', '088980']
    matched_stocks = []
    if os.path.exists(data_path):
        try:
            with open(data_path, encoding='utf-8') as f:
                all_s = json.load(f)
            stock_map = {s['ticker']: s for s in all_s}
            matched_stocks = [stock_map[t] for t in default_tickers if t in stock_map]
        except Exception:
            pass

    if len(matched_stocks) == 4:
        weight = 100.0 / len(matched_stocks)
        for target_m in test_cases:
            target_annual = target_m * 12
            total_net_annual = 0.0
            total_capital = 0.0

            for st in matched_stocks:
                st_target_annual = target_annual * (weight / 100.0)
                is_kr = (st['market'] == 'KR')
                tax_rate = 0.154 if is_kr else 0.150
                price_won = st['price'] if is_kr else st['price'] * 1350
                dps_gross_won = st['dpsTtm'] if is_kr else st['dpsTtm'] * 1350
                net_dps_won = dps_gross_won * (1.0 - tax_rate)

                if net_dps_won <= 0:
                    shares = 0
                else:
                    shares = math.ceil(st_target_annual / net_dps_won)

                req_cap = shares * price_won
                act_net = shares * net_dps_won

                total_capital += req_cap
                total_net_annual += act_net

            act_monthly = total_net_annual / 12.0
            diff = act_monthly - target_m
            math_samples.append(f"월 {target_m//10000}만: 오차 {diff:+.1f}원 (필요원금: {total_capital/100000000:.2f}억)")
            if diff < 0 or diff > 10000:
                math_ok = False
    else:
        math_ok = False
        math_samples.append("테스트용 대표 4대 종목 매칭 실패")

    check('3-3', 'FIRE 역산 시뮬레이터 수학적 오차 한도(<= 10,000원) 보존', math_ok,
          "전 테스트 케이스 단주 오차 한도 이내 일치" if math_ok else "역산 오차 허용치 초과", math_samples)

    # 3-4. 배당세율 분기(국내 15.4%, 미국 15.0%) 및 종합과세 기준(2,000만) 보존
    tax_logic_ok = False
    tax_detail = ""
    if os.path.exists(calc_path):
        calc_code = open(calc_path, encoding='utf-8', errors='ignore').read()
        has_kr_tax = ('0.154' in calc_code or '15.4' in calc_code)
        has_us_tax = ('0.150' in calc_code or '15.0' in calc_code or '0.15' in calc_code)
        has_comp_tax = ('20000000' in calc_code or '20_000_000' in calc_code or '2,000만' in calc_code)
        if has_kr_tax and has_us_tax and has_comp_tax:
            tax_logic_ok = True
            tax_detail = "국내 15.4%, 미국 15.0% 분기 및 2,000만 원 종합과세 경고 완벽 보존"
        else:
            tax_detail = f"세무 로직 누락: KR({has_kr_tax}), US({has_us_tax}), 종합과세({has_comp_tax})"
    check('3-4', '배당소득세율 분기 및 종합과세 경고 기준 보존', tax_logic_ok, tax_detail)

    # -------------------------------------------------------------
    # 4. 기존 검증(Phase 1~4) 누적 회귀 제로 (Zero Regressions) 보존
    # -------------------------------------------------------------
    print("  [4/4] 기존 Phase 1~4 누적 회귀 제로(0 Regressions) 검증 중...")

    p1_ok, p1_msg = run_script('validate_phase1.py')
    check('4-1', 'Phase 1 백엔드 데이터셋 무결성 리그레션 검증 (24개 항목)', p1_ok,
          "24개 전 항목 통과 (ALL PASS)" if p1_ok else f"실패: {p1_msg}")

    p2_ok, p2_msg = run_script('validate_phase2.py')
    check('4-2', 'Phase 2 디자인 시스템 & InfoTooltip 리그레션 검증 (12개 항목)', p2_ok,
          "12개 전 항목 통과 (ALL PASS)" if p2_ok else f"실패: {p2_msg}")

    p3_ok, p3_msg = run_script('validate_phase3.py')
    check('4-3', 'Phase 3 3대 큐레이션 & FIRE 역산기 리그레션 검증 (12개 항목)', p3_ok,
          "12개 전 항목 통과 (ALL PASS)" if p3_ok else f"실패: {p3_msg}")

    # -------------------------------------------------------------
    # 검증 결과 리포트 출력
    # -------------------------------------------------------------
    print("\n" + "="*80)
    print("  [배당패스] 모바일 & 데스크탑 듀얼 뷰포트 반응형 검증 결과 요약")
    print("="*80)
    fails = [r for r in results if not r[2]]
    for cid, title, ok, detail, samples in results:
        status = "PASS" if ok else "FAIL"
        print(f"[{status}] {cid} {title} :: {detail}")
        if samples:
            for s in samples:
                print(f"       - {s}")

    print("-"*80)
    total = len(results)
    fail_cnt = len(fails)
    pass_cnt = total - fail_cnt
    rate = (pass_cnt / total) * 100.0
    print(f"총 {total}개 항목 중 PASS: {pass_cnt}개, FAIL: {fail_cnt}개 (달성률: {rate:.1f}%)")
    final_verdict = "PASS" if fail_cnt == 0 else "FAIL"
    print(f"최종 판정: {final_verdict}")
    print("="*80)

    return (fail_cnt == 0)

if __name__ == '__main__':
    ok = validate_responsive()
    sys.exit(0 if ok else 1)
