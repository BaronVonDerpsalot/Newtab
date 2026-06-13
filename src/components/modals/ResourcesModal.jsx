export function ResourcesModal() {
  const items=[
    {label:'Crisis Text Line',detail:'Text HOME to 741741',urgent:true},
    {label:'National Lifeline',detail:'Call or text 988',urgent:true},
    {label:'Samaritans',detail:'Call 116 123 (UK)',urgent:false},
    {label:'Mind',detail:'mind.org.uk',urgent:false},
    {label:'CALM',detail:'thecalmzone.net',urgent:false},
  ];
  return (
    <div>
      <div className="modal-eyebrow">Emergency + Support</div>
      <div className="modal-title">Resources</div>
      <div className="modal-sub">Reach out — you don't have to do this alone.</div>
      {items.map((it,i)=>(
        <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'13px 16px',borderRadius:'var(--radius-md)',marginBottom:8,border:`1px solid ${it.urgent?'rgba(90,158,47,.32)':'var(--border)'}`,background:it.urgent?'rgba(90,158,47,.10)':'transparent'}}>
          <span style={{fontFamily:'var(--font-mono)',fontSize:10.5,letterSpacing:'.12em',textTransform:'uppercase',color:it.urgent?'#5a9e2f':'var(--text-2)'}}>{it.label}</span>
          <span style={{fontSize:13,color:it.urgent?'#5a9e2f':'var(--text-2)',fontWeight:it.urgent?600:400}}>{it.detail}</span>
        </div>
      ))}
    </div>
  );
}
