interface WarningAlertProps {
  title?: string;
  message: string;
  details?: React.ReactNode; // permite JSX
}

export default function WarningAlert({ title = "Atención", message, details }: WarningAlertProps) {
  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded mb-4">
      <p className="font-medium">{title}</p>
      <p>{message}</p>
      {details && <div className="text-sm mt-1">{details}</div>}
    </div>
  );
}
