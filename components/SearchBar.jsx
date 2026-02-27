export default function SearchBar({ onSearch }) {
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        marginTop: '30px'
      }}
    >
      <input
        type="text"
        placeholder="Ask Coherex anything..."
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onSearch(e.target.value);   // <-- THIS is the fix
          }
        }}
        style={{
          width: '90%',
          maxWidth: '420px',
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
    </div>
  );
}
