import '@fontsource/caveat/500.css'

type GoogleAuthNudgeProps = {
  dismissible?: boolean
  onDismiss?: () => void
}

export function GoogleAuthNudge({
  dismissible = true,
  onDismiss,
}: GoogleAuthNudgeProps) {
  return (
    <div className="auth-google-nudge" role="status" aria-live="polite">
      <div className="auth-google-nudge-copy">
        <p className="auth-google-nudge-message">
          bro just continue auth using Google 💀
        </p>
        {dismissible && onDismiss && (
          <button
            type="button"
            className="auth-google-nudge-dismiss"
            onClick={onDismiss}
            aria-label="Dismiss Google sign-in tip"
          >
            DISMISS
          </button>
        )}
      </div>
      <svg
        className="auth-google-nudge-arrow"
        viewBox="0 0 160 60"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <path
          className="auth-google-nudge-shadow"
          d="M8 5C18 29 68 48 119 49"
        />
        <path
          className="auth-google-nudge-stroke"
          d="M8 5C18 29 68 48 119 49"
        />
        <path
          className="auth-google-nudge-head"
          d="M105 35L119 49L104 53"
        />
      </svg>
    </div>
  )
}
