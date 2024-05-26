import React, { useState, useEffect, useRef } from "react";
import { Pagination } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { formatDate } from "./dateFormatter";

const Places = () => {
  const [selectedTab, setSelectedTab] = useState("BiH");
  const [tours, setTours] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const headingRef = useRef(null);

  useEffect(() => {
    console.log("Selected Tab:", selectedTab);
    console.log("Current Page:", currentPage);
    fetchTours(selectedTab, currentPage);
  }, [selectedTab, currentPage]);

  const handlePageChange = (page) => {
    console.log("Page changed to:", page);
    setCurrentPage(page);
    scrollToTop();
  };

  const scrollToTop = () => {
    if (headingRef.current) {
      headingRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const fetchTours = async (tab, page) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/tours/?page=${page}&limit=4&status=active&type=${
          tab === "Internacionalne" ? "Internacionalna" : tab
        }`
      );
      console.log(response.data); // Log the response data
      setTours(response.data.tours);
      setTotalPages(response.data.totalPages); // Ensure the response has totalPages
    } catch (error) {
      console.error("Error fetching tours:", error);
    }
  };

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    setCurrentPage(1);
  };

  return (
    <div className="w-4/5 m-auto cursor-default">
      <div className="my-10 text-center">
        <h1 ref={headingRef} className="text-4xl font-bold text-white">
          Aktivne Ture
        </h1>
        <div className="flex gap-12 justify-center lg:justify-start my-6">
          <button
            className={`submenu-text submenu-btn uppercase ${
              selectedTab === "BiH" ? "active" : ""
            }`}
            onClick={() => handleTabChange("BiH")}
          >
            BiH
          </button>
          <button
            className={`submenu-text submenu-btn uppercase ${
              selectedTab === "Internacionalne" ? "active" : ""
            }`}
            onClick={() => handleTabChange("Internacionalne")}
          >
            Internacionalne
          </button>
        </div>
        <AnimatePresence mode="wait">
          <motion.section
            key={selectedTab}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            className="w-full"
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-cols-1 gap-10 my-10 justify-items-center items-center pb-10 border-b">
              {tours.length > 0 ? (
                tours.map((tour) => (
                  <motion.div
                    key={tour.id}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-full"
                  >
                    <div className="h-full border-opacity-60 rounded-lg overflow-hidden">
                      <img
                        className="lg:h-55 md:h-48 w-full object-cover object-center"
                        src={`http://localhost:3000${tour.images[0]}`}
                        alt=""
                      />
                      <div className="p-6 hover:bg-sky-900 hover:text-white transition duration-300 ease-in">
                        <h1 className="text-2xl text-white font-semibold mb-1">
                          {tour.title.toUpperCase()}
                        </h1>
                        <h2 className="text-base font-medium text-indigo-300 mb-1">
                          {formatDate(tour.date)}
                        </h2>
                        <h2 className="text-white leading-relaxed mb-1">
                          {tour.price}
                        </h2>
                        <h2 className="text-gray-300 leading-relaxed mb-3">
                          {tour.remaining_space} slobodnih mjesta
                        </h2>
                        <div className="flex items-center flex-wrap ">
                          <a className="text-indigo-300 inline-flex items-center md:mb-2 lg:mb-0">
                            Read More
                            <svg
                              className="w-4 h-4 ml-2"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M5 12h14"></path>
                              <path d="M12 5l7 7-7 7"></path>
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p>No tours found</p>
              )}
            </div>
            {totalPages > 1 && (
              <div className="mt-4 flex justify-center w-full">
                <Pagination
                  isCompact
                  showControls
                  color="customBlue"
                  total={totalPages}
                  initialPage={currentPage}
                  onChange={handlePageChange}
                />
              </div>
            )}
          </motion.section>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Places;
