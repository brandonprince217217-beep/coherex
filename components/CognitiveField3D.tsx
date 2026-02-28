// components/CognitiveField3D.tsx

interface Props {
  intensity: number;
  breakthrough: number;
}

export default function CognitiveField3D({ intensity, breakthrough }: Props) {
  return (
    <div className="cognitive-field-3d">
      <div className="intensity-bar" style={{ width: `${intensity}%` }} />
      <div className="breakthrough-bar" style={{ width: `${breakthrough}%` }} />
    </div>
  );
}
