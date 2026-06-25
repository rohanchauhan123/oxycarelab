import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const problems = [
    {
        id: 1,
        title: "Feeling Tired",
        icon: "🥱",
        bgColor: "bg-soft-green",
        borderColor: "border-medical-green/20",
        textColor: "text-medical-green"
    },
    {
        id: 2,
        title: "Low Energy",
        icon: "🔋",
        bgColor: "bg-soft-green",
        borderColor: "border-medical-green/20",
        textColor: "text-medical-green"
    },
    {
        id: 3,
        title: "Weight Gain",
        icon: "⚖️",
        bgColor: "bg-soft-green",
        borderColor: "border-medical-green/20",
        textColor: "text-medical-green"
    },
    {
        id: 4,
        title: "Hair Fall",
        icon: "💇",
        bgColor: "bg-soft-green",
        borderColor: "border-medical-green/20",
        textColor: "text-medical-green"
    },
    {
        id: 5,
        title: "Diabetes Risk",
        icon: "🩸",
        bgColor: "bg-soft-green",
        borderColor: "border-medical-green/20",
        textColor: "text-medical-green"
    }
];

const ProblemCards = () => {
    const navigate = useNavigate();

    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-black text-dark-text mb-2">What's bothering you?</h2>
                    <p className="text-gray-500 font-medium">Select a symptom to find the right test</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                    {problems.map((problem, index) => (
                        <motion.div
                            key={problem.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => navigate(`/health-check?problem=${encodeURIComponent(problem.title)}`)}
                            className={`flex flex-col items-center justify-center p-6 rounded-xl border ${problem.borderColor} ${problem.bgColor} cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1`}
                        >
                            <span className="text-4xl mb-4 block drop-shadow-sm">{problem.icon}</span>
                            <span className={`text-sm md:text-base font-black text-center ${problem.textColor}`}>{problem.title}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProblemCards;
