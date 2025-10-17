import React from 'react';
import { motion } from "framer-motion";
// import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowBigDown, ArrowBigDownDash, ArrowBigDownIcon, ArrowRight, Award, CheckCircle, Code, Shield, TrendingUp, Users, Zap } from "lucide-react"
import { useNavigate } from "react-router-dom";
function TextRoll({ children, className }) {



  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {children}
    </motion.span>
  );
}
const stats = [
  {
    icon: <Users className="w-6 h-6 text-green-600" />,
    number: "20+",
    label: "Happy Clients",
    growth: "+25%",
  },
  {
    icon: <Award className="w-6 h-6 text-green-600" />,
    number: "98%",
    label: "Success Rate",
    growth: "+5%",
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-green-600" />,
    number: "25+",
    label: "Projects Delivered",
    growth: "+40%",
  },
  {
    icon: <Code className="w-6 h-6 text-green-600" />,
    number: "24/7",
    label: "Support Available",
    growth: "Always",
  },
];

const Hero = () => {

  const navigate = useNavigate();
  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">

      <div className="absolute bottom-10 z-50 left-1/2 transform -translate-x-1/2">
        <motion.div
          animate={{
            y: [0, 15, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <ArrowBigDownDash className="text-orange-400" size={32} />
        </motion.div>
      </div>
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          className="w-full h-full object-cover"
        >
          <source
            // src="https://cdn.pixabay.com/video/2023/09/21/181533-866999835_large.mp4"
            src="https://cdn.pixabay.com/video/2021/09/13/88481-606110665_large.mp4"
            // src="https://cdn.pixabay.com/video/2016/01/31/2030-153703078_large.mp4"
            type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black opacity-60"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-20 lg:py-32">
        <div className="grid  gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >

            <div className="md:space-y-4 flex flex-col">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight flex flex-col md:inline-block">
                <TextRoll className={"text-white"}>Find. Book. Track.</TextRoll>
              </h1>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight flex flex-col md:inline-block">
                <TextRoll className={"text-white"}> Your car care, simplified.</TextRoll>
              </h1>

              <p className="text-xl text-white/90 max-w-lg leading-relaxed mt-2 md:mt-0">
                Experience car servicing made simple, transparent, and lightning-fast. Search trusted mechanics near you, book instantly, and track your car’s service in real time — all from one place.
              </p>
            </div>



            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                onClick={() => {
                  location.href = "/find-mechanics";
                }}
                size="lg"
                className="bg-orange-500 h-16 cursor-pointer hover:bg-orange-700 text-white shadow-lg shadow-orange-600/25"
              >
                Search & Book Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                onClick={() => {
                  navigate("/#services")
                }}
                size="lg"
                variant="outline"
                className="border-green-200 h-16 hover:bg-orange-50 cursor-pointer dark:border-orange-800 dark:hover:bg-orange-950/50"
              >
                Explore Services
              </Button>
            </motion.div>
          </motion.div>


        </div>
      </div>


    </div>
  );
};

export default Hero;