import React, { useState, useEffect } from "react";
import { HeaderMenu } from "../../Components/Header-menu/Header-menu";
import { SideBar } from "../../Components/Side-Bar/Side-Bar";
import "./Contacts.scss";
import { Contact } from "../../Resources/Interface/contact";

export default function Contacts() {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [currentPage, setCurrentPage] = useState<number>(0);
  const contactsPerPage = 3;

  useEffect(() => {
    fetch("http://localhost:3000/contacts")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch contacts");
        }
        return response.json();
      })
      .then((data: Contact[]) => setContacts(data))
      .catch((error) => {
        console.error("Error fetching contacts:", error);
      });
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const sortByDate = (a: Contact, b: Contact): number => {
    return sortOrder === "asc"
      ? new Date(a.date).getTime() - new Date(b.date).getTime()
      : new Date(b.date).getTime() - new Date(a.date).getTime();
  };

  const sortedContacts = [...contacts].sort(sortByDate);

  const totalPages = Math.ceil(sortedContacts.length / contactsPerPage);

  const nextSlide = () => {
    setCurrentPage((prevPage) =>
      prevPage === totalPages - 1 ? 0 : prevPage + 1
    );
  };

  const prevSlide = () => {
    setCurrentPage((prevPage) =>
      prevPage === 0 ? totalPages - 1 : prevPage - 1
    );
  };

  const startIndex = currentPage * contactsPerPage;
  const currentContacts = sortedContacts.slice(
    startIndex,
    startIndex + contactsPerPage
  );

  return (
    <div className="reviews-page">
      <SideBar isSidebarOpen={isSidebarOpen} />
      <HeaderMenu
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
      />
      <div
        className={`main-content ${
          isSidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
      >
        <div className="slider-container">
          <button className="prev" onClick={prevSlide}>
            &#10094;
          </button>
          <div className="review-slider">
            {currentContacts.map((contact) => (
              <div key={contact.id} className="review-card">
                <h3>{contact.name}</h3>
                <p>{contact.message}</p>
                <small>{contact.date}</small>
              </div>
            ))}
          </div>
          <button className="next" onClick={nextSlide}>
            &#10095;
          </button>
        </div>

        <div className="sort-controls">
          <button onClick={() => setSortOrder("asc")}>
            Sort by Date Ascending
          </button>
          <button onClick={() => setSortOrder("desc")}>
            Sort by Date Descending
          </button>
        </div>

        <table className="reviews-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Name</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {sortedContacts.map((contact) => (
              <tr key={contact.id}>
                <td>{contact.id}</td>
                <td>{contact.date}</td>
                <td>{contact.name}</td>
                <td>{contact.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
