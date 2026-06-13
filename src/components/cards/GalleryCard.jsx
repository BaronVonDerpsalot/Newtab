/* ── Gallery card ─────────────────────────────────── */
export function GalleryCard() {
  return (
    <div className="card cell-gallery" style={{padding:16,display:'flex',flexDirection:'column',gap:10}}>
      <div className="mono-label">Gallery</div>
      <div className="gallery-grid">
        {[0,1,2,3].map(i=><div key={i} className="gallery-slot">Drop photo</div>)}
      </div>
    </div>
  );
}
