import '@fontsource/caveat/500.css'

type GoogleAuthNudgeProps = {
  pulse: boolean
}

export function GoogleAuthNudge({ pulse }: GoogleAuthNudgeProps) {
  return (
    <div
      className={`auth-google-nudge ${pulse ? 'auth-google-nudge--pulse-a' : 'auth-google-nudge--pulse-b'}`}
      role="status"
      aria-live="polite"
    >
      <div className="auth-google-nudge-copy">
        <p className="auth-google-nudge-message">
          bro just continue auth using Google 💀
        </p>
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
          d="M145 4C143 25 120 39 84 48"
        />
        <path
          className="auth-google-nudge-stroke"
          d="M145 4C143 25 120 39 84 48"
        />
        <path
          className="auth-google-nudge-head"
          d="M98 37L84 48L101 52"
        />
      </svg>
    </div>
  )
}
