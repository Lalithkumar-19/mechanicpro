import { Linkedin, Instagram, ArrowUp } from "lucide-react";

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer className="relative  bg-gradient-to-br from-gray-900 to-black border-t text-white border-orange-100 overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="animate-pulse absolute top-10 left-10 w-20 h-20 bg-orange-200 rounded-full blur-xl"></div>
                    <div className="animate-pulse absolute top-32 right-20 w-16 h-16 bg-orange-300 rounded-full blur-lg delay-1000"></div>
                    <div className="animate-pulse absolute bottom-20 left-1/3 w-24 h-24 bg-orange-200 rounded-full blur-xl delay-2000"></div>
                </div>
            </div>

            <div className="relative max-w-8xl mx-auto px-6 py-16">
                {/* Main footer content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Company Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="group">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="relative">
                                    <a href="/" className="group flex items-center ">

                                        <img src="/logo.png" alt="Logo" className="w-20 h-16 object-contain" />

                                        <h3 className="text-2xl font-bold text-white-800 group-hover:text-orange-600 transition-colors duration-300">
                                            MechanicPro
                                        </h3>
                                    </a>
                                </div>

                            </div>
                            <p className="text-white leading-relaxed max-w-md">
                                Experience car servicing made simple, transparent, and lightning-fast. Search trusted mechanics near you, book instantly, and track your car’s service in real time — all from one place.
                            </p>
                        </div>

                        {/* Social Media */}
                        <div className="flex space-x-4">
                            <a
                                href="#"
                                className="group relative w-12 h-12 bg-orange-50 hover:bg-orange-100 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                            >
                                <Linkedin className="w-5 h-5 text-orange-600 group-hover:text-orange-700 transition-colors duration-300" />
                                <div className="absolute inset-0 rounded-full bg-orange-200 opacity-0 group-hover:opacity-20 group-hover:animate-ping"></div>
                            </a>
                            <a
                                href="#"
                                className="group relative w-12 h-12 bg-orange-50 hover:bg-orange-100 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                            >
                                <Instagram className="w-5 h-5 text-orange-600 group-hover:text-orange-700 transition-colors duration-300" />
                                <div className="absolute inset-0 rounded-full bg-orange-200 opacity-0 group-hover:opacity-20 group-hover:animate-ping"></div>
                            </a>
                        </div>
                    </div>

                    {/* Services */}
                    <div className="space-y-6">
                        <h4 className="text-lg font-semibold text-orange-500 relative">
                            Quick Links
                            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-400 group-hover:w-full transition-all duration-500"></div>
                        </h4>
                        <ul className="space-y-3">
                            {[
                                "Find Mechanics",
                                "Explore Services",
                                "FAQ",

                            ].map((service, index) => (
                                <li key={index}>
                                    <span

                                        className="group flex items-center text-white hover:text-orange-400 transition-all duration-300 hover:translate-x-2"
                                    >
                                        <div className="w-2 h-2 bg-orange-200 rounded-full mr-3 group-hover:bg-orange-400 group-hover:scale-125 transition-all duration-300"></div>
                                        {service}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div className="space-y-6">
                        <h4 className="text-lg font-semibold text-orange-500 relative">
                            Company
                            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-400 group-hover:w-full transition-all duration-500"></div>
                        </h4>
                        <ul className="space-y-3">
                            {[{ item: "About Us", link: "/about" }, { item: "Contact", link: "/contact" }].map((item, index) => (
                                <li key={index}>
                                    <a
                                        href={item.link}
                                        className="group flex items-center text-white hover:text-orange-600 transition-all duration-300 hover:translate-x-2"
                                    >
                                        {/* <div className="w-2 h-2 bg-orange-200 rounded-full mr-3 group-hover:bg-orange-400 group-hover:scale-125 transition-all duration-300"></div> */}
                                        - &nbsp;{item.item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>


                {/* Bottom section */}
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
                        <p className="text-gray-400 text-sm">
                            © 2025 MechanicPro. All rights reserved.
                        </p>
                        <div className="flex space-x-6">
                            <a
                                href="#"
                                className="text-sm text-gray-400 hover:text-orange-600 transition-colors duration-300 relative group"
                            >
                                Privacy Policy
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-400 group-hover:w-full transition-all duration-300"></span>
                            </a>
                            <a
                                href="#"
                                className="text-sm text-gray-400 hover:text-orange-600 transition-colors duration-300 relative group"
                            >
                                Terms of Service
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-400 group-hover:w-full transition-all duration-300"></span>
                            </a>
                        </div>
                    </div>

                    {/* Back to top button */}
                    <button
                        onClick={scrollToTop}
                        className="group relative w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:shadow-lg"
                    >
                        <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform duration-300" />
                        <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 group-hover:animate-ping"></div>
                    </button>
                </div>
            </div>

            <style jsx>{`
        @keyframes expand {
          0% {
            width: 0%;
          }
          50% {
            width: 100%;
          }
          100% {
            width: 0%;
          }
        }
      `}</style>
        </footer>
    );
};

export default Footer;
