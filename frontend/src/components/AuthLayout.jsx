import { Link } from 'react-router-dom';

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="brand-header">
          <Link to="/" className="brand-logo-container flex flex-col items-center justify-center gap-3 mb-8">
             <img src="/newlogo.png" alt="PharmCare Logo" className="h-16 w-auto max-w-[250px] object-contain" />
             <span className="text-2xl font-bold text-sky-600 font-heading">PharmCare</span>
          </Link>
        </div>

        <div className="auth-header">
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>

        {children}

        {footer && <div className="auth-footer">{footer}</div>}
      </div>
    </div>
  );
}

export function AuthLink({ to, children }) {
  return (
    <Link to={to} className="link">
      {children}
    </Link>
  );
}

export function FormField({ label, error, children }) {
  return (
    <div className="form-field">
      {label && <label>{label}</label>}
      {children}
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}

export function SubmitButton({ loading, children }) {
  return (
    <button type="submit" className="btn-primary" disabled={loading}>
      {loading ? (
        <span className="btn-loading">
          <svg className="spinner-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </span>
      ) : (
        children
      )}
    </button>
  );
}

export function Alert({ type, message }) {
  if (!message) return null;
  const isError = type === 'error';
  return (
    <div className={`alert alert-${type}`}>
      <span className="alert-icon">{isError ? '⚠️' : '✅'}</span>
      <span className="alert-message">{message}</span>
    </div>
  );
}
