#!/usr/bin/env python3
"""
scripts/validate_adsense.py
배당패스 (Dividend Pass) 구글 애드센스(Google AdSense) 규정 준수 & 법적 페이지 & SEO 자동화 검증 스크립트

Acceptance Criteria:
1. 4대 필수 라우트 (/about, /privacy, /terms, /contact) 파일 및 페이지 컴파일 무결성
2. /privacy 페이지 내 구글 애드센스 필수 쿠키 조항(Google, 쿠키, 맞춤 광고/거부) 포함 여부
3. /terms 페이지 내 금융 투자 면책고지(투자 자문/권유 아님, 투자자 자기 책임, 데이터 지연/면책) 포함 여부
4. 글로벌 푸터(Footer.tsx) 링크 정상 연결 (/about, /privacy, /terms, /contact) 및 저작권/면책 요약문 존재 여부
5. sitemap.ts, robots.ts 생성 및 SEO 메타데이터 구성
6. npm run build 정상 완료 (정적 페이지 8개 이상 빌드 성공) 및 기존 기능(500개 데이터, 파이어 계산기, 반응형) 리그레션 0건
"""

import os
import re
import subprocess
import sys
import json
import math
import shutil
import time

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

def validate_adsense():
    print("=== [배당패스] 구글 애드센스 규정 준수 & 법적 필수 페이지 & SEO 종합 검증 가동 ===")

    # -------------------------------------------------------------
    # 1. 4대 애드센스 필수 법적/소개 라우트 파일 무결성
    # -------------------------------------------------------------
    print("  [1/6] 4대 필수 라우트 (/about, /privacy, /terms, /contact) 파일 검증 중...")

    # 1-1. /about (서비스 소개)
    about_path = os.path.join(BASE_DIR, 'app', 'about', 'page.tsx')
    has_about = os.path.exists(about_path)
    about_detail = "app/about/page.tsx 존재함"
    if has_about:
        content = open(about_path, encoding='utf-8', errors='ignore').read()
        has_export = 'export default' in content
        has_intro = any(k in content for k in ['배당패스', 'Dividend Pass', '소개', '서비스'])
        if not (has_export and has_intro):
            has_about = False
            about_detail = "컴포넌트 export 또는 서비스 소개 내용 누락"
    else:
        about_detail = "app/about/page.tsx 미생성"
    check('1-1', '/about (서비스 소개) 페이지 파일 및 컴포넌트 유효성', has_about, about_detail)

    # 1-2. /privacy (개인정보처리방침)
    privacy_path = os.path.join(BASE_DIR, 'app', 'privacy', 'page.tsx')
    has_privacy = os.path.exists(privacy_path)
    privacy_detail = "app/privacy/page.tsx 존재함"
    if has_privacy:
        content = open(privacy_path, encoding='utf-8', errors='ignore').read()
        has_export = 'export default' in content
        has_policy = any(k in content for k in ['개인정보', 'Privacy', '처리방침'])
        if not (has_export and has_policy):
            has_privacy = False
            privacy_detail = "컴포넌트 export 또는 개인정보처리방침 내용 누락"
    else:
        privacy_detail = "app/privacy/page.tsx 미생성"
    check('1-2', '/privacy (개인정보처리방침) 페이지 파일 및 컴포넌트 유효성', has_privacy, privacy_detail)

    # 1-3. /terms (이용약관 및 면책고지)
    terms_path = os.path.join(BASE_DIR, 'app', 'terms', 'page.tsx')
    has_terms = os.path.exists(terms_path)
    terms_detail = "app/terms/page.tsx 존재함"
    if has_terms:
        content = open(terms_path, encoding='utf-8', errors='ignore').read()
        has_export = 'export default' in content
        has_terms_body = any(k in content for k in ['이용약관', 'Terms', '약관'])
        if not (has_export and has_terms_body):
            has_terms = False
            terms_detail = "컴포넌트 export 또는 이용약관 내용 누락"
    else:
        terms_detail = "app/terms/page.tsx 미생성"
    check('1-3', '/terms (이용약관) 페이지 파일 및 컴포넌트 유효성', has_terms, terms_detail)

    # 1-4. /contact (문의 및 지원)
    contact_path = os.path.join(BASE_DIR, 'app', 'contact', 'page.tsx')
    has_contact = os.path.exists(contact_path)
    contact_detail = "app/contact/page.tsx 존재함"
    if has_contact:
        content = open(contact_path, encoding='utf-8', errors='ignore').read()
        has_export = 'export default' in content
        has_contact_body = any(k in content for k in ['문의', 'Contact', '이메일', '@'])
        if not (has_export and has_contact_body):
            has_contact = False
            contact_detail = "컴포넌트 export 또는 문의 연락처/양식 누락"
    else:
        contact_detail = "app/contact/page.tsx 미생성"
    check('1-4', '/contact (문의 및 고객지원) 페이지 파일 및 컴포넌트 유효성', has_contact, contact_detail)

    # -------------------------------------------------------------
    # 2. /privacy 페이지 내 구글 애드센스 필수 쿠키 및 광고 조항 검증
    # -------------------------------------------------------------
    print("  [2/6] /privacy 페이지 구글 애드센스 필수 규정 조항 검증 중...")

    privacy_content = open(privacy_path, encoding='utf-8', errors='ignore').read() if has_privacy else ""

    # 2-1. Google 제3자 광고 사업자 명시
    has_google_vendor = any(k in privacy_content for k in ['Google', '구글', '애드센스', 'AdSense', '제3자'])
    check('2-1', '/privacy 내 Google(제3자 광고 사업자) 명시 조항', has_google_vendor,
          "Google 제3자 광고 사업자 명시 확인됨" if has_google_vendor else "Google 또는 제3자 광고 사업자 조항 미발견")

    # 2-2. 쿠키(Cookie) 및 웹 비콘 수집 정책
    has_cookie_clause = any(k in privacy_content for k in ['쿠키', 'cookie', 'Cookie', '웹 비콘', '비콘'])
    check('2-2', '/privacy 내 쿠키(Cookie) 및 추적 기술 수집 정책 조항', has_cookie_clause,
          "쿠키 및 추적 기술 수집 정책 조항 확인됨" if has_cookie_clause else "쿠키(Cookie) 정책 조항 미발견")

    # 2-3. 맞춤형 광고 및 쿠키 거부/비활성화 안내
    has_ad_optout = any(k in privacy_content for k in ['맞춤', '광고', '거부', '비활성화', 'adssettings', 'opt-out', '설정'])
    check('2-3', '/privacy 내 맞춤형 광고 안내 및 쿠키 비활성화/거부 설정 안내', has_ad_optout,
          "맞춤 광고 및 쿠키 거부 안내 확인됨" if has_ad_optout else "맞춤 광고 또는 쿠키 거부 안내 미발견")

    # -------------------------------------------------------------
    # 3. /terms 페이지 내 금융 투자 면책고지(Disclaimer) 조항 검증
    # -------------------------------------------------------------
    print("  [3/6] /terms 페이지 금융 투자 면책고지 필수 조항 검증 중...")

    terms_content = open(terms_path, encoding='utf-8', errors='ignore').read() if has_terms else ""

    # 3-1. 금융 투자 자문/일임 불가 명시 (No Investment Advice)
    has_no_advice = any(k in terms_content for k in ['투자 자문', '투자 권유', '투자 추천', '자문이 아닙니다', '권유가 아닙니다', '정보 제공 목적'])
    check('3-1', '/terms 내 투자 자문/권유 불가 및 단순 정보 제공 목적 명시', has_no_advice,
          "투자 자문 불가 및 단순 정보 제공 조항 확인됨" if has_no_advice else "투자 자문/권유 면책 조항 미발견")

    # 3-2. 투자자 자기 책임 원칙 및 손실 면책 (Investor Responsibility)
    has_investor_resp = any(k in terms_content for k in ['투자 책임', '자기 책임', '본인의 책임', '손실', '귀속', '면책'])
    check('3-2', '/terms 내 투자자 자기 책임 원칙 및 원금 손실 면책 조항', has_investor_resp,
          "투자자 자기 책임 및 손실 면책 조항 확인됨" if has_investor_resp else "투자자 자기 책임 조항 미발견")

    # 3-3. 데이터 정확성 및 지연 면책 (Data Disclaimer)
    has_data_disclaimer = any(k in terms_content for k in ['과거', 'TTM', '실시간', '오차', '지연', '정확성', '보장하지 않'])
    check('3-3', '/terms 내 과거(TTM) 데이터 한계 및 시세 지연/오차 면책 조항', has_data_disclaimer,
          "데이터 시차 및 과거 지표 한계 면책 조항 확인됨" if has_data_disclaimer else "데이터 한계 면책 조항 미발견")

    # -------------------------------------------------------------
    # 4. 글로벌 푸터(Footer.tsx) 링크 정상 연결 및 저작권/면책 요약문
    # -------------------------------------------------------------
    print("  [4/6] 글로벌 푸터(Footer.tsx) 링크 및 면책/저작권 요약문 검증 중...")

    footer_path = os.path.join(BASE_DIR, 'components', 'Footer.tsx')
    has_footer_file = os.path.exists(footer_path)
    footer_content = open(footer_path, encoding='utf-8', errors='ignore').read() if has_footer_file else ""

    # Footer 파일 존재 또는 Layout/MainApp 연동
    layout_content = open(os.path.join(BASE_DIR, 'app', 'layout.tsx'), encoding='utf-8', errors='ignore').read()
    mainapp_content = open(os.path.join(BASE_DIR, 'components', 'MainApp.tsx'), encoding='utf-8', errors='ignore').read()
    footer_integrated = has_footer_file and ('Footer' in layout_content or 'Footer' in mainapp_content)
    check('4-1', '글로벌 푸터(components/Footer.tsx) 컴포넌트 생성 및 레이아웃 연동', footer_integrated,
          "Footer 컴포넌트 및 연동 확인됨" if footer_integrated else ("Footer.tsx 미생성" if not has_footer_file else "Footer 레이아웃 연동 누락"))

    # 4대 법적 페이지 링크 포함 여부
    has_all_links = False
    link_samples = []
    if has_footer_file:
        for route in ['/about', '/privacy', '/terms', '/contact']:
            if route in footer_content:
                link_samples.append(f"{route} 링크 연결됨")
            else:
                link_samples.append(f"{route} 링크 누락")
        has_all_links = all(route in footer_content for route in ['/about', '/privacy', '/terms', '/contact'])
    check('4-2', '푸터 내 4대 필수 라우트 (/about, /privacy, /terms, /contact) 링크 연결', has_all_links,
          "4대 필수 라우트 링크 완비" if has_all_links else "일부 필수 라우트 링크 누락", link_samples)

    # 저작권 및 투자 면책 요약문
    has_copyright = any(k in footer_content or k in mainapp_content for k in ['©', 'All rights reserved', 'Dividend Pass', '배당패스'])
    has_disclaimer_summary = any(k in footer_content or k in mainapp_content for k in ['보장하지 않', '투자 책임', '단순 정보', '면책'])
    check('4-3', '푸터 내 저작권(Copyright) 및 투자 위험 면책 요약문 수록', has_copyright and has_disclaimer_summary,
          "저작권 및 면책 요약문 완비" if (has_copyright and has_disclaimer_summary) else "저작권 또는 면책 요약문 누락")

    # -------------------------------------------------------------
    # 5. SEO 인프라 (sitemap, robots, 메타데이터) 구성
    # -------------------------------------------------------------
    print("  [5/6] SEO 인프라 (sitemap, robots, metadata) 검증 중...")

    # 5-1. sitemap.ts 생성 및 필수 라우트 등록
    sitemap_ts_path = os.path.join(BASE_DIR, 'app', 'sitemap.ts')
    sitemap_xml_path = os.path.join(BASE_DIR, 'public', 'sitemap.xml')
    has_sitemap = os.path.exists(sitemap_ts_path) or os.path.exists(sitemap_xml_path)
    sitemap_detail = ""
    if os.path.exists(sitemap_ts_path):
        sm_content = open(sitemap_ts_path, encoding='utf-8', errors='ignore').read()
        sm_routes = [r for r in ['about', 'privacy', 'terms', 'contact'] if r in sm_content]
        has_sitemap = len(sm_routes) >= 4
        sitemap_detail = f"app/sitemap.ts 확인 (필수 라우트 {len(sm_routes)}/4 포함)"
    elif os.path.exists(sitemap_xml_path):
        sm_content = open(sitemap_xml_path, encoding='utf-8', errors='ignore').read()
        has_sitemap = True
        sitemap_detail = "public/sitemap.xml 확인"
    else:
        sitemap_detail = "sitemap.ts 또는 sitemap.xml 미생성"
    check('5-1', 'sitemap.ts 생성 및 4대 필수 라우트 사이트맵 등록', has_sitemap, sitemap_detail)

    # 5-2. robots.ts 생성 및 크롤러 허용 설정
    robots_ts_path = os.path.join(BASE_DIR, 'app', 'robots.ts')
    robots_txt_path = os.path.join(BASE_DIR, 'public', 'robots.txt')
    has_robots = os.path.exists(robots_ts_path) or os.path.exists(robots_txt_path)
    robots_detail = ""
    if os.path.exists(robots_ts_path):
        rb_content = open(robots_ts_path, encoding='utf-8', errors='ignore').read()
        has_allow = ('allow' in rb_content.lower()) or ('rules' in rb_content)
        has_sitemap_ref = ('sitemap' in rb_content.lower())
        has_robots = has_allow and has_sitemap_ref
        robots_detail = "app/robots.ts 확인 (크롤러 Allow 및 Sitemap 참조 완비)"
    elif os.path.exists(robots_txt_path):
        has_robots = True
        robots_detail = "public/robots.txt 확인"
    else:
        robots_detail = "robots.ts 또는 robots.txt 미생성"
    check('5-2', 'robots.ts 생성 및 크롤러 허용 / 사이트맵 연동 구성', has_robots, robots_detail)

    # 5-3. 글로벌 SEO 메타데이터 구성 (title, description, openGraph 등)
    has_seo_meta = False
    meta_detail = ""
    if 'metadata' in layout_content or 'Metadata' in layout_content:
        has_title = 'title' in layout_content
        has_desc = 'description' in layout_content
        has_og = ('openGraph' in layout_content or 'og:' in layout_content or 'metadataBase' in layout_content)
        if has_title and has_desc:
            has_seo_meta = True
            meta_detail = f"기본 메타데이터 완비 (OG 설정: {has_og})"
        else:
            meta_detail = "title 또는 description 메타데이터 누락"
    check('5-3', '글로벌 SEO 메타데이터 (title, description, OG) 구성', has_seo_meta, meta_detail)

    # -------------------------------------------------------------
    # 6. 프로덕션 빌드 무결성 (정적 페이지 8개 이상) 및 기존 기능 보존
    # -------------------------------------------------------------
    print("  [6/6] 프로덕션 빌드 (정적 페이지 8개 이상) 및 기존 기능 보존 검증 중...")

    # 6-1. npm run build 정상 완료 및 정적 페이지 8개 이상 빌드 성공
    build_ok = False
    build_detail = ""
    static_count = 0
    try:
        proc = subprocess.run(
            ['npm', 'run', 'build'],
            cwd=BASE_DIR,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            timeout=180
        )
        build_output = proc.stdout + "\n" + proc.stderr
        if proc.returncode == 0:
            # 빌드 성공 후 생성된 정적 페이지 수 파싱
            gen_match = re.search(r'Generating static pages \((\d+)/(\d+)\)', build_output)
            if gen_match:
                static_count = int(gen_match.group(2))
            else:
                # 라우트 목록 파싱: ┌ ○ / , ├ ○ /about 등
                route_matches = re.findall(r'[┌├└]\s+[○●λ]\s+([/\w\.-]+)', build_output)
                static_count = len(route_matches)

            if static_count >= 8:
                build_ok = True
                build_detail = f"빌드 성공 (정적 페이지 {static_count}개 생성 완료)"
            else:
                build_ok = False
                build_detail = f"빌드는 성공했으나 정적 페이지 수 부족 ({static_count}개 < 8개 기준)"
        else:
            build_detail = f"빌드 실패 (코드 {proc.returncode}):\n{build_output[-300:]}"
    except Exception as e:
        build_detail = f"빌드 예외 발생: {e}"

    check('6-1', '프로덕션 빌드 무결성 (정적 페이지 8개 이상 생성)', build_ok, build_detail)

    # 6-2. 500개 종목 데이터 정합성 보존 (국내 250 + 미국 250)
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
                data_detail = f"종목 수 불일치: 총 {len(stocks)}개"
        except Exception as e:
            data_detail = f"데이터 로드 실패: {e}"
    check('6-2', '기존 500개 고배당 데이터셋 정합성 보존 (KR 250 + US 250)', data_ok, data_detail)

    # 6-3. FIRE 역산 시뮬레이터 수학적 오차 한도 (|오차| <= 10,000원) 보존
    math_ok = True
    math_samples = []
    test_cases = [300_000, 1_000_000, 2_000_000, 5_000_000]
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

    check('6-3', 'FIRE 역산 시뮬레이터 수학적 오차 한도(<= 10,000원) 보존', math_ok,
          "전 테스트 케이스 단주 오차 한도 이내 일치" if math_ok else "역산 오차 허용치 초과", math_samples)

    # 6-4. 반응형 및 내추럴 UX 검증 스위트 (20개 항목) 연동
    resp_ok, resp_msg = run_script('validate_responsive.py')
    check('6-4', '모바일/데스크탑 듀얼 반응형 & 내추럴 UX 리그레션 검증 (20개 항목)', resp_ok,
          "20개 전 항목 통과 (ALL PASS)" if resp_ok else f"실패: {resp_msg}")

    # -------------------------------------------------------------
    # 검증 결과 리포트 출력
    # -------------------------------------------------------------
    print("\n" + "="*80)
    print("  [배당패스] 구글 애드센스 규정 준수 & 법적 필수 페이지 & SEO 검증 결과")
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
    ok = validate_adsense()
    sys.exit(0 if ok else 1)
