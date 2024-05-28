import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Card, CardHeader, CardBody } from "@nextui-org/react";
import Gallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import {
  CalendarIcon,
  ClockIcon,
  ExclamationCircleIcon,
  CurrencyDollarIcon,
  LocationMarkerIcon,
  UserGroupIcon,
  StatusOnlineIcon,
} from "@heroicons/react/outline";
import TourComments from "./components/TourComments";
import TourAssignment from "./components/TourAssignment";
import TourReview from "./components/TourReview";
import TourList from "./components/TourList";
import DeleteTour from "./components/DeleteTour";

const TourDetails = () => {
  const { routeId } = useParams();
  const [routeDetails, setRouteDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRouteDetails = async () => {
      try {
        const url = `http://localhost:3000/tours/${routeId}`;
        console.log("Request URL:", url);
        const response = await axios.get(url);
        setRouteDetails(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching route details:", error);
      }
    };

    fetchRouteDetails();
  }, [routeId]);

  if (loading) {
    return <div>Učitavanje...</div>;
  }

  if (!routeDetails) {
    return <div>Greška: Nisu pronađeni detalji rute</div>;
  }

  const images = routeDetails.images.map((image) => ({
    original: `http://localhost:3000${image}`,
    thumbnail: `http://localhost:3000${image}`,
  }));

  return (
    <div className="tour-details-container  pt-40">
      <Card className="tour-card">
        <CardHeader className="tour-card-header">
          <div className="gallery-container">
            <Gallery items={images} showThumbnails={true} />
          </div>
        </CardHeader>
      </Card>
      <Card className="tour-card">
        <CardHeader className="tour-card-header">
          <h1>{routeDetails.title}</h1>
        </CardHeader>
        <CardBody className="tour-card-body">
          <p className="text-justify">
            <strong>Opis:</strong> {routeDetails.description}
          </p>
        </CardBody>
      </Card>
      <Card className="tour-card">
        <CardHeader className="tour-card-header">
          <h2>Informacije o turi</h2>
        </CardHeader>
        <CardBody className="tour-card-body">
          <div className="tour-info-grid">
            <div className="flex items-center">
              <CalendarIcon className="icon" />
              <p>
                <strong>Datum:</strong> {routeDetails.date}
              </p>
            </div>
            <div className="flex items-center">
              <ExclamationCircleIcon className="icon" />
              <p>
                <strong>Težina:</strong> {routeDetails.difficulty}
              </p>
            </div>
            <div className="flex items-center">
              <ClockIcon className="icon" />
              <p>
                <strong>Trajanje:</strong> {routeDetails.duration}
              </p>
            </div>
            <div className="flex items-center">
              <LocationMarkerIcon className="icon" />
              <p>
                <strong>Oprema:</strong> {routeDetails.equipment}
              </p>
            </div>
            <div className="flex items-center">
              <CurrencyDollarIcon className="icon" />
              <p>
                <strong>Cijena:</strong> {routeDetails.price}
              </p>
            </div>
            <div className="flex items-center">
              <UserGroupIcon className="icon" />
              <p>
                <strong>Limit mjesta:</strong> {routeDetails.limit_number}
              </p>
            </div>
            <div className="flex items-center">
              <StatusOnlineIcon className="icon" />
              <p>
                <strong>Status:</strong> {routeDetails.status}
              </p>
            </div>
            <div className="flex items-center">
              <UserGroupIcon className="icon" />
              <p>
                <strong>Preostalo mjesta:</strong>{" "}
                {routeDetails.remaining_space}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
      <TourAssignment
        routeId={routeId}
        remainingSpace={routeDetails.remaining_space}
        tourStatus={routeDetails.status}
      />
      {/* <Card className="tour-card">
        <CardHeader> */}
      <TourComments routeId={routeId} />
      {/* </CardHeader>
      </Card> */}
      {/* <Card className="tour-card">
        <CardHeader className="tour-card-header"> */}
      <TourReview routeId={routeId} />
      {/* </CardHeader>
      </Card> */}
      <TourList routeId={routeId} />
      <DeleteTour routeId={routeId} />
    </div>
  );
};

export default TourDetails;
