#!/usr/bin/env python3
"""
scripts/fetch_dividend_stocks.py
배당패스 500개 종목 데이터 수집 및 갱신 스크립트 (GitHub Actions 일일 무인 동기화용)
- 외부 금융 API 일시 장애 대비 최대 3회 자동 재시도(Exponential Backoff) 내장
- 원자적(Atomic) 데이터 갱신 및 기존 무결 데이터셋 안전 보존
"""

import os
import shutil
import subprocess
import sys
import time

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
COLLECTOR_SCRIPT = os.path.join(BASE_DIR, 'scripts', 'collector.py')
SRC_JSON = os.path.join(BASE_DIR, 'public', 'data', 'dividend_stocks_500.json')
DEST_JSON = os.path.join(BASE_DIR, 'public', 'dividend_stocks_500.json')
BACKUP_JSON = os.path.join(BASE_DIR, 'public', 'data', 'dividend_stocks_500.json.bak')

MAX_RETRIES = 3
RETRY_DELAY_SEC = 10


def run_collector_with_retry():
    # 기존 데이터 안전 백업
    if os.path.exists(SRC_JSON):
        try:
            shutil.copyfile(SRC_JSON, BACKUP_JSON)
        except Exception as e:
            print(f"[경고] 백업 생성 실패: {e}")

    for attempt in range(1, MAX_RETRIES + 1):
        print(f"\n[시도 {attempt}/{MAX_RETRIES}] 500개 종목 데이터 수집기 가동 중...")
        try:
            result = subprocess.run([sys.executable, COLLECTOR_SCRIPT])
            if result.returncode == 0 and os.path.exists(SRC_JSON) and os.path.getsize(SRC_JSON) > 10000:
                print(f"[성공] {attempt}번째 시도에서 500개 종목 데이터 수집 완료")
                if os.path.exists(BACKUP_JSON):
                    os.remove(BACKUP_JSON)
                return True
            else:
                print(f"[경고] {attempt}번째 시도 실패 (종료코드: {result.returncode})", file=sys.stderr)
        except Exception as e:
            print(f"[예외] 수집기 실행 중 오류 발생: {e}", file=sys.stderr)

        if attempt < MAX_RETRIES:
            wait_time = RETRY_DELAY_SEC * attempt
            print(f"-> {wait_time}초 후 재시도합니다...")
            time.sleep(wait_time)

    # 3회 모두 실패 시 기존 백업 복원
    if os.path.exists(BACKUP_JSON):
        print("[복구] 3회 수집 실패로 기존 정상 데이터셋을 복원합니다.", file=sys.stderr)
        shutil.copyfile(BACKUP_JSON, SRC_JSON)
        os.remove(BACKUP_JSON)
    return False


def main():
    print("=== [배당패스] 500개 종목 일일 자동 갱신 파이프라인 가동 ===")

    success = run_collector_with_retry()
    if not success:
        print("[치명적 오류] 3회 재시도 후에도 데이터 수집에 실패했습니다.", file=sys.stderr)
        sys.exit(1)

    # public/dividend_stocks_500.json 에도 복사하여 두 경로 모두 호환 보장
    if os.path.exists(SRC_JSON):
        shutil.copyfile(SRC_JSON, DEST_JSON)
        print(f"-> 호환용 경로 복사 완료: {DEST_JSON}")

    print("=== 일일 데이터 수집 및 정제 완주 ===")


if __name__ == '__main__':
    main()
