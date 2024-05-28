import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const isAdmin = () => {
  const token = localStorage.getItem("token");
  if (token) {
    // Decode the token
    const decodedToken = JSON.parse(atob(token.split(".")[1]));

    // Check if the user is an admin
    return decodedToken.userType === "admin";
  }
  return false;
};

const DeleteTour = ({ routeId }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const navigate = useNavigate();

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.delete(
        `http://localhost:3000/tours/${routeId}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      console.log("Tour deleted:", response.data);

      onOpenChange(false);
      navigate("/");
    } catch (error) {
      console.error("Error deleting tour:", error);
    }
  };

  if (!isAdmin()) {
    return null;
  }

  return (
    <>
      <div className="max-w-[800px] w-full m-4">
        <Button color="danger" onPress={onOpen}>
          Obriši turu
        </Button>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Potvrda
                </ModalHeader>
                <ModalBody>
                  <p className="text-black">Da li želite obrisati ovu turu?</p>
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" variant="light" onPress={onClose}>
                    Ne
                  </Button>
                  <Button
                    color="danger"
                    onPress={async () => {
                      await handleDelete();
                      onClose();
                    }}
                  >
                    Da
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </>
  );
};

export default DeleteTour;
