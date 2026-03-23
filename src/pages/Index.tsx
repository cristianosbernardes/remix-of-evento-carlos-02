import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle2, Loader2, Send, Calendar, MapPin, ArrowRight,
  Users, TrendingUp, ShoppingCart, Shield, Instagram,
  Plus, Minus, Zap, Target, Lightbulb,
} from "lucide-react";
import { z } from "zod";
import carlosSpeaker from "@/assets/carlos-speaker.webp";
import demaSpeaker from "@/assets/dema-speaker.webp";
import issaoSpeaker from "@/assets/issao-speaker.webp";
import lidianaSpeaker from "@/assets/lidiana-speaker.webp";
import tiagoSpeaker from "@/assets/tiago-speaker.webp";
import thiagoSpeaker from "@/assets/thiago-speaker.webp";
// Hero image will be added later
// import carlosHero from "@/assets/carlos-hero.webp";

/* ═══════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════ */

const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbzLoNJYoomxlHgKhn-9LgXK2t4hcDkuUK5p4Gps9Mof7gDNtpZ2n-_KzrRvDgar350V/exec";

const formSchema = z.object({
  nome: z.string().trim().min(2, "Preencha seu nome completo").max(100),
  email: z.string().trim().min(1, "Preencha seu e-mail").email("Digite um e-mail válido (ex: nome@email.com)").max(255),
  telefone: z.string().trim().min(14, "Digite um telefone válido com DDD").max(20),
  vendeInternet: z.string().min(1, "Selecione uma opção"),
  canalVenda: z.string().min(1, "Selecione uma opção"),
  regimeTributario: z.string().min(1, "Selecione uma opção"),
  principalDesafio: z.string().min(1, "Selecione uma opção"),
  interesseEvento: z.string().min(1, "Selecione uma opção"),
});
type FormData = z.infer<typeof formSchema>;

const questions = [
  { name: "vendeInternet" as const, label: "Você já vende pela internet hoje?", options: ["Sim, vendo todos os dias", "Sim, mas ainda estou estruturando", "Já tentei vender online", "Ainda não vendo online"] },
  { name: "canalVenda" as const, label: "Como sua empresa vende atualmente?", options: ["Loja física", "E-commerce próprio", "Marketplaces (Shopee, Mercado Livre, Amazon)", "Redes sociais", "Ainda não vendo"] },
  { name: "regimeTributario" as const, label: "Qual o regime tributário da sua empresa?", options: ["Ainda não tenho empresa", "MEI", "Simples Nacional", "Lucro Presumido", "Lucro Real", "Não sei informar"] },
  { name: "principalDesafio" as const, label: "Qual o principal desafio do seu negócio hoje?", options: ["Aumentar vendas", "Atrair mais clientes", "Estruturar vendas online", "Escalar o negócio", "Encontrar novos produtos"] },
  { name: "interesseEvento" as const, label: "Interesse em evento presencial em São Paulo?", options: ["Sim, quero participar", "Quero mais informações", "Apenas estou pesquisando"] },
];

const speakers = [
  { name: "Carlos Arantes", role: "CEO da UseVertice e CTA Marketing", bio: "Empresário com mais de 10 anos em vendas online, já faturou milhões no e-commerce e ajudou empresas a crescer no digital.", instagram: "https://www.instagram.com/carlosarantesm/", image: carlosSpeaker },
  { name: "Lidiana Kohls", role: "Fundadora da UseVertice", bio: "Empresária da moda com atuação nacional e internacional. Mentora de mulheres, unindo imagem, comportamento e posicionamento estratégico.", instagram: "https://www.instagram.com/lidianakohls/", image: lidianaSpeaker },
  { name: "Tiago Almeida", role: "Fundador da Felizzo", bio: "Ex-executivo com mais de 20 anos em multinacionais, liderando negócios bilionários. Marca que cresce rapidamente em Casa & Cozinha.", instagram: "https://www.instagram.com/talmeida1984/", image: tiagoSpeaker },
  { name: "Thiago Martins", role: "Fundador da China Fácil", bio: "Especialista em importação com mais de 20 anos. Diretor de grupo logístico que movimenta bilhões e conecta empresas à China.", instagram: "https://www.instagram.com/thiagoimportacao/", image: thiagoSpeaker },
  { name: "Issao Imamura", role: "Mestre em Percepção Aplicada", bio: "Referência nacional em percepção aplicada ao comportamento, comunicação e tomada de decisão. Mais de 100 mil horas de prática.", instagram: "https://www.instagram.com/issaoimamura/", image: issaoSpeaker },
  { name: "Dema Oliveira", role: "CEO da Goshen Land", bio: "Ex-executivo Samsung que venceu a Apple com estratégia. Já escalou mais de 600 negócios e é referência nacional em expansão empresarial.", instagram: "https://www.instagram.com/demaoliveiraoficial/", image: demaSpeaker },
];

