#!/usr/bin/env python3
"""
scripts/validate_phase2.py
배당패스 (Dividend Pass) Phase 2 QA 검증 자동화 스크립트

Acceptance Criteria (docs/project_execution_plan.md Phase 2):
1. 빌드 및 에러 무결성: `npm run build` 타입스크립트 및 린트 에러 0건
2. 반응형 뷰포트 최적화:
   - 모바일 375px(아이폰 SE) 가로 스크롤(Horizontal Overflow) 유발 위험 요소 0건
   - 최대 폭 max-w-xl(640px) 중앙 정렬 컨테이너 적용
3. 디자인 시스템 일관성 (cheongyak-pass 벤치마크):
   - bg-slate-50, rounded-2xl, text-slate-500, 블루/에메랄드 뱃지 시스템
4. InfoTooltip 인터랙션 및 내용 완비:
   - 모바일 클릭/터치 토글 및 외부 영역 탭 시 닫힘 (backdrop / outside click)
   - 데스크톱 마우스 호버 반응
   - 3대 핵심 설명 완비: 인기점수 계산식, TTM 배당률, 안전 필터링/고위험 배당
"""

import os
import re
import subprocess
import sys
import json

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

results = []

def check(cid, title, ok, detail="", samples=None):
    results.append((cid, title, ok, detail, (samples or [])[:10]))

def find_files(dir_path, extensions):
    matched = []
    if not os.path.exists(dir_path):
        return matched
    for root, _, files in os.walk(dir_path):
        if 'node_modules' in root or '.next' in root or '.git' in root:
            continue
        for file in files:
            if any(file.endswith(ext) for ext in extensions):
                matched.append(os.path.join(root, file))
    return matched

