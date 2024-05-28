import React, { useState, useRef } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
} from "@nextui-org/react";
import axios from "axios";
import { MdCancel } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import TourType from "./adminAccountPage/TourType";
import { DatePicker } from "@nextui-org/date-picker";
import moment from "moment";
import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function CreateTourModal({ isOpen, onClose }) {
  const [size, setSize] = useState("5xl");
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

  const [userDetails, setUserDetails] = useState(null);
  const [date, setDate] = useState(null); // Ensure date is a Date object
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [duration, setDuration] = useState("");
  const [equipment, setEquipment] = useState("");
  const [limit_number, setLimitNumber] = useState("");
  const [selectedType, setSelectedType] = useState(null);

  const [images, setImages] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const selectedFiles = e.target.files;
    console.log("Selected Files:", selectedFiles);

    setImages((prevImages) => {
      const newImages = [...prevImages, ...Array.from(selectedFiles)];
      console.log("New Images:", newImages);
      return newImages;
    });
  };

  const handleRemoveImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleImageClick = () => {
    inputRef.current.click();
  };

  const handleTypeChange = (value) => {
    setSelectedType(value);
    console.log("Selected Type:", value);
  };

  const handleSetDate = (date) => {
    // Ensure correct handling of date

    const formattedDate = moment(date)
      .subtract(1, "months")
      .startOf("day")
      .format("YYYY-MM-DD");
    setDate(formattedDate);
  };

  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/login");
    return null;
  }

  const handleCreateTour = async () => {
    if (
      !title ||
      !date ||
      !difficulty ||
      !price ||
      !duration ||
      !limit_number ||
      !description ||
      !selectedType
    ) {
      toast.error("Molimo vas unesite obavezna polja", {
        duration: 3000,
      });
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3000/users/by-token`, {
        headers: { Authorization: `${token}` },
      });
      setUserDetails(response.data);
      console.log("Token:", response.data);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("date", date); // Format date correctly
      formData.append("difficulty", difficulty);
      formData.append("duration", duration);
      formData.append("description", description);
      formData.append("equipment", equipment);
      formData.append("price", price);
      formData.append("limit_number", limit_number);
      formData.append("type", [...selectedType]);

      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }

      // Log FormData entries
      for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      // Make a request to create a post
      const createPostResponse = await axios.post(
        "http://localhost:3000/tours/create",
        formData,
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(createPostResponse.data);

      // Check if the response contains the images
      if (createPostResponse.data && createPostResponse.data.images) {
        console.log("Images in the response:", createPostResponse.data.images);
      }
      toast.success("Tura je uspješno kreirana", {
        duration: 3000,
      });
      // Close the modal
      onClose();
    } catch (error) {
      console.error("Error creating tour:", error.message);
    }
  };

  const handleOpen = (size) => {
    setSize(size);
  };

  return (
    <Modal
      size={size}
      isOpen={isOpen}
      onOpenChange={onClose}
      isDismissable={false}
      style={{ overflowY: "auto", marginBottom: 20, height: "80vh" }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-center text-3xl m-4">
              Kreiraj turu
            </ModalHeader>
            <ModalBody>
              <form className="p-2" onSubmit={handleCreateTour}>
                <div className="grid grid-cols-2 gap-4">
                  <label>
                    <p style={{ color: "black" }} className="mt-2 text-lg">
                      Naslov:
                    </p>
                    <Input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </label>
                  <label>
                    <p style={{ color: "black" }} className="mt-2 text-lg">
                      Datum:
                    </p>
                    <DatePicker
                      label="   "
                      className="max-h-[284px]"
                      selected={date}
                      onChange={(date) => handleSetDate(date)}
                    />
                  </label>

                  <label>
                    <p style={{ color: "black" }} className="mt-2 text-lg">
                      Težina ture:
                    </p>
                    <Input
                      type="text"
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                    />
                  </label>
                  <label>
                    <p style={{ color: "black" }} className="mt-2 text-lg">
                      Trajanje ture:
                    </p>
                    <Input
                      type="text"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                    />
                  </label>
                  <label>
                    <p style={{ color: "black" }} className="mt-2 text-lg">
                      Tip ture:
                    </p>
                    <TourType
                      selectedType={selectedType}
                      onTypeChange={handleTypeChange}
                    />
                  </label>
                  <label>
                    <p style={{ color: "black" }} className="mt-2 text-lg">
                      Potrebna oprema:
                    </p>
                    <Input
                      type="text"
                      value={equipment}
                      onChange={(e) => setEquipment(e.target.value)}
                    />
                  </label>
                  <label>
                    <p style={{ color: "black" }} className="mt-2 text-lg">
                      Maksimalan broj ljudi:
                    </p>
                    <Input
                      type="number"
                      value={limit_number}
                      onChange={(e) => setLimitNumber(e.target.value)}
                    />
                  </label>
                  <label>
                    <p style={{ color: "black" }} className="mt-2 text-lg">
                      Cijena:
                    </p>
                    <Input
                      type="text"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </label>
                </div>
                <div>
                  <label>
                    <p style={{ color: "black" }} className="mt-2 text-lg">
                      Opis ture:
                    </p>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </label>
                  <div>
                    <div className="text-center mt-5 font-semibold text-2xl">
                      Učitaj slike
                    </div>
                    <div className="flex flex-wrap mt-7 gap-4">
                      {images.map((file, index) => (
                        <div key={index} className="relative mr-4 mb-4">
                          <img
                            src={URL.createObjectURL(file)}
                            alt="Uploaded"
                            className="object-cover rounded image-with-border"
                            style={{ width: "130px", height: "130px" }}
                          />
                          <button
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-0 right-0 p-1 rounded-full"
                          >
                            <MdCancel />
                          </button>
                        </div>
                      ))}
                      <div
                        onClick={handleImageClick}
                        className={`bg-gray-300 rounded-md flex items-center justify-center cursor-pointer ${
                          images.length === 0 ? "image-with-border" : ""
                        }`}
                        style={{ width: "130px", height: "130px" }}
                      >
                        {images.length === 0 ? (
                          <FaPlus className="text-gray-600 text-2xl" />
                        ) : (
                          <div className="text-gray-600 text-2xl">+</div>
                        )}
                        <input
                          type="file"
                          ref={inputRef}
                          onChange={handleImageChange}
                          style={{ display: "none" }}
                          multiple
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Zatvori
              </Button>
              <Button color="primary" onPress={handleCreateTour}>
                Kreiraj
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
