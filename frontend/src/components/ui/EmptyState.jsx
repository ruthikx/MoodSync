function EmptyState({ title, description, action }) {
  return (
    <div className="glass-panel rounded-[2rem] p-8 text-center">
      <h3 className="text-xl font-semibold text-slate-100">{title}</h3>
      <p className="mt-3 text-sm text-slate-400">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

export default EmptyState;
