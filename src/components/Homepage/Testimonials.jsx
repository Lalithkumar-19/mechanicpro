import React from 'react';
import { motion } from 'framer-motion';

// Testimonials Column Component
const TestimonialsColumn = ({ testimonials, duration = 15, className = "" }) => {
    return (
        <div className={className}>
            <motion.div
                animate={{
                    translateY: "-50%",
                }}
                transition={{
                    duration: duration,
                    repeat: Infinity,
                    ease: "linear",
                    repeatType: "loop",
                }}
                className="flex flex-col gap-6 pb-6"
            >
                {[...new Array(2)].fill(0).map((_, index) => (
                    <React.Fragment key={index}>
                        {testimonials.map(({ text, image, name }, i) => (
                            <div
                                className="p-6 sm:p-7 md:p-8 rounded-2xl border border-gray-800 bg-[#111] shadow-lg shadow-orange-500/5 max-w-[280px] sm:max-w-xs w-full hover:shadow-orange-500/20 transition-all duration-300 hover:border-orange-500/40"
                                key={i}
                            >
                                <div className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6">{text}</div>
                                <div className="flex items-center gap-3">
                                    <img
                                        width={40}
                                        height={40}
                                        src={image}
                                        alt={name}
                                        className="h-10 w-10 rounded-full border-2 border-orange-500/30 object-cover"
                                    />
                                    <div className="flex flex-col">
                                        <div className="font-semibold tracking-tight leading-5 text-white">{name}</div>
                                        {/* <div className="leading-5 text-orange-400 tracking-tight text-sm font-medium">{role}</div> */}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </React.Fragment>
                ))}
            </motion.div>
        </div>
    );
};

const testimonials = [
    {
        text: "Booking a car service has never been this easy! I found a nearby mechanic within minutes, and the whole process—from booking to tracking—was super smooth. Loved the transparency throughout.",
        image: "https://randomuser.me/api/portraits/women/32.jpg",
        name: "Sarah Mitchell",
        role: "Honda City Owner",
    },
    {
        text: "I was surprised how fast the mechanic accepted my booking. The live tracking feature is a game-changer—I could see exactly when my car service was in progress. Highly recommended!",
        image: "https://randomuser.me/api/portraits/men/45.jpg",
        name: "Michael Rodriguez",
        role: "Maruti Swift Owner",
    },
    {
        text: "Finally, an app that actually understands car servicing! I didn’t have to call around or wait endlessly—booked, confirmed, and done. My car feels brand new now!",
        image: "https://randomuser.me/api/portraits/women/67.jpg",
        name: "Emma Thompson",
        role: "Hyundai Creta Owner",
    },
    {
        text: "This platform saved me so much time. I was able to schedule my service for the weekend, and the mechanic even updated me through each stage. Excellent service quality!",
        image: "https://randomuser.me/api/portraits/men/23.jpg",
        name: "David Chen",
        role: "Tata Nexon Owner",
    },
    {
        text: "Super convenient and reliable! I booked an AC service, and everything went exactly as shown in the app—no surprises or hidden costs. I’ll definitely use it again.",
        image: "https://randomuser.me/api/portraits/women/54.jpg",
        name: "Lisa Johnson",
        role: "Toyota Innova Owner",
    },
    {
        text: "The best part is the live progress tracking. I could see when my car was being worked on and when it was ready for pickup. Such peace of mind!",
        image: "https://randomuser.me/api/portraits/women/41.jpg",
        name: "Rachel Orange",
        role: "Volkswagen Polo Owner",
    },
    {
        text: "Amazing experience! The mechanic was skilled, friendly, and reached on time. The app made everything—from booking to payment—super simple.",
        image: "https://randomuser.me/api/portraits/men/38.jpg",
        name: "James Wilson",
        role: "Mahindra XUV500 Owner",
    },
    {
        text: "I had an engine issue, and finding a good mechanic was always tough. But this app connected me with a trusted workshop instantly. My car runs perfectly now.",
        image: "https://randomuser.me/api/portraits/women/29.jpg",
        name: "Amanda Foster",
        role: "Skoda Rapid Owner",
    },
    {
        text: "I never thought car servicing could be this simple. The app suggested the closest garages, showed upfront prices, and even let me track the repair progress. Totally worth it!",
        image: "https://randomuser.me/api/portraits/men/52.jpg",
        name: "Ryan Park",
        role: "Kia Seltos Owner",
    },
];


const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const Testimonials = () => {
    return (
        <section className="bg-[#0D0D0D] pt-20 relative overflow-hidden min-h-screen">
            {/* Background decorations */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,107,74,0.08),transparent_70%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,107,74,0.05),transparent_70%)]"></div>

            <div className="container z-10 mx-auto px-4 relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center justify-center max-w-[540px] mx-auto"
                >
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mt-6 text-center">
                        <span className="bg-gradient-to-r from-white via-orange-400 to-orange-600 bg-clip-text text-transparent">
                            What Our Customers Say
                        </span>
                    </h2>
                    <p className="text-center mt-6 text-gray-400 text-lg leading-relaxed">
                        Real stories from real customers who experienced our service difference.
                    </p>
                </motion.div>

                <div className="flex justify-center gap-3 sm:gap-4 md:gap-6 mt-16 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] max-h-[600px] overflow-hidden">
                    <TestimonialsColumn testimonials={firstColumn} duration={15} />
                    <TestimonialsColumn testimonials={secondColumn} duration={19} />
                    <TestimonialsColumn testimonials={thirdColumn} className="hidden sm:block" duration={17} />
                </div>
            </div>
            <div className='w-full mt-4 h-1 bg-gradient-to-r from-black via-orange-300 to-black' />
        </section>
    );
};

export default Testimonials;