const learnings = [
  { number: "01", title: "E-COMMERCE & MARKETPLACES", subtitle: "Domine os canais de venda", desc: "Estratégias práticas para vender em Shopee, Mercado Livre, Amazon e criar seu e-commerce próprio com alta conversão.", icon: ShoppingCart, bullets: ["Marketplaces que mais vendem", "Precificação estratégica", "Escala de operações"] },
  { number: "02", title: "TRÁFEGO PAGO & FUNIS", subtitle: "Atraia clientes qualificados", desc: "Aprenda a criar campanhas que geram vendas reais e funis que transformam visitantes em compradores.", icon: Target, bullets: ["Meta Ads & Google Ads", "Funis de alta conversão", "Retorno sobre investimento"] },
  { number: "03", title: "NETWORKING COM EMPRESÁRIOS", subtitle: "Conexões que valem milhões", desc: "Os maiores negócios não nascem na palestra. Nascem no intervalo, no jantar, no lounge.", icon: Users, bullets: ["Acesso a empresários reais", "Parcerias estratégicas", "Troca de experiências"] },
  { number: "04", title: "IMPORTAÇÃO & MARCA PRÓPRIA", subtitle: "Da China ao seu cliente", desc: "O caminho completo para importar produtos, criar sua marca própria e multiplicar suas margens.", icon: Zap, bullets: ["Fornecedores confiáveis", "Processo de importação", "Construção de marca"] },
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
  { icon: Calendar, value: "09.04", label: "1 DIA INTENSIVO", desc: "Conte com 8 horas de imersão total" },
];

const EVENT_DATE = new Date("2026-04-09T10:00:00");

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

