function SectionHeading({ eyebrow, title, description, action }) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow ? (
          <p className="text-xs uppercase tracking-[0.35em] text-brand-200">{eyebrow}</p>
        ) : null}
        <h2 className="mt-2 text-3xl font-bold text-slate-100">{title}</h2>
        {description ? <p className="mt-2 max-w-2xl text-sm text-slate-400">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export default SectionHeading;
