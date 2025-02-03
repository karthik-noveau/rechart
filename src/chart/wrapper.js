export const Wrapper = ({ children }) => {
  return (
    <div
      style={{
        width: "100%",
        height: "400px",
        marginBottom: "50px",
        border: "1.5px solid #2196f3ab",
        background: "white",
        borderRadius: "12px",
        // padding: "20px",
      }}
    >
      {children}
    </div>
  );
};
