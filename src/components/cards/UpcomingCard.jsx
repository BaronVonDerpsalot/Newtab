/* ── Upcoming card ────────────────────────────────── */
const MILESTONES = [
  {id:1,day:'14',mon:'Jun',title:'Therapy session',sub:'In 3 days'},
  {id:2,day:'17',mon:'Jun',title:'Weekly review',sub:'In 6 days'},
  {id:3,day:'24',mon:'Jun',title:'Monthly check-in',sub:'In 13 days'},
  {id:4,day:'10',mon:'Jul',title:'Quarterly goals review',sub:'In 29 days'},
  {id:5,day:'18',mon:'Jul',title:'Holiday',sub:'In 37 days'},
];
export function UpcomingCard() {
  return (
    <div className="card cell-upcoming">
      <div className="mono-label" style={{marginBottom:16}}>Upcoming</div>
      {MILESTONES.map(m=>(
        <div key={m.id} className="milestone-item">
          <div className="m-date"><div className="m-day">{m.day}</div><div className="m-month">{m.mon}</div></div>
          <div><div className="m-title">{m.title}</div><div className="m-sub">{m.sub}</div></div>
        </div>
      ))}
    </div>
  );
}
