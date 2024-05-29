import emailjs from "@emailjs/browser";
import { useEffect } from "react";

const SendEmail = async (updatedEmployee, toEmail, message, title, description, priority) => {
  try {
    const templateParams = {
      message: message,
      empName: updatedEmployee,
      toEmail: toEmail,
      title: title,
      description: description,
      priority: priority
    };

    const response = await emailjs.send(
      "service_8qh42ww",
      "template_r6919mo",
      templateParams,
      "pQRJ4zETIeTQcXDrP"
    );

    console.log("Email sent successfully:", response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const EmailConfig = ({ updatedEmployee, toEmail, message, title, description, priority }) => {
  useEffect(() => {
    SendEmail(updatedEmployee, toEmail, message, title, description, priority);
    console.log("function called");
  }, [updatedEmployee, toEmail, message, title, description, priority]);

  return null;
};

export default EmailConfig;
