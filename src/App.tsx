import { useState, useEffect, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  MessageCircle, 
  Sparkles, 
  Calendar,
  Lock,
  Loader2,
  Target,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
  BellRing,
  UserCheck
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { db, handleFirestoreError, OperationType } from './lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';

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
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);
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
    const data = localStorage.getItem('inscricao_pilares_saudaveis');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        setSavedData(parsed);
        setIsSubmitted(true);
        setIsAlreadyRegistered(true);
      } catch (e) {
        localStorage.removeItem('inscricao_pilares_saudaveis');
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
      const q = query(collection(db, 'inscricoes'), where("email", "==", data.email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        setIsAlreadyRegistered(true);
      } else {
        await addDoc(collection(db, 'inscricoes'), {
          ...data,
          createdAt: serverTimestamp(),
          source: 'Os 5 Pilares'
        });
        setIsAlreadyRegistered(false);
      }

      localStorage.setItem('inscricao_pilares_saudaveis', JSON.stringify(data));
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
    document.getElementById('inscricao-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white relative overflow-x-hidden selection:bg-brand-accent/20 font-sans text-brand-ink">
      {/* Top Bar */}
      <div className="bg-brand-red text-white text-center py-4 px-4 text-xs md:text-base font-black tracking-widest uppercase sticky top-0 z-50 shadow-lg">
         📅 21 de maio | ⏰ 20h | 💻 Online ao vivo no YouTube
      </div>

      <main className="relative z-10 w-full overflow-hidden">
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* HERO SECTION */}
              <section className="relative pt-12 md:pt-24 pb-20 px-6">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-accent/5 -z-10 blur-3xl rounded-full translate-x-1/2" />
                
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                  <div className="pt-4">
                    <h1 className="serif text-4xl md:text-7xl font-bold leading-tight mb-8 text-brand-ink">
                      Seu corpo dói, sua mente não para e <span className="text-brand-accent">sua vida não anda?</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-brand-ink font-light leading-relaxed mb-10">
                      Participe da aula gratuita e descubra como aliviar dores físicas, organizar suas emoções e <strong className="text-brand-red">destravar sua vida</strong> — começando pelo que realmente está por trás disso.
                    </p>
                    
                    <div className="flex items-center gap-4 p-6 bg-brand-petroleum-light border border-brand-petroleum/10 shadow-sm">
                      <Lock className="w-6 h-6 text-brand-red shrink-0" />
                      <p className="text-sm md:text-base font-bold text-brand-petroleum uppercase tracking-wider">
                        O acesso exclusivo será enviado apenas para quem se inscrever
                      </p>
                    </div>
                  </div>

                  {/* FORM */}
                  <div id="inscricao-form" className="relative group">
                    <div className="absolute -inset-2 bg-brand-accent/20 rounded-none blur-xl group-hover:bg-brand-accent/30 transition-all opacity-0 group-hover:opacity-100" />
                    <form 
                      onSubmit={handleSubmit(onSubmit)} 
                      className="bg-brand-ink text-white p-8 md:p-12 shadow-2xl relative border-t-8 border-brand-accent"
                    >
                      <div className="text-center mb-10">
                        <h2 className="serif text-3xl md:text-4xl mb-4 text-brand-accent">Garanta sua Vaga Gratuita</h2>
                        <p className="text-white/50 text-[10px] uppercase font-bold tracking-[0.2em]">Aula Gratuita — 21 de Maio</p>
                      </div>

                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-white/60">Nome Completo</label>
                          <input
                            {...register("nome")}
                            placeholder="Seu nome"
                            className={cn(
                              "w-full bg-white/10 border border-white/20 px-5 py-5 text-base focus:border-brand-accent outline-none transition-all placeholder:text-white/20 font-medium",
                              errors.nome && "border-brand-red"
                            )}
                          />
                          {errors.nome && <p className="text-brand-red text-xs font-bold mt-2 uppercase">{errors.nome.message}</p>}
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-white/60">Seu Melhor E-mail</label>
                          <input
                            {...register("email")}
                            type="email"
                            placeholder="exemplo@email.com"
                            className={cn(
                              "w-full bg-white/10 border border-white/20 px-5 py-5 text-base focus:border-brand-accent outline-none transition-all placeholder:text-white/20 font-medium",
                              errors.email && "border-brand-red"
                            )}
                          />
                          {errors.email && <p className="text-brand-red text-xs font-bold mt-2 uppercase">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-white/60">WhatsApp</label>
                          <input
                            {...register("whatsapp")}
                            placeholder="(00) 00000-0000"
                            className={cn(
                              "w-full bg-white/10 border border-white/20 px-5 py-5 text-base focus:border-brand-accent outline-none transition-all placeholder:text-white/20 font-medium",
                              errors.whatsapp && "border-brand-red"
                            )}
                          />
                          {errors.whatsapp && <p className="text-brand-red text-xs font-bold mt-2 uppercase">{errors.whatsapp.message}</p>}
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-brand-accent text-white font-black py-6 mt-8 rounded-none hover:bg-brand-white hover:text-brand-ink transition-all flex items-center justify-center gap-4 text-sm md:text-base uppercase tracking-widest group shadow-xl active:scale-95"
                        >
                          {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                            <>
                              QUERO PARTICIPAR AGORA
                              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                            </>
                          )}
                        </button>

                        {error && (
                          <div className="p-4 bg-brand-red/20 text-brand-red text-xs font-bold uppercase text-center">
                            {error}
                          </div>
                        )}
                      </div>
                    </form>
                  </div>
                </div>
              </section>

              {/* IDENTIFICAÇÃO */}
              <section className="py-24 md:py-40 bg-brand-ink text-white">
                <div className="max-w-6xl mx-auto px-6">
                  <h2 className="serif text-4xl md:text-6xl text-center mb-20">Se você sente que:</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <IdentificationCard text="Acorda já cansada, como se não tivesse descansado" />
                    <IdentificationCard text="Convive com dores no corpo que vão e voltam" />
                    <IdentificationCard text="Sua mente não desacelera" />
                    <IdentificationCard text="Você tenta organizar a vida… mas nada flui" />
                    <IdentificationCard text="Começa coisas e não consegue manter" />
                    <IdentificationCard text="O dinheiro nunca fica ou nunca é suficiente" />
                  </div>
                  
                  <div className="mt-24 text-center">
                    <p className="text-2xl md:text-3xl text-white/60 mb-8 font-light italic">
                      "Então provavelmente isso não é falta de esforço."
                    </p>
                    <p className="text-3xl md:text-5xl serif text-brand-accent font-bold">
                      É porque algo dentro da sua vida está desorganizado.
                    </p>
                  </div>
                </div>
              </section>

              {/* INTRODUÇÃO DOS 5 PILARES */}
              <section className="py-24 md:py-40 px-6 bg-white">
                <div className="max-w-5xl mx-auto text-center">
                  <h2 className="serif text-4xl md:text-7xl mb-12 text-brand-ink leading-tight">Os 5 Pilares da Sua Vida</h2>
                  <p className="text-xl md:text-2xl text-brand-ink font-light opacity-80 mb-20 max-w-3xl mx-auto">
                    Talvez você esteja tentando resolver sua vida olhando só para uma parte dela. Entenda o que sustenta você:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    <PillarSquare name="Saúde Física" number="01" />
                    <PillarSquare name="Saúde Emocional" number="02" />
                    <PillarSquare name="Saúde Espiritual" number="03" />
                    <PillarSquare name="Saúde Financeira" number="04" />
                    <PillarSquare name="Sistema Familiar" number="05" />
                  </div>

                  <div className="mt-20 p-10 bg-brand-red text-white shadow-2xl">
                    <p className="text-2xl md:text-4xl font-black uppercase tracking-widest leading-tight">
                      Quando um pilar trava, a vida inteira pesa.
                    </p>
                  </div>
                </div>
              </section>

              {/* PROMESSA DA AULA */}
              <section className="py-24 md:py-40 px-6 bg-brand-petroleum-light">
                <div className="max-w-4xl mx-auto">
                  <h2 className="serif text-4xl md:text-5xl mb-20 text-center text-brand-ink">O que você vai aprender:</h2>
                  <div className="space-y-8 mb-20">
                    <LargeCheckItem text="Por que seu corpo continua doendo mesmo tentando cuidar" />
                    <LargeCheckItem text="O que está por trás da sua sobrecarga emocional" />
                    <LargeCheckItem text="Por que sua vida parece não sair do lugar" />
                    <LargeCheckItem text="O que está travando sua relação com o dinheiro" />
                    <LargeCheckItem text="Como começar a reorganizar isso na prática" />
                  </div>
                  
                  <div className="bg-white p-12 shadow-2xl border-t-[12px] border-brand-accent text-center">
                    <p className="text-2xl md:text-4xl serif italic text-brand-red font-black leading-tight">
                      "Resultados que podem ser percebidos já no primeiro mês."
                    </p>
                  </div>
                </div>
              </section>

              {/* PROVA SOCIAL (VÍDEOS) */}
              <section className="py-24 md:py-40 px-6 bg-white border-t border-brand-ink/5">
                <div className="max-w-6xl mx-auto">
                  <div className="text-center mb-20">
                    <h2 className="serif text-4xl md:text-7xl text-brand-ink mb-6">Histórias Reais de Transformação</h2>
                    <p className="text-xl md:text-2xl text-brand-ink/70 font-light">Veja quem já aplicou os 5 pilares e mudou sua realidade</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="aspect-video bg-brand-ink shadow-2xl border-4 border-brand-accent/20">
                      <iframe 
                        className="w-full h-full"
                        src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
                        title="Depoimento 1"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                      ></iframe>
                    </div>
                    <div className="aspect-video bg-brand-ink shadow-2xl border-4 border-brand-accent/20">
                      <iframe 
                        className="w-full h-full"
                        src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
                        title="Depoimento 2"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                </div>
              </section>

              {/* AUTORIDADE */}
              <section className="py-24 md:py-40 px-6 bg-brand-petroleum-light">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                  <div className="relative group">
                    <div className="absolute -inset-6 bg-brand-accent/10 -z-10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <img 
                      src="https://images.unsplash.com/photo-1544168190-79c17527004f?q=80&w=800" 
                      alt="Roberto Firmino" 
                      className="w-full aspect-[4/5] object-cover shadow-2xl border-b-[10px] border-brand-ink grayscale hover:grayscale-0 transition-all duration-1000"
                    />
                  </div>
                  <div className="space-y-10">
                    <h3 className="serif text-5xl md:text-7xl text-brand-ink leading-tight">Roberto Firmino dos Santos</h3>
                    <p className="text-xl md:text-3xl font-black text-brand-red uppercase tracking-wider">
                      Especialista em dor crônica, sistema familiar e prosperidade.
                    </p>
                    <div className="space-y-8 text-xl md:text-2xl text-brand-ink font-light leading-relaxed">
                      <p className="font-bold border-l-4 border-brand-accent pl-6">
                        Libere-se das dores físicas e emocionais, curando a raiz nas memórias familiares e destravando sua relação com o dinheiro, com resultados já no primeiro mês e evolução em até 6 meses.
                      </p>
                      <p>
                        Ao entender que dores e bloqueios não têm explicação apenas no individual, Roberto Firmino integrou corpo, emoção e sistema familiar para oferecer uma visão completa da vida e da saúde.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* FINAL CTA */}
              <section className="py-24 md:py-40 px-6 text-center bg-brand-ink text-white">
                <div className="max-w-3xl mx-auto">
                  <h2 className="serif text-4xl md:text-7xl mb-12 text-brand-accent leading-tight">Sua nova história começa aqui.</h2>
                  <p className="text-2xl text-white/60 mb-16 font-light">Garanta sua vaga gratuita agora mesmo.</p>
                  <button 
                    onClick={scrollToForm}
                    className="bg-brand-accent text-white font-black px-16 py-8 rounded-none hover:bg-white hover:text-brand-ink transition-all text-base uppercase tracking-[0.4em] shadow-2xl group active:scale-95"
                  >
                    QUERO PARTICIPAR DA AULA
                  </button>
                  <p className="mt-12 text-xs font-black uppercase tracking-[0.3em] opacity-40">Vagas limitadas por conta da plataforma</p>
                </div>
              </section>
            </motion.div>
          ) : (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 md:py-32 px-6 max-w-5xl mx-auto"
            >
              {isAlreadyRegistered && (
                <div className="mb-10 bg-brand-petroleum-light py-4 px-8 border-l-4 border-brand-accent inline-flex items-center gap-4 text-brand-petroleum animate-bounce">
                  <UserCheck className="w-6 h-6" />
                  <span className="text-base font-black uppercase tracking-widest">Você já está inscrita no sistema!</span>
                </div>
              )}

              <div className="w-24 h-24 bg-brand-red rounded-full flex items-center justify-center mx-auto mb-12 shadow-2xl shadow-brand-red/30">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
              
              <h2 className="serif text-4xl md:text-7xl mb-16 text-brand-ink leading-tight">Passo Final <br className="hidden md:block" /> <span className="text-brand-red">Para Receber o Link</span></h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left mb-20 items-start">
                <div className="bg-brand-ink text-white p-10 space-y-8 shadow-2xl border-b-8 border-brand-accent">
                  <h3 className="serif text-2xl text-brand-accent uppercase tracking-widest">Regras do Grupo</h3>
                  <div className="space-y-6">
                    <RuleItem icon={<BellRing className="w-5 h-5" />} text="Grupo Silencioso: Apenas administradores enviam mensagens." />
                    <RuleItem icon={<ShieldCheck className="w-5 h-5" />} text="Segurança Total: Sem ofertas extras ou spam de terceiros." />
                    <RuleItem icon={<MessageCircle className="w-5 h-5" />} text="Link Exclusivo: O link será enviado apenas no dia da aula via WhatsApp." />
                  </div>
                </div>

                <div className="space-y-8 py-4">
                  <p className="text-2xl font-light text-brand-ink leading-relaxed">
                    Entre agora no grupo de avisos para garantir que você não perderá a transmissão no YouTube.
                  </p>
                  
                  <a
                    href={WHATSAPP_GROUP_URL}
                    target="_blank"
                    rel="no-referrer"
                    className="w-full inline-flex items-center justify-center gap-6 bg-[#25D366] text-white font-black px-10 py-8 rounded-none hover:bg-brand-ink transition-all shadow-2xl shadow-green-500/20 text-sm md:text-base uppercase tracking-widest group active:scale-95"
                  >
                    <MessageCircle className="w-8 h-8 group-hover:scale-110 transition-transform" />
                    ENTRAR NO GRUPO AGORA
                  </a>
                  
                  <p className="text-xs font-black text-brand-red uppercase tracking-widest text-center animate-pulse">
                    ⚠️ Importante: Muitos e-mails caem no spam. O WhatsApp é a única via garantida.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-brand-ink py-24 px-6 text-white overflow-hidden relative">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 items-start mb-20 border-b border-white/10 pb-20">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.4em] text-brand-accent mb-6">Data Reservada</p>
              <p className="serif text-3xl">21 de Maio às 20h</p>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.4em] text-brand-accent mb-6">Transmissão</p>
              <p className="serif text-3xl">Ao vivo no YouTube</p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-xs font-black uppercase tracking-[0.4em] text-brand-accent mb-6">Suporte</p>
              <p className="text-lg opacity-60">robertofirmino.suporte@gmail.com</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-[11px] font-black uppercase tracking-widest opacity-30">
            <p>© 2026 • Os 5 Pilares da Vida Saudável</p>
            <div className="flex gap-10">
              <span className="hover:text-brand-accent cursor-pointer transition-colors">Termos de Uso</span>
              <span className="hover:text-brand-accent cursor-pointer transition-colors">Privacidade</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function IdentificationCard({ text }: { text: string }) {
  return (
    <div className="p-10 bg-white/5 border border-white/10 hover:border-brand-accent hover:bg-white/10 transition-all group">
      <p className="text-xl font-light text-white opacity-80 group-hover:opacity-100 leading-relaxed">{text}</p>
    </div>
  );
}

function PillarSquare({ name, number }: { name: string, number: string }) {
  return (
    <div className="p-10 border border-brand-ink/10 bg-white group hover:bg-brand-ink hover:text-white transition-all shadow-xl shadow-brand-ink/5 border-b-8 border-b-brand-accent">
      <span className="serif text-5xl opacity-10 group-hover:opacity-100 transition-opacity mb-4 block font-black text-brand-accent">{number}</span>
      <p className="serif text-2xl leading-snug">{name}</p>
    </div>
  );
}

function LargeCheckItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-6 py-8 border-b border-brand-ink/10 group hover:bg-brand-white/50 transition-all px-4">
      <CheckCircle2 className="w-7 h-7 text-brand-red shrink-0 group-hover:scale-125 transition-transform" />
      <span className="text-xl md:text-2xl text-brand-ink/80 leading-relaxed">{text}</span>
    </div>
  );
}

function RuleItem({ icon, text }: { icon: ReactNode, text: string }) {
  return (
    <div className="flex items-center gap-4 group">
      <div className="text-brand-accent shrink-0 group-hover:scale-125 transition-transform">{icon}</div>
      <p className="text-sm md:text-base font-medium opacity-80">{text}</p>
    </div>
  );
}
