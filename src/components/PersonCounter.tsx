interface PersonCounterProps {
  label: string;
  value: number;
  onChange: (next: number) => void;
}

const PersonCounter = ({ label, value, onChange }: PersonCounterProps) => {
  return (
    <li>
      <div className="people-type">
        <strong>{label}</strong>
        <span>{label === '성인' ? '만 19세 이상' : label === '청소년' ? '중고등학생 기준' : '우대 요금 적용'}</span>
      </div>
      <div className="people-counter">
        <button type="button" onClick={() => onChange(value - 1)} aria-label={`${label} 감소`}>-</button>
        <span>{value}</span>
        <button type="button" onClick={() => onChange(value + 1)} aria-label={`${label} 증가`}>+</button>
      </div>
    </li>
  );
};

export default PersonCounter;
