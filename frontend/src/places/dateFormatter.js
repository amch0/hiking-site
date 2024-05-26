export const formatDate = (dateString) => {
  const tourDate = new Date(dateString);
  const months = [
    "Januar",
    "Februar",
    "Mart",
    "April",
    "Maj",
    "Jun",
    "Jul",
    "Avgust",
    "Septembar",
    "Oktobar",
    "Novembar",
    "Decembar",
  ];
  const day = tourDate.getDate();
  const month = months[tourDate.getMonth()];
  const year = tourDate.getFullYear();
  return `${day} ${month} ${year}`;
};
