import { useState } from 'react';

export default function SearchBar() {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Searching for: ${query}`);
  };

  return (
    <form 
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: '20px',
        zIndex: 20
      }}
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        style={{
          width: '400px',
          padding: '15px',
          fontSize: '20px',
          borderRadius: '10px',
          border: 'none',
          outline: 'none'
        }}
      />
    </form>
  );
}
