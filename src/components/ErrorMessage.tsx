interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ title = 'Oops!', message, onRetry }: ErrorMessageProps) {
  return (
    <div 
      className="bg-red-50 border border-red-200 rounded-lg p-6 text-center"
      data-testid="error-message"
    >
      <div 
        className="text-4xl mb-4"
        data-testid="error-icon"
      >
        🐛💥
      </div>
      <h3 
        className="text-lg font-semibold text-red-700 mb-2"
        data-testid="error-title"
      >
        {title}
      </h3>
      <p 
        className="text-red-600 mb-4"
        data-testid="error-text"
      >
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-primary"
          data-testid="error-retry-button"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
