import { useState } from "react";
import { motion } from "framer-motion";
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
import { CheckCircle2, Loader2, Send, Calendar, MapPin, ArrowDown } from "lucide-react";
import { z } from "zod";
import carlosSpeaker from "@/assets/carlos-speaker.webp";

const GOOGLE_SHEETS_URL = ""; // ← Cole aqui a URL do seu Google Apps Script

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
    options: [
      "Sim, vendo todos os dias",
      "Sim, mas ainda estou estruturando",
      "Já tentei vender online",
      "Ainda não vendo online",
    ],
  },
  {
    name: "canalVenda" as const,
    label: "Como sua empresa vende atualmente?",
    options: [
      "Loja física",
      "E-commerce próprio",
      "Marketplaces (Shopee, Mercado Livre, Amazon)",
      "Redes sociais",
      "Ainda não vendo",
    ],
  },
  {
    name: "regimeTributario" as const,
    label: "Qual o regime tributário da sua empresa?",
    options: [
      "Ainda não tenho empresa",
      "MEI",
      "Simples Nacional",
      "Lucro Presumido",
      "Lucro Real",
      "Não sei informar",
    ],
  },
  {
    name: "principalDesafio" as const,
    label: "Qual o principal desafio do seu negócio hoje?",
    options: [
      "Aumentar vendas",
      "Atrair mais clientes",
      "Estruturar vendas online",
      "Escalar o negócio",
      "Encontrar novos produtos",
    ],
  },
  {
    name: "interesseEvento" as const,
    label: "Interesse em evento presencial em São Paulo?",
    options: [
      "Sim, quero participar",
      "Quero mais informações",
      "Apenas estou pesquisando",
    ],
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const Index = () => {
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = formSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      if (GOOGLE_SHEETS_URL) {
        await fetch(GOOGLE_SHEETS_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(result.data),
        });
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

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-3">
            Obrigado!
          </h2>
          <p className="text-muted-foreground">
            Suas informações foram enviadas com sucesso. Em breve entraremos em contato.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ── HERO SECTION ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-primary/[0.04] via-transparent to-background" />
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/8 rounded-full blur-[150px]" />

        <div className="max-w-6xl mx-auto px-6 relative z-10 w-full py-20">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left: Event Info */}
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              <motion.div variants={fadeUp} className="mb-5">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-xs font-display uppercase tracking-[0.2em] text-primary">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
                  </span>
                  Vagas Limitadas
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight leading-[0.95]"
              >
                FÓRUM NOVO
                <br />
                <span className="text-gradient glow-text-strong">COMÉRCIO</span>
                <span className="text-foreground/30 text-xl sm:text-2xl ml-3 font-light">2026</span>
              </motion.h1>

              <motion.div variants={fadeUp} className="mb-6">
                <div className="w-16 h-0.5 bg-primary/40 mb-5" />
                <p className="text-lg sm:text-xl font-display font-semibold leading-snug text-foreground">
                  O comércio mudou.
                  <br />
                  <span className="text-primary">Quem não se adaptar, vai desaparecer.</span>
                </p>
              </motion.div>

              <motion.p variants={fadeUp} className="text-foreground/50 text-sm sm:text-base max-w-lg mb-6 leading-relaxed">
                Enquanto muitos tentam entender o que aconteceu,{" "}
                <span className="text-foreground font-medium">empresários visionários já faturam milhões</span>{" "}
                dominando e-commerce, tráfego pago, importação e marca própria.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4 text-sm text-foreground/60 mb-8">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-primary" />
                  09 de Abril de 2026
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-primary" />
                  São Paulo, SP
                </span>
              </motion.div>

              <motion.div variants={fadeUp}>
                <Button
                  size="lg"
                  onClick={scrollToForm}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-display font-bold text-sm uppercase tracking-wider px-10 py-7 group"
                >
                  Quero Participar
                  <ArrowDown className="ml-2 h-5 w-5 group-hover:translate-y-1 transition-transform" />
                </Button>
              </motion.div>
            </motion.div>

            {/* Right: Speaker Photo */}
            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:block relative"
            >
              <div className="absolute -inset-16 bg-primary/6 rounded-full blur-[120px]" />
              <div
                className="relative"
                style={{
                  WebkitMaskImage: "radial-gradient(ellipse 85% 80% at 50% 40%, black 35%, transparent 72%)",
                  maskImage: "radial-gradient(ellipse 85% 80% at 50% 40%, black 35%, transparent 72%)",
                }}
              >
                <img
                  src={carlosSpeaker}
                  alt="Carlos Arantes — Palestrante do Fórum Novo Comércio 2026"
                  className="w-full h-auto object-cover brightness-110"
                />
              </div>
              <div className="absolute bottom-8 left-8 right-8 text-center">
                <p className="font-display text-sm font-semibold text-foreground">Carlos Arantes</p>
                <p className="text-xs text-foreground/40">Palestrante Principal</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FORM SECTION ── */}
      <section id="formulario" className="py-20 sm:py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
        <div className="max-w-lg mx-auto px-6 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="text-center mb-8">
              <span className="text-primary font-display text-xs uppercase tracking-[0.3em] font-semibold">
                Cadastro
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mt-3">
                Preencha para receber mais informações
              </h2>
              <p className="text-muted-foreground text-sm mt-2">
                Responda algumas perguntas rápidas sobre o seu negócio.
              </p>
            </motion.div>

            <motion.form
              variants={fadeUp}
              onSubmit={handleSubmit}
              className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-5"
            >
              {/* Nome */}
              <div className="space-y-2">
                <Label htmlFor="nome" className="text-sm font-medium text-foreground">
                  Nome completo
                </Label>
                <Input
                  id="nome"
                  placeholder="Seu nome"
                  value={formData.nome || ""}
                  onChange={(e) => handleChange("nome", e.target.value)}
                  className={errors.nome ? "border-destructive" : ""}
                />
                {errors.nome && <p className="text-xs text-destructive">{errors.nome}</p>}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">
                  E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email || ""}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>

              {/* Telefone */}
              <div className="space-y-2">
                <Label htmlFor="telefone" className="text-sm font-medium text-foreground">
                  Telefone / WhatsApp
                </Label>
                <Input
                  id="telefone"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={formData.telefone || ""}
                  onChange={(e) => handleChange("telefone", e.target.value)}
                  className={errors.telefone ? "border-destructive" : ""}
                />
                {errors.telefone && <p className="text-xs text-destructive">{errors.telefone}</p>}
              </div>

              {/* Divider */}
              <div className="border-t border-border pt-2">
                <p className="text-xs text-primary font-display uppercase tracking-widest font-semibold">
                  Perguntas personalizadas
                </p>
              </div>

              {/* Dropdown Questions */}
              {questions.map((q) => (
                <div key={q.name} className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">{q.label}</Label>
                  <Select
                    value={formData[q.name] || ""}
                    onValueChange={(val) => handleChange(q.name, val)}
                  >
                    <SelectTrigger className={errors[q.name] ? "border-destructive" : ""}>
                      <SelectValue placeholder="Selecione uma opção" />
                    </SelectTrigger>
                    <SelectContent>
                      {q.options.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors[q.name] && <p className="text-xs text-destructive">{errors[q.name]}</p>}
                </div>
              ))}

              {errors.form && (
                <p className="text-sm text-destructive text-center">{errors.form}</p>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-display font-bold text-sm uppercase tracking-wider py-6"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                {isSubmitting ? "Enviando..." : "Enviar"}
              </Button>
            </motion.form>

            <motion.p variants={fadeUp} className="text-center text-xs text-muted-foreground mt-4">
              Seus dados estão seguros e não serão compartilhados.
            </motion.p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
