import { useState } from "react";

export function useSubmitStatus() {
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  const showSuccess = (message) => {
    setSubmitMessage(message);
    setSubmitError("");
  };

  const showError = (message) => {
    setSubmitError(message);
    setSubmitMessage("");
  };

  const clearMessages = () => {
    setSubmitMessage("");
    setSubmitError("");
  };

  return {
    submitMessage,
    submitError,
    showSuccess,
    showError,
    clearMessages,
  };
}