def check_phase2():
    print("=== [배당패스] Phase 2 자동화 검증 스크립트 가동 ===")

    # -------------------------------------------------------------
    # 1. 빌드 및 패키지 무결성
    # -------------------------------------------------------------
    pkg_path = os.path.join(BASE_DIR, 'package.json')
    has_pkg = os.path.exists(pkg_path)
    check('1-1', 'package.json 및 프로젝트 환경 구성 완비', has_pkg, "존재함" if has_pkg else "누락됨")

    if not has_pkg:
        print("[경고] package.json이 아직 생성되지 않았습니다. (dev 작업 진행 중)")
        return

    # npm run build 실행
    print("  -> npm run build 빌드 무결성 검증 중...")
    try:
        build_proc = subprocess.run(
            ['npm', 'run', 'build'],
            cwd=BASE_DIR,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            timeout=180
        )
        build_ok = (build_proc.returncode == 0)
        build_output = build_proc.stdout + "\n" + build_proc.stderr
        build_detail = "빌드 성공 (종료코드 0)" if build_ok else f"빌드 실패:\n{build_output[-500:]}"
        check('1-2', 'npm run build 빌드 무결성 (TS/Lint 0건)', build_ok, build_detail)
    except Exception as e:
        check('1-2', 'npm run build 빌드 무결성 (TS/Lint 0건)', False, f"실행 중 예외 발생: {str(e)}")

    # -------------------------------------------------------------
    # 2. 반응형 뷰포트 & 컨테이너 최적화 (가로 스크롤 방지)
    # -------------------------------------------------------------
    src_files = find_files(BASE_DIR, ['.tsx', '.jsx', '.ts', '.js', '.css'])
    
    # 반응형 컨테이너(max-w-xl, max-w-6xl, max-w-7xl 등) 및 중앙 정렬 (mx-auto) 확인
    has_container = False
    container_files = []
    pattern_container = re.compile(r'max-w-(?:xl|2xl|3xl|4xl|5xl|6xl|7xl)')
    for f in src_files:
        content = open(f, encoding='utf-8', errors='ignore').read()
        if pattern_container.search(content) and 'mx-auto' in content:
            has_container = True
            container_files.append(os.path.relpath(f, BASE_DIR))
    check('2-1', '반응형 컨테이너(max-w-xl/6xl/7xl 등) 및 중앙 정렬(mx-auto) 적용', has_container,
          f"발견 파일: {container_files}" if has_container else "반응형 mx-auto 컨테이너 미발견")

    # 375px 모바일 뷰포트 초과 하드코딩 너비 검사 (e.g. w-[400px], min-w-[500px] 등)
    overflow_risks = []
    pattern_overflow = re.compile(r'(?:min-w|w)-\[(\d+)px\]')
    for f in src_files:
        content = open(f, encoding='utf-8', errors='ignore').read()
        for match in pattern_overflow.finditer(content):
            px_val = int(match.group(1))
            if px_val > 360:
                overflow_risks.append((os.path.relpath(f, BASE_DIR), match.group(0)))
    check('2-2', '375px 모바일 가로 스크롤 유발 고정너비(w > 360px) 0건', len(overflow_risks) == 0,
          f"위험 요소 {len(overflow_risks)}건" if overflow_risks else "0건", overflow_risks)

    # -------------------------------------------------------------
    # 3. cheongyak-pass 스타일 벤치마크 디자인 시스템
    # -------------------------------------------------------------
    bg_slate_found = any('bg-slate-50' in open(f, encoding='utf-8', errors='ignore').read() for f in src_files)
    check('3-1', '부드러운 슬레이트 배경 (bg-slate-50) 적용', bg_slate_found, "확인됨" if bg_slate_found else "미발견")

    rounded_2xl_found = any('rounded-2xl' in open(f, encoding='utf-8', errors='ignore').read() for f in src_files)
    check('3-2', '모던 라운드 카드 (rounded-2xl) 적용', rounded_2xl_found, "확인됨" if rounded_2xl_found else "미발견")

    text_slate_found = any('text-slate-500' in open(f, encoding='utf-8', errors='ignore').read() for f in src_files)
    check('3-3', '서브 텍스트 가독성 (text-slate-500) 적용', text_slate_found, "확인됨" if text_slate_found else "미발견")

    # 뱃지 시스템 (블루/에메랄드/위험 경고 뱃지)
    blue_badge = any(re.search(r'bg-blue-\d+.*text-blue-\d+', open(f, encoding='utf-8', errors='ignore').read()) for f in src_files)
    emerald_badge = any(re.search(r'bg-emerald-\d+.*text-emerald-\d+', open(f, encoding='utf-8', errors='ignore').read()) for f in src_files)
    check('3-4', '신뢰감을 주는 블루/에메랄드 뱃지 시스템 구축', blue_badge and emerald_badge,
          f"Blue={blue_badge}, Emerald={emerald_badge}")

    # -------------------------------------------------------------
    # 4. InfoTooltip 컴포넌트 인터랙션 및 내용 완비
    # -------------------------------------------------------------
    tooltip_files = [f for f in src_files if 'InfoTooltip' in os.path.basename(f) or 'Tooltip' in os.path.basename(f)]
    has_tooltip = len(tooltip_files) > 0
    check('4-1', 'InfoTooltip 컴포넌트 파일 존재', has_tooltip,
          [os.path.relpath(f, BASE_DIR) for f in tooltip_files] if has_tooltip else "미발견")

    if has_tooltip:
        combined_tooltip_content = "\n".join(open(f, encoding='utf-8', errors='ignore').read() for f in tooltip_files)
        # 데스크톱 호버 지원 (hover or onMouseEnter / onMouseLeave)
        has_hover = 'hover' in combined_tooltip_content or 'onMouseEnter' in combined_tooltip_content
        check('4-2', '데스크톱 호버(hover/mouseEnter) 인터랙션 지원', has_hover, "확인됨" if has_hover else "미발견")

        # 모바일 클릭/터치 토글 및 외부 닫힘
        has_click_toggle = 'onClick' in combined_tooltip_content or 'onTouchStart' in combined_tooltip_content or 'useState' in combined_tooltip_content
        has_outside_close = ('mousedown' in combined_tooltip_content or 'backdrop' in combined_tooltip_content.lower() or
                              'fixed inset-0' in combined_tooltip_content or 'click' in combined_tooltip_content.lower() or
                              'onblur' in combined_tooltip_content.lower())
        check('4-3', '모바일 터치 토글 및 외부 탭 시 닫힘(외부 클릭/백드롭) 지원', has_click_toggle and has_outside_close,
              f"Toggle={has_click_toggle}, OutsideClose={has_outside_close}")

    # 3대 핵심 툴팁 내용 완비 검사 (인기점수, TTM, 안전필터링)
    all_content = "\n".join(open(f, encoding='utf-8', errors='ignore').read() for f in src_files)
    has_pop_desc = any(k in all_content for k in ['인기 점수', '인기점수', '시총', 'AUM', '거래대금', '60%', '40%'])
    has_ttm_desc = any(k in all_content for k in ['TTM', '12개월', '과거 배당'])
    has_risk_desc = any(k in all_content for k in ['고위험', '20%', '안전 필터', '1,000억', '500M'])
    check('4-4', 'InfoTooltip 3대 핵심 설명 내용 완비 (인기점수식/TTM/안전필터)', has_pop_desc and has_ttm_desc and has_risk_desc,
          f"인기점수식={has_pop_desc}, TTM={has_ttm_desc}, 안전필터={has_risk_desc}")

def print_report():
    print("\n" + "="*80)
    print("  Phase 2 검증 결과 요약")
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
    check_phase2()
    passed = print_report()
    sys.exit(0 if passed else 1)
