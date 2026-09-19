import { Code2, MoonStar, Sparkles, Zap } from "lucide-react";

type Agent = "Claude" | "Codex" | "Kimi" | "Hermes" | "Antigravity" | "OpenCode";

const config: Record<Agent, { Icon: typeof Sparkles; className: string; label: string }> = {
  Claude: { Icon: Sparkles, className: "bg-[#f0e9df] text-[#8c5b35]", label: "C" },
  Codex: { Icon: Code2, className: "bg-[#e8eee9] text-[#315c43]", label: "C" },
  Kimi: { Icon: MoonStar, className: "bg-[#e6edf1] text-[#3f6476]", label: "K" },
  Hermes: { Icon: Zap, className: "bg-[#f1e9e3] text-[#88583d]", label: "H" },
  Antigravity: { Icon: Sparkles, className: "bg-[#e8eafa] text-[#4c54a0]", label: "A" },
  OpenCode: { Icon: Code2, className: "bg-[#ece8f0] text-[#654a79]", label: "O" },
};

export function AgentIcon({ name, size = "md" }: { name: Agent; size?: "sm" | "md" | "lg" }) {
  const { Icon, className, label } = config[name];
  const sizes = { sm: "h-8 w-8 rounded-lg", md: "h-11 w-11 rounded-xl", lg: "h-14 w-14 rounded-2xl" };
  return (
    <span className={`agent-icon relative flex shrink-0 items-center justify-center font-extrabold ${sizes[size]} ${className}`} aria-label={`${name} icon`}>
      <Icon className="h-[45%] w-[45%]" strokeWidth={2.2} />
      <span className="absolute bottom-[5px] right-[6px] text-[7px] font-black opacity-60">{label}</span>
    </span>
  );
}
