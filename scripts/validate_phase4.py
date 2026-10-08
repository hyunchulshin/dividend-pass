#!/usr/bin/env python3
"""
scripts/validate_phase4.py
배당패스 (Dividend Pass) Phase 4 최종 배포 & 누적 전수(Phase 1~4) 리그레션 QA 자동화 검증 스크립트

Acceptance Criteria (docs/project_execution_plan.md Phase 4):
1. GitHub Actions 워크플로우 검증:
   - .github/workflows/daily_sync.yml 작성 완비
   - cron 스케줄 (KST 07:00 / UTC 22:00) 및 수동 트리거(workflow_dispatch) 지원
   - collector.py 실행 -> validate_phase1.py QA 게이트키핑 -> 자동 커밋/푸시 파이프라인
2. README.md 문서 완결성:
   - 서비스명(배당패스 / Dividend Pass)
   - 3대 핵심 기능 (큐레이션 탭, ETF 상세 모달, 파이어 역산기)
   - 공식 및 안전필터 투명 공개
   - 로컬 실행 가이드 (npm, python) 및 배포/라이선스 안내
3. 누적 전수 리그레션 제로 검증 (Phase 1, Phase 2, Phase 3 전수 합격):
   - Phase 1 (24개 항목) ALL PASS
   - Phase 2 (12개 항목) ALL PASS
   - Phase 3 (12개 항목) ALL PASS
4. 프로덕션 npm run build 빌드 무결성 (종료코드 0)
"""

import os
import re
import subprocess
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WORKFLOW_PATH = os.path.join(BASE_DIR, '.github', 'workflows', 'daily_sync.yml')
README_PATH = os.path.join(BASE_DIR, 'README.md')

results = []

def check(cid, title, ok, detail="", samples=None):
    results.append((cid, title, ok, detail, (samples or [])[:10]))

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

