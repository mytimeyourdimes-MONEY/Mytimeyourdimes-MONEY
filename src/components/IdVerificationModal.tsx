import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, Upload, FileText, Camera, UserCheck, AlertTriangle } from 'lucide-react';
import { UserProfile } from '../types';

interface IdVerificationModalProps {
  user: UserProfile;
  onClose: () => void;
  onVerificationComplete: (updatedDetails: any) => void;
}

export const IdVerificationModal: React.FC<IdVerificationModalProps> = ({
  user,
  onClose,
  onVerificationComplete,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(user.isIdVerified ? 4 : 1);
  const [idType, setIdType] = useState<'driver_license' | 'state_id' | 'passport'>('driver_license');
  const [idNumber, setIdNumber] = useState('TX-98432104');
  const [frontUploaded, setFrontUploaded] = useState(true);
  const [backUploaded, setBackUploaded] = useState(true);
  const [isScanning, setIsScanning] = useState(false);

  const startVerificationScan = () => {
    setIsScanning(true);
    setStep(3);

    setTimeout(() => {
      setIsScanning(false);
      setStep(4);
      onVerificationComplete({
        idType,
        idNumberMasked: `TX-••••••${idNumber.slice(-4) || '7842'}`,
        verifiedAt: 'Just now (Instant AI Match)',
      });
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-slate-900">
                Government ID Verification
              </h3>
              <p className="text-xs text-slate-500">
                Mandatory for all posters & taskers on My Time Your Dime's
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Step 1: Select Document Type */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed">
                <strong className="block mb-0.5">Why is ID required?</strong>
                To protect neighborhood safety and prevent fraud in Escrow payouts, every user must present a valid government-issued photo ID. Your full details are encrypted and never shared publicly.
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Your ID Type
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'driver_license', title: "State Driver's License", desc: 'Fastest verification (front & back)' },
                    { id: 'state_id', title: 'State Identification Card', desc: 'Official non-driver photo identification' },
                    { id: 'passport', title: 'United States Passport', desc: 'Passport biographical page scan' },
                  ].map((item) => (
                    <label
                      key={item.id}
                      onClick={() => setIdType(item.id as any)}
                      className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                        idType === item.id
                          ? 'border-amber-500 bg-amber-50/60 ring-1 ring-amber-500'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="idType"
                        checked={idType === item.id}
                        onChange={() => setIdType(item.id as any)}
                        className="mt-1 text-amber-600 focus:ring-amber-500"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">{item.title}</span>
                        <span className="text-[11px] text-slate-500">{item.desc}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setStep(2)}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-sm"
                >
                  Continue to Document Upload
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Document Photos & Number */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Document Number (For Registry Match)
                </label>
                <input
                  type="text"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  placeholder="e.g. TX-12948291"
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="border-2 border-dashed border-emerald-300 bg-emerald-50/40 rounded-xl p-4 text-center">
                  <FileText className="w-6 h-6 text-emerald-600 mx-auto mb-1.5" />
                  <span className="text-xs font-bold text-slate-800 block">Front of ID Document</span>
                  <span className="text-[11px] text-emerald-700 block mt-1">✓ photo_id_front.jpg attached</span>
                </div>

                <div className="border-2 border-dashed border-emerald-300 bg-emerald-50/40 rounded-xl p-4 text-center">
                  <FileText className="w-6 h-6 text-emerald-600 mx-auto mb-1.5" />
                  <span className="text-xs font-bold text-slate-800 block">Back of ID (Barcode)</span>
                  <span className="text-[11px] text-emerald-700 block mt-1">✓ barcode_back.jpg attached</span>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="w-1/3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
                >
                  Back
                </button>
                <button
                  onClick={startVerificationScan}
                  className="w-2/3 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-sm"
                >
                  Run Biometric Liveness Check
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Biometric Scanning State */}
          {step === 3 && (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-600 animate-spin">
                <Camera className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-display font-bold text-base text-slate-900">
                  Verifying Identity & Matching Facial Biometrics...
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Comparing selfie landmark data against DMV/State Registry photo and validating security watermarks.
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Verification Confirmed */}
          {step === 4 && (
            <div className="text-center space-y-4 py-2">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h4 className="font-display font-extrabold text-xl text-slate-900">
                  Identity Verified Successfully
                </h4>
                <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                  Your identity has been authenticated. You now have full clearance to accept neighborhood tasks, receive daily payouts, and post service requests with the official ID Verified badge.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Verified Member:</span>
                  <span className="font-bold text-slate-900">{user.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Document Type:</span>
                  <span className="font-bold text-slate-900 capitalize">
                    {user.idDetails?.idType ? user.idDetails.idType.replace('_', ' ') : 'Driver License'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Masked ID Number:</span>
                  <span className="font-mono font-semibold text-slate-900">
                    {user.idDetails?.idNumberMasked || 'TX-••••••4821'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Active & Good Standing
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-sm"
                >
                  Return to Applet
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
