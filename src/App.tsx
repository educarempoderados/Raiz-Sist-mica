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
  UserCheck,
  Share2
} from 'lucide-react';
import robertoImg from './roberto.jpeg';
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [activeModal, setActiveModal] = useState<'terms' | 'privacy' | null>(null);

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
    // Log page view
    const logVisit = async () => {
      try {
        await addDoc(collection(db, 'analytics_events'), {
          type: 'EXIBICAO_PAGINA',
          path: '/',
          createdAt: serverTimestamp()
        });
      } catch (err) {
        // Silently fail for analytics to not disturb UX
        console.error("Erro ao registrar acesso", err);
      }
    };
    logVisit();
    
    const data = localStorage.getItem('inscricao_pilares_saudaveis');
    if (data) {
      window.location.href = '/obrigado';
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
      // Simplificado: removemos a verificação de duplicidade para garantir o fluxo
      // e evitar problemas de permissão de leitura não autorizada
      const docRef = await addDoc(collection(db, 'inscricoes'), {
        ...data,
        createdAt: serverTimestamp(),
        source: 'A Raiz Sistêmica',
        entrouGrupo: false
      });

      localStorage.setItem('inscricao_pilares_saudaveis', JSON.stringify({ ...data, id: docRef.id }));
      window.location.href = '/obrigado';
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
      <main className="relative z-10 w-full overflow-hidden">
        <AnimatePresence mode="wait">
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* HERO SECTION */}
              <section className="relative pt-8 md:pt-16 pb-12 px-6">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-accent/5 -z-10 blur-3xl rounded-full translate-x-1/2" />
                
                <div className="max-w-5xl mx-auto text-center mb-10 md:mb-16">
                  <h1 className="font-black leading-[1.05] text-brand-ink tracking-tight uppercase flex flex-col gap-1 md:gap-2">
                    <span className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] text-[#FF4D00]">DORES E DOENÇAS CRÔNICAS</span>
                    <span className="text-base sm:text-lg md:text-xl lg:text-2xl tracking-[0.15em] font-bold">OS 5 PILARES DA VIDA SAUDÁVEL</span>
                  </h1>
                  <p className="mt-6 text-lg md:text-xl text-brand-ink/80 font-medium max-w-3xl mx-auto">
                    Descubra a importância de ter os seus pilares alinhados para uma vida plena: <strong className="text-brand-ink font-bold">Saúde Física, Emocional, Mental, Espiritual e Financeira</strong>.
                  </p>
                </div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-stretch">
                  
                  {/* FORM ON THE LEFT */}
                  <div id="inscricao-form" className="relative group w-full max-w-md mx-auto lg:max-w-none order-1 lg:order-1">
                    <div className="absolute -inset-2 bg-blue-500/20 rounded-2xl blur-2xl group-hover:bg-blue-500/30 transition-all opacity-0 group-hover:opacity-100" />
                    <form 
                      onSubmit={handleSubmit(onSubmit)} 
                      className="bg-[#003B95] text-white p-8 md:p-10 shadow-[0_20px_60px_-15px_rgba(0,59,149,0.4)] rounded-2xl relative border border-white/10"
                    >
                      <div className="text-center mb-8">
                        <div className="bg-brand-red text-white border border-brand-red/20 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] py-1.5 px-4 mb-4 rounded-full inline-flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                          🔥 Masterclass Gratuita - Vagas Limitadas
                        </div>
                        <h2 className="text-2xl md:text-4xl font-black mb-3 text-white leading-tight">CADASTRE-SE AGORA</h2>
                        <p className="text-white/80 text-[13px] md:text-sm font-medium leading-relaxed px-4">
                          Preencha e garanta seu ingresso vip para a masterclass.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-widest text-white/90 pl-1">Nome Completo</label>
                          <input
                            {...register("nome")}
                            placeholder="Digite seu nome..."
                            className={cn(
                              "w-full bg-white border border-transparent rounded-xl px-5 py-4 text-sm focus:border-[#FF4D00] focus:ring-2 focus:ring-[#FF4D00]/50 outline-none transition-all placeholder:text-black/30 font-medium text-brand-ink shadow-inner",
                              errors.nome && "border-[#FF4D00] focus:ring-[#FF4D00]/50"
                            )}
                          />
                          {errors.nome && <p className="text-white text-[10px] font-bold mt-1 pl-1 uppercase">{errors.nome.message}</p>}
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-widest text-white/90 pl-1">E-mail Principal</label>
                          <input
                            {...register("email")}
                            type="email"
                            placeholder="seu.melhor@email.com"
                            className={cn(
                              "w-full bg-white border border-transparent rounded-xl px-5 py-4 text-sm focus:border-[#FF4D00] focus:ring-2 focus:ring-[#FF4D00]/50 outline-none transition-all placeholder:text-black/30 font-medium text-brand-ink shadow-inner",
                              errors.email && "border-[#FF4D00] focus:ring-[#FF4D00]/50"
                            )}
                          />
                          {errors.email && <p className="text-white text-[10px] font-bold mt-1 pl-1 uppercase">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-widest text-white/90 pl-1">WhatsApp (com DDD)</label>
                          <input
                            {...register("whatsapp")}
                            placeholder="(11) 99999-9999"
                            className={cn(
                              "w-full bg-white border border-transparent rounded-xl px-5 py-4 text-sm focus:border-[#FF4D00] focus:ring-2 focus:ring-[#FF4D00]/50 outline-none transition-all placeholder:text-black/30 font-medium text-brand-ink shadow-inner",
                              errors.whatsapp && "border-[#FF4D00] focus:ring-[#FF4D00]/50"
                            )}
                          />
                          {errors.whatsapp && <p className="text-white text-[10px] font-bold mt-1 pl-1 uppercase">{errors.whatsapp.message}</p>}
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-[#FF4D00] text-white font-black py-4 mt-6 rounded-xl hover:bg-[#FF6A2B] transition-all flex items-center justify-center gap-3 text-[13px] md:text-sm uppercase tracking-widest shadow-[0_0_20px_rgba(255,77,0,0.4)] active:scale-95"
                        >
                          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                            <>
                              <ArrowRight className="w-5 h-5" /> QUERO ME CADASTRAR AGORA
                            </>
                          )}
                        </button>
                        
                        <div className="flex items-center justify-center gap-2 mt-4 text-white/60">
                          <ShieldCheck className="w-4 h-4" />
                          <p className="text-[10px] uppercase font-bold tracking-widest text-white/60">Suas informações estão seguras</p>
                        </div>

                        {error && (
                          <div className="p-3 mt-4 bg-red-500/20 text-white border border-red-500/30 rounded-lg text-xs font-bold uppercase text-center">
                            {error}
                          </div>
                        )}
                      </div>
                    </form>
                  </div>

                  {/* TEXT ON THE RIGHT */}
                  <div className="pt-4 lg:pt-0 w-full max-w-xl mx-auto order-2 flex flex-col justify-center">
                    <p className="text-base md:text-lg text-brand-ink/80 font-medium leading-relaxed mb-6">
                      Se você é mulher e já passou dos 30 anos, é provável que o corpo comece a dar sinais de alerta. Dores persistentes na <strong className="text-brand-ink font-black">lombar, tensão constante nos ombros, rigidez no pescoço, enxaquecas e até a temida fibromialgia</strong> não são apenas "coisas da idade" — são reflexos de uma vida sobrecarregada.
                    </p>
                    <p className="text-base md:text-lg text-brand-ink/80 font-medium leading-relaxed mb-6">
                      Nesta <strong className="text-brand-ink font-black text-[#FF4D00]">masterclass exclusiva</strong>, você vai entender como alinhar os <strong className="text-brand-ink font-black">5 Pilares (Saúde Física, Emocional, Mental, Espiritual e Financeira)</strong> é o único caminho para ir na raiz dessas dores, devolver sua energia vital e destravar seu progresso em todas as áreas.
                    </p>
                    <div className="bg-[#FF4D00]/5 border border-[#FF4D00]/20 border-l-4 border-l-[#FF4D00] p-6 rounded-r-xl mt-4 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF4D00]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 transition-transform duration-700 group-hover:scale-150" />
                      <p className="text-sm font-bold text-brand-ink leading-relaxed relative z-10">
                        <span className="text-[#FF4D00] uppercase tracking-[0.2em] block text-[10px] mb-2 font-black flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D00] animate-pulse"></span>
                          Atenção ao próximo passo
                        </span>
                        Para garantir seu acesso, <strong>preencha o formulário</strong> ao lado. Em seguida, você será direcionada para <strong>entrar no grupo oficial e exclusivo no WhatsApp</strong>, onde enviaremos o link da aula e todos os materiais de apoio.
                      </p>
                    </div>
                  </div>

                </div>
              </section>

              {/* IDENTIFICAÇÃO */}
              <section className="py-8 md:py-12 bg-brand-ink text-white">
                <div className="max-w-6xl mx-auto px-6">
                  <h2 className="serif text-4xl md:text-6xl text-center mb-12">Se você convive com:</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <IdentificationCard text="<span class='text-[#FF4D00] font-black'>Dores na lombar</span>, coluna ou joelhos que nunca passam" />
                    <IdentificationCard text="As crises do <span class='text-[#FF4D00] font-black'>ciático</span> que te limitam para viver" />
                    <IdentificationCard text="As dores generalizadas e o cansaço extremo da <span class='text-[#FF4D00] font-black'>fibromialgia</span>" />
                    <IdentificationCard text="Uma mente que não desacelera e uma constante <span class='text-[#FF4D00] font-black'>ansiedade</span> que te consome" />
                    <IdentificationCard text="A frustração de ver que tenta organizar a vida… mas o <span class='text-[#FF4D00] font-black'>dinheiro</span> nunca sobra" />
                    <IdentificationCard text="Um <span class='text-[#FF4D00] font-black'>peso</span> nos ombros que não parece ser seu" />
                  </div>
                  
                  <div className="mt-16 text-center">
                    <p className="text-2xl md:text-3xl text-white/90 mb-8 font-light italic">
                      "Então provavelmente isso não é falta de esforço."
                    </p>
                    <p className="text-3xl md:text-5xl serif text-brand-accent font-bold">
                      É porque algo dentro da sua vida está desorganizado.
                    </p>
                    <div className="mt-12">
                      <button 
                        onClick={scrollToForm}
                        className="bg-brand-accent text-white font-black px-8 md:px-12 py-6 rounded-none hover:bg-white hover:text-brand-ink transition-all text-sm md:text-base uppercase tracking-[0.2em] md:tracking-[0.4em] shadow-2xl group active:scale-95 inline-block"
                      >
                        QUERO ME INSCREVER AGORA
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* OS 5 PILARES */}
              <section className="py-8 md:py-12 px-6 bg-brand-petroleum-light">
                <div className="max-w-5xl mx-auto">
                  <div className="text-center mb-12">
                    <h2 className="serif text-3xl md:text-5xl text-brand-ink">A Reorganização dos 5 Pilares</h2>
                    <p className="mt-6 text-xl text-brand-ink/90 font-light max-w-2xl mx-auto">
                      Nesta aula exclusiva, vou abrir a "caixa-preta" do meu método para te mostrar como curar as desordens que afetam sua vida:
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <PillarCard 
                      title="Físico" 
                      text="Como dores crônicas (como a Fibromialgia) estão diretamente ligadas ao que você carrega dos seus ancestrais." 
                    />
                    <PillarCard 
                      title="Emocional" 
                      text="A libertação do estado de 'vítima' para assumir a postura de adulta protagonista." 
                    />
                    <PillarCard 
                      title="Financeiro" 
                      text="Por que o seu extrato bancário é o reflexo exato da sua árvore genealógica." 
                    />
                    <PillarCard 
                      title="Mental" 
                      text="Como quebrar o estado de alerta constante que gera ansiedade e autossabotagem." 
                    />
                    <PillarCard 
                      title="Sistema Familiar" 
                      text="Onde tudo começa. Identifique e quebre as lealdades invisíveis que te impedem de ser o próximo sucesso da sua família." 
                    />
                  </div>
                </div>
              </section>

              {/* PROMESSA DA AULA */}
              <section className="py-8 md:py-12 px-6 bg-brand-petroleum-light">
                <div className="max-w-4xl mx-auto">
                  <h2 className="serif text-4xl md:text-5xl mb-12 text-center text-brand-ink">O que você vai aprender:</h2>
                  <div className="space-y-4 mb-12">
                    <LargeCheckItem text="Por que seu corpo continua <span class='text-[#FF4D00] font-bold'>doendo</span> mesmo tentando cuidar" />
                    <LargeCheckItem text="O que está por trás da sua <span class='text-[#FF4D00] font-bold'>sobrecarga emocional</span>" />
                    <LargeCheckItem text="Por que sua vida parece não <span class='text-[#FF4D00] font-bold'>sair do lugar</span>" />
                    <LargeCheckItem text="O que está travando sua relação com o <span class='text-[#FF4D00] font-bold'>dinheiro</span>" />
                    <LargeCheckItem text="Como começar a reorganizar isso na <span class='text-[#FF4D00] font-bold'>prática</span>" />
                  </div>
                  
                  <div className="bg-white p-8 shadow-2xl border-t-[12px] border-brand-accent text-center">
                    <p className="text-2xl md:text-4xl serif italic text-brand-red font-black leading-tight">
                      "Resultados que podem ser percebidos já no primeiro mês."
                    </p>
                  </div>
                  
                  <div className="mt-12 text-center">
                    <button 
                      onClick={scrollToForm}
                      className="bg-brand-accent text-white font-black px-8 md:px-12 py-6 rounded-none hover:bg-white hover:text-brand-ink transition-all text-sm md:text-base uppercase tracking-[0.2em] md:tracking-[0.4em] shadow-2xl group active:scale-95 inline-block"
                    >
                      GARANTIR MINHA VAGA GRATUITA
                    </button>
                  </div>
                </div>
              </section>

              {/* PROVA SOCIAL (VÍDEOS) */}
              <section className="py-8 md:py-12 px-6 bg-white border-t border-brand-ink/5">
                <div className="max-w-6xl mx-auto">
                  <div className="text-center mb-12">
                    <h2 className="serif text-4xl md:text-7xl text-brand-ink mb-6">Histórias Reais de Transformação</h2>
                    <p className="text-xl md:text-2xl text-brand-ink/90 font-light">Veja quem já aplicou os 5 pilares e mudou sua realidade</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-12">
                    <div className="space-y-4">
                      <div className="aspect-video bg-brand-ink shadow-2xl border-4 border-brand-accent/20">
                        <iframe 
                          className="w-full h-full"
                          src="https://www.youtube.com/embed/1ymp-j2fid0" 
                          title="Depoimento 1"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                          allowFullScreen
                        ></iframe>
                      </div>
                      <button 
                        onClick={() => alert('Link de compartilhamento copiado!')}
                        className="flex items-center gap-2 text-brand-ink/40 hover:text-brand-accent transition-colors font-bold text-xs uppercase tracking-widest"
                      >
                        <Share2 className="w-4 h-4" /> Compartilhar história
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div className="aspect-video bg-brand-ink shadow-2xl border-4 border-brand-accent/20">
                        <iframe 
                          className="w-full h-full"
                          src="https://www.youtube.com/embed/-XU7w7skxl0" 
                          title="Depoimento 2"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                          allowFullScreen
                        ></iframe>
                      </div>
                      <button 
                        onClick={() => alert('Link de compartilhamento copiado!')}
                        className="flex items-center gap-2 text-brand-ink/40 hover:text-brand-accent transition-colors font-bold text-xs uppercase tracking-widest"
                      >
                        <Share2 className="w-4 h-4" /> Compartilhar história
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div className="aspect-video bg-brand-ink shadow-2xl border-4 border-brand-accent/20">
                        <iframe 
                          className="w-full h-full"
                          src="https://www.youtube.com/embed/RKLJbhCUsNw" 
                          title="Depoimento 3"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                          allowFullScreen
                        ></iframe>
                      </div>
                      <button 
                        onClick={() => alert('Link de compartilhamento copiado!')}
                        className="flex items-center gap-2 text-brand-ink/40 hover:text-brand-accent transition-colors font-bold text-xs uppercase tracking-widest"
                      >
                        <Share2 className="w-4 h-4" /> Compartilhar história
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div className="aspect-video bg-brand-ink shadow-2xl border-4 border-brand-accent/20">
                        <iframe 
                          className="w-full h-full"
                          src="https://www.youtube.com/embed/nTr4kbkg_dY" 
                          title="Depoimento 4"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                          allowFullScreen
                        ></iframe>
                      </div>
                      <button 
                        onClick={() => alert('Link de compartilhamento copiado!')}
                        className="flex items-center gap-2 text-brand-ink/40 hover:text-brand-accent transition-colors font-bold text-xs uppercase tracking-widest"
                      >
                        <Share2 className="w-4 h-4" /> Compartilhar história
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* AUTORIDADE */}
              <section className="py-12 md:py-16 px-6 bg-brand-petroleum-light">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-12 md:gap-16 items-center">
                  <div className="relative group max-w-xs mx-auto lg:max-w-none w-full">
                    <div className="absolute -inset-6 bg-brand-accent/10 -z-10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <img 
                      src={robertoImg} 
                      alt="Roberto Firmino dos Santos - Especialista" 
                      className="w-full aspect-[4/5] object-cover shadow-2xl border-l-[12px] border-b-[12px] border-brand-ink"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="space-y-6 md:space-y-8">
                    <div>
                      <h3 className="serif text-4xl md:text-5xl text-brand-ink leading-tight mb-2">Com quem você vai aprender?</h3>
                      <p className="text-lg md:text-xl font-black text-brand-red uppercase tracking-widest">
                        Roberto Firmino dos Santos
                      </p>
                    </div>
                    <div className="space-y-4 text-base md:text-lg text-brand-ink/80 font-light leading-relaxed">
                      <p className="font-medium text-brand-ink border-l-4 border-brand-accent pl-6 text-lg md:text-xl mb-6">
                        Eu não ensino baseado apenas em teorias ou livros. Minha trajetória começou muito antes dos palcos, mentorias e grandes empresários. Vivi na prática a <span className="text-brand-red font-black">dor</span>, a <span className="text-brand-red font-black">escassez</span> e o <span className="text-brand-red font-black">peso das histórias familiares</span> que travam a vida financeira, emocional e física.
                      </p>
                      <p>
                        Hoje, como <span className="font-black text-brand-ink">Especialista Sistêmico em Dor, Doenças Crônicas e Questões Financeiras</span>, uno mais de 30 anos de experiência clínica com Constelação Familiar, Cinesiologia Aplicada e gestão prática de vida e negócios.
                      </p>
                      <p>
                        Ajudo principalmente <span className="font-bold text-brand-ink">mulheres 30+</span> a se libertarem das dores físicas e emocionais, curando a raiz nas memórias familiares e <span className="font-bold text-brand-ink">reorganizando sua relação com o dinheiro</span> — com <span className="font-black text-brand-red">resultados percebidos já no primeiro mês</span>.
                      </p>
                      <p>
                        Entendo a dor física porque acompanhei e transformei a vida de centenas de pessoas. E entendo os desafios financeiros porque também vivi minha própria transformação. Meu trabalho é mostrar que, quando o sistema familiar se reorganiza, a saúde, os relacionamentos e a prosperidade começam a encontrar o lugar certo.
                      </p>
                    </div>
                    <div className="pt-4">
                      <button 
                        onClick={scrollToForm}
                        className="bg-brand-accent text-white font-black px-8 md:px-12 py-6 rounded-none hover:bg-white hover:text-brand-ink transition-all text-sm md:text-base uppercase tracking-[0.2em] md:tracking-[0.4em] shadow-2xl group active:scale-95 inline-block"
                      >
                        MUDAR MINHA HISTÓRIA
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* FINAL CTA */}
              <section className="py-8 md:py-12 px-6 text-center bg-brand-ink text-white">
                <div className="max-w-3xl mx-auto">
                  <h2 className="serif text-4xl md:text-7xl mb-8 text-brand-accent leading-tight">O seu sistema familiar espera por coragem.</h2>
                  <p className="text-2xl text-white/90 mb-12 font-light">Essa pessoa corajosa para mudar a história de escassez e dor é você?</p>
                <button 
                  onClick={scrollToForm}
                  className="bg-brand-accent text-white font-black px-8 md:px-12 py-6 rounded-none hover:bg-white hover:text-brand-ink transition-all text-sm md:text-base uppercase tracking-[0.2em] md:tracking-[0.4em] shadow-2xl group active:scale-95 inline-block"
                >
                  GARANTIR MINHA VAGA
                </button>
                </div>
              </section>
            </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-brand-ink py-24 px-6 text-white overflow-hidden relative">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 items-start mb-20 border-b border-white/10 pb-20">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.4em] text-brand-accent mb-6">Data Reservada</p>
              <p className="serif text-3xl">09 de Junho às 20h</p>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.4em] text-brand-accent mb-6">Transmissão</p>
              <p className="serif text-3xl">Ao vivo no YouTube</p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-xs font-black uppercase tracking-[0.4em] text-brand-accent mb-6">Suporte</p>
              <p className="text-lg md:text-base lg:text-lg opacity-90">equipe.hdsf@robertofirminodossantos.com.br</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-[11px] font-black uppercase tracking-widest opacity-70">
            <p>© 2026 • Os 5 Pilares da Vida Saudável</p>
            <div className="flex gap-10">
              <button 
                onClick={() => setActiveModal('terms')}
                className="hover:text-brand-accent cursor-pointer transition-colors uppercase"
              >
                Termos de Uso
              </button>
              <a 
                href="/politica-de-privacidade"
                className="hover:text-brand-accent cursor-pointer transition-colors uppercase"
              >
                Privacidade
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Legal Modals */}
      <AnimatePresence>
        {activeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-brand-ink/95 backdrop-blur-sm"
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="bg-white text-brand-ink w-full max-w-2xl max-h-[80vh] overflow-y-auto p-8 md:p-12 relative shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setActiveModal(null)}
                className="absolute top-6 right-6 text-brand-ink/40 hover:text-brand-red transition-colors"
              >
                <AlertCircle className="w-8 h-8 rotate-45" />
              </button>

              {activeModal === 'privacy' ? (
                <div className="prose prose-sm font-sans">
                  <h3 className="serif text-2xl mb-8 uppercase tracking-widest border-b border-brand-ink/10 pb-4">Política de Privacidade</h3>
                  <div className="space-y-6 text-sm text-brand-ink/90 leading-relaxed font-medium">
                    <p>Seus dados são tratados com o máximo rigor e segurança, em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).</p>
                    
                    <section>
                      <h4 className="text-brand-ink font-black uppercase text-xs mb-2">1. Coleta de Dados</h4>
                      <p>Coletamos seu nome, e-mail e número de WhatsApp exclusivamente para garantir seu acesso ao evento "Os 5 Pilares da Vida Saudável" e para enviar comunicações relevantes sobre o método sistêmico.</p>
                    </section>

                    <section>
                      <h4 className="text-brand-ink font-black uppercase text-xs mb-2">2. Finalidade</h4>
                      <p>O tratamento dos dados visa: a) Enviar o link de acesso às aulas; b) Enviar materiais complementares; c) Informar sobre futuros treinamentos e mentorias de Roberto Firmino dos Santos.</p>
                    </section>

                    <section>
                      <h4 className="text-brand-ink font-black uppercase text-xs mb-2">3. Seus Direitos</h4>
                      <p>Você tem total direito de solicitar a exclusão de seus dados, retificação ou revogação do consentimento a qualquer momento. Basta entrar em contato através do e-mail: equipe.hdsf@robertofirminodossantos.com.br.</p>
                    </section>

                    <section>
                      <h4 className="text-brand-ink font-black uppercase text-xs mb-2">4. Segurança</h4>
                      <p>Utilizamos tecnologias de mercado para proteger suas informações contra acessos não autorizados. Seus dados nunca serão vendidos ou compartilhados com terceiros para fins comerciais alheios a este programa.</p>
                    </section>
                  </div>
                </div>
              ) : (
                <div className="prose prose-sm font-sans">
                  <h3 className="serif text-2xl mb-8 uppercase tracking-widest border-b border-brand-ink/10 pb-4">Termos de Uso</h3>
                  <div className="space-y-6 text-sm text-brand-ink/90 leading-relaxed font-medium">
                    <p>Ao acessar este site e se inscrever em nossa aula gratuita, você concorda em cumprir estes termos.</p>

                    <section>
                      <h4 className="text-brand-ink font-black uppercase text-xs mb-2">1. Isenção de Responsabilidade</h4>
                      <p>O conteúdo apresentado nesta aula tem caráter informativo e educacional sobre visão sistêmica e autocuidado. Não substitui tratamentos médicos, psicológicos ou psiquiátricos. Resultados individuais podem variar de acordo com a aplicação prática do método.</p>
                    </section>

                    <section>
                      <h4 className="text-brand-ink font-black uppercase text-xs mb-2">2. Propriedade Intelectual</h4>
                      <p>Todo o conteúdo, logotipos e materiais didáticos são de propriedade exclusiva de Roberto Firmino dos Santos. É proibida a reprodução, cópia ou distribuição não autorizada deste material para fins comerciais.</p>
                    </section>

                    <section>
                      <h4 className="text-brand-ink font-black uppercase text-xs mb-2">3. Uso de Conteúdo</h4>
                      <p>O link de acesso à aula é pessoal e intransferível, destinado apenas aos usuários cadastrados em nossa base oficial.</p>
                    </section>
                  </div>
                </div>
              )}

              <button 
                onClick={() => setActiveModal(null)}
                className="mt-12 w-full bg-brand-ink text-white py-4 font-black uppercase tracking-widest hover:bg-brand-accent transition-all"
              >
                Entendi e Aceito
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PillarCard({ title, text }: { title: string, text: string }) {
  return (
    <div className="p-8 bg-white shadow-xl shadow-brand-ink/5 border-t-4 border-brand-accent hover:-translate-y-2 transition-all group">
      <h4 className="serif text-2xl mb-4 text-brand-ink group-hover:text-brand-accent transition-colors">{title}</h4>
      <p className="text-base text-brand-ink/90 leading-relaxed">{text}</p>
    </div>
  );
}

function DiscoveryItem({ title, text }: { title: string, text: string }) {
  return (
    <div className="space-y-2">
      <h5 className="text-lg font-black uppercase tracking-widest text-brand-accent">/ {title}</h5>
      <p className="text-lg text-white/90 leading-relaxed font-light">{text}</p>
    </div>
  );
}

function IdentificationCard({ text }: { text: string }) {
  return (
    <div className="p-8 md:p-10 bg-white/5 border border-white/10 hover:border-brand-accent hover:bg-white/10 transition-all group flex items-center justify-center min-h-[160px] text-center">
      <p 
        className="text-lg md:text-xl font-light text-white leading-relaxed"
        dangerouslySetInnerHTML={{ __html: text }}
      />
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
    <div className="flex items-start gap-6 py-6 border-b border-brand-ink/10 group hover:bg-brand-white/50 transition-all px-4">
      <CheckCircle2 className="w-7 h-7 text-brand-red shrink-0 group-hover:scale-125 transition-transform" />
      <span 
        className="text-xl md:text-3xl text-brand-ink/80 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: text }}
      />
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
