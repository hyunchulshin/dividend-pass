#!/usr/bin/env python3
"""
scripts/fetch_dividend_stocks.py
배당패스 500개 종목 데이터 수집 및 갱신 스크립트 (GitHub Actions 일일 무인 동기화용)
"""

import os
import shutil
import subprocess
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
COLLECTOR_SCRIPT = os.path.join(BASE_DIR, 'scripts', 'collector.py')
SRC_JSON = os.path.join(BASE_DIR, 'public', 'data', 'dividend_stocks_500.json')
DEST_JSON = os.path.join(BASE_DIR, 'public', 'dividend_stocks_500.json')

def main():
    print("=== [배당패스] 500개 종목 일일 자동 갱신 파이프라인 가동 ===")
    
    # 1. collector.py 실행
    result = subprocess.run([sys.executable, COLLECTOR_SCRIPT], check=True)
    if result.returncode != 0:
        print("[오류] collector.py 실행 실패", file=sys.stderr)
        sys.exit(result.returncode)

    # 2. public/dividend_stocks_500.json 에도 복사하여 두 경로 모두 호환 보장
    if os.path.exists(SRC_JSON):
        shutil.copyfile(SRC_JSON, DEST_JSON)
        print(f"-> 호환용 경로 복사 완료: {DEST_JSON}")

    print("=== 일일 데이터 수집 및 정제 완주 ===")

if __name__ == '__main__':
    main()
