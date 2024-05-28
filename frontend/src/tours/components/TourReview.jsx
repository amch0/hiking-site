import React, { useState } from "react";
import axios from "axios";
import {
  FaRegSadCry,
  FaRegFrownOpen,
  FaRegMeh,
  FaRegSmile,
  FaRegGrinHearts,
  FaStar,
} from "react-icons/fa";
import { Card, CardHeader, CardBody, Button } from "@nextui-org/react";
import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router-dom";

const TourReview = ({ routeId }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const navigate = useNavigate();

  const getDescription = (ratingValue) => {
    if (ratingValue <= 1) return "Vrlo nezadovoljan";
    if (ratingValue === 2) return "Nezadovoljan";
    if (ratingValue === 3) return "Neutralan";
    if (ratingValue === 4) return "Zadovoljan";
    if (ratingValue === 5) return "Vrlo zadovoljan";
  };

  const getEmoji = (ratingValue) => {
    if (ratingValue <= 1) return <FaRegSadCry className="text-red-500" />;
    if (ratingValue === 2)
      return <FaRegFrownOpen className="text-orange-500" />;
    if (ratingValue === 3) return <FaRegMeh className="text-yellow-500" />;
    if (ratingValue === 4)
      return <FaRegSmile className="text-light-green-500" />;
    if (ratingValue === 5)
      return <FaRegGrinHearts className="text-green-500" />;
  };

  const submitReview = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Korisnik nije prijavljen.");
        return;
      }
      if (!reviewText || !rating) {
        toast.error("Molimo vas da unesete i recenziju i ocjenu.", {
          duration: 3000,
        });
        return;
      }

      //   console.log("Sending request with data:", {
      //     tourId: tourId,
      //     content: reviewText,
      //     rating: rating,
      //   });

      const response = await axios.post(
        "http://localhost:3000/comment",
        {
          tourId: routeId,
          content: reviewText,
          rating: rating,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      console.log("Response from server:", response.data);
      console.log("Recenzija uspješno poslana:", response.data);
      toast.success("Recenzija uspješno poslana!", {
        duration: 2000,
      });

      setRating(0);
      setReviewText("");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      if (
        error.response &&
        error.response.data.message ===
          "You have already commented on this tour"
      ) {
        toast.error("Već ste komentarisali ovu turu.", {
          duration: 3000,
        });
      } else {
        console.error("Greška prilikom slanja recenzije:", error);
      }
    }
  };
  const token = localStorage.getItem("token");
  return (
    <div className="max-w-[800px] w-full m-4">
      {token ? (
        <>
          <h2 className="text-2xl font-bold mb-2">
            Ostavite komentar za ovu turu
          </h2>
          <Card>
            <CardHeader></CardHeader>
            <CardBody>
              <div className="flex items-center space-x-2">
                {[...Array(5)].map((_, index) => (
                  <FaStar
                    key={index}
                    className={`cursor-pointer ${
                      index < rating ? "text-yellow-500" : "text-gray-300"
                    }`}
                    onClick={() => setRating(index + 1)}
                  />
                ))}
              </div>
              <div className="mt-2 flex items-center">
                {getEmoji(rating)}
                <p className="ml-2">
                  {rating > 0
                    ? `Zadovoljstvo: ${getDescription(rating)}`
                    : "Odaberite ocjenu"}
                </p>
              </div>
              <form onSubmit={(e) => e.preventDefault()}>
                <textarea
                  className="mt-2 p-2 border border-gray-300 rounded w-full"
                  placeholder="Opišite vaše iskustvo..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows="4"
                />
                <Button
                  type="button"
                  className="mt-2 w-full"
                  onClick={submitReview}
                >
                  Pošalji recenziju
                </Button>
              </form>
            </CardBody>
          </Card>
        </>
      ) : (
        <p
          onClick={() => navigate("/login")}
          style={{ cursor: "pointer", color: "black" }}
        >
          Molimo prijavite se kako biste ostavili recenziju.
        </p>
      )}
    </div>
  );
};

export default TourReview;
