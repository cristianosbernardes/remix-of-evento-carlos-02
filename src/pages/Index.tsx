import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle2, Loader2, Send, Calendar, MapPin, ArrowDown,
  Users, TrendingUp, ShoppingCart, Shield, Star,
} from "lucide-react";
import { z } from "zod";
import carlosSpeaker from "@/assets/carlos-speaker.webp";
import carlosHero from "@/assets/carlos-hero.webp";

const GOOGLE_SHEETS_URL = "";

const formSchema = z.object({
  nome: z.string().trim().min(2, "Nome é obrigatório").max(100),
  email: z.string().trim().email("E-mail inválido").max(255),
  telefone: z.string().trim().min(10, "Telefone inválido").max(20),
  vendeInternet: z.string().min(1, "Selecione uma opção"),
  canalVenda: z.string().min(1, "Selecione uma opção"),
  regimeTributario: z.string().min(1, "Selecione uma opção"),
  principalDesafio: z.string().min(1, "Selecione uma opção"),
  interesseEvento: z.string().min(1, "Selecione uma opção"),
});

type FormData = z.infer<typeof formSchema>;

const questions = [
  {
    name: "vendeInternet" as const,
    label: "Você já vende pela internet hoje?",
    options: ["Sim, vendo todos os dias", "Sim, mas ainda estou estruturando", "Já tentei vender online", "Ainda não vendo online"],
  },
  {
    name: "canalVenda" as const,
    label: "Como sua empresa vende atualmente?",
    options: ["Loja física", "E-commerce próprio", "Marketplaces (Shopee, Mercado Livre, Amazon)", "Redes sociais", "Ainda não vendo"],
  },
  {
    name: "regimeTributario" as const,
    label: "Qual o regime tributário da sua empresa?",
    options: ["Ainda não tenho empresa", "MEI", "Simples Nacional", "Lucro Presumido", "Lucro Real", "Não sei informar"],
  },
  {
    name: "principalDesafio" as const,
    label: "Qual o principal desafio do seu negócio hoje?",
    options: ["Aumentar vendas", "Atrair mais clientes", "Estruturar vendas online", "Escalar o negócio", "Encontrar novos produtos"],
  },
  {
    name: "interesseEvento" as const,
    label: "Interesse em evento presencial em São Paulo?",
    options: ["Sim, quero participar", "Quero mais informações", "Apenas estou pesquisando"],
  },
];

const highlights = [
  { icon: ShoppingCart, label: "E-commerce & Marketplaces" },
  { icon: TrendingUp, label: "Tráfego Pago & Funis" },
  { icon: Users, label: "Networking Estratégico" },
];

const EVENT_DATE = new Date("2026-04-09T10:00:00");

