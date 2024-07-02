import React, { useState, useEffect } from "react";
import logo from "./assets/logo.png";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  useDisclosure,
} from "@nextui-org/react";
import axios from "axios";
import alternativeImage from "./assets/alternativaUser.png";
import { useNavigate } from "react-router-dom";
import DeleteAcc from "./userAccount/DeleteAcc";
import CreateTourModal from "./CreateTour";

function Navbar() {
  const [mobileNav, setMobileNav] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const {
    isOpen: isDeleteAccOpen,
    onOpen: onDeleteAccOpen,
    onClose: onDeleteAccClose,
  } = useDisclosure();
  const {
    isOpen: isCreateTourOpen,
    onOpen: onCreateTourOpen,
    onClose: onCreateTourClose,
  } = useDisclosure();

  const handleMyProfileClick = () => {
    navigate("/myAcc");
  };

  const toggleMobileNav = () => {
    setMobileNav(!mobileNav);
  };

  const handleClose = () => {
    setMobileNav(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios
        .get("http://localhost:3000/users/by-token", {
          headers: { Authorization: `${token}` },
        })
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user information:", error);
          localStorage.removeItem("token");
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };
  const handleCreateTourClick = () => {
    onCreateTourOpen();
  };

  return (
    <header className="lg:mt-10 absolute w-full z-30">
      <nav>
        <div className="max-w-full mx-auto px-5 py-4 sm:px-12 sm:py-6 lg:px-12 3xl:px-28 relative">
          <div className="flex items-center justify-between">
            <NavLink to="/">
              <img src={logo} alt="Logo" className="h-20 w-20" />
            </NavLink>
            <div className="hidden lg:flex lg:justify-center lg:items-center text-white nav-text gap-10 navbar-bg my-navbar w-3/4">
              <NavLink to="/" activeclassname="active" className="nav-link">
                <span className="hidden lg:inline me-4 font-bold">POČETNA</span>
              </NavLink>
              <NavLink
                to="/destination"
                activeclassname="active"
                className="nav-link"
              >
                <span className="hidden lg:inline me-4 font-bold">
                  DESTINACIJE
                </span>
              </NavLink>
              <NavLink to="/crew" activeclassname="active" className="nav-link">
                <span className="hidden lg:inline me-4 font-bold">EKIPA</span>
              </NavLink>
              <NavLink
                to="/equipment"
                activeclassname="active"
                className="nav-link"
              >
                <span className="hidden lg:inline me-4 font-bold">OPREMA</span>
              </NavLink>
              <NavLink
                to="/about"
                activeclassname="active"
                className="nav-link"
              >
                <span className="hidden lg:inline me-4 font-bold">KONTAKT</span>
              </NavLink>
              {user ? (
                <>
                  <Dropdown placement="bottom-end">
                    <DropdownTrigger>
                      <div className="flex items-center">
                        <Avatar
                          isBordered
                          as="button"
                          className="transition-transform"
                          color="default"
                          name={user.name}
                          // size="sm"
                          src={
                            user.profile_picture
                              ? `http://localhost:3000${user.profile_picture}`
                              : alternativeImage
                          }
                        />
                        <span className="ml-2 font-semibold">{user.name}</span>
                      </div>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Profile Actions" variant="flat">
                      <DropdownItem
                        key="profile"
                        className="h-14 gap-2"
                        textValue={`Signed in as ${user.email}`}
                      >
                        <p
                          className="font-semibold"
                          style={{ color: "#C4841D" }}
                        >
                          Signed in as
                        </p>
                        <p
                          className="font-semibold"
                          style={{ color: "#C4841D" }}
                        >
                          {user.email}
                        </p>
                      </DropdownItem>
                      {/* <DropdownItem
                        textValue="My Profile"
                        key="settings"
                        to="/myAcc"
                        className="nav-link"
                        onClick={handleMyProfileClick}
                      >
                        Moj Profil
                      </DropdownItem> */}
                      {user.type === "admin" && (
                        <DropdownItem
                          textValue="Kreiraj Turu"
                          key="createTour"
                          className="nav-link"
                          onClick={handleCreateTourClick} // Use separate handler function
                        >
                          Kreiraj Turu
                        </DropdownItem>
                      )}
                      <DropdownItem
                        textValue="Delete Account"
                        key="delete"
                        className="nav-link"
                        onClick={onDeleteAccOpen}
                      >
                        Obriši Nalog
                      </DropdownItem>

                      <DropdownItem
                        textValue="Log Out"
                        key="logout"
                        color="danger"
                        onClick={handleLogout}
                      >
                        Odjavi Se
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                  <CreateTourModal
                    isOpen={isCreateTourOpen}
                    onClose={onCreateTourClose}
                  />
                  <DeleteAcc
                    isOpen={isDeleteAccOpen}
                    onClose={onDeleteAccClose}
                  />
                </>
              ) : (
                <>
                  <NavLink to="/login">
                    <div className="flex flex-wrap gap-4 items-center">
                      <Button
                        color="black"
                        className="hidden lg:inline me-4 font-bold"
                        variant="faded"
                      >
                        PRIJAVI SE
                      </Button>
                    </div>
                  </NavLink>
                </>
              )}
            </div>
            <motion.button
              initial="hide"
              animate={mobileNav ? "show" : "hide"}
              onClick={toggleMobileNav}
              className="flex flex-col space-y-2 relative z-10 lg:hidden"
            >
              <motion.span
                variants={{
                  hide: {
                    rotate: 0,
                  },
                  show: {
                    rotate: 45,
                    y: 11,
                  },
                }}
                className="w-8 bg-white h-[3px] block rounded"
              ></motion.span>
              <motion.span
                variants={{
                  hide: {
                    opacity: 1,
                  },
                  show: {
                    opacity: 0,
                  },
                }}
                className="w-8 bg-white h-[3px] block rounded"
              ></motion.span>
              <motion.span
                variants={{
                  hide: {
                    rotate: 0,
                  },
                  show: {
                    rotate: -45,
                    y: -11,
                  },
                }}
                className="w-8 bg-white h-[3px] block rounded"
              ></motion.span>
            </motion.button>
          </div>
        </div>
      </nav>

      <nav
        className="lg:hidden flex justify-end nav-text text-white font-normal my-navbar"
        id="mobile-nav"
      >
        <AnimatePresence>
          {mobileNav && (
            <motion.div
              key="mobile-nav"
              variants={{
                hide: {
                  y: "-100%",
                  transition: {
                    type: "spring",
                    bounce: 0.1,
                    staggerChildren: 0.1,
                  },
                },
                show: {
                  y: "0%",
                  transition: {
                    type: "spring",
                    bounce: 0.1,
                    when: "beforeChildren",
                    staggerChildren: 0.1,
                    duration: 0.1,
                  },
                },
              }}
              initial="hide"
              animate="show"
              exit="hide"
              className="pt-24 navbar-bg h-screen"
            >
              <motion.ul
                variants={{
                  hide: {
                    y: "10%",
                    opacity: 0,
                  },
                  show: {
                    y: "0%",
                    opacity: 1,
                  },
                }}
                className="list-none"
              >
                {user && (
                  <li>
                    <Dropdown placement="bottom-end">
                      <DropdownTrigger>
                        <div className="mx-6 pb-3 flex items-center mb-6">
                          <Avatar
                            isBordered
                            as="button"
                            className="transition-transform"
                            color="default"
                            name={user.name}
                            // size="sm"
                            src={
                              user.profile_picture
                                ? `http://localhost:3000${user.profile_picture}`
                                : alternativeImage
                            }
                          />
                          <span className="ml-4 font-semibold">
                            {user.name}
                          </span>
                        </div>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Profile Actions" variant="flat">
                        <DropdownItem
                          key="profile"
                          className="h-14 gap-2"
                          textValue={`Signed in as ${user.email}`}
                        >
                          <p
                            className="font-semibold"
                            style={{ color: "#C4841D" }}
                          >
                            Signed in as
                          </p>
                          <p
                            className="font-semibold"
                            style={{ color: "#C4841D" }}
                          >
                            {user.email}
                          </p>
                        </DropdownItem>
                        {/* <DropdownItem
                          textValue="My Profile"
                          key="settings"
                          to="/myAcc"
                          className="nav-link"
                          onClick={handleMyProfileClick}
                        >
                          Moj Profil
                        </DropdownItem> */}
                        {user.type === "admin" && (
                          <DropdownItem
                            textValue="Kreiraj Turu"
                            key="createTour"
                            className="nav-link"
                            onClick={handleCreateTourClick}
                          >
                            Kreiraj Turu
                          </DropdownItem>
                        )}
                        <DropdownItem
                          textValue="Delete Account"
                          key="delete"
                          className="nav-link"
                          onClick={onDeleteAccOpen}
                        >
                          Obriši Nalog
                        </DropdownItem>
                        <DropdownItem
                          textValue="Log Out"
                          key="logout"
                          color="danger"
                          onClick={handleLogout}
                        >
                          Odjavi Se
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                    <CreateTourModal
                      isOpen={isCreateTourOpen}
                      onClose={onCreateTourClose}
                    />
                    <DeleteAcc
                      isOpen={isDeleteAccOpen}
                      onClose={onDeleteAccClose}
                    />
                  </li>
                )}
                <li>
                  <NavLink
                    to="/"
                    className="mx-6 pb-3 rounded-md nav-link"
                    onClick={handleClose}
                  >
                    <span className="pe-4 font-bold">00</span>POČETNA
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/destination"
                    className="mx-6 py-3 rounded-md nav-link"
                    onClick={handleClose}
                  >
                    <span className="pe-4 font-bold">01</span>DESTINACIJE
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/crew"
                    className="mx-6 py-3 rounded-md nav-link"
                    onClick={handleClose}
                  >
                    <span className="pe-4 font-bold">02</span>EKIPA
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/equipment"
                    className="mx-6 py-3 rounded-md nav-link"
                    onClick={handleClose}
                  >
                    <span className="pe-4 font-bold">03</span>OPREMA
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/about"
                    className="mx-6 py-3 rounded-md nav-link"
                    onClick={handleClose}
                  >
                    <span className="pe-4 font-bold">04</span>KONTAKT
                  </NavLink>
                </li>

                {!user && (
                  <li>
                    <NavLink
                      to="/login"
                      className="mx-6 py-3 rounded-md mt-6"
                      onClick={handleClose}
                    >
                      <Button
                        color="black"
                        variant="faded"
                        className="font-bold"
                      >
                        PRIJAVI SE
                      </Button>
                    </NavLink>
                  </li>
                )}
              </motion.ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}

export default Navbar;
