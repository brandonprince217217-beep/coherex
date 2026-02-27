export default function SearchBar({ onSearch }) {
  const handleButtonClick = () => {
    const input = document.getElementById("coherex-search");
    if (input && input.value.trim()) {
      onSearch(input.value);
    }
  };

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        marginTop: '30px',
        gap: '10px'
      }}
    >
      <input
        id="coherex-search"
        type="text"
        placeholder="Ask Coherex anything..."
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onSearch(e.target.value);
          }
        }}
        style={{
          width: '70%',
          maxWidth: '350px',
          padding: '14px 18px',
          borderRadius: '10px',
          border: '1px solid rgba(0, 140, 255, 0.6)',
          background: 'rgba(0, 140, 255, 0.12)',
          color: 'white',
          fontSize: '1rem',
          outline: 'none',
          boxShadow: '0 0 12px rgba(0, 140, 255, 0.4)',
          transition: '0.25s'
        }}
      />

      <button
        onClick={handleButtonClick}
        style={{
          padding: '14px 20px',
          borderRadius: '10px',
          border: 'none',
          background: 'rgba(0, 140, 255, 0.8)',
          color: 'white',
          fontSize: '1rem',
          cursor: 'pointer',
          boxShadow: '0 0 12px rgba(0, 140, 255, 0.6)',
          transition: '0.25s'
        }}
      >
        Search
      </button>
    </div>
  );
}
