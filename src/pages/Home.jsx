import React from 'react';
import Hero from '../components/home/Hero';
import ProblemCards from '../components/home/ProblemCards';
import HowItWorks from '../components/home/HowItWorks';
import Testimonials from '../components/home/Testimonials';
import FAQSection from '../components/home/FAQSection';

const Home = () => {
    return (
        <main className="bg-gray-50/30">
            <Hero />
            <ProblemCards />
            <HowItWorks />
            <Testimonials />
            <FAQSection />
        </main>
    );
};

export default Home;
