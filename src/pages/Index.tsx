import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
  Calendar, Clock, MapPin, Users, Zap, Target, TrendingUp, Globe,
  ShoppingCart, Package, Award, Handshake, ArrowRight, Instagram,
  ChevronRight, CheckCircle2, Sparkles, BarChart3, Rocket, Star,
  Play, AlertTriangle, Check, HelpCircle, ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import carlosHero from "@/assets/carlos-hero.webp";
import carlosSpeaker from "@/assets/carlos-speaker.webp";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const slideInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};
const timelineItems: Array<{ time: string; title: string; speaker?: string; desc: string; highlight?: boolean; isBreak?: boolean; isClosing?: boolean }> = [
  { time: "10:00", title: "O Novo Comércio: a revolução que já começou", speaker: "Carlos Arantes", desc: "A mudança radical do mercado, por que 90% dos empresários estão ficando para trás, e o mapa exato para dominar a nova economia digital.", highlight: true },
  { time: "11:00", title: "O que realmente está gerando milhões hoje", speaker: "Painel com Empresários", desc: "Mesa redonda sem filtro: os maiores erros, as estratégias que mais dão resultado e o que mudou de verdade nos últimos 12 meses." },
  { time: "12:00", title: "Networking Estratégico + Almoço", desc: "Encontre parceiros, fornecedores e futuros sócios.", isBreak: true },
  { time: "13:30", title: "Como gerar demanda previsível todos os dias", speaker: "Especialista em Tráfego", desc: "Tráfego pago que realmente converte, funis de vendas que escalam, e a métrica que separa quem cresce de quem só gasta." },
  { time: "14:30", title: "Marketplaces: transforme qualquer produto em negócio escalável", speaker: "Especialista em E-commerce", desc: "Shopee, Mercado Livre, Amazon e loja própria — qual estratégia usar e quando, com números reais." },
  { time: "15:30", title: "Coffee Break + Networking", desc: "Os melhores deals são fechados no café.", isBreak: true },
  { time: "16:00", title: "Importação e marca própria: margem de 300%+", speaker: "Especialista em Importação", desc: "Como encontrar fornecedores na Canton Fair, criar sua própria marca e vender com margens que seus concorrentes nem imaginam." },
  { time: "17:00", title: "O futuro dos negócios nos próximos 5 anos", speaker: "Painel Final", desc: "Discussão estratégica: o que vai explodir, o que vai morrer, e como se posicionar antes de todo mundo." },
  { time: "17:40", title: "Encerramento", desc: "\"O futuro não pertence às empresas maiores. Pertence às empresas mais rápidas.\"", isClosing: true },
];

const TimelineDot = ({ item, index, trackRef, scrollProgress, totalItems }: {
  item: typeof timelineItems[number];
  index: number;
  trackRef?: React.RefObject<HTMLDivElement>;
  scrollProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  totalItems: number;
}) => {
  const threshold = index / (totalItems - 1);
  const isActive = useTransform(scrollProgress, (v) => v >= threshold);
  const dotOpacity = useTransform(scrollProgress, [Math.max(0, threshold - 0.05), threshold], [0.3, 1]);
  const dotScale = useTransform(scrollProgress, [Math.max(0, threshold - 0.05), threshold], [0.8, 1]);

  return (
    <motion.div variants={fadeUp} className="flex gap-4 sm:gap-8 mb-1">
      <div className="w-16 sm:w-20 shrink-0 text-right pt-6">
        <span className={`font-display font-bold text-sm ${item.highlight ? "text-primary" : "text-foreground/50"}`}>{item.time}</span>
      </div>
      <div ref={trackRef} className="flex flex-col items-center relative w-3">
        <motion.div
          className="w-3 h-3 rounded-full mt-7 shrink-0 z-10 bg-primary"
          style={{ opacity: dotOpacity, scale: dotScale }}
        />
        {index < totalItems - 1 && <div className="w-px flex-1" />}
      </div>
      <div className={`flex-1 pb-10 pt-4 ${item.isBreak ? "opacity-60" : ""}`}>
        <h3 className={`font-display font-bold text-base ${item.highlight ? "text-foreground" : item.isClosing ? "text-foreground/70" : "text-foreground"}`}>{item.title}</h3>
        {item.speaker && <p className="text-xs text-primary mt-1 font-display uppercase tracking-wider">{item.speaker}</p>}
        <p className="text-sm text-foreground/50 mt-2 leading-relaxed">{item.desc}</p>
      </div>
    </motion.div>
  );
};

