

const StatusMessage = ({ submitMessage, submitError }) => {
  return (
    <>
      {submitMessage && (
        <div style={{ 
          padding: "0.75rem", 
          backgroundColor: "rgba(0, 196, 180, 0.1)", 
          border: "1px solid #00c4b4",
          borderRadius: "4px",
          color: "#00c4b4",
          marginBottom: "1rem",
          textAlign: "center"
        }}>
          ✓ {submitMessage}
        </div>
      )}

      {submitError && (
        <div style={{ 
          padding: "0.75rem", 
          backgroundColor: "rgba(255, 107, 107, 0.1)", 
          border: "1px solid #ff6b6b",
          borderRadius: "4px",
          color: "#ff6b6b",
          marginBottom: "1rem",
          textAlign: "center"
        }}>
          ✗ {submitError}
        </div>
      )}
    </>
  );
};

export default StatusMessage;