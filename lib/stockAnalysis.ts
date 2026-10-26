import { DividendStock } from '@/types/stock';

export interface CashflowScenario {
  targetMonthlyNetWon: number;
  label: string;
  requiredShares: number;
  requiredCapitalWon: number;
  annualGrossWon: number;
  annualTaxWon: number;
  annualNetWon: number;
  actualMonthlyNetWon: number;
  isComprehensiveTaxWarning: boolean;
}

export interface CapitalSimResult {
  capitalWon: number;
  shares: number;
  annualGrossWon: number;
  generalAccountTaxWon: number;
  generalAccountNetWon: number;
  monthlyNetWon: number;
  isaSavedTaxWon: number;
}

export interface StockPeerMetrics {
  overallYieldRank: number;
  totalStocksCount: number;
  marketYieldRank: number;
  marketStocksCount: number;
  marketCapRank: number;
  marketAvgYield: number;
  yieldDiffFromAvg: number;
  yieldPercentile: number;
  sameCycleCount: number;
  sameCycleYieldRank: number;
}

export interface StockFaqItem {
  question: string;
  answer: string;
}

export interface StockDeepAnalysis {
  metrics: StockPeerMetrics;
  yieldTierTitle: string;
  yieldTierBadge: string;
  positioningSummary: string;
  sustainabilityAnalysis: string;
  cycleStrategyAnalysis: string;
  taxAccountAnalysis: string;
  scenarios: CashflowScenario[];
  capital50mSim: CapitalSimResult;
  capital100mSim: CapitalSimResult;
  faqs: StockFaqItem[];
}

const USD_KRW_RATE = 1350;

export function formatWonHuman(amountWon: number): string {
  const rounded = Math.round(amountWon);
  if (rounded >= 100_000_000) {
    const eok = Math.floor(rounded / 100_000_000);
    const man = Math.round((rounded % 100_000_000) / 10_000);
    return man > 0 ? `${eok}억 ${man.toLocaleString()}만 원` : `${eok}억 원`;
  }
  if (rounded >= 10_000) {
    const man = Math.round(rounded / 10_000);
    return `${man.toLocaleString()}만 원`;
  }
  return `${rounded.toLocaleString()}원`;
}