def main():
    print("=== [배당패스] Phase 4 최종 배포 & 누적 전수 자동화 검증 스크립트 가동 ===")

    # -------------------------------------------------------------
    # 1. GitHub Actions 일일 정기 갱신 워크플로우 검증
    # -------------------------------------------------------------
    print("  [1/4] GitHub Actions 워크플로우 (.github/workflows/daily_sync.yml) 검증 중...")
    has_workflow = os.path.exists(WORKFLOW_PATH)
    check('1-1', 'daily_sync.yml 워크플로우 파일 존재', has_workflow,
          "파일 정상 확인" if has_workflow else "미생성 (dev 작업 진행 중)")

    if has_workflow:
        wf_content = open(WORKFLOW_PATH, encoding='utf-8').read()
        
        # cron 스케줄 확인
        has_cron = 'cron:' in wf_content or 'schedule:' in wf_content
        cron_match = re.search(r"cron:\s*['\"]([^'\"]+)['\"]", wf_content)
        cron_str = cron_match.group(1) if cron_match else "스케줄 등록됨"
        check('1-2', '크론 정기 스케줄 등록 (매일 무인 갱신)', has_cron, f"등록 스케줄: {cron_str}")

        # 수동 트리거 지원
        has_dispatch = 'workflow_dispatch:' in wf_content
        check('1-3', '수동 트리거(workflow_dispatch) 지원', has_dispatch,
              "지원함" if has_dispatch else "미발견")

        # collector.py 또는 fetch_dividend_stocks.py 실행 스텝
        has_collector_step = ('collector.py' in wf_content) or ('fetch_dividend_stocks.py' in wf_content)
        check('1-4', 'collector.py 또는 fetch_dividend_stocks.py 수집 스텝 등록', has_collector_step,
              "데이터 수집 스크립트 정상 등록됨" if has_collector_step else "누락됨")

        # validate_phase1.py QA 게이트키핑 스텝
        has_gatekeeper = 'validate_phase1.py' in wf_content
        check('1-5', 'validate_phase1.py QA 게이트키핑 스텝 등록', has_gatekeeper,
              "무결성 검증 통과 시에만 커밋하도록 게이트키퍼 등록됨" if has_gatekeeper else "게이트키퍼 누락됨")

        # git commit & push 스텝
        has_commit = 'git commit' in wf_content and 'git push' in wf_content
        check('1-6', '자동 git commit & push 스텝 등록', has_commit,
              "등록됨" if has_commit else "누락됨")

    # -------------------------------------------------------------
    # 2. README.md 문서 완결성 검증
    # -------------------------------------------------------------
    print("  [2/4] README.md 문서 완결성 검증 중...")
    has_readme = os.path.exists(README_PATH)
    check('2-1', 'README.md 파일 존재', has_readme, "존재함" if has_readme else "미발견")

    if has_readme:
        readme_content = open(README_PATH, encoding='utf-8').read()
        
        # 서비스명
        has_name = '배당패스' in readme_content and 'Dividend Pass' in readme_content
        check('2-2', '서비스명 (배당패스 / Dividend Pass) 명시', has_name, "확인됨" if has_name else "누락")

        # 3대 핵심 기능 명시
        has_tabs_desc = any(k in readme_content for k in ['월배당', '큐레이션', 'TOP 10'])
        has_modal_desc = any(k in readme_content for k in ['500개', '탐색', '편입종목', '보수'])
        has_fire_desc = any(k in readme_content for k in ['파이어', 'FIRE', '역산', '시뮬레이터'])
        check('2-3', '3대 핵심 기능 상세 설명 완비', has_tabs_desc and has_modal_desc and has_fire_desc,
              f"큐레이션={has_tabs_desc}, 데이터탐색={has_modal_desc}, 파이어역산기={has_fire_desc}")

        # 투명한 산출 공식 및 안전 필터 가이드
        has_formula = any(k in readme_content for k in ['60%', '40%', '인기 점수', '인기점수'])
        has_filter = any(k in readme_content for k in ['1,000억', '500M', '고위험', '20%'])
        has_ttm = any(k in readme_content for k in ['TTM', '12개월'])
        check('2-4', '인기 산출 공식, TTM 배당률 및 안전필터 기준 투명 공개',
              has_formula and has_filter and has_ttm,
              f"인기식={has_formula}, 안전필터={has_filter}, TTM={has_ttm}")

        # 로컬 실행 가이드 (npm, python)
        has_local_run = any(k in readme_content for k in ['npm run dev', 'npm install', 'python'])
        check('2-5', '로컬 개발 및 수집기 실행 방법 안내 완비', has_local_run, "가이드 확인됨" if has_local_run else "누락")

        # 배포 및 라이선스
        has_deploy = any(k in readme_content for k in ['Vercel', '배포', 'Deployment', 'License', 'MIT'])
        check('2-6', '배포 환경(Vercel) 및 라이선스 명시', has_deploy, "명시됨" if has_deploy else "누락")

    # -------------------------------------------------------------
    # 3. 누적 전수(Phase 1 ~ Phase 3) 리그레션 제로 검증
    # -------------------------------------------------------------
    print("  [3/4] 누적 전수(Phase 1 ~ Phase 3) 리그레션 제로 검증 중...")
    
    # Phase 1 검증 (24개 항목)
    p1_ok, p1_msg = run_script('validate_phase1.py')
    check('3-1', 'Phase 1 백엔드 데이터셋 무결성 리그레션 검증 (24개 항목)', p1_ok,
          "24개 전 항목 통과 (ALL PASS)" if p1_ok else f"실패: {p1_msg}")

    # Phase 2 검증 (12개 항목)
    p2_ok, p2_msg = run_script('validate_phase2.py')
    check('3-2', 'Phase 2 디자인 시스템 & InfoTooltip 리그레션 검증 (12개 항목)', p2_ok,
          "12개 전 항목 통과 (ALL PASS)" if p2_ok else f"실패: {p2_msg}")

    # Phase 3 검증 (12개 항목)
    p3_ok, p3_msg = run_script('validate_phase3.py')
    check('3-3', 'Phase 3 3대 큐레이션 & FIRE 역산기 리그레션 검증 (12개 항목)', p3_ok,
          "12개 전 항목 통과 (ALL PASS)" if p3_ok else f"실패: {p3_msg}")

    # -------------------------------------------------------------
    # 4. 최종 프로덕션 빌드 무결성
    # -------------------------------------------------------------
    print("  [4/4] 최종 프로덕션 빌드 (npm run build) 검증 중...")
    try:
        # 이전 빌드 캐시 충돌 방지 클린 빌드
        next_dir = os.path.join(BASE_DIR, '.next')
        if os.path.exists(next_dir):
            import shutil
            shutil.rmtree(next_dir, ignore_errors=True)

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
        check('4-1', '최종 프로덕션 빌드 무결성 (npm run build 종료코드 0)', build_ok,
              "빌드 성공 (Vercel 배포 준비 완료)" if build_ok else f"빌드 실패:\n{build_output[-400:]}")
    except Exception as e:
        check('4-1', '최종 프로덕션 빌드 무결성 (npm run build 종료코드 0)', False, f"예외: {e}")

    # -------------------------------------------------------------
    # 검증 결과 리포트 출력
    # -------------------------------------------------------------
    print("\n" + "="*80)
    print("  Phase 4 최종 배포 & 누적 전수 검증 결과 요약")
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
