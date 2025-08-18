import React from 'react';

function About() {
  return (
    <main role="main" style={{
      minHeight: '60vh',
      display: 'grid',
      placeItems: 'center',
      padding: '2rem',
      background: 'transparent',
      color: '#1E3A5F',
      textAlign: 'center',
      fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif'
    }}>
      <p style={{
        margin: 0,
        fontSize: 'clamp(1.2rem, 3.8vw, 2rem)',
        lineHeight: 1.35,
        maxWidth: '60ch'
      }}>
        Jag är en kille på 10 år.
      </p>
    </main>
  );
}

export default About;
