import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  MessageCircle, 
  Sparkles, 
  ShieldCheck,
  Calendar,
  Lock,
  Loader2,
  Target
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
  const [savedData, setSavedData] = useState<RegistrationData | null>(null);
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

  useEffect(() => {
    const data = localStorage.getItem('inscricao_raiz_sistemica');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        setSavedData(parsed);
        setIsSubmitted(true);
      } catch (e) {
        localStorage.removeItem('inscricao_raiz_sistemica');
      }
    }
  }, []);

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
      localStorage.setItem('inscricao_raiz_sistemica', JSON.stringify(data));
      setSavedData(data);
      setIsSubmitted(true);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'inscricoes');
      setError("Ocorreu um erro ao processar sua inscrição. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToForm = () => {
    document.getElementById('inscricao')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white relative overflow-x-hidden selection:bg-brand-accent/30 font-sans text-brand-ink">
      {/* Top Banner */}
      <div className="bg-brand-petroleum text-white text-center py-3 px-4 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase sticky top-0 z-50">
        Aula ao vivo gratuita • 14 de maio às 20h • Youtube
      </div>

      <main className="relative z-10 w-full">
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* HEADLINE SECTION */}
              <section className="pt-16 md:pt-24 pb-20 px-6 max-w-5xl mx-auto text-center">
                <h1 className="serif text-4xl md:text-7xl font-bold leading-[1.1] mb-8">
                  Dores no corpo, emoções travadas e <span className="italic text-brand-accent">dinheiro que não flui?</span>
                </h1>
                <p className="text-lg md:text-2xl text-brand-ink/70 max-w-3xl mx-auto leading-relaxed mb-12 font-light">
                  Descubra como memórias familiares invisíveis podem estar afetando sua saúde, suas emoções e sua vida financeira — e como começar a mudar isso já no primeiro mês.
                </p>
                <div className="flex flex-col items-center gap-4">
                  <div className="bg-brand-gold-light/50 border border-brand-accent/20 px-6 py-2 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest text-brand-accent mb-4">
                    Aula ao vivo gratuita — 14 de maio às 20h
                  </div>
                  <button 
                    onClick={scrollToForm}
                    className="bg-brand-olive text-white font-bold px-12 py-5 rounded-md hover:bg-brand-olive/90 transition-all text-sm uppercase tracking-widest shadow-xl shadow-brand-olive/20 active:scale-95"
                  >
                    QUERO ME INSCREVER AGORA
                  </button>
                  <p className="flex items-center gap-2 text-[10px] font-bold text-brand-ink/40 uppercase tracking-widest mt-2">
                    <Lock className="w-3 h-3" />
                    O link será enviado apenas para inscritas
                  </p>
                </div>
              </section>

              {/* BLOCO DE CONEXÃO */}
              <section className="py-20 md:py-32 px-6 bg-brand-gold-light/20 border-y border-brand-accent/10">
                <div className="max-w-4xl mx-auto">
                  <h2 className="serif text-3xl md:text-4xl mb-12 text-center">Se você sente que:</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    <ConnectionCard text="Seu corpo dói sem uma explicação clara" />
                    <ConnectionCard text="Suas emoções parecem pesadas ou desorganizadas" />
                    <ConnectionCard text="Sua vida não flui, mesmo você tentando" />
                    <ConnectionCard text="O dinheiro entra… mas não permanece" />
                  </div>
                  <div className="text-center">
                    <p className="text-xl md:text-3xl serif italic text-brand-petroleum leading-relaxed">
                      "Então talvez o problema não esteja onde você está olhando."
                    </p>
                  </div>
                </div>
              </section>

              {/* QUEBRA DE CRENÇA */}
              <section className="py-20 md:py-32 px-6 max-w-4xl mx-auto">
                <div className="text-center mb-16">
                  <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-brand-accent">Quebra de Crença</span>
                  <h2 className="serif text-3xl md:text-4xl mt-4">A maioria das pessoas tenta resolver assim:</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <BeliefCard number="1" text="Trata apenas o sintoma físico" />
                  <BeliefCard number="2" text="Tenta “pensar positivo”" />
                  <BeliefCard number="3" text="Se esforça mais para ganhar dinheiro" />
                  <BeliefCard number="4" text="Tenta controlar emoções" />
                </div>
                <p className="text-center mt-12 text-lg italic text-brand-ink/40">E mesmo assim… tudo volta.</p>
              </section>

              {/* NOVA VISÃO */}
              <section className="py-24 md:py-40 px-6 bg-brand-petroleum text-white text-center">
                <div className="max-w-3xl mx-auto">
                  <h2 className="serif text-3xl md:text-5xl mb-12">O que quase ninguém te explica é:</h2>
                  <p className="text-2xl md:text-4xl serif italic text-brand-accent mb-12 leading-tight">
                    Existe uma raiz mais profunda.
                  </p>
                  <p className="text-lg md:text-xl leading-relaxed opacity-80 mb-8 max-w-2xl mx-auto">
                    Muitas dores físicas, emocionais e até financeiras podem estar conectadas a histórias não resolvidas dentro do sistema familiar.
                  </p>
                  <div className="h-px w-20 bg-brand-accent/50 mx-auto my-12" />
                  <p className="text-lg md:text-xl font-bold tracking-widest uppercase text-brand-accent">
                    E enquanto isso não é visto… os padrões se repetem.
                  </p>
                </div>
              </section>

              {/* PROMESSA (ROMA SIMPLIFICADA) */}
              <section className="py-20 md:py-32 px-6 max-w-5xl mx-auto text-center font-light">
                <h2 className="serif text-3xl md:text-5xl mb-16 leading-tight">Nesta aula, você vai entender como iniciar um processo de reorganização interna que pode:</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left mb-20">
                  <PromiseItem text="Aliviar dores físicas e emocionais" />
                  <PromiseItem text="Trazer mais leveza para sua vida" />
                  <PromiseItem text="Destravar sua relação com o dinheiro" />
                </div>
                <p className="text-xl md:text-2xl text-brand-olive font-bold italic">
                  Com mudanças que podem começar a ser percebidas já no primeiro mês.
                </p>
              </section>

              {/* SOBRE O ESPECIALISTA */}
              <section className="py-20 md:py-32 px-6 bg-brand-gold-light/10 border-y border-brand-accent/10">
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
                  <div className="md:col-span-5 aspect-[4/5] bg-brand-gold-light rounded-sm relative overflow-hidden group shadow-2xl">
                    <img 
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=640" 
                      alt="Roberto Firmino" 
                      className="absolute inset-0 w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 transition-all duration-1000" 
                    />
                    <div className="absolute inset-0 border-[20px] border-white/10 pointer-events-none" />
                  </div>
                  <div className="md:col-span-7">
                    <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-brand-accent mb-4 block">O Especialista</span>
                    <h3 className="serif text-4xl mb-8">Roberto Firmino dos Santos</h3>
                    <div className="space-y-6 text-brand-ink/70 leading-relaxed text-lg font-light">
                      <p>
                        É educador físico e especialista em dor, corpo e desenvolvimento humano.
                      </p>
                      <p>
                        Ao longo da sua trajetória, percebeu que muitas dores e bloqueios não tinham explicação apenas no corpo ou na mente individual.
                      </p>
                      <p>
                        Foi então que passou a estudar e aplicar uma abordagem mais profunda — conectando corpo, emoções, sistema familiar e prosperidade.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* O QUE VOCÊ VAI APRENDER NA AULA */}
              <section className="py-20 md:py-32 px-6 max-w-4xl mx-auto">
                <h2 className="serif text-3xl md:text-4xl mb-16 text-center">O que você vai aprender na aula</h2>
                <div className="space-y-6">
                  <LearnCheckItem text="Por que tratar apenas o corpo muitas vezes não resolve a dor" />
                  <LearnCheckItem text="Como emoções e padrões familiares influenciam sua vida hoje" />
                  <LearnCheckItem text="A relação entre sua história familiar e o dinheiro" />
                  <LearnCheckItem text="O erro silencioso que mantém sua vida travada" />
                  <LearnCheckItem text="Como começar a reorganizar os pilares da sua vida" />
                </div>
              </section>

              {/* FILTRO (PARA VOCÊ / NÃO É PARA VOCÊ) */}
              <section className="py-20 md:py-32 px-6 bg-brand-ink text-white">
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
                  <div>
                    <h3 className="serif text-2xl md:text-3xl mb-10 text-white flex items-center gap-3">
                      <CheckCircle2 className="w-8 h-8 text-brand-accent" />
                      Essa aula é para você que:
                    </h3>
                    <ul className="space-y-6 text-white/70">
                      <li className="flex gap-3">
                        <span className="text-brand-accent">•</span>
                        Sente dores físicas frequentes (como fibromialgia, tensões, cansaço constante)
                      </li>
                      <li className="flex gap-3">
                        <span className="text-brand-accent">•</span>
                        Vive ansiedade, sobrecarga emocional ou confusão mental
                      </li>
                      <li className="flex gap-3">
                        <span className="text-brand-accent">•</span>
                        Sente que a vida não anda, mesmo tentando
                      </li>
                      <li className="flex gap-3">
                        <span className="text-brand-accent">•</span>
                        Quer entender a raiz dos seus bloqueios
                      </li>
                    </ul>
                  </div>
                  <div className="opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all">
                    <h3 className="serif text-2xl md:text-3xl mb-10 text-white/50 flex items-center gap-3">
                      <span className="text-red-400 font-bold">×</span>
                      NÃO é para você se:
                    </h3>
                    <ul className="space-y-6 text-white/40">
                      <li className="flex gap-3">• Busca uma solução rápida e superficial</li>
                      <li className="flex gap-3">• Não está aberta a olhar para si mesma com profundidade</li>
                      <li className="flex gap-3">• Quer apenas “dicas prontas” sem transformação real</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* FINAL CTA / FORM */}
              <section id="inscricao" className="py-24 px-6 md:py-40">
                <div className="max-w-xl mx-auto">
                  <div className="text-center mb-16">
                    <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-brand-olive mb-6 block">Inscrições Abertas</span>
                    <h2 className="serif text-4xl md:text-5xl mb-6">Participe gratuitamente</h2>
                    <p className="text-brand-ink/50 text-sm max-w-sm mx-auto leading-relaxed">
                      A aula é gratuita, mas o acesso ao link é restrito às inscritas. Cadastre-se para garantir sua vaga.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-brand-gold-light/20 p-8 md:p-12 rounded-xs border border-brand-accent/10 shadow-sm">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-ink/40">Nome Completo</label>
                      <input
                        {...register("nome")}
                        placeholder="Ex: Maria Pereira"
                        className={cn(
                          "w-full bg-white border border-brand-ink/10 rounded-none px-4 py-4 text-sm focus:border-brand-accent outline-none transition-all",
                          errors.nome && "border-red-200"
                        )}
                      />
                      {errors.nome && <p className="text-red-500 text-[10px] uppercase font-bold mt-1">{errors.nome.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-ink/40">Seu melhor E-mail</label>
                      <input
                        {...register("email")}
                        type="email"
                        placeholder="seu@email.com"
                        className={cn(
                          "w-full bg-white border border-brand-ink/10 rounded-none px-4 py-4 text-sm focus:border-brand-accent outline-none transition-all",
                          errors.email && "border-red-200"
                        )}
                      />
                      {errors.email && <p className="text-red-500 text-[10px] uppercase font-bold mt-1">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-ink/40">WhatsApp</label>
                      <input
                        {...register("whatsapp")}
                        placeholder="(XX) XXXXX-XXXX"
                        className={cn(
                          "w-full bg-white border border-brand-ink/10 rounded-none px-4 py-4 text-sm focus:border-brand-accent outline-none transition-all",
                          errors.whatsapp && "border-red-200"
                        )}
                      />
                      {errors.whatsapp && <p className="text-red-500 text-[10px] uppercase font-bold mt-1">{errors.whatsapp.message}</p>}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-brand-ink text-white font-bold py-5 rounded-none hover:bg-brand-ink/90 transition-all flex items-center justify-center gap-3 disabled:opacity-70 text-xs uppercase tracking-[0.2em] shadow-xl shadow-brand-ink/20 active:scale-[0.98] mt-8"
                    >
                      {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "QUERO PARTICIPAR DA AULA"}
                    </button>
                    
                    <p className="flex items-center justify-center gap-2 text-[8px] font-bold text-brand-ink/30 uppercase tracking-[0.2em] mt-8">
                      <Lock className="w-2.5 h-2.5" />
                      O link será enviado apenas para inscritas
                    </p>
                  </form>
                </div>
              </section>
            </motion.div>
          ) : (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center bg-white py-20 md:py-32 px-6 max-w-4xl mx-auto"
            >
              <div className="w-20 h-20 bg-brand-gold-light/50 rounded-full flex items-center justify-center mx-auto mb-10 border border-brand-accent/20">
                <CheckCircle2 className="w-10 h-10 text-brand-accent" />
              </div>
              
              <h2 className="serif text-4xl md:text-5xl mb-8">Participação Confirmada.</h2>
              
              {savedData && (
                <div className="mb-12 inline-grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-2xl mx-auto w-full border-y border-brand-accent/10 py-8">
                  <InfoBlock label="Nome" value={savedData.nome} />
                  <InfoBlock label="E-mail" value={savedData.email} />
                  <InfoBlock label="WhatsApp" value={savedData.whatsapp} />
                </div>
              )}
              
              <div className="max-w-xl mx-auto space-y-8 mb-16">
                <p className="text-xl md:text-2xl font-light leading-relaxed">
                  Sua vaga para a aula de <strong>14 de maio</strong> está <strong className="text-brand-olive uppercase tracking-widest font-bold">Quase</strong> garantida.
                </p>
                
                <div className="bg-brand-petroleum text-white p-8 md:p-12 rounded-sm text-left">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-accent mb-6">Próximo Passo — Fundamental</p>
                  <p className="text-lg leading-relaxed opacity-90">
                    Você deve entrar no grupo do WhatsApp agora. É por lá que enviaremos o link exclusivo da transmissão no YouTube minutos antes de começar.
                  </p>
                </div>
              </div>

              <a
                href={WHATSAPP_GROUP_URL}
                target="_blank"
                rel="no-referrer"
                className="inline-flex items-center gap-4 bg-[#25D366] text-white font-bold px-12 py-6 rounded-none hover:bg-[#1fb355] transition-all shadow-2xl shadow-green-500/20 text-sm uppercase tracking-widest group active:scale-95"
              >
                <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                ENTRAR NO GRUPO DO WHATSAPP
              </a>

              <p className="mt-10 text-[10px] text-red-500/60 font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                ⚠️ Sem o grupo, você não terá acesso ao link da aula
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* BLOCO FINAL DADOS */}
      <section className="bg-brand-gold-light/20 py-20 px-6 border-t border-brand-accent/10">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center text-brand-ink/60">
          <div>
            <Calendar className="w-6 h-6 mx-auto mb-4 text-brand-accent opacity-50" />
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1">Data</p>
            <p className="serif text-xl">14 de Maio</p>
          </div>
          <div>
            <Sparkles className="w-6 h-6 mx-auto mb-4 text-brand-accent opacity-50" />
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1">Horário</p>
            <p className="serif text-xl">20:00 Horas</p>
          </div>
          <div>
            <Target className="w-6 h-6 mx-auto mb-4 text-brand-accent opacity-50" />
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1">Local</p>
            <p className="serif text-xl">Ao vivo no YouTube</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-ink py-16 px-6 text-white/30 text-[10px] font-bold uppercase tracking-[0.3em]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div className="space-y-4">
            <p>© 2026 • ROBERTO FIRMINO DOS SANTOS</p>
            <p className="text-white/10">A HISTÓRIA DO DINHEIRO EM MEU SISTEMA FAMILIAR</p>
          </div>
          <div className="space-y-4 md:text-right">
            <p>O link será enviado apenas para inscritos</p>
            <p>Seus dados estão protegidos por nossa política de privacidade</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ConnectionCard({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-4 p-6 bg-white border border-brand-accent/5 rounded-sm hover:border-brand-accent/20 transition-all group">
      <div className="w-2 h-2 rounded-full bg-brand-accent group-hover:scale-150 transition-transform" />
      <span className="text-lg md:text-xl font-light text-brand-ink/80 leading-snug">{text}</span>
    </div>
  );
}

function BeliefCard({ number, text }: { number: string, text: string }) {
  return (
    <div className="p-8 border border-brand-ink/5 rounded-xs flex items-center gap-6 group hover:bg-brand-gold-light/20 transition-all">
      <span className="serif text-4xl text-brand-accent opacity-20 group-hover:opacity-100 transition-opacity">{number}</span>
      <span className="text-lg text-brand-ink/70 font-light">{text}</span>
    </div>
  );
}

function PromiseItem({ text }: { text: string }) {
  return (
    <div className="space-y-4">
      <div className="h-0.5 w-12 bg-brand-accent" />
      <p className="text-xl md:text-2xl serif leading-relaxed text-brand-ink">{text}</p>
    </div>
  );
}

function LearnCheckItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-4 py-6 border-b border-brand-ink/5 group">
      <CheckCircle2 className="w-5 h-5 text-brand-accent mt-1 shrink-0 group-hover:scale-110 transition-transform" />
      <span className="text-lg md:text-xl font-light text-brand-ink/80">{text}</span>
    </div>
  );
}

function InfoBlock({ label, value }: { label: string, value: string }) {
  return (
    <div>
      <span className="text-[10px] uppercase font-bold text-brand-ink/30 block mb-1 tracking-tighter">{label}</span>
      <p className="text-sm font-light text-brand-ink truncate">{value}</p>
    </div>
  );
}