const useCountdown = () => {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const calc = () => {
      const diff = EVENT_DATE.getTime() - Date.now();
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      return {
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff / 3600000) % 24),
        minutes: Math.floor((diff / 60000) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    };
    setTime(calc());
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const Index = () => {
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const countdown = useCountdown();

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
    }
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
        await fetch(GOOGLE_SHEETS_URL, { method: "POST", mode: "no-cors", headers: { "Content-Type": "application/json" }, body: JSON.stringify(result.data) });
      }
      setIsSubmitted(true);
    } catch {
      setErrors({ form: "Erro ao enviar. Tente novamente." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToForm = () => {
    document.getElementById("formulario")?.scrollIntoView({ behavior: "smooth" });
  };

  const filledCount = Object.keys(formData).filter((k) => formData[k as keyof FormData]).length;
  const totalFields = 8;
  const progress = Math.round((filledCount / totalFields) * 100);

  return (
    <AnimatePresence mode="wait">
      {isSubmitted ? (
        <motion.div
          key="success"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen bg-background flex items-center justify-center px-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center max-w-md"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center mx-auto mb-8"
            >
              <CheckCircle2 className="w-12 h-12 text-primary" />
            </motion.div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Cadastro Realizado!
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              Suas informações foram enviadas com sucesso.<br />
              Em breve nossa equipe entrará em contato com mais detalhes sobre o evento.
            </p>
            <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/20 text-primary text-sm font-display">
              <Calendar className="w-4 h-4" />
              Nos vemos em 09 de Abril!
            </div>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div key="page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background text-foreground overflow-x-hidden">
          {/* ── FLOATING NAV ── */}
          <nav className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-border/40">
            <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
              <span className="font-display font-bold text-base tracking-tight">
                <span className="text-gradient">FNC</span>
                <span className="text-muted-foreground ml-1 text-xs font-medium">2026</span>
              </span>
              <Button
                size="sm"
                onClick={scrollToForm}
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-display font-semibold text-xs uppercase tracking-wider h-8 px-4"
              >
                Inscreva-se
              </Button>
            </div>
          </nav>

          {/* ── HERO ── */}
          <section className="relative min-h-screen flex items-center overflow-hidden pt-14">
            {/* Background layers */}
            <div className="absolute inset-0 bg-grid opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] via-transparent to-background" />
            <div className="absolute top-1/3 -left-32 w-[500px] h-[500px] bg-primary/[0.06] rounded-full blur-[180px]" />
            <div className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] bg-primary/[0.04] rounded-full blur-[150px]" />

            <div className="max-w-6xl mx-auto px-6 relative z-10 w-full py-16 sm:py-20">
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                {/* Left */}
                <motion.div initial="hidden" animate="visible" variants={stagger}>
                  <motion.div variants={fadeUp} className="mb-6">
                    <span className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-xs font-display uppercase tracking-[0.2em] text-primary">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                      </span>
                      Vagas Limitadas
                    </span>
                  </motion.div>

                  <motion.h1
                    variants={fadeUp}
                    className="font-display text-[2.75rem] sm:text-5xl lg:text-[3.75rem] font-bold mb-6 tracking-tight leading-[0.92]"
                  >
                    FÓRUM NOVO
                    <br />
                    <span className="text-gradient glow-text-strong">COMÉRCIO</span>
                    <span className="text-foreground/25 text-lg sm:text-xl ml-3 font-light align-middle">2026</span>
                  </motion.h1>

                  <motion.div variants={fadeUp} className="mb-6">
                    <div className="w-12 h-[2px] bg-gradient-to-r from-primary to-transparent mb-5" />
                    <p className="text-lg sm:text-xl font-display font-semibold leading-snug">
                      O comércio mudou.
                      <br />
                      <span className="text-primary">Quem não se adaptar, vai desaparecer.</span>
                    </p>
                  </motion.div>

                  <motion.p variants={fadeUp} className="text-foreground/45 text-sm sm:text-[15px] max-w-lg mb-7 leading-relaxed">
                    Enquanto muitos tentam entender o que aconteceu,{" "}
                    <span className="text-foreground/80 font-medium">empresários visionários já faturam milhões</span>{" "}
                    dominando e-commerce, tráfego pago, importação e marca própria.
                  </motion.p>

                  {/* Highlights */}
                  <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mb-7">
                    {highlights.map((h, i) => (
                      <span key={i} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-border text-xs font-medium text-foreground/70">
                        <h.icon className="w-3.5 h-3.5 text-primary" />
                        {h.label}
                      </span>
                    ))}
                  </motion.div>

                  {/* Date & Location */}
                  <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-5 text-sm text-foreground/50 mb-8">
                    <span className="inline-flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-primary" />
                      </div>
                      <span>
                        <span className="block text-foreground font-medium text-[13px]">09 de Abril, 2026</span>
                        <span className="text-[11px] text-foreground/40">10h às 18h</span>
                      </span>
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-primary" />
                      </div>
                      <span>
                        <span className="block text-foreground font-medium text-[13px]">São Paulo, SP</span>
                        <span className="text-[11px] text-foreground/40">Local a confirmar</span>
                      </span>
                    </span>
                  </motion.div>

                  <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-start gap-4">
                    <Button
                      size="lg"
                      onClick={scrollToForm}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 font-display font-bold text-sm uppercase tracking-wider px-10 py-7 group glow-green"
                    >
                      Quero Participar
                      <ArrowDown className="ml-2 h-5 w-5 group-hover:translate-y-1 transition-transform" />
                    </Button>
                  </motion.div>

                  {/* Social proof */}
                  <motion.div variants={fadeUp} className="mt-6 flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {[0, 1, 2, 3].map((i) => (
                        <div key={i} className="w-7 h-7 rounded-full bg-secondary border-2 border-background flex items-center justify-center">
                          <Users className="w-3 h-3 text-foreground/40" />
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-foreground/40">
                      <span className="text-foreground/70 font-medium">+200 empresários</span> já se cadastraram
                    </p>
                  </motion.div>
                </motion.div>

                {/* Right: Speaker */}
                <motion.div
                  initial={{ opacity: 0, x: 50, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="hidden lg:block relative"
                >
                  <div className="absolute -inset-20 bg-primary/[0.05] rounded-full blur-[140px]" />
                  <div className="relative rounded-3xl overflow-hidden border border-border/50">
                    <div
                      style={{
                        WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
                        maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
                      }}
                    >
                      <img
                        src={carlosSpeaker}
                        alt="Carlos Arantes — Palestrante do Fórum Novo Comércio 2026"
                        className="w-full h-auto object-cover brightness-110"
                      />
                    </div>
                    {/* Speaker card overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-card via-card/90 to-transparent">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                          <Star className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-display text-sm font-bold text-foreground">Carlos Arantes</p>
                          <p className="text-xs text-foreground/50">Palestrante Principal • Especialista em Novo Comércio</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Scroll indicator */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 text-foreground/20"
            >
              <ArrowDown className="w-5 h-5" />
            </motion.div>
          </section>

          {/* ── COUNTDOWN BAR ── */}
          <section className="py-10 relative">
            <div className="max-w-4xl mx-auto px-6">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="rounded-2xl border border-primary/20 bg-card/80 backdrop-blur-sm p-6 sm:p-8"
              >
                <p className="text-center text-xs font-display uppercase tracking-[0.25em] text-foreground/40 mb-5">
                  O evento começa em
                </p>
                <div className="flex justify-center gap-3 sm:gap-5">
                  {[
                    { v: countdown.days, l: "Dias" },
                    { v: countdown.hours, l: "Horas" },
                    { v: countdown.minutes, l: "Min" },
                    { v: countdown.seconds, l: "Seg" },
                  ].map((u, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-background border border-border flex items-center justify-center">
                        <span className="font-display text-2xl sm:text-3xl font-bold text-primary tabular-nums">
                          {String(u.v).padStart(2, "0")}
                        </span>
                      </div>
                      <span className="text-[10px] text-foreground/35 mt-2 uppercase tracking-widest font-medium">{u.l}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>

          {/* ── FORM SECTION ── */}
          <section id="formulario" className="py-16 sm:py-24 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
            <div className="max-w-xl mx-auto px-6 relative z-10">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={stagger}
              >
                <motion.div variants={fadeUp} className="text-center mb-10">
                  <span className="text-primary font-display text-[11px] uppercase tracking-[0.3em] font-semibold">
                    Cadastro Gratuito
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mt-3 leading-tight">
                    Garanta sua vaga e receba
                    <br />
                    <span className="text-primary">informações exclusivas</span>
                  </h2>
                  <p className="text-muted-foreground text-sm mt-3 max-w-md mx-auto">
                    Preencha o formulário abaixo com suas informações. Leva menos de 2 minutos.
                  </p>
                </motion.div>

                <motion.form
                  variants={fadeUp}
                  onSubmit={handleSubmit}
                  className="bg-card/70 backdrop-blur-sm border border-border rounded-2xl p-6 sm:p-8 space-y-5 shadow-xl shadow-primary/[0.03]"
                >
                  {/* Progress bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] text-foreground/40 font-medium">Progresso</span>
                      <span className="text-[11px] text-primary font-display font-semibold">{progress}%</span>
                    </div>
                    <div className="h-1 bg-border rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      />
                    </div>
                  </div>

                  {/* Contact fields */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="nome" className="text-xs font-medium text-foreground/70">
                        Nome completo
                      </Label>
                      <Input
                        id="nome"
                        placeholder="Seu nome completo"
                        value={formData.nome || ""}
                        onChange={(e) => handleChange("nome", e.target.value)}
                        className={`h-11 bg-background/50 ${errors.nome ? "border-destructive" : "border-border/70"}`}
                      />
                      {errors.nome && <p className="text-[11px] text-destructive">{errors.nome}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-xs font-medium text-foreground/70">
                        E-mail
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={formData.email || ""}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className={`h-11 bg-background/50 ${errors.email ? "border-destructive" : "border-border/70"}`}
                      />
                      {errors.email && <p className="text-[11px] text-destructive">{errors.email}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="telefone" className="text-xs font-medium text-foreground/70">
                        WhatsApp
                      </Label>
                      <Input
                        id="telefone"
                        type="tel"
                        placeholder="(11) 99999-9999"
                        value={formData.telefone || ""}
                        onChange={(e) => handleChange("telefone", e.target.value)}
                        className={`h-11 bg-background/50 ${errors.telefone ? "border-destructive" : "border-border/70"}`}
                      />
                      {errors.telefone && <p className="text-[11px] text-destructive">{errors.telefone}</p>}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-3 pt-1">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-[10px] text-primary font-display uppercase tracking-[0.2em] font-semibold whitespace-nowrap">
                      Sobre seu negócio
                    </span>
                    <div className="flex-1 h-px bg-border" />
                  </div>

                  {/* Dropdown Questions */}
                  {questions.map((q) => (
                    <div key={q.name} className="space-y-1.5">
                      <Label className="text-xs font-medium text-foreground/70">{q.label}</Label>
                      <Select
                        value={formData[q.name] || ""}
                        onValueChange={(val) => handleChange(q.name, val)}
                      >
                        <SelectTrigger className={`h-11 bg-background/50 ${errors[q.name] ? "border-destructive" : "border-border/70"}`}>
                          <SelectValue placeholder="Selecione uma opção" />
                        </SelectTrigger>
                        <SelectContent>
                          {q.options.map((opt) => (
                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors[q.name] && <p className="text-[11px] text-destructive">{errors[q.name]}</p>}
                    </div>
                  ))}

                  {errors.form && (
                    <p className="text-sm text-destructive text-center">{errors.form}</p>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-display font-bold text-sm uppercase tracking-wider py-6 glow-green transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Send className="w-4 h-4 mr-2" />
                    )}
                    {isSubmitting ? "Enviando..." : "Garantir Minha Vaga"}
                  </Button>

                  {/* Trust badges */}
                  <div className="flex items-center justify-center gap-4 pt-2">
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-foreground/35">
                      <Shield className="w-3 h-3" />
                      Dados protegidos
                    </span>
                    <span className="w-px h-3 bg-border" />
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-foreground/35">
                      <CheckCircle2 className="w-3 h-3" />
                      100% gratuito
                    </span>
                  </div>
                </motion.form>
              </motion.div>
            </div>
          </section>

          {/* ── FOOTER ── */}
          <footer className="py-8 border-t border-border/30">
            <div className="max-w-6xl mx-auto px-6 text-center">
              <p className="text-xs text-foreground/25 font-display">
                © 2026 Fórum Novo Comércio. Todos os direitos reservados.
              </p>
            </div>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Index;
