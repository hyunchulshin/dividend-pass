#!/usr/bin/env python3
"""
scripts/validate_phase1.py
Phase 1 QA 검증 스크립트 - public/data/dividend_stocks_500.json 무결성 검사
사용: python3 scripts/validate_phase1.py [--json]
종료코드: 0 = 전 항목 PASS, 1 = FAIL 존재
"""
import json
import math
import os
import sys
from collections import Counter

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(BASE_DIR, 'public', 'data', 'dividend_stocks_500.json')

REQUIRED = ['ticker', 'name', 'market', 'price', 'dpsTtm', 'dividendYield', 'dividendCycle',
            'marketCap', 'volume', 'popularityScore', 'isHighRisk', 'expenseRatio', 'topHoldings']
NUMERIC = ['price', 'dpsTtm', 'dividendYield', 'marketCap', 'volume', 'popularityScore', 'expenseRatio']
CYCLES = {'MONTHLY', 'QUARTERLY', 'ANNUAL'}
MCAP_MIN = {'KR': 100_000_000_000, 'US': 500_000_000}
REP_MONTHLY_ETFS = {'446720', '458730', 'JEPI'}  # 기획서 명시 대표 월배당 ETF

results = []  # (id, title, pass, detail, samples)


def check(cid, title, ok, detail='', samples=None):
    results.append((cid, title, ok, detail, (samples or [])[:15]))


def is_etf(x):
    # 출력 JSON에 isEtf 필드가 제거되어 있어 수수료/구성종목 유무로 추정
    return (x.get('expenseRatio') or 0) > 0 or bool(x.get('topHoldings'))


def bad_value(v):
    if v is None:
        return True
    if isinstance(v, float) and (math.isnan(v) or math.isinf(v)):
        return True
    if isinstance(v, str) and v.strip() in ('', 'undefined', 'null', 'NaN', 'None'):
        return True
    return False


