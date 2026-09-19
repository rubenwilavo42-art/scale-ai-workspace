"use client";

import { useState } from "react";
import { Check, ChevronRight, Download, Sparkles } from "lucide-react";
import { AgentIcon } from "./AgentIcon";

const agents = [
  { name: "Claude Code", mark: "C", tone: "bg-[#f0e9df] text-[#8c5b35]", status: "Prêt", desc: "Pour coder, analyser et construire." },
  { name: "Codex", mark: "⌘", tone: "bg-[#e8eee9] text-[#315c43]", status: "Prêt", desc: "Pour développer et automatiser." },
  { name: "Antigravity", mark: "A", tone: "bg-[#e8eafa] text-[#4c54a0]", status: "Prêt", desc: "Pour explorer et résoudre." },
  { name: "OpenCode", mark: "O", tone: "bg-[#ece8f0] text-[#654a79]", status: "Installation en un clic", desc: "Ajoutez un nouvel agent à votre espace." },
  { name: "Hermes", mark: "H", tone: "bg-[#f1e9e3] text-[#88583d]", status: "Installation en un clic", desc: "Préparez un agent pour vos tâches." },
  { name: "Kimi", mark: "K", tone: "bg-[#e6edf1] text-[#3f6476]", status: "Installation en un clic", desc: "Ajoutez-le à votre prochaine session." },
];

export function AgentsShowcase() {
  const [selected, setSelected] = useState(0);
  const agent = agents[selected];

  return (
    <div className="mt-14 grid overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-[0_30px_90px_rgba(0,0,0,.07)] lg:grid-cols-[1.05fr_.95fr]">
      <div className="border-b border-black/10 p-4 sm:p-6 lg:border-b-0 lg:border-r">
        <div className="mb-5 flex items-center justify-between px-1">
          <div>
            <p className="text-sm font-bold">Agents disponibles</p>
            <p className="mt-1 text-xs text-black/40">Choisissez l’agent pour votre prochaine tâche.</p>
          </div>
          <span className="rounded-full bg-black/[.04] px-3 py-1.5 text-[11px] font-bold text-black/50">{agents.length} agents</span>
        </div>
        <div className="space-y-2">
          {agents.map((item, index) => (
            <button
              key={item.name}
              onClick={() => setSelected(index)}
              className={`group flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${selected === index ? "border-black/10 bg-[#f7f6f2] shadow-sm" : "border-transparent hover:bg-black/[.025]"}`}
            >
              <AgentIcon name={item.name === "Claude Code" ? "Claude" : item.name === "Codex" ? "Codex" : item.name as "Antigravity" | "OpenCode" | "Hermes" | "Kimi"} />
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="truncate text-sm font-bold">{item.name}</span>
                  <span className={`hidden rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide sm:inline ${item.status === "Prêt" ? "bg-emerald-500/10 text-emerald-700" : "bg-black/[.05] text-black/45"}`}>{item.status}</span>
                </span>
                <span className="mt-1 block truncate text-xs text-black/40">{item.desc}</span>
              </span>
              <ChevronRight className={`h-4 w-4 transition ${selected === index ? "translate-x-0 text-black/50" : "-translate-x-1 text-black/15 group-hover:translate-x-0 group-hover:text-black/40"}`} />
            </button>
          ))}
        </div>
      </div>

      <div className="relative flex min-h-[430px] flex-col justify-between overflow-hidden bg-[#171717] p-6 text-white sm:p-8">
        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/[.05] blur-3xl" />
        <div className="relative">
          <div className="flex items-center justify-between">
            <span className="rounded-full border border-white/10 bg-white/[.06] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.18em] text-white/55">Nouvelle session</span>
            <Sparkles className="h-4 w-4 text-white/35" />
          </div>
          <div className="mt-12 flex items-center gap-4">
            <AgentIcon name={agent.name === "Claude Code" ? "Claude" : agent.name === "Codex" ? "Codex" : agent.name as "Antigravity" | "OpenCode" | "Hermes" | "Kimi"} size="lg" />
            <div>
              <p className="text-2xl font-extrabold tracking-tight">{agent.name}</p>
              <p className="mt-1 text-sm text-white/45">Travaille dans <span className="text-white/70">~/mon-projet</span></p>
            </div>
          </div>
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/[.045] p-4">
            <p className="text-[10px] font-bold uppercase tracking-[.16em] text-white/35">Votre tâche</p>
            <p className="mt-3 text-sm leading-6 text-white/80">Analyse ce projet, comprends sa structure et propose les prochaines étapes.</p>
            <div className="mt-5 flex items-center gap-2 text-xs text-white/40"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Espace prêt · fichiers accessibles</div>
          </div>
        </div>
        <div className="relative mt-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-white/35"><Check className="h-4 w-4" />Même espace de travail</div>
          <button className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-bold text-black transition hover:bg-white/90"><Download className="h-3.5 w-3.5" />Lancer avec {agent.name}</button>
        </div>
      </div>
    </div>
  );
}
