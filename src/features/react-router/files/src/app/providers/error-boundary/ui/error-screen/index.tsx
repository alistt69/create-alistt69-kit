interface ErrorScreenProps {
    title?: string;
    description?: string;
    errorMessage?: string;
    onRetry?: () => void;
}

function ErrorScreen({
    title = 'Something went wrong',
    description = 'An unexpected error occurred. Try again or reload the page.',
    errorMessage,
    onRetry,
}: ErrorScreenProps) {
    return (
        <main
            style={{
                minHeight: '100vh',
                display: 'grid',
                placeItems: 'center',
                padding: '24px',
                background:
                    'radial-gradient(circle at top, rgba(255,255,255,0.06), transparent 40%), #0b0d12',
                color: '#f5f7fa',
            }}
        >
            <section
                style={{
                    width: '100%',
                    maxWidth: '560px',
                    padding: '32px',
                    borderRadius: '24px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.04)',
                    backdropFilter: 'blur(12px)',
                    boxShadow: '0 20px 80px rgba(0,0,0,0.35)',
                }}
            >
                <div
                    style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '16px',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: '28px',
                        background: 'rgba(255,255,255,0.08)',
                        marginBottom: '20px',
                    }}
                >
                    ⚠️
                </div>

                <h1
                    style={{
                        margin: 0,
                        fontSize: '32px',
                        lineHeight: 1.1,
                        fontWeight: 700,
                    }}
                >
                    {title}
                </h1>

                <p
                    style={{
                        marginTop: '12px',
                        marginBottom: 0,
                        fontSize: '16px',
                        lineHeight: 1.6,
                        color: 'rgba(245,247,250,0.78)',
                    }}
                >
                    {description}
                </p>

                {errorMessage ? (
                    <pre
                        style={{
                            marginTop: '20px',
                            padding: '16px',
                            overflowX: 'auto',
                            borderRadius: '16px',
                            background: 'rgba(0,0,0,0.28)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            color: '#ffb4b4',
                            fontSize: '13px',
                            lineHeight: 1.5,
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                        }}
                    >
                        {errorMessage}
                    </pre>
                ) : null}

                <div
                    style={{
                        display: 'flex',
                        gap: '12px',
                        flexWrap: 'wrap',
                        marginTop: '24px',
                    }}
                >
                    {onRetry ? (
                        <button
                            type="button"
                            onClick={onRetry}
                            style={buttonPrimaryStyle}
                        >
                            Try again
                        </button>
                    ) : null}

                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        style={buttonSecondaryStyle}
                    >
                        Reload page
                    </button>
                </div>
            </section>
        </main>
    );
}

const buttonBaseStyle: React.CSSProperties = {
    appearance: 'none',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '14px',
    padding: '12px 16px',
    fontSize: '14px',
    fontWeight: 600,
    transition: 'transform 0.15s ease, opacity 0.15s ease',
};

const buttonPrimaryStyle: React.CSSProperties = {
    ...buttonBaseStyle,
    background: '#ffffff',
    color: '#0b0d12',
};

const buttonSecondaryStyle: React.CSSProperties = {
    ...buttonBaseStyle,
    background: 'rgba(255,255,255,0.08)',
    color: '#f5f7fa',
    border: '1px solid rgba(255,255,255,0.1)',
};

export default ErrorScreen;
