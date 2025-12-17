import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const Faq = () => {
    const [openItems, setOpenItems] = useState({});
    const sectionRef = useRef(null);
    const videoRef = useRef(null);

    const toggleItem = (index) => {
        setOpenItems(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    useEffect(() => {
        // Intersection Observer for animations
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // Animate header first
                        const header = entry.target.querySelector('.faq-header');
                        if (header) {
                            header.style.transform = 'translateY(0)';
                            header.style.opacity = '1';
                        }

                        // Then animate FAQ items with stagger
                        const items = entry.target.querySelectorAll('.faq-item');
                        items.forEach((item, index) => {
                            setTimeout(() => {
                                item.style.transform = 'translateY(0)';
                                item.style.opacity = '1';
                            }, index * 100);
                        });

                        // Play video when in view
                        if (videoRef.current) {
                            videoRef.current.play();
                        }
                    } else {
                        // Pause video when out of view
                        if (videoRef.current) {
                            videoRef.current.pause();
                        }
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const faqData = [
        {
            question: "What is MechanicPro?",
            answer: "MechanicPro is a professional vehicle service and maintenance platform that connects customers with trusted mechanics and provides complete solutions for car care — from engine oil changes to full diagnostics & repairs."
        },
        {
            question: "Where is MechanicPro located?",
            answer: "MechanicPro operates across multiple locations with on-site service options. Customers can book appointments online or visit our nearest partner workshop."
        },
        {
            question: "What types of vehicles do you service?",
            answer: "Currently MechanicPro provides comprehensive service for all types of four-wheelers (cars) i.e petrol, diesel, and CNG models."
        },
        {
            question: "What services are offered by MechanicPro?",
            answer: "Our services include: Engine oil and filter replacement, Brake pad and fluid replacement, Battery inspection and replacement, Gear oil and transmission service, Air conditioning maintenance, All types of electrical repairs, Accessories, Wiper and lighting system service, General vehicle inspection and diagnostics, All major repairs (full bore, half bore), Denting & painting, Full interior deep cleaning, Car wash & detailing."
        },
        {
            question: "Do you provide doorstep service?",
            answer: "Yes, MechanicPro offers doorstep vehicle check-ups and minor repairs at your preferred location, also Doorstep Pickup & Drop."
        },
        {
            question: "Do you use genuine spare parts?",
            answer: "Absolutely! We will recommend high-quality and manufacturer-approved parts to ensure safety and long-lasting performance, also keeping customer's budget preference."
        },
        {
            question: "How can customers book a service?",
            answer: "Currently, services can be booked via our website, or by contacting our customer care team directly / through WhatsApp (9281487865)."
        },
        {
            question: "Are MechanicPro's prices affordable?",
            answer: "Yes, our pricing is transparent and competitive. We provide cost estimates upfront & no hidden charges."
        },
        {
            question: "Do you offer service warranties?",
            answer: "Yes. All our services and parts come with a warranty to ensure complete customer satisfaction."
        },
        {
            question: "Is there any membership or loyalty program?",
            answer: "Yes, frequent customers can join our loyalty program to enjoy discounts, priority service, and exclusive offers."
        },
        {
            question: "What makes MechanicPro different from local garages?",
            answer: "MechanicPro focuses on professional-grade servicing, customer service satisfaction, digital job tracking, genuine parts, and certified technicians — ensuring reliability and transparency at every step, mainly MechanicPro's service assurance."
        },
        {
            question: "Are your mechanics trained and certified?",
            answer: "Yes. All our technicians are well-trained and regularly updated on the latest vehicle technologies and tools."
        },
        {
            question: "Can you handle modern vehicles and diagnostics?",
            answer: "Definitely. We use advanced diagnostic tools and OBD systems to identify and fix issues accurately."
        },
        {
            question: "What if I face issues after service?",
            answer: "Just contact our support team within the warranty period — we'll resolve it immediately."
        },
        {
            question: "How can customers give feedback?",
            answer: "We always request customer's feedback after every service - You can share your experience through our website, social media pages, or directly with our customer care team."
        }
    ];

    return (
        <section ref={sectionRef} id="faq" className="py-16 bg-black text-white relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-20 left-10 w-72 h-72 bg-coral-500 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-coral-600 rounded-full blur-3xl"></div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Left Column - FAQ Content */}
                    <div className="space-y-8">
                        {/* Header */}
                        <div className="faq-header opacity-0 transform translate-y-8 transition-all duration-700">
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                                Frequently Asked{" "}
                                <span className="text-coral-400 text-orange-500">Questions</span>
                            </h2>
                            <p className="text-xl text-coral-300 font-medium mb-4">
                                Everything You Need to Know About Our Car Services
                            </p>
                            <p className="text-gray-400 text-lg leading-relaxed">
                                We've compiled responses to the questions we hear most often
                                to help you understand our services, process, and commitment to quality.
                            </p>
                        </div>

                        {/* FAQ Items */}
                        <div className="space-y-4 cursor-pointer">
                            {faqData.map((item, index) => (
                                <div
                                    key={index}
                                    className="faq-item  cursor-pointer opacity-0 transform translate-y-8 transition-all duration-500"
                                    style={{ transitionDelay: `${index * 100}ms` }}
                                >
                                    <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden shadow-lg hover:border-coral-500/30 transition-all duration-300">
                                        <button
                                            onClick={() => toggleItem(index)}
                                            className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-800/30 transition-colors duration-200 group"
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className="flex-shrink-0 w-8 h-8 bg-coral-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                    <span className="text-white font-semibold text-sm">
                                                        {index + 1}
                                                    </span>
                                                </div>
                                                <h3 className="text-white font-semibold text-lg group-hover:text-coral-300 transition-colors duration-300">
                                                    {item.question}
                                                </h3>
                                            </div>
                                            <div className="flex-shrink-0 ml-4">
                                                <div className="w-6 h-6 bg-coral-500 rounded-full flex items-center justify-center group-hover:bg-coral-600 transition-colors duration-300">
                                                    {openItems[index] ? (
                                                        <ChevronUp className="w-4 h-4 text-white" />
                                                    ) : (
                                                        <ChevronDown className="w-4 h-4 text-white" />
                                                    )}
                                                </div>
                                            </div>
                                        </button>

                                        {/* Answer Content */}
                                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openItems[index] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                            }`}>
                                            <div className="px-6 pb-6">
                                                <div className="pl-12">
                                                    <p className="text-gray-300 text-base leading-relaxed">
                                                        {item.answer}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Video */}
                    <div className="lg:pl-8 mt-8 lg:mt-0">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                            <video
                                ref={videoRef}
                                src="https://www.pexels.com/download/video/4489872/"
                                muted
                                loop
                                playsInline
                                className="w-full h-[700px] md:h-fit object-cover rounded-2xl"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-2xl"></div>

                            {/* Video Overlay Content */}
                            {/* <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-black/60 backdrop-blur-sm rounded-xl p-4 border border-coral-500/30">
                  <h3 className="text-white font-semibold text-lg mb-2">
                    Premium Car Care Services
                  </h3>
                  <p className="text-coral-300 text-sm">
                    Experience the future of car maintenance with our professional, transparent, and reliable services.
                  </p>
                </div>
              </div> */}
                        </div>

                        {/* Stats below video */}
                        <div className="grid grid-cols-3 gap-4 mt-6">
                            <div className="text-center p-4 bg-gray-900/50 rounded-xl border border-gray-800">
                                <div className="text-2xl font-bold text-coral-400">50K+</div>
                                <div className="text-gray-400 text-sm">Cars Serviced</div>
                            </div>
                            <div className="text-center p-4 bg-gray-900/50 rounded-xl border border-gray-800">
                                <div className="text-2xl font-bold text-coral-400">98%</div>
                                <div className="text-gray-400 text-sm">Satisfaction</div>
                            </div>
                            <div className="text-center p-4 bg-gray-900/50 rounded-xl border border-gray-800">
                                <div className="text-2xl font-bold text-coral-400">24/7</div>
                                <div className="text-gray-400 text-sm">Support</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="text-center mt-16 max-w-2xl mx-auto">
                    <h3 className="text-3xl font-bold text-white mb-6">
                        Still Have Questions?
                    </h3>
                    <p className="text-gray-400 text-lg mb-6">
                        Our customer support team is here to help you with any additional questions.
                    </p>
                    <button
                        onClick={() => window.open('https://wa.me/919281487865', '_blank')}
                        className="cursor-pointer group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/25 overflow-hidden">
                        <span className="relative z-10 flex items-center justify-center space-x-2">
                            <span>Contact Support</span>
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    </button>
                </div>
            </div>

            <style jsx>{`
        .faq-header {
          transition: transform 0.7s cubic-bezier(0.23, 1, 0.32, 1), 
                      opacity 0.7s cubic-bezier(0.23, 1, 0.32, 1);
        }
        
        .faq-item {
          transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1), 
                      opacity 0.5s cubic-bezier(0.23, 1, 0.32, 1);
        }
      `}</style>
        </section>
    );
};

export default Faq;