export function generateStockDeepAnalysis(
  stock: DividendStock,
  allStocks: DividendStock[]
): StockDeepAnalysis {
  const isKr = stock.market === 'KR';
  const taxRate = isKr ? 0.154 : 0.15;
  const priceWon = isKr ? stock.price : stock.price * USD_KRW_RATE;
  const dpsGrossWon = isKr ? stock.dpsTtm : stock.dpsTtm * USD_KRW_RATE;
  const dpsNetWon = dpsGrossWon * (1 - taxRate);

  // 1. 동료 집단 및 전체 랭킹 산출
  const sortedByYieldAll = [...allStocks].sort((a, b) => b.dividendYield - a.dividendYield);
  const overallYieldRank =
    sortedByYieldAll.findIndex((s) => s.ticker === stock.ticker) + 1 || 1;

  const marketStocks = allStocks.filter((s) => s.market === stock.market);
  const sortedByYieldMarket = [...marketStocks].sort((a, b) => b.dividendYield - a.dividendYield);
  const marketYieldRank =
    sortedByYieldMarket.findIndex((s) => s.ticker === stock.ticker) + 1 || 1;

  const sortedByMcapMarket = [...marketStocks].sort((a, b) => b.marketCap - a.marketCap);
  const marketCapRank =
    sortedByMcapMarket.findIndex((s) => s.ticker === stock.ticker) + 1 || 1;

  const marketAvgYield =
    marketStocks.reduce((acc, cur) => acc + cur.dividendYield, 0) /
    Math.max(1, marketStocks.length);
  const yieldDiffFromAvg = stock.dividendYield - marketAvgYield;
  const yieldPercentile = Math.max(
    1,
    Math.round((marketYieldRank / Math.max(1, marketStocks.length)) * 100)
  );

  const sameCycleStocks = marketStocks.filter(
    (s) => s.dividendCycle === stock.dividendCycle
  );
  const sortedSameCycle = [...sameCycleStocks].sort(
    (a, b) => b.dividendYield - a.dividendYield
  );
  const sameCycleYieldRank =
    sortedSameCycle.findIndex((s) => s.ticker === stock.ticker) + 1 || 1;

  const metrics: StockPeerMetrics = {
    overallYieldRank,
    totalStocksCount: allStocks.length,
    marketYieldRank,
    marketStocksCount: marketStocks.length,
    marketCapRank,
    marketAvgYield,
    yieldDiffFromAvg,
    yieldPercentile,
    sameCycleCount: sameCycleStocks.length,
    sameCycleYieldRank,
  };

  // 2. 목표 월 배당금 5단계 역산 시나리오 (월 10만 / 30만 / 50만 / 100만 / 200만 원)
  const targetSteps = [
    { amount: 100_000, label: '월 10만 원 (통신·구독비 해결)' },
    { amount: 300_000, label: '월 30만 원 (관리비·공과금 해결)' },
    { amount: 500_000, label: '월 50만 원 (기초 생활비 보탬)' },
    { amount: 1_000_000, label: '월 100만 원 (세미 파이어 기초)' },
    { amount: 2_000_000, label: '월 200만 원 (은퇴 현금흐름 완성)' },
  ];

  const scenarios: CashflowScenario[] = targetSteps.map(({ amount, label }) => {
    const targetAnnualNet = amount * 12;
    const requiredShares = dpsNetWon > 0 ? Math.ceil(targetAnnualNet / dpsNetWon) : 0;
    const requiredCapitalWon = requiredShares * priceWon;
    const annualGrossWon = requiredShares * dpsGrossWon;
    const annualNetWon = requiredShares * dpsNetWon;
    const annualTaxWon = annualGrossWon - annualNetWon;
    const actualMonthlyNetWon = annualNetWon / 12;

    return {
      targetMonthlyNetWon: amount,
      label,
      requiredShares,
      requiredCapitalWon,
      annualGrossWon,
      annualTaxWon,
      annualNetWon,
      actualMonthlyNetWon,
      isComprehensiveTaxWarning: annualGrossWon > 20_000_000,
    };
  });

  // 3. 정액 투자 시뮬레이션 (5,000만 원 / 1억 원 투자 시)
  function simulateCapital(capitalWon: number): CapitalSimResult {
    const shares = priceWon > 0 ? Math.floor(capitalWon / priceWon) : 0;
    const annualGrossWon = shares * dpsGrossWon;
    const generalAccountTaxWon = annualGrossWon * taxRate;
    const generalAccountNetWon = annualGrossWon - generalAccountTaxWon;
    const monthlyNetWon = generalAccountNetWon / 12;

    // ISA 계좌 가정: 국내 주식/국내 상장 ETF의 경우 200만 원까지 비과세, 초과분 9.9% 분리과세
    let isaTaxWon = 0;
    if (isKr) {
      if (annualGrossWon > 2_000_000) {
        isaTaxWon = (annualGrossWon - 2_000_000) * 0.099;
      }
    } else {
      // 미국 직투 종목은 일반 해외주식 계좌에서 15% 원천징수 적용
      isaTaxWon = generalAccountTaxWon;
    }
    const isaSavedTaxWon = Math.max(0, generalAccountTaxWon - isaTaxWon);

    return {
      capitalWon,
      shares,
      annualGrossWon,
      generalAccountTaxWon,
      generalAccountNetWon,
      monthlyNetWon,
      isaSavedTaxWon,
    };
  }

  const capital50mSim = simulateCapital(50_000_000);
  const capital100mSim = simulateCapital(100_000_000);

  // 4. 수익률 구간별 정밀 진단 및 서술 생성
  const marketName = isKr ? '한국거래소(KRX)' : '미국 증시(US)';
  const assetLabel = stock.isEtf ? '상장지수펀드(ETF)' : '개별 상장기업 주식';
  const cycleLabel =
    stock.dividendCycle === 'MONTHLY'
      ? '월배당(연 12회 지급)'
      : stock.dividendCycle === 'QUARTERLY'
      ? '분기배당(연 4회 지급)'
      : '연배당(연 1회 결산 지급)';

  let yieldTierTitle = '';
  let yieldTierBadge = '';
  let sustainabilityAnalysis = '';

  if (stock.dividendYield >= 9.0) {
    yieldTierTitle = '초고배당 인컴 집중형 (High-Income Tier)';
    yieldTierBadge = '초고배당 9%+';
    sustainabilityAnalysis = stock.isEtf
      ? `${stock.name}(${stock.ticker})은(는) 연 ${stock.dividendYield.toFixed(2)}%에 달하는 초고배당 구간의 ${assetLabel}입니다. 이처럼 연 9%를 상회하는 분배율은 주로 콜옵션 매도 프리미엄을 활용하는 커버드콜(Covered Call) 전략이나 고수익 채권·리츠 자산 편입을 통해 창출됩니다. 당장 매달 또는 매 분기 유입되는 현금흐름 규모가 매우 크다는 장점이 있으나, 기초자산 가격이 횡보하거나 하락할 때 원금(NAV) 회복 속도가 더딜 수 있으므로 분배금의 최소 30~50%를 재투자하거나 배당성장형 자산과 혼합 보유하는 전략이 권장됩니다.`
      : `${stock.name}(${stock.ticker})은(는) 과거 12개월 실측 기준 연 ${stock.dividendYield.toFixed(2)}%의 매우 높은 배당수익률을 기록하고 있습니다. 개별 기업이 연 9% 이상의 배당률을 나타낼 때는 고배당 정책 강화에 따른 긍정적 요인 외에도, 주가 조정에 따른 착시 현상이나 일회성 이익 배분 여부를 함께 점검해야 합니다. 따라서 직전 분기 영업현금흐름(OCF)과 배당성향 추이를 확인하며 분할 접근하는 것이 안전합니다.`;
  } else if (stock.dividendYield >= 5.5) {
    yieldTierTitle = '고배당 현금흐름 핵심형 (Core High-Yield Tier)';
    yieldTierBadge = '고배당 5.5%~9%';
    sustainabilityAnalysis = stock.isEtf
      ? `${stock.name}(${stock.ticker})은(는) 연 ${stock.dividendYield.toFixed(2)}%의 배당수익률로, 원금 방어력과 현금흐름 창출력이 균형을 이루는 핵심 인컴형 ETF 구간에 위치합니다. 시중 정기예금 금리를 크게 웃도는 분배금을 제공하면서도 과도한 옵션 매도로 인한 상방 막힘 현상이 상대적으로 덜해, 은퇴 준비 계좌나 파이어(FIRE) 포트폴리오의 메인 허리 자산으로 활용하기에 적합합니다. 연간 총보수율은 ${stock.expenseRatio.toFixed(2)}% 수준으로 장기 보유 시 비용 효율성까지 고려된 설계를 보여줍니다.`
      : `${stock.name}(${stock.ticker})은(는) 연 ${stock.dividendYield.toFixed(2)}%의 배당수익률을 제공하는 대표적 고배당 가치주입니다. 통상 연 5.5%~8% 구간의 우량 배당주는 성숙기 산업에서 탄탄한 독점적 시장 지위와 잉여현금흐름(FCF)을 바탕으로 주주환원을 실행하는 기업들이 포진해 있습니다. 주가 하락 시 높은 배당수익률이 강력한 하방 경직성(안전마진) 역할을 수행합니다.`;
  } else if (stock.dividendYield >= 3.0) {
    yieldTierTitle = '중배당·배당성장 균형형 (Dividend Growth & Balance Tier)';
    yieldTierBadge = '균형 배당성장 3%~5.5%';
    sustainabilityAnalysis = stock.isEtf
      ? `${stock.name}(${stock.ticker})은(는) 연 ${stock.dividendYield.toFixed(2)}%의 안정적인 분배율과 기초지수 자본차익(주가 상승)을 동시에 추구하는 배당성장형 ETF입니다. 당장의 표면 배당률은 초고배당 커버드콜 상품보다 낮아 보일 수 있으나, 편입 기업들의 이익 성장에 따라 매년 지급되는 주당 분배금(DPS) 자체가 우상향하기 때문에 5년·10년 이상 장기 투자 시 매수가 대비 실효 배당률(Yield on Cost)이 극대화되는 복리 효과를 기대할 수 있습니다.`
      : `${stock.name}(${stock.ticker})은(는) 연 ${stock.dividendYield.toFixed(2)}%의 배당수익률과 함께 기업 이익의 상당 부분을 미래 성장 동력에 재투자하는 균형 잡힌 배당주입니다. 무리한 배당 지급으로 재무 건전성을 훼손하지 않으면서도 꾸준한 주주환원 기조를 유지하고 있어, 주가 상승에 따른 자본 이득과 배당 소득의 조화를 원하는 장기 투자자에게 적합합니다.`;
  } else {
    yieldTierTitle = '시세차익 중심 우량 배당형 (Capital Appreciation & Quality Tier)';
    yieldTierBadge = '우량 성장+배당';
    sustainabilityAnalysis = `${stock.name}(${stock.ticker})은(는) 현재 연 ${stock.dividendYield.toFixed(2)}%의 배당수익률을 기록 중이며, 단기 고배당 인컴보다는 강력한 시장 지배력과 장기 주가 우상향을 통한 총수익률(Total Return) 극대화에 초점이 맞춰진 우량 자산입니다. 시가총액 상위권의 높은 유동성과 안정적인 재무구조를 갖추고 있어 고배당 종목들과 함께 포트폴리오의 변동성을 낮추는 핵심 코어(Core) 자산으로 편입하기에 유리합니다.`;
  }

  // 5. 시장 내 포지셔닝 종합 요약 문단
  const avgComparisonText =
    yieldDiffFromAvg >= 0
      ? `${isKr ? '국내' : '미국'} 검증 유니버스 평균 배당률(${marketAvgYield.toFixed(2)}%) 대비 +${yieldDiffFromAvg.toFixed(2)}%p 높은 수준`
      : `${isKr ? '국내' : '미국'} 검증 유니버스 평균 배당률(${marketAvgYield.toFixed(2)}%) 대비 ${Math.abs(yieldDiffFromAvg).toFixed(2)}%p 낮은 안정형 수준`;

  const positioningSummary = `${stock.name}(${stock.ticker})은(는) ${marketName}에 상장된 ${assetLabel}로, 배당패스가 수집·검증한 전체 ${metrics.totalStocksCount}개 종목 중 배당수익률 전체 ${metrics.overallYieldRank}위, ${isKr ? '국내' : '미국'} 시장 ${metrics.marketStocksCount}개 종목 중 ${metrics.marketYieldRank}위(상위 ${metrics.yieldPercentile}%)에 랭크되어 있습니다. 과거 12개월(TTM) 기준 연간 주당 배당금(DPS)은 ${isKr ? `${Math.round(stock.dpsTtm).toLocaleString()}원` : `$${stock.dpsTtm.toFixed(2)}(약 ${Math.round(dpsGrossWon).toLocaleString()}원)`}이며, 현재가 대비 배당수익률은 ${stock.dividendYield.toFixed(2)}%로 ${avgComparisonText}입니다. 시가총액 규모 면에서는 시장 내 ${metrics.marketCapRank}위를 기록하며 시가총액·거래대금 복합 인기 점수 ${stock.popularityScore.toFixed(1)}점을 획득했습니다.`;

  // 6. 배당 주기별 현금흐름 운용 전략 문단
  let cycleStrategyAnalysis = '';
  if (stock.dividendCycle === 'MONTHLY') {
    cycleStrategyAnalysis = `${stock.name}의 가장 큰 강점은 ${cycleLabel} 구조라는 점입니다. 동일 시장 내 월배당 종목 ${metrics.sameCycleCount}개 중 배당수익률 ${metrics.sameCycleYieldRank}위를 차지하고 있으며, 매월 분배금이 입금되므로 별도의 배당월 조합 없이 단일 종목만으로도 매달 고정적인 현금흐름을 창출할 수 있습니다. 특히 매달 들어오는 분배금을 즉시 재매수(DRIP)할 경우 연 1회 배당주 대비 복리 회전 속도가 12배 빨라져 보유 주식 수를 빠르게 늘리는 데 유리합니다.`;
  } else if (stock.dividendCycle === 'QUARTERLY') {
    cycleStrategyAnalysis = `${stock.name}은(는) ${cycleLabel} 방식을 채택하고 있으며, 동일 시장 내 분기배당 종목 ${metrics.sameCycleCount}개 중 배당수익률 ${metrics.sameCycleYieldRank}위에 해당합니다. 3개월마다 정기적인 현금흐름이 발생하므로, 지급월이 서로 다른 분기배당 종목 2~3개 또는 월배당 ETF와 교차 편입하면 1년 12개월 끊김 없는 월간 배당 캘린더를 완성할 수 있습니다.`;
  } else {
    cycleStrategyAnalysis = `${stock.name}은(는) ${cycleLabel} 특성을 가진 종목으로, 동일 시장 내 연배당 종목 ${metrics.sameCycleCount}개 가운데 배당수익률 ${metrics.sameCycleYieldRank}위를 기록하고 있습니다. 연말 또는 결산 기준일에 맞춰 1년 치 배당금이 일괄 지급되므로 배당락일 전후의 주가 변동성과 매수 타이밍을 면밀히 점검하는 것이 중요하며, 평달 현금흐름을 보완하기 위해 월배당 ETF와 병행 구성하는 전략이 효과적입니다.`;
  }

  // 7. 계좌별 세금 시뮬레이션 해설 문단
  const taxAccountAnalysis = isKr
    ? `현재 ${stock.name}(${stock.ticker})에 5,000만 원을 투자할 경우 약 ${capital50mSim.shares.toLocaleString()}주를 매수할 수 있으며, 연간 세전 배당금은 약 ${Math.round(capital50mSim.annualGrossWon).toLocaleString()}원입니다. 일반 위탁계좌에서 보유 시 15.4% 원천징수세로 매년 약 ${Math.round(capital50mSim.generalAccountTaxWon).toLocaleString()}원이 차감되어 세후 연 ${Math.round(capital50mSim.generalAccountNetWon).toLocaleString()}(월평균 약 ${Math.round(capital50mSim.monthlyNetWon).toLocaleString()}원)을 수령하게 됩니다. 반면 중개형 ISA 계좌를 활용하면 비과세(200만 원~400만 원) 및 9.9% 분리과세 혜택 덕분에 일반계좌 대비 매년 약 ${Math.round(capital50mSim.isaSavedTaxWon).toLocaleString()}원의 세금을 아낄 수 있습니다.`
    : `현재 ${stock.name}(${stock.ticker})에 원화 환산 5,000만 원(환율 1,350원 기준)을 투자할 경우 약 ${capital50mSim.shares.toLocaleString()}주를 보유하게 되며, 연간 세전 배당금은 약 ${Math.round(capital50mSim.annualGrossWon).toLocaleString()}원입니다. 미국 현지 배당소득세율 15.0%가 원천징수되어 매년 약 ${Math.round(capital50mSim.generalAccountTaxWon).toLocaleString()}원의 세금 차감 후 연 ${Math.round(capital50mSim.generalAccountNetWon).toLocaleString()}(월평균 약 ${Math.round(capital50mSim.monthlyNetWon).toLocaleString()}원)이 입금됩니다. 연간 해외주식 배당금과 국내 금융소득 합산액이 2,000만 원을 넘지 않도록 관리하고, 환차손익(비과세)과 배당소득(과세)의 균형을 맞추는 것이 핵심입니다.`;

  // 8. 종목별 고유 FAQ 4문 4답 생성
  const sim100m = scenarios.find((s) => s.targetMonthlyNetWon === 1_000_000) || scenarios[3];
  const sim30m = scenarios.find((s) => s.targetMonthlyNetWon === 300_000) || scenarios[1];

  const faqs: StockFaqItem[] = [
    {
      question: `${stock.name} (${stock.ticker}) 한 종목만으로 매월 세후 100만 원의 배당금을 받으려면 얼마의 투자금이 필요한가요?`,
      answer: `${stock.name}의 현재 주가(${isKr ? `${Math.round(stock.price).toLocaleString()}원` : `$${stock.price.toFixed(2)}`})와 과거 12개월 주당 배당금(${isKr ? `${Math.round(stock.dpsTtm).toLocaleString()}원` : `$${stock.dpsTtm.toFixed(2)}`}), 그리고 ${isKr ? '국내 배당소득세 15.4%' : '미국 배당소득세 15.0%'}를 반영하여 역산하면 총 ${sim100m.requiredShares.toLocaleString()}주가 필요합니다. 이를 원화 투자 원금으로 환산하면 약 ${formatWonHuman(sim100m.requiredCapitalWon)}이 소요되며, 이 경우 연간 세전 배당금은 약 ${formatWonHuman(sim100m.annualGrossWon)}, 세후 실수령액은 연 ${formatWonHuman(sim100m.annualNetWon)}(월평균 ${Math.round(sim100m.actualMonthlyNetWon).toLocaleString()}원)입니다.`,
    },
    {
      question: `${stock.name}에 5,000만 원을 투자하면 매달(또는 연간) 얼마의 배당금을 실수령하나요?`,
      answer: `${stock.name}에 5,000만 원을 거치식으로 투자하면 현재가 기준 약 ${capital50mSim.shares.toLocaleString()}주를 매수할 수 있습니다. 1년간 발생하는 세전 배당금은 약 ${Math.round(capital50mSim.annualGrossWon).toLocaleString()}원이며, 원천징수 세금(약 ${Math.round(capital50mSim.generalAccountTaxWon).toLocaleString()}원)을 제외한 세후 연간 실수령액은 약 ${Math.round(capital50mSim.generalAccountNetWon).toLocaleString()}원입니다. 이를 12개월로 나누면 월평균 약 ${Math.round(capital50mSim.monthlyNetWon).toLocaleString()}원의 현금흐름에 해당합니다.`,
    },
    {
      question: `${stock.name} (${stock.ticker})의 배당수익률은 전체 배당주 중에서 높은 편인가요?`,
      answer: `${stock.name}의 연 배당수익률은 ${stock.dividendYield.toFixed(2)}%로, 배당패스가 검증한 ${isKr ? '국내' : '미국'} 대표 배당주 ${metrics.marketStocksCount}개 중 ${metrics.marketYieldRank}위(상위 ${metrics.yieldPercentile}%), 한·미 통합 500개 종목 중 전체 ${metrics.overallYieldRank}위를 기록하고 있습니다. 이는 ${isKr ? '국내' : '미국'} 시장 평균 배당수익률(${metrics.marketAvgYield.toFixed(2)}%)과 비교해 ${yieldDiffFromAvg >= 0 ? `${yieldDiffFromAvg.toFixed(2)}%p 높은` : `${Math.abs(yieldDiffFromAvg).toFixed(2)}%p 낮은`} 수준입니다.`,
    },
    {
      question: `${stock.name}으로 월 30만 원의 부수입 파이프라인을 만들려면 몇 주를 모아야 하나요?`,
      answer: `세후 월 30만 원(연간 세후 360만 원)의 배당 현금흐름을 달성하려면 ${stock.name} 기준 총 ${sim30m.requiredShares.toLocaleString()}주를 보유해야 합니다. 필요 투자 원금은 약 ${formatWonHuman(sim30m.requiredCapitalWon)}이며, 연간 세전 배당금이 약 ${formatWonHuman(sim30m.annualGrossWon)}으로 금융소득종합과세 기준선(연 2,000만 원) 이내이므로 건강보험료나 종합소득세 합산 부담 없이 안전하게 분리과세로 종결됩니다.`,
    },
  ];

  return {
    metrics,
    yieldTierTitle,
    yieldTierBadge,
    positioningSummary,
    sustainabilityAnalysis,
    cycleStrategyAnalysis,
    taxAccountAnalysis,
    scenarios,
    capital50mSim,
    capital100mSim,
    faqs,
  };
}
