import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // Import useParams hook

const TourDetails = () => {
  const { routeId } = useParams(); // Get routeId from route parameters
  const [routeDetails, setRouteDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRouteDetails = async () => {
      try {
        const url = `http://localhost:3000/tours/${routeId}`;
        console.log("Request URL:", url); // Log the request URL
        const response = await axios.get(url);
        setRouteDetails(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching route details:", error);
        // Handle error here, e.g., redirect to an error page
      }
    };

    fetchRouteDetails();

    // Clean up function
    return () => {
      setRouteDetails(null); // Reset routeDetails state when component unmounts
    };
  }, [routeId]); // Fetch data whenever routeId changes

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!routeDetails) {
    return <div>Error: Route details not found</div>;
  }

  // Render route details
  return (
    <div>
      <p>Route ID: {routeDetails.id} </p>
      {/* Render other details of the route */}
    </div>
  );
};

export default TourDetails;
