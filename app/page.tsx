"use client";

import { useState } from 'react';
import CompanyMode from '@/components/genome/CompanyMode';
import PersonalLabWorkspace from '@/components/lab/PersonalLabWorkspace';

export default function Home() {
  const [mode, setMode] = useState<'research' | 'company'>('research');
  return <>
    <div hidden={mode !== 'research'}><PersonalLabWorkspace onCompanyMode={() => setMode('company')} /></div>
    <div hidden={mode !== 'company'}><CompanyMode onBack={() => setMode('research')} /></div>
  </>;
}
