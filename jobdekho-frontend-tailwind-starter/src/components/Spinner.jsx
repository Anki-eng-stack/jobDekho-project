const Spinner = ({ size = "md", text = "" }) => {
  const sizes = { sm: 16, md: 28, lg: 44 };
  const px = sizes[size] || sizes.md;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@500;600&display=swap');

        .jd-spinner-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          font-family: 'DM Sans', sans-serif;
        }

        .jd-spinner-ring {
          border-radius: 50%;
          border-style: solid;
          border-color: #ede9fe;
          border-top-color: #7c3aed;
          animation: jdSpinRing 0.75s cubic-bezier(0.4,0,0.2,1) infinite;
          flex-shrink: 0;
        }

        .jd-spinner-text {
          font-size: 0.8rem;
          font-weight: 600;
          color: #7c3aed;
          letter-spacing: 0.04em;
          animation: jdSpinFade 1.2s ease infinite alternate;
        }

        @keyframes jdSpinRing {
          to { transform: rotate(360deg); }
        }

        @keyframes jdSpinFade {
          from { opacity: 0.5; }
          to   { opacity: 1; }
        }
      `}</style>

      <div className="jd-spinner-wrap">
        <div
          className="jd-spinner-ring"
          style={{
            width: px,
            height: px,
            borderWidth: px <= 16 ? 2 : px <= 28 ? 3 : 4,
            boxShadow: `0 0 ${px / 2}px rgba(124,58,237,0.15)`,
          }}
        />
        {text && <span className="jd-spinner-text">{text}</span>}
      </div>
    </>
  );
};

export default Spinner;