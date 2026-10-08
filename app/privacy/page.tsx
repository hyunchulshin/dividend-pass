import React from 'react';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ShieldCheck, Cookie, Lock, FileText, UserCheck, HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: '개인정보처리방침 - 배당패스 (Dividend Pass)',
  description: '배당패스의 개인정보처리방침, 쿠키(Cookie) 정책 및 Google 애드센스 광고 게재 관련 규정 안내입니다.',
};

export default function PrivacyPage() {
  return (
    <div className="flex-1 flex flex-col bg-white min-h-screen text-slate-900">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        {/* 상단 헤더 */}
        <section className="space-y-3 border-b border-slate-200/80 pb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200/60 shadow-xs">
            <Lock size={13} className="text-blue-600" />
            <span>Privacy Policy</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            개인정보처리방침
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            최종 개정일: 2026년 10월 1일 | 시행일: 2026년 10월 1일
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            배당패스(이하 &apos;서비스&apos;)는 이용자의 개인정보를 매우 소중하게 생각하며, 관련 법령을 준수하고 있습니다.
            본 방침은 서비스 이용 시 수집되는 정보와 그 이용 목적, Google 애드센스 등 제3자 광고 사업자와 관련된 쿠키 정책을 투명하게 안내합니다.
          </p>
        </section>

        {/* 1. 개인정보 수집 항목 및 방법 */}
        <section className="space-y-3.5">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileText size={20} className="text-blue-600" />
            1. 수집하는 개인정보 항목 및 방법
          </h2>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs sm:text-sm text-slate-600 space-y-2 leading-relaxed">
            <p>
              <strong>배당패스는 회원가입 절차가 없으며, 주민등록번호, 연락처, 주소 등 민감한 개인 식별 정보를 일체 수집하거나 보관하지 않습니다.</strong>
            </p>
            <p>
              서비스 이용 과정에서 브라우저 통신에 따라 아래와 같은 비식별 정보가 자동으로 생성되어 수집될 수 있습니다:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-1 text-slate-500">
              <li>접속 IP 주소, 브라우저 종류 및 OS 정보</li>
              <li>방문 일시, 서비스 이용 및 오류 기록</li>
              <li>화면 해상도 및 기기 정보</li>
            </ul>
          </div>
        </section>

        {/* 2. 쿠키(Cookie)의 사용 및 Google 애드센스 광고 규정 */}
        <section className="space-y-3.5">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <Cookie size={20} className="text-orange-500" />
            2. 쿠키(Cookie) 사용 및 Google 애드센스(Google AdSense) 관련 안내
          </h2>
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
            <p>
              배당패스는 사용자 경험 개선 및 통계 분석, 그리고 제3자 광고 사업자(Google 포함)를 통한 온라인 광고 게재를 위해 <strong>쿠키(Cookie)</strong>를 사용합니다.
            </p>
            <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100 space-y-2">
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm">Google 광고 및 DoubleClick 쿠키 정책:</h3>
              <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-600">
                <li>
                  Google을 포함한 제3자 광고 공급업체는 사용자가 본 웹사이트 또는 다른 웹사이트를 이전에 방문한 기록을 토대로 쿠키를 사용하여 광고를 게재합니다.
                </li>
                <li>
                  Google의 광고 쿠키(DoubleClick 쿠키) 사용을 통해 Google과 파트너사는 사용자의 인터넷 사이트 방문 기록을 바탕으로 관련성 높은 맞춤형 광고를 제공할 수 있습니다.
                </li>
              </ul>
            </div>

            <h3 className="font-bold text-slate-900 pt-1">쿠키 설정 해제 및 맞춤 광고 옵트아웃(Opt-out) 방법:</h3>
            <p>
              이용자는 맞춤형 광고 수신을 거부할 권리가 있으며, 언제든지 다음 방법을 통해 쿠키 사용을 비활성화할 수 있습니다:
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs pl-1 text-slate-600">
              <li>
                <strong>Google 광고 설정:</strong>{' '}
                <a
                  href="https://www.google.com/settings/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline font-medium"
                >
                  https://www.google.com/settings/ads
                </a>
                에서 개인 맞춤 광고 게재를 해제할 수 있습니다.
              </li>
              <li>
                <strong>제3자 공급업체 쿠키 차단:</strong>{' '}
                <a
                  href="https://www.aboutads.info"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline font-medium"
                >
                  www.aboutads.info
                </a>
                를 방문하여 관심 기반 광고 쿠키를 선택 해제할 수 있습니다.
              </li>
              <li>
                <strong>브라우저 자체 설정:</strong> 웹 브라우저(Chrome, Safari, Edge 등) 설정 메뉴에서 모든 쿠키 저장을 거부하거나 기존 쿠키를 삭제할 수 있습니다.
              </li>
            </ul>
          </div>
        </section>

        {/* 3. 개인정보의 보유 및 파기 */}
        <section className="space-y-3.5">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck size={20} className="text-emerald-600" />
            3. 개인정보의 보유 기간 및 파기
          </h2>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs sm:text-sm text-slate-600 space-y-2 leading-relaxed">
            <p>
              서비스는 수집된 비식별 통계 데이터를 통계 분석 목적이 달성된 후 지체 없이 영구 파기합니다.
              전자적 파일 형태로 기록·저장된 정보는 기록을 재생할 수 없도록 기술적 방법을 사용하여 삭제합니다.
            </p>
          </div>
        </section>

        {/* 4. 이용자의 권리 및 관리자 문의 */}
        <section className="space-y-3.5">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <UserCheck size={20} className="text-indigo-600" />
            4. 이용자의 권리 행사 및 개인정보 관리 책임자
          </h2>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs sm:text-sm text-slate-600 space-y-2 leading-relaxed">
            <p>
              이용자는 언제든지 자신의 브라우저를 통해 쿠키 저장 여부를 선택할 권리가 있습니다.
              개인정보 보호와 관련된 문의, 불만 처리, 의견은 아래 공식 연락처로 접수해 주시면 신속하게 조치하겠습니다:
            </p>
            <div className="pt-1 text-xs text-slate-500 space-y-1">
              <p>• 서비스명: 배당패스 (Dividend Pass)</p>
              <p>• 이메일: <a href="mailto:contact@dividendpass.com" className="text-blue-600 underline font-semibold">contact@dividendpass.com</a></p>
            </div>
          </div>
        </section>

        {/* 5. 방침의 변경 */}
        <section className="space-y-2 text-xs text-slate-500 border-t border-slate-200 pt-6">
          <h3 className="font-bold text-slate-700">5. 개인정보처리방침 변경 안내</h3>
          <p>
            법령, 정책 또는 보안 기술의 변경에 따라 본 방침의 추가, 삭제 및 수정이 있을 시에는 웹사이트를 통해 공지합니다.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
