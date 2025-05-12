'use client'
import React from 'react';
import { useState } from 'react';
import MerchantInfoModal from './store-info-modal';
import UpbitLoginModal from './upbit-login-modal';

interface RegistrationWorkflowProps {
  onComplete: () => void
}

export default function RegistrationWorkflow({ onComplete }: RegistrationWorkflowProps) {
  const [step, setStep] = useState(1); // 1: 가맹점 정보, 2: 업비트 로그인

  const handleMerchantNext = () => {
    setStep(2); // 가맹점 정보 확인 후 업비트 로그인으로 이동
  };

  const handleRegistrationComplete = () => {
    onComplete(); // 메인 컴포넌트로 완료 알림
  };

  return (
    <>
      {step === 1 && <MerchantInfoModal onNext={handleMerchantNext} />}
      {step === 2 && <UpbitLoginModal onComplete={handleRegistrationComplete} />}
    </>
  );
}