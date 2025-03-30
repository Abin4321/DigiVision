import React, { useState } from "react";
import { Modal, Button } from "flowbite-react";
import supabase from "../../../SupabaseClient";

const Message = ({ isModalOpen, setIsModalOpen, selectedUserId }) => {
  const [updateMessage, setUpdateMessage] = useState("");

  // Handle message submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (updateMessage.trim()) {
      try {
        const { data, error } = await supabase.from("important_updates").insert([
          {
            message: updateMessage,
            status: false,
            user_id: selectedUserId,
          },
        ]);

        if (error) {
          console.error("Error submitting update:", error.message);
          alert("Failed to send the message. Please try again.");
        } else {
          alert("Message sent successfully!");
          setUpdateMessage("");
          setIsModalOpen(false);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        alert("Something went wrong. Please try again.");
      }
    } else {
      alert("Please enter a valid message.");
    }
  };

  return (
    <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} size="sm">
      <Modal.Header>Send Message</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <textarea
            value={updateMessage}
            onChange={(e) => setUpdateMessage(e.target.value)}
            className="w-1/2 p-2 border border-gray-300 rounded"
            placeholder="Enter your message..."
            rows="4"
          ></textarea>
          <div className="mt-4 flex justify-end">
            <Button type="submit" color="blue">
              Send
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default Message;
