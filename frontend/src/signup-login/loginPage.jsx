import React, { useState, useEffect } from "react";
import ButtonStyle from "./components/button";
import backgroundImage from "../assets/background.jpg";
import { useMediaQuery } from "@react-hook/media-query";
import { Toaster, toast } from "sonner";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Link,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const Login = () => {
  const isSmallScreen = useMediaQuery("(max-width: 48em)");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Molimo navedite svoje podatke.", {
        duration: 3000,
      });
    }
    try {
      const response = await axios.post("http://localhost:3000/users/login", {
        email: email,
        password: password,
      });

      console.log("Login response:", response.data);
      localStorage.setItem("token", response.data.token);

      // navigate("/");
      window.location.href = "/";
    } catch (error) {
      if (error.response) {
        const status = error.response.status;

        if (status === 401) {
          toast.error(
            "Nevažeći email ili šifra. Molimo provjerite svoje podatke i pokušajte ponovo.",
            {
              duration: 3000,
            }
          );
        } else if (status === 403) {
          toast.error("Molimo potvrdite svoju email adresu.", {
            duration: 3000,
          });
        }
      }
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotPasswordEmail) {
      toast.error("Molimo navedite svoju email adresu.", {
        duration: 3000,
      });
    }
    const loadingToastId = toast.loading("Slanje email adrese");

    try {
      const response = await axios.post(
        "http://localhost:3000/users/forgotPassword",
        {
          email: forgotPasswordEmail,
        }
      );
      console.log("Forgot Password response:", response.data);
      toast.success("Email poslan. Provjerite svoj email.", {
        duration: 3000,
      });
      toast.dismiss(loadingToastId);
      setForgotPasswordEmail("");
    } catch (error) {
      console.error("Error sending forgot password request:", error);
      if (error.response && error.response.status === 404) {
        toast.error("Korisnik nije pornađen.", {
          duration: 3000,
        });
      }
      toast.dismiss(loadingToastId);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [])



  return (
    <div
      className={` flex items-center justify-center ${
        isSmallScreen ? "" : "bg-cover bg-center bg-no-repeat h-screen"
      }`}
      style={
        isSmallScreen ? {} : { backgroundImage: `url(${backgroundImage})` }
      }
    >
      <Toaster richColors position="top-right" />
      <div className="form bg-slate-50 p-8 rounded-lg space-y-4 w-full md:w-4/12 ">
        <h1 className="text-3xl font-bold text-center p-2">Prijavi se</h1>

        <div className="input space-y-4">
          <Input
            isRequired
            type="email"
            label="Email"
            placeholder="primjer@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            isRequired
            label="Lozinka"
            placeholder="Unesite svoju lozinku"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <FaRegEye className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <FaRegEyeSlash className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
            type={isVisible ? "text" : "password"}
          />
        </div>

        <div className="form-link text-center">
          <>
            <Link
              to="#"
              className="link login text-center cursor-pointer"
              style={{ textDecoration: "underline" }}
              onClick={onOpen}
            >
              Zaboravili ste lozinku?
            </Link>
            <Modal
              isOpen={isOpen}
              onOpenChange={onOpenChange}
              placement="top-center"
            >
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1">
                    Zaboravili ste lozinku?
                    </ModalHeader>
                    <ModalBody>
                      <Input
                        autoFocus
                        label="Email"
                        placeholder="Unesite svoj email adresu"
                        variant="bordered"
                        value={forgotPasswordEmail}
                        onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      />
                    </ModalBody>
                    <ModalFooter>
                      <Button color="danger" variant="flat" onPress={onClose}>
                        Zatvori
                      </Button>
                      <Button
                        color="primary"
                        onPress={() => {
                          handleForgotPassword();
                        }}
                      >
                        Pošalji
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
          </>
        </div>
        <ButtonStyle onClick={handleLogin}>Prijavi se</ButtonStyle>

        <div className="form-link p-2 text-center">
          <span>
            Nemate korisnički račun?{" "}
            <Link
              href="/signUp"
              className="link login"
              style={{ textDecoration: "underline" }}
            >
              Registruj se
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
