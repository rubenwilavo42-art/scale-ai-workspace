"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ChevronRight, FileCode2, Folder, GitBranch, Pause, Play, RotateCcw, Send, Square, Terminal, X } from "lucide-react";
import { AgentIcon } from "./AgentIcon";

type AgentName = "Claude" | "Codex" | "Kimi" | "Hermes";

type AgentState = { progress: number; status: "Prêt" | "En cours" | "Terminé"; line: string };

const initial: Record<AgentName, AgentState> = {
  Claude: { progress: 100, status: "Terminé", line: "Analyse de 14 fichiers terminée" },
  Codex: { progress: 76, status: "En cours", line: "Préparation des modifications..." },
  Kimi: { progress: 100, status: "Terminé", line: "Synthèse des résultats prête" },
  Hermes: { progress: 48, status: "En cours", line: "Inspection de la structure..." },
};

const agents: AgentName[] = ["Claude", "Codex", "Kimi", "Hermes"];

export function ProductDemo() {
  const [selected, setSelected] = useState<AgentName>("Codex");
  const [states, setStates] = useState(initial);
  const [running, setRunning] = useState(true);
  const [compare, setCompare] = useState(false);
  const [prompt, setPrompt] = useState("Analyse mon projet et propose les prochaines étapes.");

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      setStates(prev => Object.fromEntries(Object.entries(prev).map(([name, state]) => {
        if (state.status !== "En cours") return [name, state];
        const progress = Math.min(100, state.progress + Math.ceil(Math.random() * 4));
        return [name, progress >= 100 ? { progress: 100, status: "Terminé", line: "Tâche terminée avec succès" } : { ...state, progress }];
      })) as Record<AgentName, AgentState>);
    }, 1100);
    return () => window.clearInterval(timer);
  }, [running]);

  const active = states[selected];
  const completed = useMemo(() => agents.filter(a => states[a].status === "Terminé").length, [states]);

  function launch() {
    setRunning(true);
    setStates(prev => Object.fromEntries(agents.map(a => [a, { ...prev[a], progress: 0, status: "En cours", line: "Démarrage de la session..." }])) as Record<AgentName, AgentState>);
  }

  function reset() { setRunning(false); setStates(initial); setCompare(false); }

  return (
    <div className="product-demo mt-14 overflow-hidden rounded-[2rem] border border-black/10 bg-[#101010] shadow-[0_35px_100px_rgba(0,0,0,.14)]">
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3 text-white sm:px-5">
        <div className="flex gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-[#ff6257]"/><i className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]"/><i className="h-2.5 w-2.5 rounded-full bg-[#28c840]"/></div>
        <div className="ml-3 flex items-center gap-2 text-xs font-bold text-white/65"><span className="rounded-md bg-white/10 px-2 py-1">ScalAI</span><span>/</span><span>mon-projet</span></div>
        <div className="ml-auto flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-white/35"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400"/> Local</div>
      </div>

      <div className="grid min-h-[650px] lg:grid-cols-[230px_1fr]">
        <aside className="border-b border-white/10 bg-[#151515] p-3 text-white lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between px-2 py-2"><span className="text-[10px] font-extrabold uppercase tracking-[.18em] text-white/35">Sessions</span><button className="rounded-md bg-white/5 px-2 py-1 text-xs text-white/55">+</button></div>
          <div className="space-y-1.5">
            {agents.map(name => <button key={name} onClick={() => setSelected(name)} className={`flex w-full items-center gap-2.5 rounded-xl p-2.5 text-left transition ${selected === name ? "bg-white/10" : "hover:bg-white/5"}`}>
              <AgentIcon name={name} size="sm"/><span className="min-w-0 flex-1"><b className="block truncate text-xs">{name}</b><span className="mt-0.5 block truncate text-[10px] text-white/35">{states[name].line}</span></span><span className={`h-1.5 w-1.5 rounded-full ${states[name].status === "En cours" ? "bg-[var(--accent)]" : "bg-emerald-400"}`}/>
            </button>)}
          </div>
          <div className="mt-5 border-t border-white/10 pt-4"><p className="px-2 text-[10px] font-extrabold uppercase tracking-[.18em] text-white/35">Workspace</p><div className="mt-2 rounded-xl bg-white/5 p-3 text-xs text-white/65"><div className="flex items-center gap-2"><Folder size={13}/> ~/mon-projet</div><div className="mt-2 text-[10px] text-white/30">12 fichiers · 4 dossiers</div></div></div>
          <div className="mt-4 hidden rounded-xl border border-white/8 bg-white/[.03] p-3 lg:block"><div className="flex items-center gap-2 text-[10px] font-bold text-white/45"><GitBranch size={12}/> main</div><p className="mt-2 text-[10px] leading-4 text-white/25">Les agents partagent le même espace.</p></div>
        </aside>

        <section className="min-w-0 bg-[#101010] text-white">
          <div className="flex flex-wrap items-center gap-3 border-b border-white/10 px-4 py-3 sm:px-6"><div><p className="text-sm font-bold">Vos sessions</p><p className="mt-0.5 text-[10px] text-white/30">{completed}/4 tâches terminées</p></div><div className="ml-auto flex gap-2"><button onClick={() => setRunning(v => !v)} className="icon-action">{running ? <Pause size={13}/> : <Play size={13}/>}</button><button onClick={reset} className="icon-action"><RotateCcw size={13}/></button><button onClick={() => setCompare(v => !v)} className={`rounded-lg px-3 py-2 text-[10px] font-bold ${compare ? "bg-white text-black" : "bg-white/7 text-white/60"}`}>Comparer</button></div></div>

          <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-6">
            {agents.map(name => { const s = states[name]; return <button key={name} onClick={() => setSelected(name)} className={`group rounded-2xl border p-4 text-left transition ${selected === name ? "border-white/20 bg-white/[.07]" : "border-white/8 bg-white/[.025] hover:bg-white/[.05]"}`}>
              <div className="flex items-center gap-3"><AgentIcon name={name}/><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><b className="text-sm">{name}</b><span className="text-[9px] font-bold uppercase tracking-wider text-white/30">{s.status}</span></div><p className="mt-1 truncate text-[10px] text-white/35">{s.line}</p></div><ChevronRight size={14} className="text-white/20 transition group-hover:translate-x-0.5"/></div>
              <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/8"><div className="h-full rounded-full bg-[var(--accent)] transition-all duration-700" style={{width:`${s.progress}%`}}/></div><div className="mt-2 flex justify-between text-[9px] text-white/25"><span>{s.progress}%</span><span>{s.status === "Terminé" ? "Résultat prêt" : "Travail en cours"}</span></div>
            </button> })}
          </div>

          <div className="grid gap-4 border-t border-white/10 p-4 sm:p-6 lg:grid-cols-[1fr_260px]">
            <div className="rounded-2xl border border-white/8 bg-white/[.025] p-4">
              <div className="flex items-center gap-3"><AgentIcon name={selected} size="sm"/><div><p className="text-xs font-bold">{selected} · session active</p><p className="text-[10px] text-white/30">Travaille dans ~/mon-projet</p></div><span className="ml-auto rounded-full bg-emerald-400/10 px-2 py-1 text-[9px] font-bold text-emerald-300">LOCAL</span></div>
              <div className="mt-5 space-y-3 font-mono text-[10px] leading-5 text-white/45"><p><span className="text-emerald-400">✓</span> Lecture de package.json</p><p><span className="text-emerald-400">✓</span> Analyse de la structure</p><p><span className="text-[var(--accent)]">●</span> {active.line}</p><p className="text-white/20">$ _</p></div>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[.025] p-4"><p className="text-[9px] font-extrabold uppercase tracking-[.16em] text-white/30">Fichiers</p><div className="mt-3 space-y-2 text-[10px] text-white/55"><div className="flex items-center gap-2"><Folder size={12}/> src</div><div className="ml-4 flex items-center gap-2"><FileCode2 size={12}/> app/page.tsx</div><div className="ml-4 flex items-center gap-2"><FileCode2 size={12}/> components/</div><div className="flex items-center gap-2"><FileCode2 size={12}/> package.json</div></div></div>
          </div>

          <div className="border-t border-white/10 p-4 sm:p-6">
            <div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-white/[.035] p-2"><textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={2} className="min-h-[54px] flex-1 resize-none bg-transparent px-2 py-2 text-xs leading-5 text-white outline-none placeholder:text-white/20"/><button onClick={launch} className="rounded-xl bg-white p-3 text-black transition hover:bg-white/90" aria-label="Lancer la tâche"><Send size={15}/></button></div>
            <div className="mt-2 flex items-center justify-between text-[9px] text-white/25"><span>Entrée pour envoyer · ⌘K pour le centre de commande</span><button onClick={() => setRunning(false)} className="inline-flex items-center gap-1 hover:text-white/50"><Square size={9}/> Arrêter</button></div>
          </div>
        </section>
      </div>

      {compare && <div className="border-t border-white/10 bg-[#151515] p-4 sm:p-6"><div className="mb-4 flex items-center justify-between"><div><p className="text-xs font-bold">Comparer les résultats</p><p className="mt-1 text-[10px] text-white/30">Les agents ont travaillé sur la même mission.</p></div><button onClick={() => setCompare(false)} className="icon-action"><X size={13}/></button></div><div className="grid gap-2 sm:grid-cols-4">{agents.map(name => <div key={name} className="rounded-xl border border-white/8 bg-white/[.025] p-3"><div className="flex items-center gap-2"><AgentIcon name={name} size="sm"/><b className="text-[10px]">{name}</b></div><p className="mt-3 text-[9px] leading-4 text-white/35">{name === "Codex" ? "Approche technique et modifications proposées." : name === "Kimi" ? "Synthèse et points d'attention." : name === "Hermes" ? "Plan d'action et automatisation." : "Analyse structurée du projet."}</p></div>)}</div></div>}
    </div>
  );
}
