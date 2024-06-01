import emailjs from "@emailjs/browser";
import { useEffect } from "react";

const SendEmail = async (updatedEmployee, toEmail, message, title, description, priority, hideBox, templateChange) => {
  try {
    const templateParams = {
      message: message,
      empName: updatedEmployee,
      toEmail: toEmail,
      title: title,
      description: description,
      priority: priority,
      hideBox: hideBox
    };

    const response = await emailjs.send(
      "service_8qh42ww",
      templateChange ? "template_t4ghl3i" : "template_r6919mo",
      templateParams,
      "pQRJ4zETIeTQcXDrP"
    );

    console.log("Email sent successfully:", response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const EmailConfig = ({ updatedEmployee, toEmail, message, title, description, priority, hideBox, templateChange }) => {
  useEffect(() => {
    SendEmail(updatedEmployee, toEmail, message, title, description, priority, hideBox, templateChange);
    console.log("function called");
  }, [updatedEmployee, toEmail, message, title, description, priority, hideBox]);

  return null;
};

export default EmailConfig;
