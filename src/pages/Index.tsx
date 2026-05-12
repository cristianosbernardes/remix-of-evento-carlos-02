import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CheckCircle2, XCircle, Loader2, Send, Calendar, MapPin, ArrowRight,
  Users, TrendingUp, ShoppingCart, Shield, Instagram,
  Plus, Minus, Zap, Target, Lightbulb, Star,
} from "lucide-react";
import { z } from "zod";
import carlosSpeaker from "@/assets/carlos-speaker.webp";
import carlosHeroBg from "@/assets/carlos-hero-bg.webp";
// Hero image will be added later
// import carlosHero from "@/assets/carlos-hero.webp";

/* ═══════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════ */

const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbzLoNJYoomxlHgKhn-9LgXK2t4hcDkuUK5p4Gps9Mof7gDNtpZ2n-_KzrRvDgar350V/exec";

const contactSchema = z.object({
  nome: z.string().trim().min(2, "Preencha seu nome completo"),
  email: z.string().trim().email("Digite um e-mail válido"),
  telefone: z.string().trim().min(14, "Digite um telefone válido com DDD"),
});

const multiStepQuestions = [
  {
    id: "vendeInternet",
    label: "Você já vende pela internet hoje?",
    options: ["Sim, vendo todos os dias", "Sim, mas ainda estou estruturando", "Já tentei vender online", "Ainda não vendo online"],
    disqualify: [] as string[],
  },
  {
    id: "canalVenda",
    label: "Como sua empresa vende atualmente?",
    options: ["Loja física", "E-commerce próprio", "Marketplaces (Shopee, Mercado Livre, Amazon)", "Redes sociais", "Ainda não vendo", "Apenas curiosidade"],
    disqualify: ["Apenas curiosidade"],
  },
  {
    id: "faturamento",
    label: "Qual o faturamento da sua empresa por mês?",
    options: ["Acima de R$ 500k", "De R$ 70k a R$ 500k", "De R$ 20k a R$ 70k", "Até R$ 20k"],
    disqualify: [] as string[],
  },
  {
    id: "objetivo",
    label: "Qual seu objetivo de faturamento nos próximos 6 meses com vendas online?",
    options: ["Entre R$ 10k a R$ 50k/mês", "Entre R$ 50k a R$ 100k/mês", "Entre R$ 100k a R$ 500k/mês", "Acima de R$ 500k/mês"],
    disqualify: [] as string[],
  },
  {
    id: "investimento",
    label: "Quanto você está disposto a investir agora?",
    options: ["Até R$ 10k", "Entre R$ 10k a R$ 50k", "Acima de R$ 50k"],
    disqualify: ["Até R$ 10k"],
  },
  {
    id: "desafio",
    label: "Qual o principal desafio do seu negócio hoje?",
    options: ["Aumentar vendas", "Atrair mais clientes", "Estruturar vendas online", "Escalar o negócio"],
    disqualify: [] as string[],
  },
  {
    id: "interesse",
    label: "Você teria interesse em participar de um evento presencial em São Paulo para aprender estratégias de crescimento empresarial?",
    options: ["Sim, quero participar", "Quero mais informações", "Apenas estou pesquisando"],
    disqualify: ["Apenas estou pesquisando"],
  },
];

const speakers = [
  { name: "Carlos Arantes", role: "CEO da UseVertice e CTA Marketing", bio: "Empresário com mais de 10 anos operando no mercado digital. Já ajudou empresários a saírem do zero para o primeiro milhão — inclusive foi pessoalmente à China validar fornecedores e estruturar operações reais. Sem teoria. Só o que funciona na prática.", instagram: "https://www.instagram.com/carlosarantesm/", image: carlosSpeaker, imagePos: "center 0%" },
];

const learnings = [
  { number: "01", title: "Como vender todos os dias nos maiores marketplaces do Brasil", subtitle: "E-Commerce & Marketplaces", desc: "Estratégias práticas para dominar Shopee, Mercado Livre e Amazon — e criar seu e-commerce próprio com alta conversão.", icon: ShoppingCart, bullets: ["Marketplaces que mais vendem", "Precificação estratégica", "Escala de operações"] },
  { number: "02", title: "Como gerar novos clientes todos os dias sem desperdiçar dinheiro em anúncios", subtitle: "Tráfego Pago & Funis", desc: "Aprenda a criar campanhas que geram vendas reais e funis que transformam visitantes em compradores.", icon: Target, bullets: ["Meta Ads & Google Ads", "Funis de alta conversão", "Retorno sobre investimento"] },
  { number: "03", title: "Como escalar seu faturamento sem precisar contratar mais funcionários", subtitle: "Escalabilidade & Gestão", desc: "Os sistemas e processos que permitem crescer sem aumentar a estrutura — da mesma forma que quem chegou ao primeiro milhão.", icon: TrendingUp, bullets: ["Automação de processos", "Gestão enxuta", "Operação digital"] },
  { number: "04", title: "Como importar da China e criar sua marca própria com margem acima de 300%", subtitle: "Importação & Marca Própria", desc: "O caminho completo para importar com segurança, criar sua marca e multiplicar suas margens.", icon: Zap, bullets: ["Fornecedores confiáveis", "Processo de importação", "Construção de marca"] },
];

const outcomes = [
  { icon: Lightbulb, title: "Visão clara do mercado", desc: "Você vai entender onde estão as oportunidades reais no novo comércio e como posicionar seu negócio para aproveitá-las — hoje." },
  { icon: Target, title: "Direcionamento estratégico", desc: "Sai do evento com um caminho definido. Sem dúvidas sobre qual canal focar, qual produto priorizar, qual próximo passo dar." },
  { icon: CheckCircle2, title: "Caminhos validados", desc: "Não são teorias. São estratégias que já funcionaram para empresários reais — incluindo quem foi do zero ao primeiro milhão." },
  { icon: TrendingUp, title: "Ideias aplicáveis no seu negócio", desc: "Cada conteúdo foi pensado para que você saia com algo para implementar imediatamente. Sem enrolação." },
];

const faqs = [
  { q: "O evento é presencial ou online?", a: "O Fórum Novo Comércio é 100% presencial, em São Paulo. A experiência ao vivo, o networking e a imersão são fundamentais." },
  { q: "Preciso ter uma empresa para participar?", a: "Não. O evento é para quem já tem empresa e quer escalar, mas também para quem está começando." },
  { q: "Como funciona o credenciamento?", a: "Após o cadastro, você receberá um e-mail com todas as instruções de credenciamento, horários e local exato." },
  { q: "Terá alimentação no local?", a: "Sim! O evento contará com coffee breaks e opções de alimentação durante todo o dia." },
  { q: "Qual o horário do evento?", a: "Das 10h às 18h, com intervalos para networking e alimentação. Chegue 30 min antes." },
];

