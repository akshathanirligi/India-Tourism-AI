import { FiChevronDown } from "react-icons/fi";

function Accordion({ id, title, icon, openId, onToggle, children }) {
  const isOpen = openId === id;

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-lg shadow-slate-200/60 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-200/70">
      <button
        type="button"
        onClick={() => onToggle(isOpen ? null : id)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition-colors hover:bg-sky-50/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-500 sm:px-7"
      >
        <span className="flex items-center gap-3 text-base font-bold tracking-tight text-slate-900 sm:text-lg">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-sky-100 to-blue-50 text-xl text-sky-700 shadow-sm">{icon}</span>
          {title}
        </span>
        <FiChevronDown className={`h-5 w-5 text-slate-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="min-h-0 overflow-hidden">
          <div className={`border-t border-slate-100 bg-slate-50/40 px-5 py-5 transition-opacity duration-200 sm:px-7 sm:py-6 ${isOpen ? "opacity-100" : "opacity-0"}`}>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Accordion;