const TimelineSection = () => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackLeft, setTrackLeft] = useState(0);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 80%", "end 20%"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Measure the dot track center position dynamically
  useEffect(() => {
    const measure = () => {
      if (trackRef.current && timelineRef.current) {
        const trackRect = trackRef.current.getBoundingClientRect();
        const parentRect = timelineRef.current.getBoundingClientRect();
        setTrackLeft(trackRect.left - parentRect.left + trackRect.width / 2);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <section id="programacao" className="py-28 sm:py-36 relative">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp} className="mb-14">
            <span className="text-primary font-display text-xs uppercase tracking-[0.3em] font-semibold">Agenda Completa</span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mt-4 text-foreground">
              8 horas de conteúdo que{" "}
              <span className="text-primary">valem mais</span> que um MBA
            </h2>
            <p className="text-foreground/55 mt-4 max-w-2xl text-base">
              Cada palestra foi pensada para entregar estratégias que você pode aplicar no dia seguinte.
            </p>
          </motion.div>

          <div className="max-w-4xl relative" ref={timelineRef}>
            {/* Gray background line */}
            {trackLeft > 0 && (
              <div className="absolute w-0.5 bg-border/30" style={{ left: trackLeft - 1, top: "1.75rem", bottom: "1rem" }} />
            )}
            {/* Green progress line */}
            {trackLeft > 0 && (
              <motion.div className="absolute w-0.5 bg-primary origin-top z-[1]" style={{ left: trackLeft - 1, top: "1.75rem", height: lineHeight }} />
            )}

            {timelineItems.map((item, i) => (
              <TimelineDot key={i} item={item} index={i} trackRef={i === 0 ? trackRef : undefined} scrollProgress={scrollYProgress} totalItems={timelineItems.length} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const FaqItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <motion.div variants={fadeUp} className="rounded-xl bg-card border border-border overflow-hidden hover:border-primary/20 transition-colors duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
      >
        <span className="font-display font-semibold text-foreground text-sm sm:text-base">{question}</span>
        <ChevronDown className={`h-4 w-4 text-primary shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <p className="px-5 pb-5 text-sm text-foreground/50 leading-relaxed">{answer}</p>
      </motion.div>
    </motion.div>
  );
};
const LOTE_END_DATE = new Date("2026-03-20T23:59:59");

const LoteCountdown = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calc = () => {
      const now = new Date().getTime();
      const diff = LOTE_END_DATE.getTime() - now;
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    };
    setTimeLeft(calc());
    const timer = setInterval(() => setTimeLeft(calc()), 1000);
    return () => clearInterval(timer);
  }, []);

  const units = [
    { value: timeLeft.days, label: "Dias" },
    { value: timeLeft.hours, label: "Horas" },
    { value: timeLeft.minutes, label: "Min" },
    { value: timeLeft.seconds, label: "Seg" },
  ];

  return (
    <motion.div variants={fadeUp} className="mt-10 max-w-md mx-auto">
      <p className="text-xs font-display uppercase tracking-[0.2em] text-foreground/40 mb-4">
        Este lote encerra em
      </p>
      <div className="flex justify-center gap-3">
        {units.map((u, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-card border border-primary/20 flex items-center justify-center">
              <span className="font-display text-2xl sm:text-3xl font-bold text-primary">
                {String(u.value).padStart(2, "0")}
              </span>
            </div>
            <span className="text-[10px] text-foreground/40 mt-2 uppercase tracking-wider font-medium">{u.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const Index = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-display font-bold text-lg tracking-tight">
            <span className="text-gradient">FNC</span>
            <span className="text-muted-foreground ml-1 text-sm font-body">2026</span>
          </span>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-foreground/60">
            <button onClick={() => scrollToSection("sobre")} className="hover:text-foreground transition-colors duration-300">Sobre</button>
            <button onClick={() => scrollToSection("programacao")} className="hover:text-foreground transition-colors duration-300">Programação</button>
            <button onClick={() => scrollToSection("palestrante")} className="hover:text-foreground transition-colors duration-300">Palestrante</button>
            <button onClick={() => scrollToSection("beneficios")} className="hover:text-foreground transition-colors duration-300">Benefícios</button>
          </div>
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 font-display font-semibold text-xs uppercase tracking-wider">
            Garantir Vaga
          </Button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-primary/[0.04] via-transparent to-background" />
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/8 rounded-full blur-[150px]" />

        {/* Background image for tablet/mobile */}
        <div className="absolute inset-0 lg:hidden overflow-hidden">
          <img
            src={carlosHero}
            alt=""
            className="absolute top-1/2 right-0 -translate-y-1/2 w-[70%] h-auto object-cover opacity-[0.15] blur-[8px] scale-110"
            style={{
              WebkitMaskImage: 'radial-gradient(ellipse 90% 80% at 70% 50%, black 20%, transparent 70%)',
              maskImage: 'radial-gradient(ellipse 90% 80% at 70% 50%, black 20%, transparent 70%)',
            }}
            aria-hidden="true"
          />
        </div>

        <motion.div style={{ opacity: heroOpacity }} className="max-w-6xl mx-auto px-6 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: Text */}
            <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
              <motion.div variants={fadeUp} className="mb-6">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-xs font-display uppercase tracking-[0.2em] text-primary">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
                  </span>
                  10 de Abril de 2026 · São Paulo
                </span>
              </motion.div>

              <motion.h1 variants={fadeUp} className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight leading-[0.92]">
                FÓRUM NOVO<br />
                <span className="text-gradient glow-text-strong">COMÉRCIO</span>
                <span className="text-foreground/30 text-2xl sm:text-3xl md:text-4xl ml-3 font-light">2026</span>
              </motion.h1>

              <motion.div variants={fadeUp} className="mb-8">
                <div className="w-16 h-0.5 bg-primary/40 mb-6" />
                <p className="font-display text-lg sm:text-xl md:text-2xl font-semibold leading-snug text-foreground">
                  O comércio mudou.<br />
                  <span className="text-primary">Quem não se adaptar, vai desaparecer.</span>
                </p>
              </motion.div>

              <motion.p variants={fadeUp} className="text-foreground/50 text-sm sm:text-base max-w-lg mb-8 leading-relaxed">
                Enquanto muitos tentam entender o que aconteceu, <span className="text-foreground font-medium">empresários visionários já faturam milhões</span> dominando e-commerce, tráfego pago, importação e marca própria.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-start gap-3">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-display font-bold text-sm uppercase tracking-wider px-10 py-7 group">
                  Garantir Minha Vaga
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => scrollToSection("programacao")}
                  className="text-foreground/60 hover:text-foreground hover:bg-foreground/5 font-display text-sm uppercase tracking-wider px-8 py-7"
                >
                  Ver Programação
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </motion.div>

              <motion.div variants={fadeUp} className="mt-6 flex flex-col items-start gap-2">
                <p className="text-xs text-foreground/30 font-medium">
                  Pagamento seguro · Cartão, PIX ou boleto
                </p>
                <p className="inline-flex items-center gap-1.5 text-sm font-display font-semibold" style={{ color: '#fbbf24' }}>
                  <span>⚠</span>
                  Últimas vagas · Preço pode aumentar sem aviso
                </p>
              </motion.div>
            </motion.div>

            {/* Right: Speaker photo */}
            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" as const }}
              className="hidden lg:block relative"
            >
              <div className="relative">
                <div className="absolute -inset-16 bg-primary/6 rounded-full blur-[120px]" />
                <div className="relative" style={{
                  WebkitMaskImage: 'radial-gradient(ellipse 85% 80% at 50% 40%, black 35%, transparent 72%)',
                  maskImage: 'radial-gradient(ellipse 85% 80% at 50% 40%, black 35%, transparent 72%)',
                }}>
                  <img
                    src={carlosHero}
                    alt="Carlos Arantes palestrando no palco — Fórum Novo Comércio 2026"
                    className="w-full h-auto object-cover scale-110 brightness-110"
                    loading="eager"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* ── TRUST BAR ── */}
      <section className="py-10 relative">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { number: "8h", label: "de imersão prática" },
              { number: "7+", label: "painéis e palestras" },
              { number: "200+", label: "empresários confirmados" },
              { number: "1", label: "dia que pode mudar tudo" },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeUp} className="p-5 rounded-xl bg-card border border-border text-center">
                <p className="font-display text-2xl sm:text-3xl font-bold text-primary">{item.number}</p>
                <p className="text-xs text-foreground/50 mt-1 uppercase tracking-wider font-medium">{item.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── SOBRE O EVENTO ── */}
      <section id="sobre" className="py-28 sm:py-36 relative">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.span variants={fadeUp} className="text-primary font-display text-xs uppercase tracking-[0.3em] font-semibold">
              Sobre o Evento
            </motion.span>

            <motion.h2 variants={fadeUp} className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mt-4 mb-10 leading-tight text-foreground">
              O evento que está reunindo os empresários{" "}
              <span className="text-primary">mais ambiciosos</span> do Brasil
            </motion.h2>

            <motion.div variants={fadeUp} className="space-y-5 text-foreground/50 leading-relaxed text-lg max-w-4xl">
              <p>
                Nos últimos 3 anos, <span className="text-foreground font-medium">o mercado brasileiro mudou mais do que nos 20 anteriores.</span>
              </p>
              <p>
                Novas plataformas surgiram. Novos canais dominaram. Empresários que entenderam esse movimento multiplicaram seus faturamentos. Os que ignoraram... ficaram para trás.
              </p>
              <p className="text-foreground font-display text-xl sm:text-2xl font-bold border-l-2 border-primary pl-6 py-2">
                A pergunta não é "se" você precisa se adaptar.<br />
                A pergunta é: <span className="text-primary">quanto tempo você ainda vai esperar?</span>
              </p>
              <p>
                O Fórum Novo Comércio 2026 é uma imersão presencial de um dia inteiro, criada para empresários que querem <span className="text-foreground font-medium">agir agora</span> — não para quem quer ficar assistindo de longe.
              </p>
            </motion.div>

            <motion.div variants={staggerContainer} className="grid sm:grid-cols-2 gap-3 mt-14">
              {[
                { icon: TrendingUp, text: "Estratégias reais que geraram milhões em faturamento" },
                { icon: Globe, text: "Oportunidades inexploradas na economia digital" },
                { icon: BarChart3, text: "Cases de empresários que escalaram do zero" },
                { icon: Handshake, text: "Networking com quem está construindo o futuro" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors duration-300 group"
                >
                  <item.icon className="h-5 w-5 text-primary shrink-0" />
                  <span className="text-sm text-foreground/70 group-hover:text-foreground transition-colors">{item.text}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.p variants={fadeUp} className="mt-12 text-lg text-foreground/50">
              Este não é mais um evento teórico.{" "}
              <span className="text-foreground font-display font-bold">É o ponto de virada para quem quer crescer de verdade.</span>
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── EVENT INFO ── */}
      <section className="py-16 relative">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-3"
          >
            {[
              { icon: Calendar, label: "Data", value: "10 de Abril", sub: "Quinta-feira" },
              { icon: Clock, label: "Horário", value: "10h às 18h", sub: "8h de imersão" },
              { icon: MapPin, label: "Local", value: "São Paulo – SP", sub: "A confirmar" },
              { icon: Users, label: "Formato", value: "Presencial", sub: "Vagas limitadas" },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="p-6 rounded-2xl bg-card border border-border text-center hover:border-primary/30 transition-colors duration-300"
              >
                <item.icon className="h-6 w-6 text-primary mx-auto mb-3" />
                <p className="text-[10px] text-foreground/30 uppercase tracking-[0.2em] mb-1 font-display font-medium">{item.label}</p>
                <p className="font-display font-bold text-foreground">{item.value}</p>
                <p className="text-xs text-primary/60 mt-1">{item.sub}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── PARA QUEM É ── */}
      <section className="py-28 sm:py-36 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.015] to-transparent" />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} className="mb-14">
              <span className="text-primary font-display text-xs uppercase tracking-[0.3em] font-semibold">Público Ideal</span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mt-4 text-foreground">
                Este evento foi <span className="text-primary">desenhado</span> para você se...
              </h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: Rocket, title: "Quer escalar seu negócio", desc: "Sair dos R$100K e chegar nos R$1M+ com estratégias validadas por quem já chegou lá" },
                { icon: ShoppingCart, title: "Tem ou quer ter um e-commerce", desc: "Marketplace, loja própria ou dropshipping — descubra qual modelo é mais lucrativo para você" },
                { icon: Globe, title: "Quer vender mais online", desc: "Aprenda a gerar demanda previsível todos os dias com tráfego pago e funis de conversão" },
                { icon: Award, title: "Quer criar marca própria", desc: "Pare de vender commodities. Construa uma marca que cobra premium e fideliza clientes" },
                { icon: Package, title: "Quer importar com margem alta", desc: "Fornecedores confiáveis, Canton Fair, logística e posicionamento de produto importado" },
                { icon: BarChart3, title: "É gestor de tráfego ou marketing", desc: "Atualize-se com as estratégias que estão realmente convertendo em 2026" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 group"
                >
                  <item.icon className="h-6 w-6 text-primary mb-4 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="font-display font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-foreground/40 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── PALESTRANTE ── */}
      <section id="palestrante" className="py-28 sm:py-36 relative overflow-hidden">
        <div className="absolute top-1/2 -translate-y-1/2 -left-40 w-[400px] h-[400px] bg-primary/6 rounded-full blur-[150px]" />
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.span variants={fadeUp} className="text-primary font-display text-xs uppercase tracking-[0.3em] font-semibold">
              Palestrante Principal
            </motion.span>

            <motion.div variants={fadeUp} className="grid sm:grid-cols-5 gap-8 md:gap-12 mt-10">
              <motion.div variants={slideInLeft} className="sm:col-span-2 relative">
                <div className="sticky top-24">
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-border">
                    <img
                      src={carlosSpeaker}
                      alt="Carlos Arantes — especialista em crescimento digital"
                      className="w-full h-full object-cover brightness-125"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                    <div className="absolute bottom-5 left-5 right-5 px-4 py-3 rounded-xl bg-background/70 backdrop-blur-md border border-primary/30">
                      <p className="font-display font-bold text-sm text-primary">+500 empresários</p>
                      <p className="text-xs text-foreground/60">impactados diretamente</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={slideInRight} className="sm:col-span-3">
                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-2 text-foreground">
                  Carlos <span className="text-primary">Arantes</span>
                </h2>
                <p className="text-foreground/40 font-display text-sm uppercase tracking-wider mb-6">Empresário · Estrategista Digital · Mentor</p>

                <div className="space-y-4 text-foreground/50 leading-relaxed">
                  <p className="text-lg">
                    Carlos Arantes não é um teórico. É um <span className="text-foreground font-medium">empresário que fatura no digital todos os dias</span> e que já ajudou centenas de empresários a transformar seus resultados.
                  </p>
                  <p>
                    Seu método combina <span className="text-foreground font-medium">visão estratégica com execução brutal</span> — desde a construção de marcas próprias até a dominação de marketplaces e tráfego pago.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mt-8">
                  {["E-commerce", "Tráfego Pago", "Importação", "Marca Própria", "Marketplaces", "Escala Digital"].map((s, i) => (
                    <span key={i} className="px-4 py-2 rounded-lg bg-primary/10 border border-primary/20 text-xs font-semibold text-foreground/80">
                      {s}
                    </span>
                  ))}
                </div>

                <a
                  href="https://www.instagram.com/carlosarantesm/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 mt-8 px-5 py-3 rounded-xl bg-card border border-border hover:border-primary/30 text-sm text-foreground hover:text-primary transition-all duration-300 font-display font-semibold group"
                >
                  <Instagram className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                  @carlosarantesm
                </a>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── PROGRAMAÇÃO ── */}
      <TimelineSection />

      {/* ── BENEFÍCIOS ── */}
      <section id="beneficios" className="py-28 sm:py-36 relative">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} className="mb-14">
              <span className="text-primary font-display text-xs uppercase tracking-[0.3em] font-semibold">Benefícios</span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mt-4 text-foreground">
                O que você leva é{" "}
                <span className="text-primary">infinitamente maior</span> do que o ingresso
              </h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: TrendingUp, title: "Estratégias validadas", desc: "Métodos que já geraram milhões — não teoria de sala de aula" },
                { icon: Globe, title: "Visão de futuro", desc: "Entenda para onde o mercado digital está indo antes dos seus concorrentes" },
                { icon: Users, title: "Networking de elite", desc: "Conecte-se com empresários que pensam grande e fazem acontecer" },
                { icon: Rocket, title: "Aceleração de resultados", desc: "Encurte anos de aprendizado em um único dia de imersão" },
                { icon: Handshake, title: "Parcerias estratégicas", desc: "Encontre fornecedores, sócios e parceiros que vão multiplicar seu negócio" },
                { icon: Sparkles, title: "Mentalidade de crescimento", desc: "Saia do evento com clareza absoluta sobre seus próximos passos" },
              ].map((item, i) => (
                <motion.div key={i} variants={fadeUp} className="flex items-start gap-4 p-5 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors duration-300 group">
                  <item.icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-display font-bold text-foreground mb-1">{item.title}</h3>
                    <p className="text-sm text-foreground/40 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── NETWORKING ── */}
      <section className="py-28 sm:py-36 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center"
          >
            <motion.span variants={fadeUp} className="text-primary font-display text-xs uppercase tracking-[0.3em] font-semibold">
              Conexões
            </motion.span>
            <motion.h2 variants={fadeUp} className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mt-4 mb-6 leading-tight text-foreground">
              Uma conexão certa vale mais que{" "}
              <span className="text-primary">mil curtidas</span>
            </motion.h2>
            <motion.div variants={fadeUp} className="space-y-3 text-foreground/50 text-lg mb-12 max-w-2xl mx-auto">
              <p>Grandes negócios não nascem de ideias geniais.</p>
              <p className="text-foreground font-display text-xl font-bold">Nascem de conexões certas, no momento certo.</p>
              <p>O Fórum Novo Comércio reúne <span className="text-foreground font-medium">os empresários mais ativos da economia digital brasileira</span> em um ambiente projetado para gerar negócios reais.</p>
            </motion.div>
            <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-3">
              {[
                { icon: Users, text: "Trocar experiências reais" },
                { icon: Handshake, text: "Fechar parcerias" },
                { icon: Rocket, text: "Gerar oportunidades" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-card border border-border text-sm font-display font-medium text-foreground/60 hover:border-primary/30 hover:text-foreground transition-all duration-300">
                  <item.icon className="h-4 w-4 text-primary" />
                  {item.text}
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── INVESTIMENTO ── */}
      <section id="investimento" className="py-28 sm:py-36 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.06] via-primary/[0.02] to-transparent" />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center"
          >
            <motion.div variants={fadeUp} className="mb-14">
              <span className="text-primary font-display text-xs uppercase tracking-[0.3em] font-semibold">Investimento</span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mt-4 text-foreground">
                O preço de <span className="text-primary">ficar parado</span> é muito maior
              </h2>
              <p className="text-foreground/50 mt-4 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
                Um único dia de imersão que pode transformar a trajetória do seu negócio. O valor do ingresso é uma fração do retorno que você vai gerar.
              </p>
            </motion.div>

            <motion.div variants={scaleIn} className="max-w-md mx-auto">
              <div className="rounded-2xl bg-card border border-border p-8 sm:p-10 relative overflow-hidden">
                {/* Shine sweep effect */}
                <div className="absolute inset-0 shimmer pointer-events-none" />

                <span className="inline-block px-4 py-1.5 rounded-full bg-primary/15 border border-primary/30 text-xs font-display font-semibold text-primary uppercase tracking-wider mb-6">
                  Lote Atual
                </span>

                <div className="mb-8">
                  <p className="text-foreground/40 line-through text-sm font-medium mb-1">De R$397,00</p>
                  <p className="font-display text-5xl sm:text-6xl font-bold text-primary">
                    R$197<span className="text-2xl sm:text-3xl">,00</span>
                  </p>
                  <p className="text-foreground/40 text-sm mt-2">ou 12x de R$19,42</p>
                </div>

                <div className="space-y-3 text-left mb-8">
                  {[
                    "Acesso completo ao evento (8h)",
                    "Todas as palestras e painéis",
                    "Networking estratégico",
                    "Coffee break incluso",
                    "Material digital pós-evento",
                    "Certificado de participação",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-sm text-foreground/70 font-medium">{item}</span>
                    </div>
                  ))}
                </div>

                <Button size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-display font-bold text-base uppercase tracking-wider py-7 group relative overflow-hidden">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Garantir Minha Vaga
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>

                <p className="text-xs text-foreground/30 mt-4 font-medium">
                  Pagamento seguro · Cartão, PIX ou boleto
                </p>
                <p className="inline-flex items-center gap-1.5 mt-3 text-sm font-display font-semibold" style={{ color: '#fbbf24' }}>
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Últimas vagas · Preço pode aumentar sem aviso
                </p>
              </div>
            </motion.div>

            {/* Countdown do lote */}
            <LoteCountdown />
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-28 sm:py-36 relative">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} className="text-center mb-14">
              <span className="text-primary font-display text-xs uppercase tracking-[0.3em] font-semibold">Dúvidas</span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mt-4 text-foreground">
                Perguntas <span className="text-primary">frequentes</span>
              </h2>
            </motion.div>

            <div className="max-w-3xl mx-auto space-y-3">
              {[
                { q: "Onde será o evento?", a: "O Fórum Novo Comércio 2026 será realizado em São Paulo, no dia 10 de Abril. O endereço exato será enviado por e-mail após a confirmação da inscrição." },
                { q: "O evento é presencial ou online?", a: "O evento é 100% presencial. Acreditamos que as melhores conexões e oportunidades de negócio acontecem pessoalmente." },
                { q: "Posso parcelar o ingresso?", a: "Sim! Você pode parcelar em até 12x de R$19,42 no cartão de crédito, ou pagar à vista via PIX ou boleto." },
                { q: "O que está incluso no ingresso?", a: "Acesso completo às 8 horas de evento, todas as palestras e painéis, networking estratégico, coffee break, material digital pós-evento e certificado de participação." },
                { q: "Para quem é o evento?", a: "Para empresários, empreendedores e profissionais que querem dominar a economia digital — seja no e-commerce, marketplaces, tráfego pago, importação ou marca própria." },
                { q: "Posso pedir reembolso?", a: "Sim, oferecemos reembolso integral até 7 dias antes do evento. Após esse prazo, o ingresso pode ser transferido para outra pessoa." },
                { q: "O preço pode aumentar?", a: "Sim. O valor atual de R$197 é referente ao lote atual. À medida que as vagas forem preenchidas, o preço será reajustado sem aviso prévio." },
              ].map((item, i) => (
                <FaqItem key={i} question={item.q} answer={item.a} />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="py-28 sm:py-36 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.06] via-primary/[0.02] to-transparent" />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center"
          >
            <motion.h2 variants={fadeUp} className="font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6 text-foreground">
              O mercado <span className="text-primary">não vai esperar</span> você.
            </motion.h2>
            <motion.p variants={fadeUp} className="font-display text-xl sm:text-2xl text-foreground/40 mb-4">
              Cada dia que você adia é um dia que seu concorrente avança.
            </motion.p>
            <motion.p variants={fadeUp} className="text-foreground/40 mb-10 max-w-xl mx-auto text-lg">
              Reserve sua vaga no Fórum Novo Comércio 2026. <span className="text-foreground font-medium">Um dia que pode redefinir a trajetória do seu negócio.</span>
            </motion.p>
            <motion.div variants={fadeUp}>
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-display font-bold text-base sm:text-lg uppercase tracking-wider px-14 py-8 group">
                Garantir Minha Vaga Agora
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <p className="text-xs text-foreground/30 mt-4 font-medium">
                Pagamento seguro · Cartão, PIX ou boleto
              </p>
              <p className="inline-flex items-center gap-1.5 mt-3 text-sm font-display font-semibold" style={{ color: '#fbbf24' }}>
                <AlertTriangle className="h-3.5 w-3.5" />
                Últimas vagas · Preço pode aumentar sem aviso
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border/30 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="font-display font-bold text-xl">
                <span className="text-primary">Fórum Novo Comércio</span>{" "}
                <span className="text-foreground/25 text-sm font-light">2026</span>
              </p>
              <p className="text-xs text-foreground/30 mt-2 max-w-md leading-relaxed">
                Evento voltado para empresários e profissionais que desejam compreender e dominar a nova economia digital.
              </p>
            </div>
            <a
              href="https://www.instagram.com/carlosarantesm/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-foreground/40 hover:text-primary transition-colors duration-300"
            >
              <Instagram className="h-5 w-5" />
              @carlosarantesm
            </a>
          </div>
          <div className="mt-8 pt-8 border-t border-border/20 text-center">
            <p className="text-xs text-foreground/20">
              © 2026 Fórum Novo Comércio. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