const stats = [
  { icon: Users, value: "+50", label: "EMPRESÁRIOS", desc: "Faturando coletivamente milhões em receita anual" },
  { icon: TrendingUp, value: "+6", label: "ESPECIALISTAS", desc: "As maiores autoridades em novo comércio do Brasil" },
  { icon: MapPin, value: "SÃO PAULO", label: "PRESENCIAL", desc: "O maior evento de novo comércio do país" },
  { icon: Calendar, value: "19.06", label: "1 DIA INTENSIVO", desc: "Conte com 8 horas de imersão total" },
];

const EVENT_DATE = new Date("2026-06-19T10:00:00");

/* ═══════════════════════════════════════════
   HOOKS & ANIMATIONS
   ═══════════════════════════════════════════ */


const useCountdown = () => {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const calc = () => {
      const diff = EVENT_DATE.getTime() - Date.now();
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      return { days: Math.floor(diff / 86400000), hours: Math.floor((diff / 3600000) % 24), minutes: Math.floor((diff / 60000) % 60), seconds: Math.floor((diff / 1000) % 60) };
    };
    setTime(calc());
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };
const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

/* ═══════════════════════════════════════════
   VIDEO PLAYER — VSL style
   ═══════════════════════════════════════════ */

const VideoPlayer = () => {
  const [open, setOpen] = useState(false);
  const inlineRef = useRef<HTMLVideoElement>(null);
  const modalRef = useRef<HTMLVideoElement>(null);

  // Lock scroll + ESC when modal is open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open]);

  // When modal opens: play modal video with sound from beginning
  useEffect(() => {
    if (!open) return;
    const v = modalRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.muted = false;
    v.play().catch(() => {});
  }, [open]);

  const handleOpen = () => {
    inlineRef.current?.pause();
    setOpen(true);
  };

  const handleClose = () => {
    modalRef.current?.pause();
    setOpen(false);
    inlineRef.current?.play().catch(() => {});
  };

  return (
    <>
      {/* ── Inline silent preview ── */}
      <div
        className="relative cursor-pointer group rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-primary/10"
        style={{ maxWidth: 520, width: "100%", aspectRatio: "9/16" }}
        onClick={handleOpen}
      >
        <video
          ref={inlineRef}
          src="/evento-video.mp4"
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent" />

        {/* Badge */}
        <div className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-primary/30 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-primary text-[10px] font-body font-bold uppercase tracking-wider">Última Edição</span>
        </div>

        {/* Pulsing play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <span className="absolute inset-0 rounded-full bg-primary/40 animate-ping" style={{ animationDuration: "1.5s" }} />
            <span className="absolute inset-0 rounded-full bg-primary/20 animate-ping" style={{ animationDuration: "1.5s", animationDelay: "0.5s" }} />
            <div className="relative w-[72px] h-[72px] rounded-full bg-primary flex items-center justify-center shadow-2xl shadow-primary/60 group-hover:scale-110 transition-transform duration-300">
              <div className="ml-1.5" style={{ width: 0, height: 0, borderTop: "12px solid transparent", borderBottom: "12px solid transparent", borderLeft: "20px solid black" }} />
            </div>
          </div>
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 inset-x-0 p-5">
          <p className="font-display text-white text-base leading-tight">FÓRUM NOVO COMÉRCIO 2026</p>
          <p className="font-body text-white/50 text-xs mt-1">Clique para assistir com som</p>
        </div>
      </div>

      {/* ── Modal with sound ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            onClick={handleClose}
          >
            <div className="absolute inset-0 bg-black/92 backdrop-blur-md" />

            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              className="relative z-10 flex flex-col items-center gap-3 w-full"
              style={{ maxWidth: 420 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close */}
              <div className="w-full flex justify-end">
                <button
                  onClick={handleClose}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white/60 hover:text-white font-body text-xs flex items-center gap-1.5"
                >
                  ✕ Fechar
                </button>
              </div>

              {/* Video container */}
              <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black" style={{ aspectRatio: "9/16", maxHeight: "78vh" }}>
                <video
                  ref={modalRef}
                  src="/evento-video.mp4"
                  className="w-full h-full object-contain"
                  playsInline
                  controls
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

/* ═══════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════ */

/* V4-style section label — red dot + uppercase text */
const SectionLabel = ({ text }: { text: string }) => (
  <p className="flex items-center justify-center gap-2 text-primary font-body text-sm font-semibold uppercase tracking-[0.15em] mb-4">
    <span className="w-2 h-2 rounded-full bg-primary" />
    {text}
  </p>
);

/* V4-style heading — Dela Gothic One, 32px, with highlighted span */
const SectionHeading = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <h2 className={`font-display text-[clamp(1.5rem,4vw,2rem)] leading-[1.3] text-center ${className}`}>
    {children}
  </h2>
);

/* V4-style CTA button */
const CtaButton = ({ children, onClick, className = "" }: { children: React.ReactNode; onClick: () => void; className?: string }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 via-primary to-emerald-400 text-primary-foreground font-body font-bold text-sm uppercase tracking-[0.1em] px-8 py-4 rounded hover:brightness-110 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 ${className}`}
  >
    {children}
    <ArrowRight className="w-5 h-5" />
  </button>
);

/* Speaker card — horizontal highlight layout */
const SpeakerCard = ({ speaker: s }: { speaker: typeof speakers[0] }) => (
  <motion.div variants={scaleIn} className="group relative rounded-3xl overflow-hidden bg-[#111] border border-white/8 hover:border-primary/25 transition-all duration-500">
    {/* Green top accent line */}
    <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent z-20" />

    <div className="flex flex-col md:flex-row">
      {/* ── Left: photo ── */}
      <div className="relative md:w-[340px] md:flex-shrink-0 h-80 md:h-auto overflow-hidden">
        {s.image ? (
          <img
            src={s.image}
            alt={s.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
            style={{ objectPosition: (s as any).imagePos || "center top" }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-transparent">
            <span className="font-display text-7xl text-primary/15">{s.name.split(" ").map((n: string) => n[0]).join("")}</span>
          </div>
        )}
        {/* Gradient fade to right on md+ */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111]/80 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#111]" />
      </div>

      {/* ── Right: bio ── */}
      <div className="flex-1 p-8 md:p-10 flex flex-col justify-center gap-5">
        {/* Label */}
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="font-body text-primary text-[11px] font-bold uppercase tracking-widest">Palestrante Principal</span>
        </div>

        {/* Name + role */}
        <div>
          <h3 className="font-display text-3xl sm:text-4xl text-white leading-none">{s.name}</h3>
          <p className="text-primary font-body font-semibold text-sm mt-2">{s.role}</p>
        </div>

        {/* Bio */}
        <p className="font-body text-white/60 text-base leading-relaxed">{s.bio}</p>

        {/* Credentials */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "+10 anos", desc: "no mercado digital" },
            { label: "China", desc: "validou fornecedores pessoalmente" },
            { label: "R$1M+", desc: "gerados por alunos no 1º ano" },
            { label: "Presencial", desc: "aprenda com quem faz" },
          ].map((c) => (
            <div key={c.label} className="bg-white/4 border border-white/6 rounded-xl px-4 py-3">
              <p className="font-display text-primary text-lg leading-none">{c.label}</p>
              <p className="font-body text-white/40 text-xs mt-1 leading-snug">{c.desc}</p>
            </div>
          ))}
        </div>

        {/* Instagram */}
        <a
          href={s.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="self-start flex items-center gap-2 px-4 py-2 rounded-full bg-white/6 border border-white/10 hover:bg-primary/10 hover:border-primary/30 transition-all text-white/50 hover:text-white font-body text-sm"
        >
          <Instagram className="w-3.5 h-3.5" />
          @carlosarantesm
        </a>
      </div>
    </div>
  </motion.div>
);

/* X-shaped marquee bands */
const MarqueeBand = ({ reverse = false }: { reverse?: boolean }) => (
  <div className="relative overflow-hidden py-3">
    <div className={`flex ${reverse ? "animate-marquee-reverse" : "animate-marquee"} whitespace-nowrap`}>
      {Array.from({ length: 16 }).map((_, i) => (
        <span key={i} className="mx-6 font-display text-sm sm:text-base tracking-[0.1em] uppercase">
          <span className="text-white/90">FÓRUM NOVO</span>
          <span className="text-primary ml-1.5">COMÉRCIO</span>
          <span className="text-white/30 ml-1.5">2026</span>
          <span className="inline-block mx-5 text-primary/50">◆</span>
        </span>
      ))}
    </div>
  </div>
);

/* FAQ Item — V4 style */
const FaqItem = ({ item, isOpen, toggle }: { item: typeof faqs[0]; isOpen: boolean; toggle: () => void }) => (
  <motion.div variants={fadeUp} className={`border rounded-lg transition-all duration-300 ${isOpen ? "border-primary/40 bg-white/[0.03]" : "border-white/10 hover:border-white/20"}`}>
    <button onClick={toggle} className="w-full flex items-center justify-between p-5 text-left gap-4">
      <span className={`font-body font-semibold text-[15px] transition-colors ${isOpen ? "text-primary" : "text-white"}`}>{item.q}</span>
      <span className={`flex-shrink-0 w-7 h-7 rounded flex items-center justify-center transition-all ${isOpen ? "bg-primary text-black" : "bg-white/10 text-white/50"}`}>
        {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
      </span>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
          <p className="px-5 pb-5 text-sm text-white/50 font-body leading-relaxed">{item.a}</p>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

/* ═══════════════════════════════════════════
   MULTI-STEP QUALIFICATION FORM
   ═══════════════════════════════════════════ */

const MultiStepForm = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [contact, setContact] = useState({ nome: "", email: "", telefone: "" });
  const [contactErrors, setContactErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const TOTAL_Q = multiStepQuestions.length;

  const maskPhone = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 11);
    if (d.length <= 2) return d.length ? `(${d}` : "";
    if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  };

  const handleOptionSelect = (option: string) => {
    const q = multiStepQuestions[step];
    setAnswers((prev) => ({ ...prev, [q.id]: option }));
    if (q.disqualify.includes(option)) {
      setStep(TOTAL_Q + 1);
    } else if (step === TOTAL_Q - 1) {
      setStep(TOTAL_Q);
    } else {
      setStep(step + 1);
    }
  };

  const handleContactChange = (field: "nome" | "email" | "telefone", value: string) => {
    if (field === "telefone") value = maskPhone(value);
    setContact((prev) => ({ ...prev, [field]: value }));
    if (contactErrors[field]) setContactErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    const result = contactSchema.safeParse(contact);
    if (!result.success) {
      const fe: Record<string, string> = {};
      result.error.errors.forEach((err) => { if (err.path[0]) fe[err.path[0] as string] = err.message; });
      setContactErrors(fe);
      return;
    }
    setIsSubmitting(true);
    try {
      if (GOOGLE_SHEETS_URL) {
        const dataHora = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
        await fetch(GOOGLE_SHEETS_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            Data: dataHora,
            Nome: result.data.nome,
            "E-mail": result.data.email,
            WhatsApp: result.data.telefone,
            "Vende pela internet": answers.vendeInternet || "",
            "Como vende": answers.canalVenda || "",
            "Faturamento mensal": answers.faturamento || "",
            "Objetivo 6 meses": answers.objetivo || "",
            "Investimento disponível": answers.investimento || "",
            "Desafio atual": answers.desafio || "",
            "Vem no evento": answers.interesse || "",
          }),
        });
      }
      if (typeof window.fbq === "function") {
        window.fbq("track", "Lead", { content_name: "Fórum Novo Comércio 2026", content_category: "Evento" });
      }
      navigate("/obrigado");
    } catch {
      setSubmitError("Erro ao enviar. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPct = step >= TOTAL_Q ? 95 : Math.round((step / TOTAL_Q) * 92);

  if (step === TOTAL_Q + 1) {
    return (
      <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-6 sm:p-10 text-center space-y-6">
        <div className="w-14 h-14 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto">
          <XCircle className="w-7 h-7 text-white/30" />
        </div>
        <div className="space-y-3">
          <p className="font-display text-xl text-white leading-tight">Entendemos o seu momento</p>
          <p className="font-body text-white/50 text-sm leading-relaxed max-w-sm mx-auto">
            Pelos dados enviados, ainda não é o momento de você ir para o evento presencial pois estou pensando no seu momento atual financeiro. Mas isso não te impede de começar.
          </p>
          <p className="font-body text-white/50 text-sm leading-relaxed max-w-sm mx-auto">
            Recomendamos o <span className="text-white font-semibold">F.R.O = Fature Rápido Online</span>, ideal para quem está iniciando.
          </p>
        </div>
        <a
          href="https://carlosarantes.com.br/metodo-fro-v3/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 via-primary to-emerald-400 text-black font-body font-bold text-sm uppercase tracking-wider px-6 py-3 rounded hover:brightness-110 transition-all"
        >
          Veja como funciona esse método
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    );
  }

  return (
    <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-6 sm:p-8 space-y-6">
      {/* Progress */}
      <div className="space-y-2.5">
        <div className="flex justify-between items-center">
          <span className="text-[11px] text-white/40 font-body font-medium">
            {step < TOTAL_Q ? `Pergunta ${step + 1} de ${TOTAL_Q}` : "Finalizando cadastro"}
          </span>
          <span className="text-[11px] text-primary font-body font-bold">{progressPct}%</span>
        </div>
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <div className="flex gap-1">
          {multiStepQuestions.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                i < step ? "bg-primary" : i === step && step < TOTAL_Q ? "bg-primary/50" : "bg-white/10"
              }`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step < TOTAL_Q ? (
          <motion.div
            key={`q-${step}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="space-y-4"
          >
            <p className="font-body font-semibold text-white text-base leading-snug">
              {multiStepQuestions[step].label}
            </p>
            <div className="space-y-2">
              {multiStepQuestions[step].options.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleOptionSelect(option)}
                  className="w-full text-left px-4 py-3.5 rounded-lg border border-white/10 bg-white/[0.02] hover:border-primary/40 hover:bg-primary/5 active:bg-primary/10 transition-all duration-150 font-body text-white/65 hover:text-white text-sm flex items-center justify-between gap-3 group"
                >
                  <span>{option}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white/20 group-hover:text-primary flex-shrink-0 transition-colors" />
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="contact"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="space-y-5"
          >
            <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/15">
              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="font-body text-white/70 text-sm leading-relaxed">
                <span className="text-white font-semibold">Ótimo perfil!</span> Agora informe seus dados para garantir sua vaga e receber mais informações.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="ms-nome" className="text-xs font-body font-medium text-white/80">Nome completo</Label>
                <Input
                  id="ms-nome"
                  placeholder="Seu nome completo"
                  value={contact.nome}
                  onChange={(e) => handleContactChange("nome", e.target.value)}
                  className={`h-11 bg-black/30 border-white/15 text-white/70 placeholder:text-white/25 ${contactErrors.nome ? "border-yellow-500" : ""}`}
                />
                {contactErrors.nome && <p className="text-[11px] text-yellow-400">{contactErrors.nome}</p>}
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="ms-email" className="text-xs font-body font-medium text-white/80">E-mail</Label>
                  <Input
                    id="ms-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={contact.email}
                    onChange={(e) => handleContactChange("email", e.target.value)}
                    className={`h-11 bg-black/30 border-white/15 text-white/70 placeholder:text-white/25 ${contactErrors.email ? "border-yellow-500" : ""}`}
                  />
                  {contactErrors.email && <p className="text-[11px] text-yellow-400">{contactErrors.email}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ms-telefone" className="text-xs font-body font-medium text-white/80">WhatsApp</Label>
                  <Input
                    id="ms-telefone"
                    type="text"
                    inputMode="numeric"
                    placeholder="(11) 99999-9999"
                    value={contact.telefone}
                    onChange={(e) => handleContactChange("telefone", e.target.value)}
                    className={`h-11 bg-black/30 border-white/15 text-white/70 placeholder:text-white/25 ${contactErrors.telefone ? "border-yellow-500" : ""}`}
                  />
                  {contactErrors.telefone && <p className="text-[11px] text-yellow-400">{contactErrors.telefone}</p>}
                </div>
              </div>
              {submitError && <p className="text-sm text-yellow-400 text-center font-body">{submitError}</p>}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-emerald-600 via-primary to-emerald-400 text-black font-body font-bold text-sm uppercase tracking-wider py-4 rounded hover:brightness-110 transition-all flex items-center justify-center gap-2 glow-green"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {isSubmitting ? "Enviando..." : "Garantir Minha Vaga"}
              </button>
              <div className="flex items-center justify-center">
                <span className="inline-flex items-center gap-1.5 text-[11px] text-white/30 font-body">
                  <Shield className="w-3 h-3" /> Seus dados estão protegidos
                </span>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */

const Index = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const countdown = useCountdown();

  const scrollToForm = () => document.getElementById("formulario")?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      {/* ══ PREMIUM BACKGROUND — fixed orbs + light beams ══ */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden bg-background" style={{ zIndex: -1 }}>
        {/* Orb 1 — large, top-right, primary glow */}
        <div className="absolute rounded-full" style={{ top: "-20%", right: "-12%", width: "70vw", height: "70vw", maxWidth: 900, maxHeight: 900, background: "radial-gradient(circle at center, rgba(0,230,118,0.13) 0%, transparent 60%)" }} />
        {/* Orb 2 — mid-left */}
        <div className="absolute rounded-full" style={{ top: "38%", left: "-18%", width: "55vw", height: "55vw", maxWidth: 700, maxHeight: 700, background: "radial-gradient(circle at center, rgba(0,230,118,0.09) 0%, transparent 60%)" }} />
        {/* Orb 3 — bottom-right */}
        <div className="absolute rounded-full" style={{ bottom: "8%", right: "-5%", width: "42vw", height: "42vw", maxWidth: 520, maxHeight: 520, background: "radial-gradient(circle at center, rgba(0,230,118,0.07) 0%, transparent 60%)" }} />
        {/* Orb 4 — center subtle teal for depth */}
        <div className="absolute rounded-full" style={{ top: "55%", left: "30%", width: "35vw", height: "35vw", maxWidth: 440, maxHeight: 440, background: "radial-gradient(circle at center, rgba(0,200,255,0.04) 0%, transparent 60%)" }} />

        {/* Light beam 1 — diagonal left */}
        <div className="absolute" style={{ top: "-8%", left: "20%", width: 80, height: "72vh", background: "linear-gradient(to bottom, rgba(0,230,118,0.11) 0%, transparent 100%)", transform: "rotate(22deg)", transformOrigin: "top center", filter: "blur(24px)" }} />
        {/* Light beam 2 — right side, white */}
        <div className="absolute" style={{ top: "-5%", right: "26%", width: 50, height: "55vh", background: "linear-gradient(to bottom, rgba(255,255,255,0.06) 0%, transparent 100%)", transform: "rotate(-14deg)", transformOrigin: "top center", filter: "blur(14px)" }} />
        {/* Light beam 3 — thin crisp, green */}
        <div className="absolute" style={{ top: 0, left: "57%", width: 2, height: "48vh", background: "linear-gradient(to bottom, rgba(0,230,118,0.30) 0%, transparent 100%)", transform: "rotate(8deg)", transformOrigin: "top center" }} />
        {/* Light beam 4 — thin crisp, white */}
        <div className="absolute" style={{ top: 0, right: "40%", width: 1.5, height: "38vh", background: "linear-gradient(to bottom, rgba(255,255,255,0.15) 0%, transparent 100%)", transform: "rotate(-5deg)", transformOrigin: "top center" }} />
        {/* Light beam 5 — wide soft, center-right, lower section */}
        <div className="absolute" style={{ top: "45%", right: "10%", width: 60, height: "50vh", background: "linear-gradient(to bottom, rgba(0,230,118,0.07) 0%, transparent 100%)", transform: "rotate(-18deg)", transformOrigin: "top center", filter: "blur(20px)" }} />
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen text-white overflow-x-hidden">

          {/* ══ NAV — V4 style: logo | urgency | countdown | CTA ══ */}
          <nav className="fixed top-0 left-0 right-0 z-[5000] bg-[rgba(3,12,24,0.92)] backdrop-blur-[12px]">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 sm:h-[72px] flex items-center justify-between gap-2 sm:gap-4">
              {/* Logo */}
              <span className="font-display text-[11px] sm:text-base tracking-tight flex-shrink-0">
                <span className="text-white">FÓRUM</span>
                <span className="text-primary ml-1">NOVO COMÉRCIO</span>
                <span className="text-white/30 ml-1 text-[10px] hidden sm:inline">2026</span>
              </span>

              {/* Urgency text — 2 lines like V4 */}
              <div className="hidden lg:block text-center font-body font-medium text-[13px] leading-tight">
                <span className="text-white/60">GARANTA SEU INGRESSO ANTES</span>
                <br />
                <span className="text-white/60">QUE </span><span className="text-white font-bold underline">AS VAGAS SE ESGOTEM!</span>
              </div>

              {/* Countdown — V4 style: card-bg boxes with labels */}
              <div className="hidden sm:flex items-center gap-1 font-body">
                {[
                  { v: countdown.days, l: "DIAS" },
                  { v: countdown.hours, l: "HORAS" },
                  { v: countdown.minutes, l: "MINUTOS" },
                  { v: countdown.seconds, l: "SEGUNDOS" },
                ].map((u, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <div className="flex flex-col items-center">
                      <div className="bg-[#1A1A1A] border border-white/10 rounded-md px-2 py-1 min-w-[38px] text-center">
                        <span className="text-primary font-extrabold text-base tabular-nums leading-none">{String(u.v).padStart(2, "0")}</span>
                      </div>
                      <span className="text-[7px] text-white/40 font-bold tracking-wider mt-0.5">{u.l}</span>
                    </div>
                    {i < 3 && <span className="text-primary font-bold text-sm -mt-3">:</span>}
                  </div>
                ))}
              </div>

              {/* CTA */}
              <button onClick={scrollToForm} className="flex-shrink-0 bg-gradient-to-r from-emerald-600 via-primary to-emerald-400 text-black font-body font-bold text-[10px] sm:text-[11px] uppercase tracking-wider px-3 sm:px-4 py-2 sm:py-2.5 rounded hover:brightness-110 transition-all flex items-center gap-1.5 sm:gap-2">
                <span className="hidden sm:inline">Garantir Ingresso</span>
                <span className="sm:hidden">Ingresso</span>
                <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
            </div>
          </nav>

          {/* ══ HERO — V4 style: full-bleed image, centered text overlay ══ */}
          <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16 sm:pt-[72px]">
            {/* Background hero image */}
            <img src={carlosHeroBg} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover object-center" />
            <div className="absolute inset-0 bg-background/60" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background" />

            {/* Hero-specific premium glows — above overlays */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 2 }}>
              {/* Top-right orb */}
              <div className="absolute rounded-full" style={{ top: "-30%", right: "-10%", width: "60%", height: "120%", background: "radial-gradient(circle at 70% 30%, rgba(0,230,118,0.12) 0%, transparent 55%)" }} />
              {/* Bottom-left orb */}
              <div className="absolute rounded-full" style={{ bottom: "-20%", left: "-10%", width: "50%", height: "80%", background: "radial-gradient(circle at 30% 70%, rgba(0,230,118,0.07) 0%, transparent 55%)" }} />
              {/* Thin crisp beam — left of center */}
              <div className="absolute" style={{ top: 0, left: "32%", width: 1.5, height: "80%", background: "linear-gradient(to bottom, rgba(0,230,118,0.35) 0%, transparent 100%)", transform: "rotate(12deg)", transformOrigin: "top center" }} />
              {/* Wide soft beam — right */}
              <div className="absolute" style={{ top: "-5%", right: "20%", width: 55, height: "70%", background: "linear-gradient(to bottom, rgba(0,230,118,0.07) 0%, transparent 100%)", transform: "rotate(-10deg)", transformOrigin: "top center", filter: "blur(18px)" }} />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
              <motion.div initial="hidden" animate="visible" variants={stagger} className="flex flex-col items-center">
                {/* Badge */}
                <motion.div variants={fadeUp}>
                  <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-[13px] font-body text-white/70">
                    <Zap className="w-4 h-4 text-primary" />
                    19 de Junho · São Paulo · <span className="text-primary font-bold">Vagas Limitadas</span>
                  </span>
                </motion.div>

                {/* Headline */}
                <motion.h1 variants={fadeUp} className="font-display text-[clamp(1.75rem,5.5vw,2.5rem)] mt-8 leading-[1.3] uppercase">
                  O comércio mudou.{" "}
                  <span className="text-primary">Enquanto a maioria ainda não percebeu</span>{" "}
                  — outros estão faturando todos os dias pela internet.
                </motion.h1>

                {/* Subtitle */}
                <motion.p variants={fadeUp} className="mt-6 text-white/60 font-body font-medium text-base sm:text-xl max-w-2xl leading-[1.4]">
                  A pergunta não é SE você vai se adaptar ao novo comércio.{" "}
                  <span className="text-white font-semibold">É quando — e de qual lado você vai estar.</span>
                </motion.p>

                {/* CTA */}
                <motion.div variants={fadeUp} className="mt-8">
                  <CtaButton onClick={scrollToForm} className="px-10 sm:px-14 py-5 text-base glow-green-strong">
                    Quero Estar do Lado Certo
                  </CtaButton>
                </motion.div>

                {/* Date + Location — V4: Montserrat 500 16px */}
                <motion.p variants={fadeUp} className="mt-6 font-body font-medium text-white/60 text-base flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-primary" /> 19 de Junho
                  <span className="text-white/20">|</span>
                  <MapPin className="w-4 h-4 text-primary" /> São Paulo, SP
                </motion.p>
              </motion.div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
          </section>

          {/* ══ X-SHAPED MARQUEE BANDS ══ */}
          <div className="relative -mt-4 py-1 overflow-hidden">
            <div className="relative z-10 -rotate-[1.5deg] -ml-[10%] w-[120%] bg-[#0F0F0F] border-y border-white/10">
              <MarqueeBand />
            </div>
            <div className="relative z-20 rotate-[1.5deg] -ml-[10%] w-[120%] -mt-2 bg-[#141414] border-y border-primary/15">
              <MarqueeBand reverse />
            </div>
          </div>

          {/* ══ STATS — V4: 4 dark cards with red icon, big number, label ══ */}
          <section className="py-16 sm:py-20 relative bg-grid-fade">
            <div className="max-w-5xl mx-auto px-6">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger} className="text-center mb-12">
                <motion.div variants={fadeUp}>
                  <SectionLabel text="O maior evento de novo comércio" />
                  <SectionHeading>
                    O <span className="text-primary">MAIOR EVENTO DE ESTRATÉGIA</span>
                    <br />PARA EMPRESÁRIOS DO BRASIL
                  </SectionHeading>
                  <p className="font-body font-medium text-white/50 text-lg mt-4 max-w-xl mx-auto">
                    Onde os empresários que comandam o mercado vêm buscar <span className="text-white font-semibold">clareza para os próximos 10 anos.</span>
                  </p>
                </motion.div>
              </motion.div>

              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((s, i) => (
                  <motion.div key={i} variants={scaleIn} className="relative rounded-2xl bg-[#1A1A1A] border border-white/5 p-5 sm:p-6 text-center overflow-hidden group hover:border-primary/20 transition-colors">
                    {/* Red top bar — V4 style */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-[3px] bg-primary rounded-b" />
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mt-2">
                      <s.icon className="w-5 h-5 text-primary" />
                    </div>
                    <p className="font-display text-2xl sm:text-3xl text-primary mt-4">{s.value}</p>
                    <p className="font-display text-xs sm:text-sm text-white mt-1">{s.label}</p>
                    <p className="font-body text-[11px] sm:text-xs text-white/40 mt-2 leading-snug">{s.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* ══ O PROBLEMA — ANTES/DEPOIS ══ */}
          <section className="py-16 sm:py-20 section-elevated">
            <div className="max-w-4xl mx-auto px-6">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger}>
                <motion.div variants={fadeUp} className="text-center mb-10">
                  <SectionLabel text="O problema" />
                  <SectionHeading>
                    O PROBLEMA DA MAIORIA DOS EMPRESÁRIOS{" "}
                    <span className="text-primary">NÃO ESTÁ NAS VENDAS.</span>
                  </SectionHeading>
                  <p className="font-body font-medium text-white/50 text-base mt-3">Está na forma como enxergam o mercado.</p>
                </motion.div>

                <motion.div variants={fadeUp} className="grid sm:grid-cols-2 gap-5">
                  <div className="rounded-2xl bg-[#1A1A1A] border border-white/5 p-6 relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-[3px] bg-red-500/80 rounded-b" />
                    <p className="font-body font-bold text-red-400/80 text-xs uppercase tracking-wider mt-2 mb-4">Enquanto muitos:</p>
                    <ul className="space-y-3">
                      {[
                        "Brigam por preço no mercado físico",
                        "Trabalham com margem cada vez mais apertada",
                        "Dependem de uma única fonte de clientes",
                        "Veem o digital como complicado demais",
                        "Continuam no mesmo lugar ano após ano",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-white/45 font-body text-[14px] leading-snug">
                          <span className="mt-1 w-3.5 h-3.5 rounded-full border border-red-500/40 flex items-center justify-center flex-shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500/60" />
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-2xl bg-[#1A1A1A] border border-primary/10 p-6 relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-[3px] bg-primary rounded-b" />
                    <p className="font-body font-bold text-primary text-xs uppercase tracking-wider mt-2 mb-4">Outros empresários estão:</p>
                    <ul className="space-y-3">
                      {[
                        "Vendendo todos os dias pela internet",
                        "Dominando Shopee, Mercado Livre e Amazon",
                        "Gerando clientes com tráfego pago no automático",
                        "Escalando sem precisar de mais funcionários",
                        "Chegando ao primeiro milhão — e além",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-white/70 font-body text-[14px] leading-snug">
                          <CheckCircle2 className="mt-0.5 w-4 h-4 text-primary flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>

                <motion.div variants={fadeUp} className="text-center mt-6">
                  <p className="font-body text-white/60 text-base">
                    E é exatamente isso que você vai aprender no{" "}
                    <span className="text-primary font-bold">Fórum Novo Comércio.</span>
                  </p>
                </motion.div>

                <motion.div variants={fadeUp} className="text-center mt-8">
                  <CtaButton onClick={scrollToForm}>Quero Virar o Jogo</CtaButton>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* ══ VÍDEO — ÚLTIMA EDIÇÃO ══ */}
          <section className="py-16 sm:py-20 relative bg-grid-fade">
            <div className="max-w-5xl mx-auto px-6">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger}>
                <motion.div variants={fadeUp} className="text-center mb-10">
                  <SectionLabel text="Última edição" />
                  <SectionHeading>
                    VEJA COMO FOI A <span className="text-primary">ÚLTIMA EDIÇÃO</span>
                  </SectionHeading>
                  <p className="font-body font-medium text-white/50 text-lg mt-4 max-w-lg mx-auto">
                    Mais de 50 empresários reunidos para{" "}
                    <span className="text-white font-semibold">transformar seus negócios em um único dia.</span>
                  </p>
                </motion.div>

                <motion.div variants={scaleIn} className="flex justify-center">
                  <VideoPlayer />
                </motion.div>

                <motion.div variants={fadeUp} className="text-center mt-10">
                  <CtaButton onClick={scrollToForm}>Quero Estar na Próxima Edição</CtaButton>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* ══ SPEAKERS — V4 style: 3+2 grid, dark cards, photo, red accent ══ */}
          <section className="py-16 sm:py-20 relative bg-grid-fade">
            <div className="max-w-6xl mx-auto px-6">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger} className="text-center mb-12">
                <motion.div variants={fadeUp}>
                  <SectionLabel text="Aprenda com grandes" />
                  <SectionHeading>
                    E QUEM ESTÁ NO PALCO DO <span className="text-primary">FÓRUM NOVO COMÉRCIO?</span>
                  </SectionHeading>
                  <p className="font-body font-medium text-white/50 text-lg mt-4 max-w-lg mx-auto">
                    Aprenda diretamente com quem <span className="text-white font-semibold">vive o que ensina — todos os dias.</span>
                  </p>
                </motion.div>
              </motion.div>

              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} variants={stagger}>
                <SpeakerCard speaker={speakers[0]} />
              </motion.div>

              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mt-12">
                <CtaButton onClick={scrollToForm}>Quero Estar Nesse Evento</CtaButton>
              </motion.div>
            </div>
          </section>

          {/* ══ WHAT YOU'LL LEARN — V4 style numbered cards ══ */}
          <section className="py-16 sm:py-20 section-elevated">
            <div className="max-w-5xl mx-auto px-6">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger} className="text-center mb-12">
                <motion.div variants={fadeUp}>
                  <SectionLabel text="Conteúdo do evento" />
                  <SectionHeading>
                    DURANTE O EVENTO, VOCÊ VAI ENTENDER:
                  </SectionHeading>
                  <p className="font-body font-medium text-white/50 text-lg mt-4 max-w-lg mx-auto">
                    Sem teoria. Sem enrolação. <span className="text-white font-semibold">Só o que realmente está funcionando hoje.</span>
                  </p>
                </motion.div>
              </motion.div>

              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} variants={stagger} className="space-y-4">
                {learnings.map((item, i) => (
                  <motion.div key={i} variants={fadeUp} className="rounded-2xl bg-[#1A1A1A] border border-white/5 overflow-hidden hover:border-primary/20 transition-colors">
                    <div className="h-[3px] bg-gradient-to-r from-primary via-primary/50 to-transparent" />
                    <div className="flex flex-col sm:flex-row gap-5 p-5 sm:p-6">
                      <div className="flex sm:flex-col items-center sm:items-start gap-3 flex-shrink-0">
                        <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                          <item.icon className="w-5 h-5 text-primary" />
                        </div>
                        <span className="font-display text-3xl text-primary/15">{item.number}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-display text-base sm:text-lg text-white leading-tight">{item.title}</h3>
                        <p className="text-primary font-body font-semibold text-xs mt-1 uppercase tracking-wider">{item.subtitle}</p>
                        <p className="text-white/40 font-body text-sm mt-3 leading-relaxed">{item.desc}</p>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {item.bullets.map((b, j) => (
                            <span key={j} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/[0.03] border border-white/[0.06] text-[11px] text-white/35 font-body font-medium">
                              <CheckCircle2 className="w-3 h-3 text-primary/40" /> {b}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mt-12">
                <CtaButton onClick={scrollToForm}>Quero Aprender Tudo Isso</CtaButton>
              </motion.div>
            </div>
          </section>

          {/* ══ VOCÊ VAI SAIR COM ══ */}
          <section className="py-16 sm:py-20 section-elevated">
            <div className="max-w-5xl mx-auto px-6">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger}>
                <motion.div variants={fadeUp} className="text-center mb-12">
                  <SectionLabel text="A transformação" />
                  <SectionHeading>
                    VOCÊ VAI SAIR DO EVENTO{" "}
                    <span className="text-primary">DIFERENTE.</span>
                  </SectionHeading>
                  <p className="font-body font-medium text-white/50 text-lg mt-4 max-w-lg mx-auto">
                    Não é teoria. É{" "}
                    <span className="text-white font-semibold">direcionamento real para o seu negócio.</span>
                  </p>
                </motion.div>

                <motion.div variants={stagger} className="grid sm:grid-cols-2 gap-4">
                  {outcomes.map((item, i) => (
                    <motion.div key={i} variants={scaleIn} className="rounded-2xl bg-[#1A1A1A] border border-white/5 p-6 relative overflow-hidden hover:border-primary/20 transition-colors">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-[3px] bg-primary rounded-b" />
                      <div className="flex items-start gap-4 mt-2">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                          <item.icon className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-display text-sm text-white leading-tight">{item.title}</h3>
                          <p className="text-white/40 font-body text-xs mt-2 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div variants={fadeUp} className="text-center mt-10">
                  <CtaButton onClick={scrollToForm}>Quero Essa Transformação</CtaButton>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* ══ CASE STUDY — FELIZZO ══ */}
          <section className="py-16 sm:py-20 relative bg-grid-fade">
            <div className="max-w-4xl mx-auto px-6">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger}>
                <motion.div variants={fadeUp} className="text-center mb-10">
                  <SectionLabel text="Caso real" />
                  <SectionHeading>
                    VOCÊ PODE SER O <span className="text-primary">PRÓXIMO.</span>
                  </SectionHeading>
                </motion.div>

                <motion.div variants={scaleIn} className="rounded-2xl bg-[#1A1A1A] border border-primary/15 p-6 sm:p-8 relative overflow-hidden">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-[3px] bg-primary rounded-b" />
                  <div className="flex flex-col gap-6 mt-4">
                    <div className="flex items-center gap-3">
                      <div className="px-3 py-1.5 rounded bg-primary/10 border border-primary/20">
                        <span className="font-display text-xs text-primary tracking-wider">FELIZZO</span>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 text-primary fill-primary" />
                        ))}
                      </div>
                    </div>
                    <p className="font-display text-[clamp(1.1rem,3vw,1.5rem)] text-white leading-tight">
                      Do zero ao{" "}
                      <span className="text-primary">R$1.000.000 faturados</span>{" "}
                      no primeiro ano.
                    </p>
                    <p className="font-body text-white/50 text-sm leading-relaxed max-w-xl">
                      Começou do absoluto zero no e-commerce. Aplicou as estratégias, foi pessoalmente à China com Carlos Arantes validar fornecedores, e no primeiro ano de operação já atingiu{" "}
                      <span className="text-white font-semibold">R$1 milhão faturados — sem ter nenhum funcionário.</span>
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {[
                        { value: "R$1M", label: "No 1º Ano" },
                        { value: "Zero", label: "Funcionários" },
                        { value: "Do Zero", label: "Ponto de Partida" },
                      ].map((s, i) => (
                        <div key={i} className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                          <p className="font-display text-primary text-lg">{s.value}</p>
                          <p className="font-body text-white/30 text-[10px] uppercase tracking-wider mt-0.5">{s.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={fadeUp} className="text-center mt-8">
                  <CtaButton onClick={scrollToForm}>Quero Resultados Como Esses</CtaButton>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* ══ ESTE EVENTO É PARA VOCÊ QUE ══ */}
          <section className="py-16 sm:py-20 section-elevated">
            <div className="max-w-3xl mx-auto px-6">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger}>
                <motion.div variants={fadeUp} className="text-center mb-10">
                  <SectionLabel text="Quem é esse evento" />
                  <SectionHeading>
                    ESSE EVENTO É PARA{" "}
                    <span className="text-primary">VOCÊ QUE:</span>
                  </SectionHeading>
                </motion.div>

                <motion.div variants={fadeUp} className="rounded-2xl bg-[#1A1A1A] border border-primary/10 p-6 sm:p-8 relative overflow-hidden">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-[3px] bg-primary rounded-b" />
                  <ul className="space-y-4 mt-2">
                    {[
                      "Já tem negócio e quer crescer de verdade",
                      "Quer vender na internet e não sabe por onde começar",
                      "Quer escalar seu faturamento sem aumentar a estrutura",
                      "Quer sair do modelo tradicional e entrar no novo comércio",
                      "Está cansado de teoria e quer só o que realmente funciona",
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-white/70 font-body text-[15px]">
                        <div className="w-6 h-6 rounded bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div variants={fadeUp} className="text-center mt-8">
                  <CtaButton onClick={scrollToForm}>Esse Sou Eu — Quero Participar</CtaButton>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* ══ NÃO É PARA VOCÊ SE ══ */}
          <section className="py-16 sm:py-20 relative bg-grid-fade">
            <div className="max-w-3xl mx-auto px-6">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger}>
                <motion.div variants={fadeUp} className="text-center mb-10">
                  <SectionLabel text="Seja honesto consigo" />
                  <SectionHeading>
                    MAS SE VOCÊ É ASSIM,{" "}
                    <span className="text-red-400">NÃO VENHA.</span>
                  </SectionHeading>
                  <p className="font-body font-medium text-white/50 text-base mt-3 max-w-lg mx-auto">
                    Vagas são limitadas. Não queremos desperdiçar a sua — nem a nossa.
                  </p>
                </motion.div>

                <motion.div variants={fadeUp} className="rounded-2xl bg-[#1A1A1A] border border-red-500/15 p-6 sm:p-8 relative overflow-hidden">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-[3px] bg-red-500/60 rounded-b" />
                  <ul className="space-y-4 mt-2">
                    {[
                      "Está procurando fórmula mágica para enriquecer sem esforço",
                      "Não tem negócio ativo ou produto para vender",
                      "Quer conteúdo superficial de 'como ganhar dinheiro online'",
                      "Não está disposto a implementar o que vai aprender",
                      "Prefere continuar fazendo o que sempre fez esperando resultados diferentes",
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-white/45 font-body text-[15px]">
                        <div className="w-6 h-6 rounded bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                          <XCircle className="w-3.5 h-3.5 text-red-400" />
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 pt-5 border-t border-white/5">
                    <p className="font-body text-white/30 text-sm text-center leading-relaxed">
                      Se você se identificou com algum item acima, este evento simplesmente não foi feito para você — e tudo bem.{" "}
                      <span className="text-white/60 font-semibold">Se não se identificou, seu lugar está aqui.</span>
                    </p>
                  </div>
                </motion.div>

                <motion.div variants={fadeUp} className="text-center mt-8">
                  <CtaButton onClick={scrollToForm}>Meu Lugar É Aqui — Quero Me Inscrever</CtaButton>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* ══ MARQUEE ══ */}
          <div className="relative py-1 overflow-hidden">
            <div className="relative z-10 -rotate-[1.5deg] -ml-[10%] w-[120%] bg-[#0F0F0F] border-y border-white/10">
              <MarqueeBand />
            </div>
            <div className="relative z-20 rotate-[1.5deg] -ml-[10%] w-[120%] -mt-2 bg-[#141414] border-y border-primary/15">
              <MarqueeBand reverse />
            </div>
          </div>

          {/* ══ FORM (antes do FAQ) ══ */}
          <section id="formulario" className="py-16 sm:py-20 relative bg-grid-fade section-elevated">
            <div className="max-w-xl mx-auto px-6">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger}>
                <motion.div variants={fadeUp} className="text-center mb-10">
                  <SectionLabel text="Inscreva-se" />
                  <SectionHeading>
                    Responda <span className="text-primary">7 perguntas rápidas</span> e garanta sua vaga
                  </SectionHeading>
                  <p className="font-body font-medium text-white/50 text-base mt-3 max-w-md mx-auto">Leva menos de 2 minutos. Sem compromisso.</p>
                </motion.div>

                <motion.div variants={fadeUp}>
                  <MultiStepForm />
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* ══ LOCAL DO EVENTO — V4 style ══ */}
          <section className="py-16 sm:py-20 relative bg-grid-fade">
            <div className="max-w-5xl mx-auto px-6">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger}>
                <motion.div variants={fadeUp} className="text-center mb-10">
                  <SectionLabel text="Onde irá acontecer" />
                  <SectionHeading>
                    COMO CHEGAR NO NOSSO <span className="text-primary">PONTO DE ENCONTRO</span>
                  </SectionHeading>
                </motion.div>

                {/* Info cards — all same height */}
                <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <div className="rounded-2xl bg-[#1A1A1A] border border-white/5 p-5 flex flex-col">
                    <p className="font-display text-sm text-primary">ENDEREÇO</p>
                    <p className="font-body text-white/70 text-xs mt-2 leading-relaxed">Sede da Associação Comercial de São Paulo</p>
                    <p className="font-body text-white/40 text-xs mt-1">Palácio do Comércio — Centro Histórico</p>
                    <p className="font-body text-white/40 text-xs mt-1">São Paulo, SP</p>
                  </div>
                  <div className="rounded-2xl bg-[#1A1A1A] border border-white/5 p-5 flex flex-col">
                    <p className="font-display text-sm text-primary">DATA</p>
                    <p className="font-body text-white/70 text-xs mt-2">19 de Junho de 2026</p>
                    <p className="font-body text-white/40 text-xs mt-1">(Sexta-feira)</p>
                  </div>
                  <div className="rounded-2xl bg-[#1A1A1A] border border-white/5 p-5 flex flex-col">
                    <p className="font-display text-sm text-primary">HORÁRIO</p>
                    <p className="font-body text-white/70 text-xs mt-2">10h00 às 18h00</p>
                    <p className="font-body text-white/40 text-xs mt-1">(8 horas de imersão total)</p>
                  </div>
                  <div className="rounded-2xl bg-[#1A1A1A] border border-white/5 p-5 flex flex-col">
                    <p className="font-display text-sm text-primary">FACILIDADES</p>
                    <p className="font-body text-white/40 text-xs mt-2 leading-relaxed">
                      • Acesso fácil por transporte público<br />
                      • Estacionamento no local<br />
                      • Alimentação disponível<br />
                      • Centro Histórico de SP
                    </p>
                  </div>
                </motion.div>

                {/* Google Maps embed */}
                <motion.div variants={fadeUp} className="rounded-2xl overflow-hidden border border-white/5">
                  <iframe
                    src="https://maps.google.com/maps?q=Associa%C3%A7%C3%A3o+Comercial+de+S%C3%A3o+Paulo,+Rua+Boa+Vista+51,+Centro,+S%C3%A3o+Paulo,+SP&t=&z=16&ie=UTF8&iwloc=&output=embed"
                    width="100%"
                    height="350"
                    style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) brightness(0.9) contrast(1.1)" }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Local do evento"
                  />
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* ══ FAQ — V4 style ══ */}
          <section className="py-16 sm:py-20 section-elevated">
            <div className="max-w-2xl mx-auto px-6">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger}>
                <motion.div variants={fadeUp} className="text-center mb-10">
                  <SectionLabel text="FAQ" />
                  <SectionHeading>PERGUNTAS FREQUENTES</SectionHeading>
                </motion.div>
                <motion.div variants={stagger} className="space-y-3">
                  {faqs.map((faq, i) => (
                    <FaqItem key={i} item={faq} isOpen={openFaq === i} toggle={() => setOpenFaq(openFaq === i ? null : i)} />
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* ══ FOOTER ══ */}
          <footer className="py-8 border-t border-white/5">
            <div className="max-w-6xl mx-auto px-6 text-center">
              <p className="text-xs text-white/20 font-body">© 2026 Fórum Novo Comércio. Todos os direitos reservados.</p>
            </div>
          </footer>
        </motion.div>
    </>
  );
};

export default Index;
