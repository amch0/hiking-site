import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import axios from "axios";
import { Toaster, toast } from "sonner";

const DeleteAcc = ({ isOpen, onClose }) => {
  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem("token");
      const loadingToastId = toast.loading("Brisanje naloga");
      await axios.delete("http://localhost:3000/users", {
        headers: {
          Authorization: `${token}`,
        },
      });
      toast.success("Nalog obrisan.", {
        duration: 3000,
      });
      localStorage.removeItem("token");

      onClose();
      toast.dismiss(loadingToastId);

      setTimeout(() => {
        window.location.href = "/";
      }, 3000);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <>
      <Toaster richColors position="top-right" />
      <Modal isOpen={isOpen} onOpenChange={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
              Jeste li sigurni da želite izbrisati svoj račun?
              </ModalHeader>

              <ModalFooter>
                <Button color="primary" onPress={onClose}>
                  Ne
                </Button>
                <Button color="danger" onPress={handleDeleteAccount}>
                  Da
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default DeleteAcc;
