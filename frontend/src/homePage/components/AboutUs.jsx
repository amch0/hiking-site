import React from "react";
import { aboutUsData } from "/data.json";
import { motion } from "framer-motion";
import { FaInstagram, FaFacebookF, FaViber } from "react-icons/fa";
import { Toaster, toast } from "sonner";
import { useState } from "react";
import axios from "axios";

function AboutUs() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");

  const sendEmail = (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error("All fields are required");
      return;
    }
    const loadingToastId = toast.loading("Slanje email");
    axios
      .post("http://localhost:3000/contact", {
        name,
        email,
        phone_number: phoneNumber,
        message,
      })
      .then((response) => {
        console.log("Email sent successfully", response);
        toast.success("Email poslan uspjesno!");
        setName("");
        setEmail("");
        setPhoneNumber("");
        setMessage("");
      })
      .catch((error) => {
        console.error("Error sending email", error);
        toast.error("Failed to send email. Please try again later.");
      })
      .finally(() => {
        toast.dismiss(loadingToastId);
      });
  };
  const contactData = aboutUsData.find((item) => item.title === "Kontakt");

  return (
    <main className="tech-bg  px-5 md:px-12 pb-52 md:pb-0 lg:pb-0 pt-24 md:pt-40 lg:px-40 lg:pt-52 lg:relative min-[912px]:h-screen">
      <section className="md:pt-14 text-white flex flex-wrap justify-center md:flex-col md:items-center lg:pt-0 lg:gap-10">
        <h1 className="section-heading text-center md:text-start mb-2 md:mb-4 lg:mb-2">
          <span className="me-5 section-number"></span>O NAMA
        </h1>

        <article className="text-center lg:text-start md:flex md:flex-col lg:basis-2/3">
          <hr className="opacity-30 md:hidden pb-4" />
          <motion.div
            className="grid gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 1 }}
          >
            {contactData && (
              <div className="flex flex-col lg:flex-row gap-6 justify-center items-center w-full  mx-auto md:mx-auto lg:mx-0">
                <div className="w-full lg:w-1/2">
                  <h2 className="text-xl font-semibold mb-4">INFO</h2>
                  <p
                    className="text-sky-100 font-semibold mb-4"
                    style={{ textAlign: "justify" }}
                  >
                    Gorske priče su planinarsko udruženje koje je osnovano 2024.
                    godine u Sarajevu od strane mladih i ambicioznih planinara.
                    Cilj udruženja je promoviranje ljubavi prema prirodi,
                    očuvanje planinskih područja i promicanje aktivnog života u
                    prirodi među mladima i širom zajednicom. Gorske priče
                    nastoje postati središnje mjesto okupljanja ljubitelja
                    prirode i planinarenja te pružiti potporu mladim planinarima
                    u njihovim avanturama u prirodi. Ovo udruženje teži postati
                    prepoznatljivim čimbenikom u promicanju aktivnog života u
                    prirodi i očuvanju prirodnih resursa planinskih područja u
                    Bosni i Hercegovini. U slučaju bilo kakvih pitanja
                    kontakirajte nas putem emaila i pridruzite nam se na:
                  </p>
                  <div className="flex justify-center">
                    <a
                      href="https://www.instagram.com/example"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center mr-4 text-rose-500 cursor-pointer text-3xl"
                    >
                      <FaInstagram className="mr-2" />
                    </a>
                    <a
                      href="https://www.facebook.com/example"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center mr-4 text-sky-200 cursor-pointer text-3xl"
                    >
                      <FaFacebookF className="mr-2" />
                    </a>
                    <a
                      href="viber://chat?number=+123456789"
                      className="flex items-center text-pink-400 cursor-pointer text-3xl"
                    >
                      <FaViber className="mr-2" />
                    </a>
                  </div>
                </div>
                <form
                  className="grid gap-6 text-left w-full lg:w-1/2"
                  onSubmit={sendEmail}
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-300">
                      Ime
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 p-2 block w-full bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 p-2 block w-full bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">
                      Kontakt Broj
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="mt-1 p-2 block w-full bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">
                      Poruka
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="mt-1 p-2 block w-full bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
                      rows="4"
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-500"
                  >
                    Pošalji
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </article>
      </section>
    </main>
  );
}

export default AboutUs;
