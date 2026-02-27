interface StreamingBlockProps {
  text: string;
}

export default function StreamingBlock({ text }: StreamingBlockProps) {
  return (
    <div className="streaming-block">
      <span>{text}</span>
      <span className="cursor">▌</span>
    </div>
  );
}
