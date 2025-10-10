import React from 'react'
import Hero from '../components/Homepage/Hero'
import WhyUs from '../components/Homepage/WhyUs'
import HowItWorks from '../components/Homepage/HowItWorks'
import Testimonials from '../components/Homepage/Testimonials'
import OurServices from '../components/Homepage/OurServices'
import Faq from '../components/Homepage/Faq'

const Home = () => {
  return (
    <div className='flex flex-col w-full bg-black'>
      <Hero />
      <WhyUs />
      <HowItWorks />
      <Testimonials />

      <OurServices />
      <Faq />

    </div>
  )
}

export default Home
