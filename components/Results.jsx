import ResultCard from './ResultCard';

export default function Results({ results }) {
  if (!results || results.length === 0) return null;

  return (
    <div
      style={{
        marginTop: 30,
        maxWidth: 700,
        marginInline: "auto",
        width: "90%",
      }}
    >
      {results.map((result) => (
        <ResultCard key={result._id || result.query} result={result} isNested={false} />
      ))}
    </div>
  );
}
