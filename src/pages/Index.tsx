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
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { z } from "zod";

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
    label: "Você teria interesse em participar de um evento presencial em São Paulo?",
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
  visible: { transition: { staggerChildren: 0.07 } },
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
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="w-full max-w-lg"
      >
        {/* Header */}
        <motion.div variants={fadeUp} className="text-center mb-8">
          <span className="font-display font-bold text-xl tracking-tight">
            <span className="text-gradient">FNC</span>
            <span className="text-muted-foreground ml-1.5 text-sm">2026</span>
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mt-4">
            Mais volume — prévia do formulário
          </h1>
          <p className="text-muted-foreground text-sm mt-2">
            Responda algumas perguntas rápidas para receber mais informações sobre o evento.
          </p>
        </motion.div>

        {/* Form Card */}
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
              <Label className="text-sm font-medium text-foreground">
                {q.label}
              </Label>
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
  );
};

export default Index;
