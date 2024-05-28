import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import { Card, CardHeader, CardBody, Avatar } from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalFooter,
  Button,
  useDisclosure,
  ModalHeader,
} from "@nextui-org/react";
import { Link } from "react-router-dom";
import { Toaster, toast } from "sonner";

const TourComments = ({ routeId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchComments = async () => {
    try {
      const url = `http://localhost:3000/comment/tour/${routeId}`;
      console.log("Request URL:", url);
      const response = await axios.get(url);
      console.log("Response data:", response.data);
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [routeId]);

  const renderStars = (rating) => {
    const stars = [];
    const maxRating = 5;
    for (let i = 1; i <= maxRating; i++) {
      stars.push(
        <FaStar
          key={i}
          className={i <= rating ? "text-yellow-500" : "text-gray-300"}
        />
      );
    }
    return stars;
  };

  const openModal = (comment_id) => {
    setCommentToDelete(comment_id);
    onOpen();
  };

  const deleteComment = async (comment_id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/comment/${comment_id}`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      await fetchComments();
      onClose();
      toast.success("Uspješno ste obrisali komentar!", {
        style: {
          duration: 3000,
        },
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const isAdmin = () => {
    // Retrieve token from local storage
    const token = localStorage.getItem("token");
    if (token) {
      // Decode the token
      const decodedToken = JSON.parse(atob(token.split(".")[1]));

      // Check if the user is an admin
      return decodedToken.userType === "admin";
    }
    return false;
  };

  if (loading) {
    return <div>Učitavanje komentara...</div>;
  }

  return (
    <div className="max-w-[800px] w-full m-4 ">
      <h2 className="text-2xl font-bold mb-2">Komentari</h2>
      {comments && comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment.id}>
            <Card className="mb-3">
              <CardHeader className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  {comment.user && (
                    <>
                      <Avatar
                        src={`http://localhost:3000${comment.user.profile_picture}`}
                        alt={`${comment.user.name}`}
                        isBordered
                        radius="full"
                        size="md"
                      />

                      <div className="ml-2">
                        <p className="uppercase text-md font-bold text-black">{`${comment.user.name}`}</p>
                        <p className="text-small">
                          {new Date(comment.date).toLocaleString()}
                        </p>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex items-center">
                  {renderStars(comment.rating)}
                </div>
              </CardHeader>
              <CardBody className="flex flex-col items-start p-4 ">
                <p className="text-black text-base text-justify ">
                  {comment.content}
                </p>
              </CardBody>
              {isAdmin() && (
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => openModal(comment.id)}
                >
                  Obriši komentar
                </Button>
              )}
            </Card>
          </div>
        ))
      ) : (
        <>
          <p className="text-2xl text-black font-bold mb-2">
            Ova tura nema aktivnih komentara.
          </p>
        </>
      )}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Da li želite obrisati ovaj komentar?
          </ModalHeader>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onPress={() => deleteComment(commentToDelete)}
            >
              Da
            </Button>

            <Button color="primary" onPress={onClose}>
              Ne
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default TourComments;
