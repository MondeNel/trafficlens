import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CitizenLayout from '../../components/layout/CitizenLayout';
import PaymentModal from '../../components/citizen/PaymentModal';
import Skeleton from '../../components/ui/Skeleton';
import demoUser from '../../data/demoUser';

// Step schema mapping out the registration progression
const STEPS = [
  { id: 1, title: 'Transaction' },
  { id: 2, title: 'Personal Info' },
  { id: 3, title: 'Vehicle Class' },
  { id: 4, title: 'Declaration' },
  { id: 5, title: 'Review & Confirm' }
];

const Documents = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentItem, setPaymentItem] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // State management mapping exactly to the DL1 South African Form fields
  const [formData, setFormData] = useState({
    transactionType: 'driving_licence',
    idType: 'rsa_id',
    idNumber: '',
    surname: '',
    firstNames: '',
    gender: '',
    preferredLanguage: 'English',
    email: '',
    cellphone: '',
    vehicleClass: '',
    hasEpilepsy: false,
    hasGiddiness: false,
    hasMentalIllness: false,
    hasDiabetes: false,
    hasDefectiveVision: false,
    agreesToTerms: false
  });

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handlePayNow = () => {
    setPaymentItem({
      id: 'renewal-' + Date.now(),
      fine_type: 'license_renewal',
      description: `Driver's License Renewal Application (Class ${formData.vehicleClass || 'B'})`,
      amount: 200,
      location: 'TrafficLens Online Portal',
      plate_number: null
    });
    setShowPayment(true);
  };

  const handlePaymentComplete = async (fineId) => {
    // Simulate payment processing delay
    setIsProcessingPayment(true);
    setShowPayment(false);
    
    // Simulate backend processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessingPayment(false);
    setPaymentSuccess(true);
    
    // Redirect to dashboard after 2.5 seconds
    setTimeout(() => {
      navigate('/dashboard');
    }, 2500);
  };

  // Human-readable labels used in Step 1 and Step 5 Review
  const txLabels = {
    driving_licence: 'Driving Licence (Bestuurslisensie)',
    replacement_foreign: 'Replacement of Foreign Driving Licence',
    replacement_card: 'Replacement of Driving Licence Card (Lost/Stolen)',
    temporary_licence: 'Temporary Driving Licence'
  };

  const idLabels = {
    rsa_id: 'RSA ID Card/Book',
    traffic_register: 'Traffic Register No.',
    foreign_id: 'Foreign ID'
  };

  // Helper calculation to check if any medical flags are currently active
  const hasMedicalFlags = formData.hasEpilepsy || formData.hasGiddiness || formData.hasMentalIllness || formData.hasDiabetes || formData.hasDefectiveVision;

  // Payment success screen
  if (paymentSuccess) {
    return (
      <CitizenLayout user={demoUser}>
        <div className="flex flex-col items-center justify-center py-12 px-4 max-w-md mx-auto">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
            <svg viewBox="0 0 24 24" className="w-8 h-8 stroke-emerald-500 fill-none" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">Payment Successful!</h2>
          <p className="text-sm text-slate-500 mb-6 text-center">
            Your driving licence application and payment have been processed. You will be redirected shortly.
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 w-full mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-500">Amount Paid</span>
              <span className="font-bold text-emerald-600">R 200.00</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-500">Reference Number</span>
              <span className="font-mono text-ca font-medium">DL-{Date.now().toString(36).toUpperCase()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Status</span>
              <span className="text-emerald-600 font-medium">Completed</span>
            </div>
          </div>

          <div className="w-8 h-8 border-4 border-slate-200 border-t-ca rounded-full animate-spin mb-2" />
          <p className="text-xs text-slate-400">Redirecting to dashboard...</p>
        </div>
      </CitizenLayout>
    );
  }

  // Payment processing screen
  if (isProcessingPayment) {
    return (
      <CitizenLayout user={demoUser}>
        <div className="flex flex-col items-center justify-center py-12 px-4 max-w-md mx-auto">
          <div className="w-16 h-16 border-4 border-slate-200 border-t-ca rounded-full animate-spin mb-4" />
          <h2 className="text-lg font-bold text-slate-900 mb-2">Processing Payment</h2>
          <p className="text-sm text-slate-500 mb-6 text-center">
            Please wait while we process your payment of R 200.00.
          </p>
        </div>
      </CitizenLayout>
    );
  }

  // Success message after submission (awaiting payment)
  if (isSubmitted) {
    return (
      <CitizenLayout user={demoUser}>
        <div className="flex flex-col items-center justify-center py-12 px-4 max-w-md mx-auto">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
            <svg viewBox="0 0 24 24" className="w-8 h-8 stroke-emerald-500 fill-none" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">Application Submitted!</h2>
          <p className="text-sm text-slate-500 mb-6 text-center">
            Your driving licence application has been received. You need to pay the renewal fee to finalise the process.
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 w-full mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-500">Licence Renewal Fee</span>
              <span className="font-bold text-slate-900">R 200.00</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-500">Reference Number</span>
              <span className="font-mono text-ca font-medium">DL-{Date.now().toString(36).toUpperCase()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Status</span>
              <span className="text-amber-600 font-medium">Awaiting Payment</span>
            </div>
          </div>

          <button
            onClick={handlePayNow}
            className="w-full py-3 bg-ca text-white rounded-xl text-sm font-bold hover:bg-ca-dark transition-colors shadow-sm"
          >
            Pay R 200.00
          </button>

          <button
            onClick={() => setIsSubmitted(false)}
            className="w-full py-2 text-slate-500 text-sm mt-2 hover:text-slate-700"
          >
            ← Back to application
          </button>
        </div>

        {/* Payment Modal */}
        <PaymentModal
          isOpen={showPayment}
          onClose={() => setShowPayment(false)}
          fine={paymentItem}
          onPay={handlePaymentComplete}
          isProcessing={false}
        />
      </CitizenLayout>
    );
  }

  return (
    <CitizenLayout user={demoUser}>
      <div className="flex flex-col gap-6 max-w-2xl mx-auto">

        {/* Title Headers */}
        <div>
          <h1 className="text-lg font-semibold text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            DL1: Driving Licence Application
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">National Road Traffic Act, 1996</p>
        </div>

        {isLoading ? (
          <div className="space-y-4 bg-white p-6 border border-slate-200 rounded-xl">
            <Skeleton className="h-6 w-1/3 mb-4" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">

            {/* Progress Tracker Bar */}
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-ca">Step {currentStep} of {STEPS.length}</span>
                <span className="text-xs text-slate-500 font-medium">{STEPS[currentStep - 1].title}</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-ca h-1.5 transition-all duration-300"
                  style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Form Canvas */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">

              {/* STEP 1: TRANSACTION TYPE */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <h2 className="text-sm font-medium text-slate-900">Select Application Purpose</h2>
                  <div className="grid grid-cols-1 gap-2">
                    {Object.entries(txLabels).map(([id, label]) => (
                      <label key={id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${formData.transactionType === id ? 'border-ca bg-ca-light/30 text-ca' : 'border-slate-200 hover:bg-slate-50'}`}>
                        <input
                          type="radio"
                          name="transactionType"
                          value={id}
                          checked={formData.transactionType === id}
                          onChange={handleInputChange}
                          className="text-ca focus:ring-ca h-4 w-4"
                        />
                        <span className="text-xs font-medium text-slate-700">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: PARTICULARS OF APPLICANT */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <h2 className="text-sm font-medium text-slate-900">Section A: Particulars of Applicant</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">Identification Type</label>
                      <select name="idType" value={formData.idType} onChange={handleInputChange} className="w-full text-xs p-2.5 border border-slate-200 rounded bg-white focus:outline-none focus:border-ca">
                        {Object.entries(idLabels).map(([val, label]) => (
                          <option key={val} value={val}>{label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">Identification Number</label>
                      <input type="text" name="idNumber" value={formData.idNumber} onChange={handleInputChange} placeholder="YYMMDDSSSSXXX" className="w-full text-xs p-2.5 border border-slate-200 rounded focus:outline-none focus:border-ca" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">First Names</label>
                      <input type="text" name="firstNames" value={formData.firstNames} onChange={handleInputChange} className="w-full text-xs p-2.5 border border-slate-200 rounded focus:outline-none focus:border-ca" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">Surname</label>
                      <input type="text" name="surname" value={formData.surname} onChange={handleInputChange} className="w-full text-xs p-2.5 border border-slate-200 rounded focus:outline-none focus:border-ca" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">Gender</label>
                      <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full text-xs p-2.5 border border-slate-200 rounded bg-white focus:outline-none focus:border-ca">
                        <option value="">Select...</option>
                        <option value="male">Male (Manlik)</option>
                        <option value="female">Female (Vroulik)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">Preferred Official Language</label>
                      <select name="preferredLanguage" value={formData.preferredLanguage} onChange={handleInputChange} className="w-full text-xs p-2.5 border border-slate-200 rounded bg-white focus:outline-none focus:border-ca">
                        <option value="English">English</option>
                        <option value="Afrikaans">Afrikaans</option>
                        <option value="isiZulu">isiZulu</option>
                        <option value="isiXhosa">isiXhosa</option>
                      </select>
                    </div>
                    <div className="col-span-2 grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-500 mb-1">Cellphone Number</label>
                        <input type="tel" name="cellphone" value={formData.cellphone} onChange={handleInputChange} placeholder="0821234567" className="w-full text-xs p-2.5 border border-slate-200 rounded focus:outline-none focus:border-ca" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-500 mb-1">Email Address</label>
                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="name@example.co.za" className="w-full text-xs p-2.5 border border-slate-200 rounded focus:outline-none focus:border-ca" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: CLASS OF MOTOR VEHICLE */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <h2 className="text-sm font-medium text-slate-900">Section B: Class of Motor Vehicle</h2>
                  <div className="grid grid-cols-1 gap-2 max-h-72 overflow-y-auto pr-1">
                    {[
                      { code: 'A1', label: 'Motorcycle (Engine ≤ 125 cc)' },
                      { code: 'A', label: 'Motorcycle (Engine > 125 cc)' },
                      { code: 'B', label: 'Light Motor Vehicle / Minibus (GVM ≤ 3,500 kg)' },
                      { code: 'C1', label: 'Heavy Motor Vehicle (GVM 3,500 kg - 16,000 kg)' },
                      { code: 'C', label: 'Extra Heavy Motor Vehicle (GVM > 16,000 kg)' }
                    ].map((vehicle) => (
                      <label key={vehicle.code} className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${formData.vehicleClass === vehicle.code ? 'border-ca bg-ca-light/30' : 'border-slate-200 hover:bg-slate-50'}`}>
                        <div className="flex items-center gap-3">
                          <input type="radio" name="vehicleClass" value={vehicle.code} checked={formData.vehicleClass === vehicle.code} onChange={handleInputChange} className="text-ca focus:ring-ca h-4 w-4" />
                          <span className="text-xs text-slate-700 font-medium">{vehicle.label}</span>
                        </div>
                        <span className="px-2 py-0.5 bg-slate-100 border border-slate-300 text-slate-600 font-bold text-[10px] rounded">{vehicle.code}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 4: MEDICAL DECLARATION */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <h2 className="text-sm font-medium text-slate-900">Section D: Medical Declaration</h2>

                  <div className="space-y-2 border-b border-slate-100 pb-4">
                    {[
                      { id: 'hasEpilepsy', label: 'Uncontrolled Epilepsy' },
                      { id: 'hasGiddiness', label: 'Sudden attacks of disabling giddiness or fainting' },
                      { id: 'hasMentalIllness', label: 'Any form of severe or treatable mental illness' },
                      { id: 'hasDiabetes', label: 'Uncontrolled diabetes mellitus' },
                      { id: 'hasDefectiveVision', label: 'Defective Vision' }
                    ].map((med) => (
                      <label key={med.id} className="flex items-start gap-3 cursor-pointer py-1">
                        <input
                          type="checkbox"
                          name={med.id}
                          checked={formData[med.id]}
                          onChange={handleInputChange}
                          className="mt-0.5 rounded text-ca focus:ring-ca h-3.5 w-3.5 border-slate-300"
                        />
                        <span className="text-xs text-slate-600">{med.label}</span>
                      </label>
                    ))}

                    {/* Dynamic None of the Above Switcher */}
                    <label className="flex items-start gap-3 cursor-pointer py-1 pt-2 border-t border-slate-100 mt-2">
                      <input
                        type="checkbox"
                        name="noneOfAbove"
                        checked={!hasMedicalFlags}
                        onChange={() => {
                          setFormData(prev => ({
                            ...prev,
                            hasEpilepsy: false,
                            hasGiddiness: false,
                            hasMentalIllness: false,
                            hasDiabetes: false,
                            hasDefectiveVision: false
                          }));
                        }}
                        className="mt-0.5 rounded text-ca focus:ring-ca h-3.5 w-3.5 border-slate-300"
                      />
                      <span className="text-xs font-semibold text-slate-800">None of the above</span>
                    </label>
                  </div>

                  {/* Mandatory Legal Declaration Box */}
                  <label className={`flex items-start gap-3 p-3 rounded border transition-all cursor-pointer ${formData.agreesToTerms ? 'bg-emerald-50/40 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                    <input
                      type="checkbox"
                      name="agreesToTerms"
                      checked={formData.agreesToTerms}
                      onChange={handleInputChange}
                      className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4 border-slate-300"
                    />
                    <span className="text-[11px] text-slate-700 leading-normal">
                      I declare that I am not prohibited from obtaining a licence and all details provided are true and correct. I realize that a false declaration is punishable by law. <span className="text-rose-500 font-bold">*</span>
                    </span>
                  </label>
                </div>
              )}

              {/* STEP 5: REVIEW SCREEN */}
              {currentStep === 5 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-sm font-semibold text-slate-900">Review Form Details</h2>
                    <p className="text-[11px] text-slate-400">Please verify your entries before submission.</p>
                  </div>

                  <div className="border border-slate-200 rounded-lg overflow-hidden text-xs divide-y divide-slate-100">
                    <div className="p-3 bg-slate-50/60">
                      <span className="font-bold text-slate-400 text-[10px] uppercase tracking-wider block mb-1">01. Application Type</span>
                      <p className="text-slate-800 font-medium">{txLabels[formData.transactionType]}</p>
                    </div>

                    <div className="p-3 grid grid-cols-2 gap-y-2 gap-x-4">
                      <div className="col-span-2"><span className="font-bold text-slate-400 text-[10px] uppercase tracking-wider block">02. Personal Particulars</span></div>
                      <div>
                        <span className="text-slate-400 text-[10px]">Full Names</span>
                        <p className="text-slate-800 font-medium">{formData.firstNames || '—'} {formData.surname || '—'}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px]">{idLabels[formData.idType]}</span>
                        <p className="text-slate-800 font-medium tracking-wide">{formData.idNumber || '—'}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px]">Contact No.</span>
                        <p className="text-slate-800 font-medium">{formData.cellphone || '—'}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px]">Email Address</span>
                        <p className="text-slate-800 font-medium truncate">{formData.email || '—'}</p>
                      </div>
                    </div>

                    <div className="p-3 flex justify-between items-center bg-slate-50/60">
                      <div>
                        <span className="font-bold text-slate-400 text-[10px] uppercase tracking-wider block">03. Vehicle Licensing Code</span>
                        <p className="text-slate-800 font-medium">Requested Licensing Class</p>
                      </div>
                      <span className="px-3 py-1 bg-white border border-slate-300 text-slate-800 font-extrabold text-xs rounded shadow-sm">
                        Class {formData.vehicleClass || 'None'}
                      </span>
                    </div>

                    <div className="p-3">
                      <span className="font-bold text-slate-400 text-[10px] uppercase tracking-wider block mb-1">04. Medical Declaration Summary</span>
                      {hasMedicalFlags ? (
                        <p className="text-amber-600 font-medium text-[11px]">
                          ⚠️ Medical condition flags have been recorded for evaluation.
                        </p>
                      ) : (
                        <p className="text-emerald-600 font-medium text-[11px]">
                          ✓ Checked: No restrictive medical conditions declared.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Bar Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`px-4 py-1.5 rounded text-xs font-medium border border-slate-200 transition-colors ${currentStep === 1 ? 'text-slate-300 bg-slate-50 cursor-not-allowed' : 'text-slate-600 bg-white hover:bg-slate-50'}`}
                >
                  Back
                </button>

                {currentStep < STEPS.length ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={currentStep === 4 && !formData.agreesToTerms}
                    className={`px-4 py-1.5 text-white text-xs font-medium rounded transition-all ${
                      currentStep === 4 && !formData.agreesToTerms
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-200'
                        : 'bg-ca hover:bg-ca-dark'
                    }`}
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-5 py-1.5 text-white text-xs font-medium rounded bg-emerald-600 hover:bg-emerald-700 transition-colors"
                  >
                    Submit Application
                  </button>
                )}
              </div>

            </form>
          </div>
        )}
      </div>
    </CitizenLayout>
  );
};

export default Documents;