// CreateTourModal.js
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

export default function CreateTourModal({ isOpen, onClose }) {
  const [size, setSize] = React.useState("md");
  const sizes = [
    "xs",
    "sm",
    "md",
    "lg",
    "xl",
    "2xl",
    "3xl",
    "4xl",
    "5xl",
    "full",
  ];

  const handleOpen = (size) => {
    setSize(size);
  };

  return (
    <Modal size={size} isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <>
          <ModalHeader className="flex flex-col gap-1">Create Tour</ModalHeader>
          <ModalBody>
            {/* Add your input fields here for creating a tour */}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Close
            </Button>
            <Button color="primary" onPress={onClose}>
              Create
            </Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
}
