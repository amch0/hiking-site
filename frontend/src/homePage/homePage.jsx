import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Places from "../places/places";

function Home() {
  return (
    <main className="home-bg">
      <section className="px-6 pt-40 flex-col justify-around md:mx-40 pb-12 md:pb-0 flex md:justify-center md:gap-12 lg:flex-row lg:justify-between lg:items-end lg:pb-32 3xl:pb-60 h-full">
        <div className="flex flex-col justify-center align-middle lg:w-2/5">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          >
            <h2 className="lg:text-start main-subheading text-[20px] lg:text-[28px] 3xl:text-[34px]">
              Zavirite u Divljinu
            </h2>
            <h1 className="main-title text-center lg:text-start text-[80px] md:text-[150px] md:leading-[150px] 3xl:text-[200px] 3xl:py-14">
              Gorske Priče
            </h1>
            <p className="text-center lg:text-start">
              Prepustite se avanturi na vrhovima planina gdje se susreću nebo i
              zemlja, stvarajući nezaboravne trenutke u srcu prirode!
            </p>
          </motion.div>
        </div>
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 1 }}
        >
          <Link to="/destination" className="main-btn font-bellefair"></Link>
        </motion.div>
      </section>
      <section>
        <Places />
      </section>
    </main>
  );
}

export default Home;
