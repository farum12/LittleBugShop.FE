interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

export default function LoadingSpinner({ size = 'md', message }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <div 
      className="flex flex-col items-center justify-center py-8"
      data-testid="loading-spinner"
    >
      <div 
        className={`${sizeClasses[size]} border-4 border-bug-light border-t-bug-primary rounded-full animate-spin`}
        data-testid="spinner-icon"
      />
      {message && (
        <p 
          className="mt-4 text-gray-600"
          data-testid="loading-message"
        >
          {message}
        </p>
      )}
    </div>
  );
}
