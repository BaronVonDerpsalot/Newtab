/* ── Todo card ────────────────────────────────────── */
export function TodoCard({ todos, onToggle }) {
  return (
    <div className="card cell-todo">
      <div className="mono-label" style={{marginBottom:12}}>To-do</div>
      {todos.map(t=>(
        <div key={t.id} className="todo-item" onClick={()=>onToggle(t.id)}>
          <div className={`todo-box ${t.done?'done':''}`}></div>
          <span className={`todo-text ${t.done?'done':''}`}>{t.text}</span>
        </div>
      ))}
    </div>
  );
}