def main():
    with open(DATA, encoding='utf-8') as f:
        raw = f.read()
    d = json.loads(raw)

    # ---------- 1. 볼륨 & 균형 ----------
    check('1-1', '총 종목 수 = 500', len(d) == 500, f'{len(d)}개')
    tickers = [x.get('ticker') for x in d]
    dup = [t for t, c in Counter(tickers).items() if c > 1]
    check('1-2', '티커 중복 0건', not dup, f'{len(dup)}건', dup)
    grp = Counter((x.get('market'), 'ETF' if is_etf(x) else 'STOCK') for x in d)
    exp = {('KR', 'STOCK'): 150, ('KR', 'ETF'): 100, ('US', 'STOCK'): 150, ('US', 'ETF'): 100}
    check('1-3', '시장/유형 균형 (KR 150+100 / US 150+100, 추정분류)', dict(grp) == exp,
          ', '.join(f'{k[0]}-{k[1]}={v}' for k, v in sorted(grp.items())))
    check('1-4', 'ETF/주식 구분 필드 존재 (isEtf/assetType)',
          all(('isEtf' in x) or ('assetType' in x) for x in d),
          '출력 JSON에 구분 필드 없음 -> 프론트/QA가 유형 판별 불가' if not any('isEtf' in x for x in d) else '')

    # ---------- 2. 스키마 ----------
    missing = [(x.get('ticker'), k) for x in d for k in REQUIRED if k not in x]
    check('2-1', '13개 필수 필드 존재', not missing, f'{len(missing)}건', missing)
    nulls = [(x.get('ticker'), k, x.get(k)) for x in d for k in REQUIRED if k in x and bad_value(x[k])]
    check('2-2', 'null/NaN/undefined/빈문자열 0건', not nulls and 'NaN' not in raw, f'{len(nulls)}건', nulls)
    types = [(x['ticker'], k, type(x[k]).__name__) for x in d for k in NUMERIC
             if k in x and (isinstance(x[k], bool) or not isinstance(x[k], (int, float)))]
    types += [(x['ticker'], 'isHighRisk', type(x['isHighRisk']).__name__) for x in d if not isinstance(x.get('isHighRisk'), bool)]
    types += [(x['ticker'], 'topHoldings', type(x['topHoldings']).__name__) for x in d if not isinstance(x.get('topHoldings'), list)]
    check('2-3', '필드 타입 정합성', not types, f'{len(types)}건', types)
    enums = [(x['ticker'], x.get('market'), x.get('dividendCycle')) for x in d
             if x.get('market') not in ('KR', 'US') or x.get('dividendCycle') not in CYCLES]
    check('2-4', 'market/dividendCycle enum 정합성', not enums, f'{len(enums)}건', enums)
    zero = [(x['ticker'], x['name'], {k: x[k] for k in ('price', 'volume', 'dpsTtm', 'dividendYield') if x[k] <= 0})
            for x in d if any(x[k] <= 0 for k in ('price', 'volume', 'dpsTtm', 'dividendYield'))]
    check('2-5', 'price/volume/dps/yield 0 이하 0건 (실질 결측)', not zero, f'{len(zero)}건', zero)
    etf_noh = [x['ticker'] for x in d if is_etf(x) and not x['topHoldings']]
    check('2-6', 'ETF topHoldings 비어있지 않음', not etf_noh, f'{len(etf_noh)}건', etf_noh)

    # ---------- 3. 안전 필터 ----------
    low = [(x['ticker'], x['name'], x['marketCap']) for x in d if x['marketCap'] < MCAP_MIN[x['market']]]
    check('3-1', '시총 하한 미달 0건 (KR 1,000억 / US $500M)', not low, f'{len(low)}건', low)
    risk_miss = [(x['ticker'], x['dividendYield']) for x in d if x['dividendYield'] > 20 and x['isHighRisk'] is not True]
    risk_false = [(x['ticker'], x['dividendYield']) for x in d if x['dividendYield'] <= 20 and x['isHighRisk'] is True]
    check('3-2', '배당률>20% -> isHighRisk=true (누락 0건)', not risk_miss, f'누락 {len(risk_miss)}건', risk_miss)
    check('3-3', '배당률<=20% -> isHighRisk=false (오탐 0건)', not risk_false, f'오탐 {len(risk_false)}건', risk_false)
    incons = [(x['ticker'], x['dividendYield'], round(x['dpsTtm'] / x['price'] * 100, 2))
              for x in d if x['price'] > 0 and abs(x['dpsTtm'] / x['price'] * 100 - x['dividendYield']) > max(0.5, 0.1 * x['dividendYield'])]
    check('3-4', 'dpsTtm/price 와 dividendYield 일치 (오차 10%/0.5%p 이내)', not incons, f'{len(incons)}건', incons)

    # ---------- 4. 데이터 진정성 (collector 하드코딩 fallback 시그니처) ----------
    fab_us_exc = [x['ticker'] for x in d if x['market'] == 'US' and x['price'] == 50.0 and x['dpsTtm'] == 2.0
                  and x['marketCap'] == 2_000_000_000]
    check('4-1', 'US ETF 예외 fallback(가짜 price=50/AUM=2B) 0건', not fab_us_exc, f'{len(fab_us_exc)}건', fab_us_exc)
    fab_mcap = [(x['ticker'], x['name'], x['marketCap']) for x in d if x['market'] == 'US' and x['marketCap'] in (1_500_000_000, 1_000_000_000)]
    check('4-2', 'US 시총 강제 보정값(1.5B/1.0B 정확히 일치) 0건', not fab_mcap, f'{len(fab_mcap)}건 (시총 필터 우회 의심)', fab_mcap)
    FB = {('KR', True): {8.5, 3.8, 1.6, 1.2}, ('KR', False): {2.1}, ('US', True): {8.5, 50.0, 3.5, 4.2, 2.0}, ('US', False): {2.5}}
    fab_y = [(x['ticker'], x['name'], x['dividendYield']) for x in d
             if x['dividendYield'] in FB[(x['market'], is_etf(x))]
             and abs(round(x['price'] * x['dividendYield'] / 100, 2) - x['dpsTtm']) < 0.011]
    check('4-3', '배당률 하드코딩 fallback 의심값 0건', not fab_y, f'{len(fab_y)}건 (dps=price*고정률 패턴)', fab_y)

    # ---------- 5. 인기 점수 ----------
    rng = [x['ticker'] for x in d if not (0 <= x['popularityScore'] <= 100)]
    check('5-1', 'popularityScore 0~100 범위', not rng, f'{len(rng)}건', rng)
    top = sorted(d, key=lambda x: x['popularityScore'], reverse=True)[:10]
    top_t = {x['ticker'] for x in top}
    hit = REP_MONTHLY_ETFS & top_t
    check('5-2', '상위 10위 내 대표 월배당 ETF(SOL/TIGER 미국배당다우존스, JEPI) 배치',
          hit == REP_MONTHLY_ETFS, f'포함 {sorted(hit)} / 누락 {sorted(REP_MONTHLY_ETFS - hit)}',
          [f"{i+1}. {x['ticker']} {x['name']} ({x['popularityScore']}, {x['dividendCycle']})" for i, x in enumerate(top)])
    nonmon = [x['ticker'] for x in top if x['dividendCycle'] != 'MONTHLY']
    check('5-3', '상위 10위 월배당 비중 (참고)', True, f'비월배당 {len(nonmon)}개: {nonmon}')

    # 순수 공식(AUM 60% + 거래대금 40%, 시장별 순위) 재현 — 거래대금은 volume*price 근사
    def pure(group):
        n = len(group)
        rm = {x['ticker']: i for i, x in enumerate(sorted(group, key=lambda x: -x['marketCap']))}
        rt = {x['ticker']: i for i, x in enumerate(sorted(group, key=lambda x: -x['volume'] * x['price']))}
        return {t: ((n - rm[t]) / n) * 0.6 + ((n - rt[t]) / n) * 0.4 for t in rm}
    ps = {**pure([x for x in d if x['market'] == 'KR']), **pure([x for x in d if x['market'] == 'US'])}
    pure_top = sorted(ps, key=lambda t: -ps[t])[:10]
    byt = {x['ticker']: x for x in d}
    pure_hit = REP_MONTHLY_ETFS & set(pure_top)
    check('5-4', '순수 공식 재현 시에도 대표 월배당 ETF 상위 10위 유지 (가산점 의존도 검사)',
          pure_hit == REP_MONTHLY_ETFS, f'순수공식 top10 내 대표ETF {sorted(pure_hit)}',
          [f"{i+1}. {t} {byt[t]['name']} (실제점수 {byt[t]['popularityScore']})" for i, t in enumerate(pure_top)])

    # ---------- 출력 ----------
    fails = [r for r in results if not r[2]]
    if '--json' in sys.argv:
        print(json.dumps([dict(id=r[0], title=r[1], ok=r[2], detail=r[3], samples=r[4]) for r in results],
                         ensure_ascii=False, indent=2, default=str))
    else:
        for cid, title, ok, detail, samples in results:
            print(f"[{'PASS' if ok else 'FAIL'}] {cid} {title} :: {detail}")
            for s in samples:
                print(f"        - {s}")
        print(f"\n총 {len(results)}개 항목 중 FAIL {len(fails)}개 -> 최종 판정: {'PASS' if not fails else 'FAIL'}")
    sys.exit(0 if not fails else 1)


if __name__ == '__main__':
    main()
