import React, { useEffect } from "react";
import axios from "axios";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";

const TourAssignment = ({ routeId, remainingSpace, tourStatus }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Remaining space:", remainingSpace);
  }, [remainingSpace]);

  const handleAssignTour = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found in local storage");
        return;
      }

      const requestBody = {
        tourId: routeId,
      };

      const response = await axios.post(
        "http://localhost:3000/userTour/assign",
        requestBody,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      console.log("Assignment response:", response.data);
      if (response.data.message === "User is already assigned to this tour") {
        toast.warning("Već ste prijavljeni na ovu turu.", {
          style: {
            backgroundColor: "orange",
            color: "white",
          },
        });
      } else if (response.data.error) {
        toast.error(response.data.error);
      } else {
        toast.success("Uspješno ste se prijavili na turu!", {
          style: {
            backgroundColor: "green",
            color: "white",
            duration: 3000,
          },
        });
        onClose();
      }
    } catch (error) {
      console.error("Error assigning tour:", error);
      toast.warning("Već ste prijavljeni na ovu turu.", {
        style: {
          backgroundColor: "orange",
          color: "white",
          duration: 3000,
        },
      });
      onClose();
    }
  };
  if (tourStatus === "done") {
    return null;
  }
  const token = localStorage.getItem("token");

  return (
    <>
      <Toaster position="top-center" />

      {token ? (
        remainingSpace > 0 ? (
          <>
            <Button onPress={onOpen}>Prijavite se na turu</Button>
            <Modal
              isOpen={isOpen}
              onClose={onClose}
              isDismissable={false}
              isKeyboardDismissDisabled={true}
            >
              <ModalContent>
                <ModalHeader>Prijava na turu</ModalHeader>
                <ModalBody>
                  <p className="text-black">
                    Da li se želite prijaviti na ovu turu?
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button color="default" onPress={onClose}>
                    Ne
                  </Button>
                  <Button color="primary" onPress={handleAssignTour}>
                    Da
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </>
        ) : (
          <p className="text-black">
            Žao nam je, sva mjesta za ovu turu su popunjena.
          </p>
        )
      ) : (
        <p
          onClick={() => navigate("/login")}
          style={{ cursor: "pointer", color: "black" }}
        >
          Za prijavu na turu potreban Login
        </p>
      )}
    </>
  );
};

export default TourAssignment;
