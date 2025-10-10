import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import styles from "./Header.module.css";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeItem, setActiveItem] = useState("");

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Find mechanics", path: "/find-mechanics" },
    { name: "Discover Services", path: "/#services" },
    { name: "About Us", path: "/about-us" },
    { name: "Contact Us", path: "/contact-us" },
    { name: "FAQ", path: "/faq" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMobileMenuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? "bg-white/10 backdrop-blur-md shadow-lg border-b border-white/20"
        : "bg-transparent"
        }`}
    >
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <a href="/" className="group flex items-center ">

            <img src="/logo.png" alt="Logo" className="w-20 h-16 object-contain" />

            <span className="text-xl font-bold text-white group-hover:text-orange-300 transition-colors duration-300">
              MechanicPro
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.path}
                onClick={() => setActiveItem(item.name)}
                className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg group ${activeItem === item.name
                  ? "text-orange-400 bg-white/10"
                  : "text-white hover:text-orange-300"
                  }`}
              >
                {item.name}
                {/* Hover line that expands from center to ends */}
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-orange-400 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          {/* Desktop CTA Button */}
          <a href="/contact">
            <button className="hidden md:block cursor-pointer group relative px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/25 hover:scale-105 overflow-hidden">
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </button>
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden group relative p-2 rounded-lg text-white hover:text-orange-300 hover:bg-white/10 transition-all duration-300"
            aria-label="Toggle mobile menu"
          >
            <div className="relative w-6 h-6">
              <Menu
                size={24}
                className={`absolute inset-0 transition-all duration-300 ${isMobileMenuOpen ? "opacity-0 rotate-90" : "opacity-100 rotate-0"
                  }`}
              />
              <X
                size={24}
                className={`absolute inset-0 transition-all duration-300 ${isMobileMenuOpen ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
                  }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? "h-full opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          <div className="py-4 space-y-2 rounded-lg mt-2 bg-white/10 backdrop-blur-md border border-white/20 flex flex-col">
            {navItems.map((item, index) => (
              <a
                key={item.name}
                href={item.path}
                onClick={() => {
                  setActiveItem(item.name);
                  setIsMobileMenuOpen(false);
                }}
                className={`relative px-4 py-3 w-fit text-sm font-medium transition-all duration-300 rounded-lg group ${activeItem === item.name
                  ? "text-orange-400 bg-white/10"
                  : "text-white hover:text-orange-300"
                  } ${styles.slideInLeft} ${isMobileMenuOpen ? "opacity-100" : "opacity-0"
                  }`}
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                {item.name}
                <span className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-orange-400 transition-all duration-300 group-hover:w-4/5"></span>
              </a>
            ))}

            <div className="pt-4 px-4 border-t border-white/20">
              <a href="/contact" className="block w-full">
                <button className="w-full cursor-pointer group relative px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/25 hover:scale-[1.02] overflow-hidden">
                  <span className="relative z-10">Get Started</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </button>
              </a>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;