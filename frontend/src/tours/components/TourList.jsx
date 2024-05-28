import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { Button } from "@nextui-org/react";

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

const TourList = ({ routeId }) => {
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tourTitle, setTourTitle] = useState("");

  useEffect(() => {
    const fetchAssignedUsers = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/userTour/${routeId}`
        );
        setTourTitle(response.data.tourTitle);
        setAssignedUsers(response.data.assignedUsers);
      } catch (error) {
        console.error("Error fetching assigned users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedUsers();
  }, [routeId]);

  const handleDownloadPDF = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/userTour/downloadPDF/${routeId}`,
        {
          responseType: "blob", // Ensure response type is blob
        }
      );

      // Create a temporary URL for the PDF file
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create a link element and simulate a click to initiate download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${tourTitle}.pdf`); // Set the filename as the tour title
      document.body.appendChild(link);
      link.click();

      // Clean up by revoking the URL object
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  if (!isAdmin()) {
    return null;
  }

  if (!assignedUsers.length && !loading) {
    return <div>No assigned users for this tour.</div>;
  }

  return (
    <div className="max-w-[800px] w-full m-4">
      <h1 className="mb-2">Korisnici prijavljeni na turi "{tourTitle}":</h1>
      <Table removeWrapper aria-label="User Tour Table">
        <TableHeader>
          <TableColumn>IME</TableColumn>
          <TableColumn>EMAIL</TableColumn>
          <TableColumn>KONTAKT TELEFON</TableColumn>
        </TableHeader>
        <TableBody>
          {assignedUsers.map((user, index) => (
            <TableRow key={index}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone_number}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div style={{ marginTop: "1rem" }}>
        {assignedUsers.length > 0 && (
          <Button color="primary" onClick={handleDownloadPDF}>
            Preuzmi PDF
          </Button>
        )}
      </div>
    </div>
  );
};

export default TourList;