/* Speaker card */
const SpeakerCard = ({ speaker: s }: { speaker: typeof speakers[0] }) => (
  <motion.div variants={scaleIn} className="group relative rounded-2xl overflow-hidden bg-[#1A1A1A] border border-white/5 hover:border-primary/20 transition-all duration-500 h-full">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-[3px] bg-primary rounded-b z-20" />
    <div className="relative h-72 overflow-hidden">
      {s.image ? (
        <img src={s.image} alt={s.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700" />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-transparent">
          <span className="font-display text-5xl text-primary/15">{s.name.split(" ").map(n => n[0]).join("")}</span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent" />
      <a href={s.instagram} target="_blank" rel="noopener noreferrer" className="absolute top-3 right-3 w-8 h-8 rounded bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-primary/20 hover:border-primary/40 transition-all z-10">
        <Instagram className="w-3.5 h-3.5 text-white/60" />
      </a>
    </div>
    <div className="p-5 -mt-6 relative z-10">
      <h3 className="font-display text-base text-white leading-tight">{s.name}</h3>
      <p className="text-primary font-body font-semibold text-xs mt-1">{s.role}</p>
      <p className="text-white/35 font-body text-xs mt-2 leading-relaxed">{s.bio}</p>
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
   MAIN COMPONENT
   ═══════════════════════════════════════════ */

const Index = () => {
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const countdown = useCountdown();
  const navigate = useNavigate();

  const maskPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return digits.length ? `(${digits}` : "";
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const handleChange = (field: keyof FormData, value: string) => {
    if (field === "telefone") {
      // Block non-numeric input and apply mask
      const onlyDigits = value.replace(/\D/g, "");
      if (value !== "" && onlyDigits === "" && value !== "(") return; // typed only letters
      value = maskPhone(value);
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const result = formSchema.safeParse(formData);
    if (!result.success) {
      const fe: Record<string, string> = {};
      result.error.errors.forEach((err) => { if (err.path[0]) fe[err.path[0] as string] = err.message; });
      setErrors(fe);
      return;
    }
    setIsSubmitting(true);
    try {
      if (GOOGLE_SHEETS_URL) {
        // Map form fields to spreadsheet columns A-I (LP02 - 09/04)
        const now = new Date();
        const dataHora = now.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
        const payload = {
          Data: dataHora,                                  // Col A
          Nome: result.data.nome,                          // Col B
          "E-mail": result.data.email,                     // Col C
          WhatsApp: result.data.telefone,                   // Col D
          "Vende pela internet": result.data.vendeInternet, // Col E
          "Como vende": result.data.canalVenda,             // Col F
          "Regime tributário": result.data.regimeTributario, // Col G
          "Desafio atual": result.data.principalDesafio,    // Col H
          "Vem no evento": result.data.interesseEvento,     // Col I
        };
        await fetch(GOOGLE_SHEETS_URL, { method: "POST", mode: "no-cors", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      }
      navigate("/obrigado");
    } catch { setErrors({ form: "Erro ao enviar. Tente novamente." }); }
    finally { setIsSubmitting(false); }
  };

  const scrollToForm = () => document.getElementById("formulario")?.scrollIntoView({ behavior: "smooth" });
  const filledCount = Object.keys(formData).filter((k) => formData[k as keyof FormData]).length;
  const progress = Math.round((filledCount / 8) * 100);

  return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background text-white overflow-x-hidden">

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
              <div className="hidden md:block text-center font-body font-medium text-[13px] leading-tight">
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
            {/* Background — placeholder until hero image is added */}
            <div className="absolute inset-0 bg-background" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] via-transparent to-background" />

            {/* Content */}
            <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
              <motion.div initial="hidden" animate="visible" variants={stagger} className="flex flex-col items-center">
                {/* Badge */}
                <motion.div variants={fadeUp}>
                  <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-[13px] font-body text-white/70">
                    <Zap className="w-4 h-4 text-primary" />
                    A diferença não é esforço. <span className="text-primary font-bold">É perspectiva.</span>
                  </span>
                </motion.div>

                {/* Headline — V4: Dela Gothic One 38px */}
                <motion.h1 variants={fadeUp} className="font-display text-[clamp(1.75rem,5.5vw,2.4rem)] mt-8 leading-[1.35] uppercase">
                  Corre o dia inteiro. No fim, a empresa{" "}
                  <span className="text-primary">continua no mesmo lugar</span>
                </motion.h1>

                {/* Subtitle — V4: Montserrat 500 20px */}
                <motion.p variants={fadeUp} className="mt-6 text-white/60 font-body font-medium text-base sm:text-xl max-w-2xl leading-[1.4]">
                  Enquanto você vive como refém das urgências, <span className="text-white font-semibold">seus concorrentes já desenharam os próximos 10 anos</span> de seus negócios.
                </motion.p>

                {/* CTA — V4: red bg, bold, uppercase, arrow */}
                <motion.div variants={fadeUp} className="mt-8">
                  <CtaButton onClick={scrollToForm} className="px-10 sm:px-14 py-5 text-base glow-green-strong">
                    Quero Mudar a Perspectiva
                  </CtaButton>
                </motion.div>

                {/* Date + Location — V4: Montserrat 500 16px */}
                <motion.p variants={fadeUp} className="mt-6 font-body font-medium text-white/60 text-base flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-primary" /> 09 de Abril
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

          {/* ══ O DILEMA — V4 style ══ */}
          <section className="py-16 sm:py-20 section-elevated">
            <div className="max-w-4xl mx-auto px-6">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger}>
                <motion.div variants={fadeUp} className="text-center mb-10">
                  <SectionLabel text="O Dilema" />
                  <SectionHeading>
                    TODO EMPRESÁRIO ENFRENTA <span className="text-primary">O MESMO DILEMA</span>
                  </SectionHeading>
                </motion.div>

                <motion.div variants={fadeUp} className="grid sm:grid-cols-2 gap-5">
                  <div className="rounded-2xl bg-[#1A1A1A] border border-white/5 p-6 relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-[3px] bg-red-500/80 rounded-b" />
                    <p className="font-body font-bold text-red-400/80 text-xs uppercase tracking-wider mt-2 mb-3">O curto prazo sufoca</p>
                    <p className="font-body text-white/50 text-[15px] leading-relaxed">
                      Contas, clientes, crises, urgências. Você vive resolvendo o HOJE... <span className="text-white font-medium">mas o AMANHÃ nunca chega.</span>
                    </p>
                    <p className="font-body text-white/35 text-[15px] mt-3 leading-relaxed">
                      Quando olha pra trás, percebe: mais um ano passou e <span className="text-red-400/70 font-medium">você continua no mesmo lugar.</span>
                    </p>
                  </div>
                  <div className="rounded-2xl bg-[#1A1A1A] border border-white/5 p-6 relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-[3px] bg-primary rounded-b" />
                    <p className="font-body font-bold text-primary text-xs uppercase tracking-wider mt-2 mb-3">A solução existe</p>
                    <p className="font-body text-white/50 text-[15px] leading-relaxed">
                      O problema não é falta de trabalho. <span className="text-white font-medium">É falta de um trajeto claro.</span>
                    </p>
                    <p className="font-body text-white/35 text-[15px] mt-3 leading-relaxed">
                      A rotina que te obriga a sobreviver ao mês e nunca <span className="text-primary font-medium">construir os próximos 10 anos.</span>
                    </p>
                  </div>
                </motion.div>

                <motion.div variants={fadeUp} className="text-center mt-10">
                  <CtaButton onClick={scrollToForm}>Quero Mudar a Perspectiva</CtaButton>
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
                    Autoridades que <span className="text-white font-semibold">construíram impérios</span> onde outros viam apenas caos.
                  </p>
                </motion.div>
              </motion.div>

              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} variants={stagger}>
                {/* Top row: 3 cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  {speakers.slice(0, 3).map((s, i) => (
                    <SpeakerCard key={i} speaker={s} />
                  ))}
                </div>
                {/* Bottom row: 3 cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {speakers.slice(3).map((s, i) => (
                    <SpeakerCard key={i} speaker={s} />
                  ))}
                </div>
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
                  <SectionLabel text="O que você vai aprender" />
                  <SectionHeading>
                    ISSO É MAIS DO QUE UM EVENTO.{" "}
                    <span className="text-primary">É O ANTÍDOTO PARA O IMEDIATISMO.</span>
                  </SectionHeading>
                  <p className="font-body font-medium text-white/50 text-lg mt-4 max-w-lg mx-auto">
                    Você não vai aprender tática. Vai aprender <span className="text-white font-semibold">arquitetura.</span>
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
                    Garanta sua vaga e receba <span className="text-primary">informações exclusivas</span>
                  </SectionHeading>
                  <p className="font-body font-medium text-white/50 text-base mt-3 max-w-md mx-auto">Preencha o formulário abaixo. Leva menos de 2 minutos.</p>
                </motion.div>

                <motion.form variants={fadeUp} onSubmit={handleSubmit} className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-6 sm:p-8 space-y-5">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] text-white font-body font-medium">Progresso</span>
                      <span className="text-[11px] text-primary font-body font-bold">{progress}%</span>
                    </div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                      <motion.div className="h-full bg-primary rounded-full" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="nome" className="text-xs font-body font-medium text-white">Nome completo</Label>
                      <Input id="nome" placeholder="Seu nome completo" value={formData.nome || ""} onChange={(e) => handleChange("nome", e.target.value)} className={`h-11 bg-black/30 border-white/15 text-white/70 placeholder:text-white/25 ${errors.nome ? "border-yellow-500" : ""}`} />
                      {errors.nome && <p className="text-[11px] text-yellow-400">{errors.nome}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-xs font-body font-medium text-white">E-mail</Label>
                      <Input id="email" type="email" placeholder="seu@email.com" value={formData.email || ""} onChange={(e) => handleChange("email", e.target.value)} className={`h-11 bg-black/30 border-white/15 text-white/70 placeholder:text-white/25 ${errors.email ? "border-yellow-500" : ""}`} />
                      {errors.email && <p className="text-[11px] text-yellow-400">{errors.email}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="telefone" className="text-xs font-body font-medium text-white">WhatsApp</Label>
                      <Input id="telefone" type="text" inputMode="numeric" placeholder="(11) 99999-9999" value={formData.telefone || ""} onChange={(e) => handleChange("telefone", e.target.value)} className={`h-11 bg-black/30 border-white/15 text-white/70 placeholder:text-white/25 ${errors.telefone ? "border-yellow-500" : ""}`} />
                      {errors.telefone && <p className="text-[11px] text-yellow-400">{errors.telefone}</p>}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    <div className="flex-1 h-px bg-white/10" />
                    <span className="text-[10px] text-primary font-body font-bold uppercase tracking-[0.2em] whitespace-nowrap">Sobre seu negócio</span>
                    <div className="flex-1 h-px bg-white/10" />
                  </div>

                  {questions.map((q) => (
                    <div key={q.name} className="space-y-1.5">
                      <Label className="text-xs font-body font-medium text-white">{q.label}</Label>
                      <Select value={formData[q.name] || ""} onValueChange={(val) => handleChange(q.name, val)}>
                        <SelectTrigger className={`h-11 bg-black/30 border-white/15 text-white/70 ${errors[q.name] ? "border-yellow-500" : ""}`}>
                          <SelectValue placeholder="Selecione uma opção" />
                        </SelectTrigger>
                        <SelectContent>
                          {q.options.map((opt) => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}
                        </SelectContent>
                      </Select>
                      {errors[q.name] && <p className="text-[11px] text-yellow-400">{errors[q.name]}</p>}
                    </div>
                  ))}

                  {errors.form && <p className="text-sm text-yellow-400 text-center font-body">{errors.form}</p>}

                  <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-emerald-600 via-primary to-emerald-400 text-black font-body font-bold text-sm uppercase tracking-wider py-4 rounded hover:brightness-110 transition-all flex items-center justify-center gap-2 glow-green">
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {isSubmitting ? "Enviando..." : "Garantir Minha Vaga"}
                  </button>

                  <div className="flex items-center justify-center pt-2">
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-white/30 font-body"><Shield className="w-3 h-3" /> Seus dados estão protegidos</span>
                  </div>
                </motion.form>
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
                    <p className="font-body text-white/70 text-xs mt-2">09 de Abril de 2026</p>
                    <p className="font-body text-white/40 text-xs mt-1">(Quarta-feira)</p>
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
  );
};

export default Index;
