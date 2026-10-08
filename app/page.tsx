import React from 'react';
import MainApp from '@/components/MainApp';
import { getDividendStocks } from '@/lib/data';

export default async function HomePage() {
  const stocks = await getDividendStocks();

  return <MainApp initialStocks={stocks} />;
}
