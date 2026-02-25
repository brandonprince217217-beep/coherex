export default function About() {
  return (
    <div
      style={{
        textAlign: "center",
        color: "white",
        maxWidth: "800px",
        margin: "0 auto",
        padding: "40px 20px",
        lineHeight: "1.6",
        fontFamily: "Inter, sans-serif"
      }}
    >
      <h1
        style={{
          fontSize: "48px",
          fontWeight: "800",
          marginBottom: "20px"
        }}
      >
        Coherex
      </h1>

      <h2
        style={{
          fontSize: "28px",
          fontWeight: "600",
          marginBottom: "10px",
          opacity: 0.9
        }}
      >
        About the Developer
      </h2>

      <h3
        style={{
          fontSize: "22px",
          fontWeight: "500",
          marginBottom: "30px",
          opacity: 0.8
        }}
      >
        Brandon Prince
      </h3>

      <p style={{ fontSize: "20px", opacity: 0.85 }}>
        I’m Brandon Prince — the creator, architect, and developer behind
        Coherex. I build systems that feel clean, intentional, and powerful.
        My focus is on creating digital experiences that are simple to use,
        visually premium, and built with precision. Coherex is my vision for
        a smarter, more intuitive way to interact with information and tools.
      </p>
    </div>
  );
}
