import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  MessageCircle, 
  Users, 
  Heart, 
  Target, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Calendar,
  Lock,
  Loader2
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { db, handleFirestoreError, OperationType } from './lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Utility for Tailwind class merging
 */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// WhatsApp Group URL
const WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/LHOEUdVmQqA9MAfML9KlP7";

// Form Schema
const registrationSchema = z.object({
  nome: z.string()
    .min(3, "O nome deve ter pelo menos 3 caracteres")
    .max(100, "O nome é muito longo"),
  email: z.string()
    .email("E-mail inválido"),
  whatsapp: z.string()
    .regex(/^\(\d{2}\) \d{5}-\d{4}$/, "Formato inválido: (XX) XXXXX-XXXX")
});

type RegistrationData = z.infer<typeof registrationSchema>;

export default function App() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<RegistrationData>({
    resolver: zodResolver(registrationSchema)
  });

  const whatsappValue = watch("whatsapp");

  // Phone masking logic
  useEffect(() => {
    if (!whatsappValue) return;
    let x = whatsappValue.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
    if (!x) return;
    const masked = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
    if (masked !== whatsappValue) {
      setValue("whatsapp", masked);
    }
  }, [whatsappValue, setValue]);

  const onSubmit = async (data: RegistrationData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const path = 'inscricoes';
      await addDoc(collection(db, path), {
        ...data,
        createdAt: serverTimestamp()
      });
      setIsSubmitted(true);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'inscricoes');
      setError("Ocorreu um erro ao processar sua inscrição. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-accent/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-terra/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4" />

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12 md:py-16">
        
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-20 items-center"
            >
              <div className="md:col-span-12 flex justify-between items-center mb-4 md:mb-8">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent text-white text-[10px] font-bold tracking-widest uppercase">
                  Aula ao vivo • Gratuita • Vagas limitadas
                </span>
                <div className="hidden md:block text-[10px] tracking-widest font-semibold text-brand-ink/40 uppercase">
                  Transmissão via WhatsApp
                </div>
              </div>

              {/* Left Column: Content + Pillars */}
              <div className="md:col-span-7 flex flex-col justify-center">
                <div className="mb-12">
                  <h1 className="serif text-5xl md:text-7xl font-bold text-brand-ink leading-[1.1] mb-8">
                    A Raiz Sistêmica da <span className="italic text-brand-accent">Dor</span> e da <span className="italic text-brand-terra">Escassez</span>
                  </h1>
                  <p className="text-lg md:text-xl text-brand-ink/70 max-w-xl leading-relaxed">
                    Entenda por que a dor emocional e a escassez financeira têm a mesma raiz — e como destravar os 5 pilares que sustentam sua vida através da visão sistêmica.
                  </p>
                </div>

                {/* Learning Pillars Editorial Style */}
                <div className="mt-12 md:mt-24">
                  <h3 className="text-[10px] uppercase tracking-widest mb-8 font-bold text-brand-ink/30 border-b border-brand-ink/10 pb-4">
                    Os 5 Pilares do Destravamento
                  </h3>
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 gap-y-10">
                    <PillarCard title="Saúde" description="Vitalidade e equilíbrio físico." />
                    <PillarCard title="Relações" description="Vínculos que libertam." />
                    <PillarCard title="Propósito" description="Clareza na sua jornada." />
                    <PillarCard title="Dinheiro" description="Fluxo de prosperidade." />
                    <PillarCard title="Espiritual" description="Conexão com o divino." />
                  </div>
                </div>
              </div>

              {/* Right Column: Form */}
              <div className="md:col-span-5">
                <section id="inscricao" className="bg-white p-8 md:p-12 rounded-lg shadow-[0_20px_50px_rgba(45,36,30,0.05)] border border-brand-ink/5 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-accent" />
                  
                  <div className="mb-10">
                    <h2 className="serif text-3xl mb-2 text-brand-ink">Garanta sua vaga</h2>
                    <p className="text-brand-ink/50 text-sm italic">Inscrição rápida em menos de 30 segundos.</p>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-tighter text-brand-ink/40">Nome Completo</label>
                      <input
                        {...register("nome")}
                        placeholder="Ex: Maria Oliveira"
                        className={cn(
                          "w-full bg-brand-bg/50 border border-brand-ink/10 rounded-md px-4 py-3 text-sm focus:border-brand-accent outline-none transition-all",
                          errors.nome && "border-red-200 focus:border-red-300"
                        )}
                      />
                      {errors.nome && <p className="text-red-500 text-[10px] uppercase font-bold mt-1 tracking-tighter">{errors.nome.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-tighter text-brand-ink/40">E-mail</label>
                      <input
                        {...register("email")}
                        type="email"
                        placeholder="seu@email.com"
                        className={cn(
                          "w-full bg-brand-bg/50 border border-brand-ink/10 rounded-md px-4 py-3 text-sm focus:border-brand-accent outline-none transition-all",
                          errors.email && "border-red-200 focus:border-red-300"
                        )}
                      />
                      {errors.email && <p className="text-red-500 text-[10px] uppercase font-bold mt-1 tracking-tighter">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-tighter text-brand-ink/40">WhatsApp</label>
                      <input
                        {...register("whatsapp")}
                        placeholder="(XX) XXXXX-XXXX"
                        className={cn(
                          "w-full bg-brand-bg/50 border border-brand-ink/10 rounded-md px-4 py-3 text-sm focus:border-brand-accent outline-none transition-all",
                          errors.whatsapp && "border-red-200 focus:border-red-300"
                        )}
                      />
                      {errors.whatsapp && <p className="text-red-500 text-[10px] uppercase font-bold mt-1 tracking-tighter">{errors.whatsapp.message}</p>}
                    </div>

                    {error && (
                      <div className="p-4 bg-red-50 border border-red-100 rounded-md text-red-600 text-xs">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-brand-ink text-white font-bold py-4 rounded-md hover:bg-brand-ink/90 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed text-xs uppercase tracking-widest"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        "QUERO MINHA VAGA"
                      )}
                    </button>
                  </form>
                  
                  <p className="text-[10px] text-center mt-8 text-brand-ink/30 italic">
                    Seus dados estão seguros e protegidos pela nossa política de privacidade.
                  </p>
                </section>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-center bg-white/50 backdrop-blur-sm border border-brand-accent/20 rounded-3xl p-8 md:p-16 shadow-xl"
            >
              <div className="flex justify-center mb-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
              </div>
              
              <h2 className="serif text-3xl md:text-4xl mb-6 text-brand-ink">
                Obrigado por se inscrever na aula!
              </h2>
              
              <div className="max-w-xl mx-auto space-y-6 text-brand-ink/80 mb-12">
                <p className="text-lg">
                  Sua inscrição está <strong className="text-brand-terra uppercase">quase</strong> garantida. 
                  Falta apenas 1 passo: entrar no grupo do WhatsApp.
                </p>
                <div className="bg-brand-accent/5 p-6 rounded-2xl border border-brand-accent/10">
                  <p className="text-sm">
                    É por lá que você vai receber o link da aula ao vivo. É um grupo silencioso — apenas avisos importantes, sem spam, sem conversas paralelas.
                  </p>
                </div>
              </div>

              <a
                href={WHATSAPP_GROUP_URL}
                target="_blank"
                rel="no-referrer"
                className="inline-flex items-center gap-3 bg-[#25D366] text-white font-bold px-8 py-5 rounded-full hover:bg-[#1fb355] transition-all shadow-lg shadow-green-500/20 text-lg md:text-xl group"
              >
                <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                ENTRAR NO GRUPO DO WHATSAPP AGORA
              </a>

              <p className="mt-8 text-xs text-brand-ink/50 flex items-center justify-center gap-2">
                <span className="text-red-500">⚠</span>
                Sem entrar no grupo, você não receberá o link da aula
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-brand-ink/5 flex flex-col md:flex-row justify-between items-center text-brand-ink/40 text-[10px] uppercase tracking-widest font-semibold gap-4">
          <p>© 2026 • A Raiz Sistêmica</p>
          <p>Seus dados estão seguros e serão usados apenas para fins relacionados a esta aula.</p>
          <p>Acesso exclusivo via WhatsApp</p>
        </footer>
      </main>
    </div>
  );
}

function PillarCard({ title, description }: { title: string, description: string }) {
  return (
    <div className="border-t border-brand-ink/10 pt-4">
      <h4 className="serif text-xl mb-1 text-brand-ink">{title}</h4>
      <p className="text-[10px] text-brand-ink/60 leading-snug">{description}</p>
    </div>
  );
}
