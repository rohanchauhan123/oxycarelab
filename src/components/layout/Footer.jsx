import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, ArrowRight } from 'lucide-react';
import Logo from '../ui/Logo';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const quickLinks = [
        { name: 'About Us', path: '/about' },
        { name: 'Health Packages', path: '/health-packages' },
        { name: 'Partner Labs', path: '/partner-labs' },
        { name: 'Book a Test', path: '/book-test' },
        { name: 'Home Collection', path: '/home-collection' },
    ];

    const supportLinks = [
        { name: 'Terms & Conditions', path: '/terms-conditions' },
        { name: 'Privacy Policy', path: '/privacy-policy' },
        { name: 'Cancellation Policy', path: '/cancellation-policy' },
        { name: 'Refund Policy', path: '/refund-policy' },
        { name: 'FAQ', path: '/faq' },
    ];

    return (
        <footer className="bg-gray-50 pt-16 pb-8 border-t border-gray-100">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center gap-2 group transition-transform hover:scale-105 inline-block">
                            <Logo className="h-10 md:h-12" />
                        </Link>
                        <p className="text-grey-text text-sm leading-relaxed">
                            Leading the way in medical diagnostics with cutting-edge technology and patient-centric care. Your health, our priority.
                        </p>
                        <div className="flex gap-4">
                            {[
                                { Icon: Facebook, href: 'https://www.facebook.com/oxycarelabs' },
                                { Icon: Twitter, href: 'https://twitter.com/oxycarelabs' },
                                { Icon: Instagram, href: 'https://www.instagram.com/oxycarelabs/' },
                                { Icon: Linkedin, href: 'https://www.linkedin.com/company/oxycarelabs/' }
                            ].map(({ Icon, href }, i) => (
                                <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-medical-green hover:border-medical-green transition-all shadow-sm">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold mb-6">Quick Links</h4>
                        <ul className="space-y-4">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <Link to={link.path} className="text-grey-text hover:text-medical-green text-sm flex items-center group transition-colors">
                                        <ArrowRight size={14} className="mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-medical-green" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-lg font-bold mb-6">Support</h4>
                        <ul className="space-y-4">
                            {supportLinks.map((link) => (
                                <li key={link.name}>
                                    <Link to={link.path} className="text-grey-text hover:text-medical-green text-sm transition-colors block">{link.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-bold mb-6">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 group">
                                <MapPin size={18} className="text-medical-green shrink-0 mt-1" />
                                <a 
                                    href="https://www.google.com/maps/search/?api=1&query=R+K+Complex,+near+by+Police+Chawki,+Sanjay+Nagar,+Lal+Kuan,+Ghaziabad,+Uttar+Pradesh+201009" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-grey-text text-sm hover:text-medical-green transition-colors"
                                >
                                    R K Complex, near by Police Chawki, Sanjay Nagar, Lal Kuan, Ghaziabad, Uttar Pradesh 201009
                                </a>
                            </li>
                            <li className="flex items-center gap-3 group">
                                <Phone size={18} className="text-medical-green shrink-0" />
                                <a href="tel:+918376852126" className="text-grey-text text-sm hover:text-medical-green transition-colors">+91 8376852126</a>
                            </li>
                            <li className="flex items-center gap-3 group">
                                <Mail size={18} className="text-medical-green shrink-0" />
                                <a href="mailto:info@oxycarelabs.com" className="text-grey-text text-sm hover:text-medical-green transition-colors">info@oxycarelabs.com</a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Banner */}
                <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-grey-text font-medium">
                    <p>© {currentYear} OxyCareLabs Diagnostic Services. All rights reserved.</p>
                    <div className="flex gap-6">
                        <span>Designed for Health Excellence</span>
                        <span>Made with Care</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
