import React, { useEffect, useRef } from 'react';
import { X, Bookmark, Search, AlertCircle, CheckCircle2, LoaderCircle } from 'lucide-react';
export function Button({ children, variant = 'primary', className = '', ...props }) {
  return (
    <button className={`button ${variant} ${className}`} {...props}>
      {children}
    </button>
  );
}
export function Card({ children, className = '', ...props }) {
  return (
    <div className={`card ${className}`} {...props}>
      {children}
    </div>
  );
}
export function PageHeading({ eyebrow, title, description, children }) {
  return (
    <div className="page-heading">
      <div>
        <div className="eyebrow">{eyebrow || 'MECHLAB WORKSPACE'}</div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {children}
    </div>
  );
}
export function SearchBar({
  value,
  onChange,
  placeholder = 'Search this library…',
  label = 'Search',
  ...props
}) {
  return (
    <div className="search-bar">
      <Search size={19} />
      <input
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        {...props}
      />
      {value && (
        <button aria-label="Clear search" onClick={() => onChange('')}>
          <X size={16} />
        </button>
      )}
    </div>
  );
}
export function CategoryFilter({ values, value, onChange }) {
  return (
    <div className="filter-row" aria-label="Category filters">
      {values.map((v) => (
        <button
          key={v}
          className={`chip ${value === v ? 'selected' : ''}`}
          aria-pressed={value === v}
          onClick={() => onChange(v)}
        >
          {v}
        </button>
      ))}
    </div>
  );
}
export function EmptyState({
  title = 'No results found',
  description = 'Try a different search or filter.',
}) {
  return (
    <div className="empty">
      <Search size={32} />
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
export function ErrorMessage({ children }) {
  return children ? (
    <div className="error" role="alert">
      <AlertCircle size={19} />
      {children}
    </div>
  ) : null;
}
export function LoadingState() {
  return (
    <div className="empty" role="status">
      <LoaderCircle className="spin" />
      <p>Loading the engineering workspace…</p>
    </div>
  );
}
export function BookmarkButton({ item, lab }) {
  const active = lab.favorites.some((f) => f.key === item.key);
  return (
    <button
      className={`icon-button bookmark ${active ? 'active' : ''}`}
      aria-label={`${active ? 'Remove' : 'Add'} bookmark for ${item.name}`}
      aria-pressed={active}
      title={active ? 'Remove bookmark' : 'Save to favorites'}
      onClick={(e) => {
        e.stopPropagation();
        lab.toggleFavorite(item);
      }}
    >
      <Bookmark size={18} fill={active ? 'currentColor' : 'none'} />
    </button>
  );
}
export function Modal({ title, onClose, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    const old = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    (
      ref.current?.querySelector('input') || ref.current?.querySelector('button,select,a[href]')
    )?.focus();
    const listener = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        const all = Array.from(
          ref.current?.querySelectorAll(
            'button:not([disabled]),a[href],input,select,textarea,[tabindex="0"]',
          ) || [],
        );
        const first = all[0],
          last = all.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener('keydown', listener);
    return () => {
      document.body.style.overflow = old;
      document.removeEventListener('keydown', listener);
      previous?.focus();
    };
  }, [onClose]);
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section
        ref={ref}
        className="modal card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <header>
          <h2 id="modal-title">{title}</h2>
          <button className="icon-button" onClick={onClose} aria-label="Close dialog">
            <X />
          </button>
        </header>
        {children}
      </section>
    </div>
  );
}
export function Toast({ toast, onDismiss }) {
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(onDismiss, 3500);
    return () => clearTimeout(id);
  }, [toast, onDismiss]);
  return toast ? (
    <div className="toast" role="status">
      <CheckCircle2 size={19} />
      {toast.message}
      <button className="icon-button" aria-label="Dismiss notification" onClick={onDismiss}>
        <X size={16} />
      </button>
    </div>
  ) : null;
}
export class ErrorBoundary extends React.Component {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    return this.state.error ? (
      <div className="empty">
        <h2>This view could not load.</h2>
        <p>
          Reload the app to recover your workspace. Your saved bookmarks are kept on this device.
        </p>
        <Button onClick={() => location.reload()}>Reload app</Button>
      </div>
    ) : (
      this.props.children
    );
  }
}
