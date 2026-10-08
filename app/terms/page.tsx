import React from 'react';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AlertTriangle, FileCheck, ShieldAlert, Scale, HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: '이용약관 및 투자 면책고지 - 배당패스 (Dividend Pass)',
  description: '배당패스의 이용약관, 금융 투자 면책고지(Disclaimer) 및 서비스 이용 주의사항을 안내합니다.',
};

export default function TermsPage() {
  return (
    <div className="flex-1 flex flex-col bg-white min-h-screen text-slate-900">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        {/* 상단 헤더 */}
        <section className="space-y-3 border-b border-slate-200/80 pb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200/60 shadow-xs">
            <Scale size={13} className="text-blue-600" />
            <span>Terms of Service & Disclaimer</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            이용약관 및 투자 면책고지
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            최종 개정일: 2026년 10월 1일 | 시행일: 2026년 10월 1일
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            배당패스(이하 &apos;서비스&apos;)를 이용해 주셔서 감사합니다.
            본 약관은 서비스 이용에 관한 기본 권리와 의무, 그리고 법적 투자 면책사항을 규정합니다.
            서비스를 이용하기 전 본 약관을 주의 깊게 읽어 주시기 바랍니다.
          </p>
        </section>

        {/* 핵심 금융 투자 면책고지 (가장 중요) */}
        <section className="p-5 sm:p-6 rounded-2xl bg-amber-50/80 border-2 border-amber-300 space-y-3">
          <div className="flex items-center gap-2 text-amber-900 font-extrabold text-base sm:text-lg">
            <AlertTriangle className="text-amber-600 shrink-0" size={24} />
            <span>【필독】 금융 투자 면책고지 (Financial Disclaimer)</span>
          </div>
          <div className="text-xs sm:text-sm text-amber-950 leading-relaxed space-y-2.5 font-medium">
            <p className="p-3 bg-white/80 rounded-xl border border-amber-200 text-slate-900 font-bold">
              &ldquo;본 서비스의 배당률 및 시뮬레이션 결과는 단순 참고용 모의 계산이며, 특정 종목 매수/매도 권유나 투자 자문이 아닙니다. 실제 투자에 대한 모든 판단과 책임은 투자자 본인에게 있습니다.&rdquo;
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-xs text-amber-900 pl-1">
              <li>
                <strong>과거 실적의 비보장성:</strong> 서비스에 표시되는 배당수익률 및 분배금은 과거 12개월(TTM) 실제 지급 실적에 기초한 통계치이며, 향후의 배당 지속성이나 주가 상승을 보장하지 않습니다.
              </li>
              <li>
                <strong>원금 손실 위험:</strong> 배당주 및 ETF는 원금 손실 위험이 있는 금융투자상품입니다. 기업 실적 악화, 배당금 삭감(Dividend Cut), 시장 금리 인상, 경기 침체 등에 따라 투자 원금의 전부 또는 일부를 잃을 수 있습니다.
              </li>
              <li>
                <strong>환율 및 세금 변동:</strong> 미국 주식의 원화 환산액은 고정 환율(1,350원)을 가정한 모의 시뮬레이션이며, 실제 환율 변동 및 세법 개정(금융투자소득세, 배당소득세율 등)에 따라 세후 수령액이 크게 달라질 수 있습니다.
              </li>
              <li>
                <strong>자문 행위 부존재:</strong> 배당패스는 금융투자업 인가를 받은 투자자문사나 투자일임사가 아니며, 특정 개인의 재무 상태나 투자 성향을 고려하지 않은 일반 공개 정보만을 제공합니다.
              </li>
            </ul>
          </div>
        </section>

        {/* 1. 서비스의 성격 및 제공 범위 */}
        <section className="space-y-3.5">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileCheck size={20} className="text-blue-600" />
            1. 서비스의 성격 및 제공 범위
          </h2>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs sm:text-sm text-slate-600 space-y-2 leading-relaxed">
            <p>
              배당패스는 공개된 금융 시장 데이터를 수집하여 가공·시각화하는 정보 제공 웹 서비스입니다.
              이용자는 별도의 가입 없이 무료로 종목 탐색, 필터링, 포트폴리오 모의 역산 기능을 자유롭게 이용할 수 있습니다.
            </p>
            <p>
              서비스 내 모든 데이터는 기계적 알고리즘에 의해 자동 정렬되며, 유료 광고나 특정 운용사/발행사와의 이해관계에 따른 가산점은 일체 부여되지 않습니다.
            </p>
          </div>
        </section>

        {/* 2. 정보의 정확성 및 책임 제한 */}
        <section className="space-y-3.5">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert size={20} className="text-rose-600" />
            2. 정보의 정확성 및 서비스 제공자의 책임 제한
          </h2>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs sm:text-sm text-slate-600 space-y-2 leading-relaxed">
            <p>
              서비스 운영자는 데이터의 정확성과 적시성을 유지하기 위해 최선을 다하지만, 제3자 데이터 제공업체(API)의 오류, 네트워크 지연, 불가항력적 사유 등으로 인해
              정보에 오류나 누락이 발생할 수 있습니다.
            </p>
            <p>
              따라서 이용자는 실제 거래 전에 반드시 해당 기업의 공시 보고서나 증권사 HTS/MTS를 통해 최신 공시 정보를 직접 재확인해야 합니다.
              운영자는 본 서비스에서 제공된 정보를 신뢰하여 행한 투자로 발생한 어떠한 직·간접적 손해에 대해서도 법적 책임을 부담하지 않습니다.
            </p>
          </div>
        </section>

        {/* 3. 지적재산권 및 콘텐츠 이용 규정 */}
        <section className="space-y-3.5">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <Scale size={20} className="text-indigo-600" />
            3. 지적재산권 및 서비스 이용 제한
          </h2>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs sm:text-sm text-slate-600 space-y-2 leading-relaxed">
            <p>
              배당패스가 제작한 웹 디자인, 로고, 알고리즘 로직 및 텍스트 콘텐츠의 저작권은 서비스 운영자에게 있습니다.
              이용자는 사전 서면 동의 없이 본 서비스의 콘텐츠를 무단 크롤링, 복제, 상업적 배포, 재가공할 수 없습니다.
            </p>
          </div>
        </section>

        {/* 4. 약관의 변경 및 관할 법원 */}
        <section className="space-y-2 text-xs text-slate-500 border-t border-slate-200 pt-6">
          <h3 className="font-bold text-slate-700">4. 준거법 및 관할 법원</h3>
          <p>
            본 약관은 대한민국 법령에 따라 규율되고 해석되며, 서비스 이용과 관련하여 발생한 분쟁에 대해서는 민사소송법상의 관할 법원을 제1심 관할 법원으로 합니다.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
