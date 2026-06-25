import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import Button from '../components/ui/Button';

const HealthCheckFlow = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [step, setStep] = useState(1);
    
    // Form State
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [problems, setProblems] = useState([]);
    const [lifestyle, setLifestyle] = useState('');

    useEffect(() => {
        const initialProblem = searchParams.get('problem');
        if (initialProblem) {
            setProblems([initialProblem]);
        }
    }, [searchParams]);

    const problemOptions = [
        "Feeling tired", "Hair fall", "Weight gain", "Weakness", "Joint Pain", "No specific issue"
    ];

    const lifestyleOptions = ["Active", "Normal", "Low activity"];

    const handleProblemToggle = (p) => {
        if (p === "No specific issue") {
            setProblems(["No specific issue"]);
            return;
        }
        setProblems(prev => {
            if (prev.includes("No specific issue")) return [p];
            if (prev.includes(p)) return prev.filter(item => item !== p);
            return [...prev, p];
        });
    };

    const nextStep = () => {
        if (step < 4) setStep(step + 1);
        else {
            // Encode answers and go to results
            navigate(`/results?age=${age}&gender=${gender}&problems=${problems.join(',')}&lifestyle=${lifestyle}`);
        }
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
        else navigate(-1);
    };

    const isStepValid = () => {
        switch(step) {
            case 1: return age && parseInt(age) > 0 && parseInt(age) < 120;
            case 2: return gender !== '';
            case 3: return problems.length > 0;
            case 4: return lifestyle !== '';
            default: return false;
        }
    };

    const renderStep = () => {
        switch(step) {
            case 1:
                return (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex flex-col items-center w-full"
                    >
                        <h2 className="text-3xl font-black text-dark-text mb-8">What is your age?</h2>
                        <input
                            type="number"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            className="text-center text-4xl font-black w-32 border-b-4 border-medical-green outline-none bg-transparent py-2 mb-8 text-medical-green"
                            placeholder="Years"
                            autoFocus
                        />
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex flex-col items-center w-full"
                    >
                        <h2 className="text-3xl font-black text-dark-text mb-8">Select your gender</h2>
                        <div className="flex gap-4">
                            {['Male', 'Female'].map(g => (
                                <div
                                    key={g}
                                    onClick={() => setGender(g)}
                                    className={`w-32 h-32 rounded-3xl flex items-center justify-center text-xl font-black cursor-pointer transition-all border-2 ${
                                        gender === g 
                                        ? 'bg-medical-green text-white border-medical-green shadow-lg shadow-medical-green/30' 
                                        : 'bg-white text-gray-500 border-gray-100 hover:border-medical-green/30'
                                    }`}
                                >
                                    {g}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                );
            case 3:
                return (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex flex-col items-center w-full"
                    >
                        <h2 className="text-3xl font-black text-dark-text mb-8">What problems are you facing?</h2>
                        <div className="flex flex-wrap justify-center gap-3 max-w-lg">
                            {problemOptions.map(p => (
                                <div
                                    key={p}
                                    onClick={() => handleProblemToggle(p)}
                                    className={`px-6 py-4 rounded-full font-bold cursor-pointer transition-all border-2 flex items-center gap-2 ${
                                        problems.includes(p)
                                        ? 'bg-soft-green text-medical-green border-medical-green/30'
                                        : 'bg-white text-gray-600 border-gray-100 hover:border-medical-green/20'
                                    }`}
                                >
                                    {problems.includes(p) && <CheckCircle2 size={18} />}
                                    {p}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                );
            case 4:
                return (
                    <motion.div
                        key="step4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex flex-col items-center w-full"
                    >
                        <h2 className="text-3xl font-black text-dark-text mb-8">How is your lifestyle?</h2>
                        <div className="flex flex-col gap-4 w-full max-w-sm">
                            {lifestyleOptions.map(l => (
                                <div
                                    key={l}
                                    onClick={() => setLifestyle(l)}
                                    className={`w-full py-5 rounded-2xl text-center text-lg font-bold cursor-pointer transition-all border-2 ${
                                        lifestyle === l
                                        ? 'bg-soft-green text-medical-green border-medical-green/30 shadow-md'
                                        : 'bg-white text-gray-500 border-gray-100 hover:border-medical-green/20'
                                    }`}
                                >
                                    {l}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                );
            default:
                return null;
        }
    };

    return (
        <main className="min-h-screen bg-gray-50/50 flex flex-col relative pt-20 pb-24">
            <div className="container mx-auto px-4 flex-1 flex flex-col max-w-2xl">
                
                {/* Header / Progress */}
                <div className="flex items-center justify-between mb-12">
                    <button onClick={prevStep} className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100 hover:bg-gray-50 text-gray-600">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex gap-2">
                        {[1,2,3,4].map(i => (
                            <div key={i} className={`h-2 rounded-full transition-all ${i <= step ? 'w-8 bg-medical-green' : 'w-2 bg-gray-200'}`} />
                        ))}
                    </div>
                    <div className="w-12" /> {/* Spacer */}
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        {renderStep()}
                    </AnimatePresence>
                </div>

                {/* Next Button Footer */}
                <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 p-4 pb-safe z-50 shadow-[0_-10px_20px_rgba(0,0,0,0.02)] flex justify-center">
                    <div className="container max-w-2xl px-4 w-full flex justify-end">
                        <Button
                            onClick={nextStep}
                            disabled={!isStepValid()}
                            className="w-full sm:w-auto px-12 h-14 rounded-2xl text-lg font-black uppercase tracking-wider"
                        >
                            {step === 4 ? 'See Results' : 'Continue'}
                        </Button>
                    </div>
                </div>

            </div>
        </main>
    );
};

export default HealthCheckFlow;
