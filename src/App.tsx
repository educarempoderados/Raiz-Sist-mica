import { useState, useEffect } from 'react';
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
  AlertCircle
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
    const data = localStorage.getItem('inscricao_pilares_saudaveis');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        setSavedData(parsed);
        setIsSubmitted(true);
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
      const path = 'inscricoes';
      await addDoc(collection(db, path), {
        ...data,
        createdAt: serverTimestamp(),
        source: 'Os 5 Pilares'
      });
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
      {/* Dynamic Top Banner */}
      <div className="bg-brand-red text-white text-center py-3 px-4 text-[10px] md:text-sm font-bold tracking-[0.1em] uppercase sticky top-0 z-50">
         📅 14 de maio | ⏰ 20h | 💻 Online ao vivo
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
              {/* HERO SECTION / ABOVE THE FOLD */}
              <section className="relative pt-12 md:pt-20 pb-20 px-6 overflow-hidden">
                {/* Background Accent */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-gold-light/20 -skew-x-12 translate-x-1/2 -z-10" />
                
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="text-left">
                    <h1 className="serif text-4xl md:text-6xl font-bold leading-[1.1] mb-6 text-brand-ink">
                      Seu corpo dói, sua mente não para e <span className="text-brand-accent">sua vida não anda?</span>
                    </h1>
                    <p className="text-lg md:text-xl text-brand-ink/70 leading-relaxed mb-8 font-light">
                      Participe da aula gratuita e descubra como aliviar dores físicas, organizar suas emoções e destravar sua vida — começando pelo que realmente está por trás disso.
                    </p>
                    
                    <div className="hidden lg:block space-y-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-brand-red uppercase tracking-widest">
                        <Lock className="w-3.5 h-3.5" />
                        O acesso será enviado apenas para quem se inscrever
                      </div>
                      <div className="h-1 w-20 bg-brand-accent" />
                    </div>
                  </div>

                  {/* FORM AT THE START (ABOVE THE FOLD) */}
                  <div id="inscricao-form" className="relative">
                    <div className="absolute -inset-4 bg-brand-accent/5 rounded-2xl blur-3xl -z-10" />
                    <form 
                      onSubmit={handleSubmit(onSubmit)} 
                      className="bg-brand-ink text-white p-6 md:p-10 shadow-2xl relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-brand-accent/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                      
                      <div className="text-center mb-8">
                        <h2 className="serif text-2xl md:text-3xl mb-2 text-brand-accent">Garanta sua vaga</h2>
                        <p className="text-white/50 text-[10px] uppercase font-bold tracking-[0.2em]">Aula Gratuita — 14 de Maio</p>
                      </div>

                      <div className="space-y-5 relative z-10">
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-bold uppercase tracking-widest text-white/40 ml-1">Nome Completo</label>
                          <input
                            {...register("nome")}
                            placeholder="Seu nome aqui"
                            className={cn(
                              "w-full bg-white/5 border border-white/10 px-4 py-4 text-sm focus:border-brand-accent outline-none transition-all placeholder:text-white/20",
                              errors.nome && "border-brand-red/50"
                            )}
                          />
                          {errors.nome && <p className="text-brand-red text-[9px] uppercase font-bold mt-1 ml-1">{errors.nome.message}</p>}
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[9px] font-bold uppercase tracking-widest text-white/40 ml-1">E-mail</label>
                          <input
                            {...register("email")}
                            type="email"
                            placeholder="seu@melhoremail.com"
                            className={cn(
                              "w-full bg-white/5 border border-white/10 px-4 py-4 text-sm focus:border-brand-accent outline-none transition-all placeholder:text-white/20",
                              errors.email && "border-brand-red/50"
                            )}
                          />
                          {errors.email && <p className="text-brand-red text-[9px] uppercase font-bold mt-1 ml-1">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[9px] font-bold uppercase tracking-widest text-white/40 ml-1">WhatsApp</label>
                          <input
                            {...register("whatsapp")}
                            placeholder="(XX) XXXXX-XXXX"
                            className={cn(
                              "w-full bg-white/5 border border-white/10 px-4 py-4 text-sm focus:border-brand-accent outline-none transition-all placeholder:text-white/20",
                              errors.whatsapp && "border-brand-red/50"
                            )}
                          />
                          {errors.whatsapp && <p className="text-brand-red text-[9px] uppercase font-bold mt-1 ml-1">{errors.whatsapp.message}</p>}
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-brand-accent text-white font-black py-5 rounded-none hover:bg-white hover:text-brand-ink transition-all flex items-center justify-center gap-3 disabled:opacity-70 text-xs uppercase tracking-[0.3em] mt-6 group"
                        >
                          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                            <>
                              QUERO PARTICIPAR DA AULA
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                          )}
                        </button>
                      </div>

                      <p className="flex items-center justify-center gap-2 text-[8px] font-bold text-white/30 uppercase tracking-[0.2em] mt-8">
                        <Lock className="w-2.5 h-2.5" />
                        Seus dados estão 100% seguros
                      </p>
                    </form>
                  </div>
                </div>
              </section>

              {/* BLOCO DE IDENTIFICAÇÃO (FORTE) */}
              <section className="py-24 md:py-32 bg-brand-petroleum-light">
                <div className="max-w-5xl mx-auto px-6">
                  <div className="text-center mb-16">
                    <h2 className="serif text-3xl md:text-5xl text-brand-ink">Se você sente que:</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <IdentificationCard text="Acorda já cansada, como se não tivesse descansado" />
                    <IdentificationCard text="Convive com dores no corpo que vão e voltam" />
                    <IdentificationCard text="Sua mente não desacelera" />
                    <IdentificationCard text="Você tenta organizar a vida… mas nada flui" />
                    <IdentificationCard text="Começa coisas e não consegue manter" />
                    <IdentificationCard text="O dinheiro nunca fica ou nunca é suficiente" />
                  </div>
                  
                  <div className="mt-20 text-center max-w-3xl mx-auto">
                    <p className="text-xl md:text-2xl text-brand-ink/80 leading-relaxed font-light mb-6">
                      Então provavelmente isso não é falta de esforço.
                    </p>
                    <p className="text-2xl md:text-4xl serif italic text-brand-red font-bold">
                      É porque algo dentro da sua vida está desorganizado.
                    </p>
                  </div>
                </div>
              </section>

              {/* APROFUNDANDO A DOR */}
              <section className="py-24 md:py-32 px-6 max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                  <div>
                    <h3 className="serif text-2xl md:text-3xl mb-8">Você já tentou:</h3>
                    <ul className="space-y-4 text-brand-ink/60">
                      <li className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-brand-accent rounded-full" />
                        Cuidar da saúde
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-brand-accent rounded-full" />
                        Melhorar sua rotina
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-brand-accent rounded-full" />
                        Controlar suas emoções
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-brand-accent rounded-full" />
                        Se esforçar mais para ganhar dinheiro
                      </li>
                    </ul>
                  </div>
                  <div className="bg-brand-red/5 border-l-4 border-brand-red p-8">
                    <h3 className="serif text-2xl md:text-3xl mb-6 text-brand-red">Mas no fundo…</h3>
                    <div className="space-y-2 text-lg font-bold text-brand-ink">
                      <p>👉 a dor continua</p>
                      <p>👉 o cansaço volta</p>                      <p>👉 a ansiedade aparece</p>
                      <p>👉 e a vida segue travada</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* VIRADA DE CHAVE */}
              <section className="py-24 md:py-40 bg-brand-ink text-white overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-accent to-transparent" />
                <div className="max-w-4xl mx-auto px-6 text-center">
                  <AlertCircle className="w-12 h-12 text-brand-red mx-auto mb-8 animate-pulse" />
                  <h2 className="serif text-3xl md:text-5xl mb-8">Talvez o problema não seja você.</h2>
                  <p className="text-xl md:text-2xl text-white/70 italic font-light">
                    Talvez você esteja tentando resolver sua vida olhando só para uma parte dela.
                  </p>
                </div>
              </section>

              {/* INTRODUÇÃO DOS 5 PILARES */}
              <section className="py-24 md:py-32 px-6">
                <div className="max-w-5xl mx-auto">
                  <div className="text-center mb-20">
                    <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-brand-accent block mb-4">A Estrutura</span>
                    <h2 className="serif text-4xl md:text-5xl">Os 5 Pilares da Vida Saudável</h2>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-8 text-center">
                    <PillarItem name="Físico" delay={0.1} />
                    <PillarItem name="Emocional" delay={0.2} />
                    <PillarItem name="Espiritual" delay={0.3} />
                    <PillarItem name="Financeiro" delay={0.4} />
                    <PillarItem name="Familiar" delay={0.5} />
                  </div>
                  <div className="mt-20 text-center bg-brand-accent text-white p-8 md:p-12">
                    <p className="text-xl md:text-2xl font-bold uppercase tracking-widest leading-relaxed">
                      Quando um ou mais desses pilares está desorganizado…
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 text-sm font-bold opacity-90">
                      <p>👉 o corpo sente</p>
                      <p>👉 as emoções pesam</p>
                      <p>👉 a mente trava</p>
                      <p>👉 o dinheiro não flui</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* PROMESSA DA AULA */}
              <section className="py-24 md:py-32 px-6 bg-brand-gold-light/20">
                <div className="max-w-4xl mx-auto">
                  <h2 className="serif text-3xl md:text-4xl mb-16 text-center">Nessa aula ao vivo, você vai entender:</h2>
                  <div className="space-y-6 mb-16 font-light">
                    <PromiseCheckItem text="Por que seu corpo continua doendo mesmo tentando cuidar" />
                    <PromiseCheckItem text="O que está por trás da sua sobrecarga emocional" />
                    <PromiseCheckItem text="Por que sua vida parece não sair do lugar" />
                    <PromiseCheckItem text="O que está travando sua relação com o dinheiro" />
                    <PromiseCheckItem text="E como começar a reorganizar isso na prática" />
                  </div>
                  <div className="text-center bg-white p-10 shadow-xl shadow-brand-accent/5 border-t-4 border-brand-accent">
                    <p className="text-2xl md:text-3xl serif italic text-brand-red font-bold">
                      Com mudanças que podem começar a ser percebidas já no primeiro mês.
                    </p>
                  </div>
                </div>
              </section>

              {/* AUTORIDADE */}
              <section className="py-24 md:py-32 px-6">
                <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                  <div className="lg:col-span-12 xl:col-span-5 relative group">
                    <div className="absolute -inset-4 bg-brand-accent/20 blur-2xl group-hover:bg-brand-accent/30 transition-all" />
                    <div className="relative aspect-[4/5] bg-brand-ink overflow-hidden grayscale brightness-75 hover:grayscale-0 transition-all duration-700 shadow-2xl">
                      <img 
                        src="https://images.unsplash.com/photo-1544168190-79c17527004f?q=80&w=800" 
                        alt="Especialista Roberto Firmino" 
                        className="absolute inset-0 w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000"
                      />
                    </div>
                  </div>
                  <div className="lg:col-span-12 xl:col-span-7">
                    <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-brand-red block mb-6">A Autoridade</span>
                    <h3 className="serif text-4xl md:text-5xl mb-8">Roberto Firmino dos Santos</h3>
                    <div className="space-y-6 text-lg text-brand-ink/70 leading-relaxed font-light">
                      <p>
                        Roberto Firmino dos Santos é especialista em dor, corpo e desenvolvimento humano.
                      </p>
                      <p>
                        Ao longo da sua trajetória, percebeu que muitas dores físicas e emocionais não melhoravam apenas com tratamentos tradicionais.
                      </p>
                      <p>
                        Foi a partir disso que passou a trabalhar com uma visão mais completa da vida — integrando corpo, emoções, sistema familiar e prosperidade.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* QUEBRA DE EXPECTATIVA */}
              <section className="py-24 md:py-32 px-6 bg-brand-red/5">
                <div className="max-w-3xl mx-auto text-center">
                  <h2 className="serif text-3xl md:text-4xl mb-12 text-brand-red">Essa aula não é sobre:</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-60">
                    <ExpectationCard text="Pensamento Positivo" />
                    <ExpectationCard text="Fórmulas Prontas" />
                    <ExpectationCard text="Motivação Momentânea" />
                  </div>
                  <p className="mt-12 text-xl italic font-bold text-brand-ink">É sobre entender o que realmente está travando sua vida.</p>
                </div>
              </section>

              {/* PARA QUEM É / NÃO É */}
              <section className="py-24 md:py-32 px-6 bg-brand-ink text-white">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
                  <div>
                    <h3 className="serif text-3xl mb-12 text-brand-accent flex items-center gap-4">
                      <CheckCircle2 className="w-8 h-8" />
                      Para quem é:
                    </h3>
                    <ul className="space-y-8 text-xl font-light">
                      <li className="flex gap-4"><span className="text-brand-accent">•</span> Mulheres 30+ que convivem com dores físicas constantes</li>
                      <li className="flex gap-4"><span className="text-brand-accent">•</span> Vivem cansadas ou sobrecarregadas emocionalmente</li>
                      <li className="flex gap-4"><span className="text-brand-accent">•</span> Sentem que a vida não anda</li>
                      <li className="flex gap-4"><span className="text-brand-accent">•</span> Querem parar de repetir os mesmos padrões</li>
                    </ul>
                  </div>
                  <div className="opacity-40 hover:opacity-100 transition-opacity">
                    <h3 className="serif text-3xl mb-12 text-white/50 flex items-center gap-4">
                      <div className="w-8 h-1 bg-white/30" />
                      Para quem NÃO é:
                    </h3>
                    <ul className="space-y-8 text-lg font-light text-white/60">
                      <li className="flex gap-4">• Quem busca solução rápida sem profundidade</li>
                      <li className="flex gap-4">• Quem não quer olhar para si mesma</li>
                      <li className="flex gap-4">• Quem não está disposta a mudar</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* FINAL CTA */}
              <section className="py-24 md:py-40 px-6 text-center relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-brand-accent/30" />
                <div className="max-w-2xl mx-auto">
                  <h2 className="serif text-4xl md:text-6xl mb-8">Último Passo.</h2>
                  <p className="text-xl text-brand-ink/50 mb-12 font-light">
                    O acesso ao link da aula é restrito. Você só recebe o link se estiver inscrita.
                  </p>
                  <button 
                    onClick={scrollToForm}
                    className="bg-brand-red text-white font-black px-12 py-6 rounded-none hover:bg-brand-ink transition-all text-sm uppercase tracking-[0.4em] shadow-2xl shadow-brand-red/30 group active:scale-95"
                  >
                    QUERO PARTICIPAR AGORA
                  </button>
                </div>
              </section>
            </motion.div>
          ) : (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 md:py-32 px-6 max-w-4xl mx-auto"
            >
              <div className="w-24 h-24 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-12 border border-brand-red/20 shadow-xl shadow-brand-red/5">
                <CheckCircle2 className="w-12 h-12 text-brand-red" />
              </div>
              
              <h2 className="serif text-4xl md:text-6xl mb-10 text-brand-ink">Inscrição Efetuada com Sucesso!</h2>
              
              <div className="max-w-2xl mx-auto space-y-10 mb-20 text-left">
                <div className="bg-brand-petroleum-light p-8 md:p-12 border-l-8 border-brand-accent shadow-sm">
                  <h3 className="serif text-2xl md:text-3xl mb-6 text-brand-ink">Próximo Passo — OBRIGATÓRIO</h3>
                  <p className="text-lg leading-relaxed text-brand-ink/70 font-light mb-8">
                    Para garantir que você receberá o link da transmissão do YouTube, você precisa entrar no grupo oficial da aula.
                  </p>
                  <div className="bg-white p-6 border border-brand-red/10 italic text-brand-red font-bold text-sm">
                    ⚠️ Atenção: Não enviaremos o link por e-mail no dia. O acesso é exclusivo para quem estiver no grupo.
                  </div>
                </div>
              </div>

              <a
                href={WHATSAPP_GROUP_URL}
                target="_blank"
                rel="no-referrer"
                className="inline-flex items-center gap-6 bg-[#25D366] text-white font-black px-12 py-8 rounded-none hover:bg-[#1fb355] transition-all shadow-2xl shadow-green-500/20 text-sm uppercase tracking-[0.3em] group active:scale-95"
              >
                <MessageCircle className="w-8 h-8 group-hover:scale-110 transition-transform" />
                ENTRAR NO GRUPO DO WHATSAPP
              </a>

              <p className="mt-16 text-[10px] text-brand-ink/30 font-bold uppercase tracking-[0.5em] animate-pulse">
                Clique acima para finalizar sua inscrição
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* REFORÇO FINAL */}
      <section className="bg-brand-ink text-white py-24 md:py-32 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
          <div className="p-8 border border-white/5 hover:border-brand-accent/30 transition-all group">
            <Calendar className="w-6 h-6 mx-auto mb-6 text-brand-accent group-hover:scale-110 transition-transform" />
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40 mb-2">Data da Aula</p>
            <p className="serif text-2xl">14 de Maio</p>
          </div>
          <div className="p-8 border border-white/5 hover:border-brand-red/30 transition-all group">
            <Sparkles className="w-6 h-6 mx-auto mb-6 text-brand-red group-hover:scale-110 transition-transform" />
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40 mb-2">Horário Brasília</p>
            <p className="serif text-2xl">20:00 Horas</p>
          </div>
          <div className="p-8 border border-white/5 hover:border-brand-accent/30 transition-all group">
            <Target className="w-6 h-6 mx-auto mb-6 text-brand-accent group-hover:scale-110 transition-transform" />
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40 mb-2">Onde Assistir</p>
            <p className="serif text-2xl">Ao vivo no YouTube</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-20 px-6 border-t border-brand-ink/5">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12 mb-16">
            <div>
              <h4 className="serif text-3xl text-brand-ink mb-2">Os 5 Pilares da Vida Saudável</h4>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-accent">Transformação Profunda • 2026</p>
            </div>
            <div className="text-left md:text-right space-y-2 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-ink/40 leading-relaxed">
              <p>O link será enviado apenas para inscritas</p>
              <p>ROBERTO FIRMINO DOS SANTOS</p>
            </div>
          </div>
          <div className="pt-12 border-t border-brand-ink/5 flex flex-col md:flex-row justify-between gap-6 text-[8px] font-bold uppercase tracking-widest text-brand-ink/20">
            <p>© Todos os direitos reservados</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-brand-accent">Política de Privacidade</a>
              <a href="#" className="hover:text-brand-accent">Termos de Uso</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function IdentificationCard({ text }: { text: string }) {
  return (
    <div className="p-8 bg-white shadow-sm border-b-2 border-transparent hover:border-brand-accent transition-all group">
      <p className="text-lg font-light text-brand-ink/80 leading-relaxed group-hover:text-brand-ink transition-colors">{text}</p>
    </div>
  );
}

function PillarItem({ name, delay }: { name: string, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="p-8 border border-brand-ink/5 bg-brand-petroleum-light group hover:bg-brand-accent transition-all"
    >
      <p className="serif text-xl md:text-2xl text-brand-ink group-hover:text-white transition-colors">{name}</p>
    </motion.div>
  );
}

function PromiseCheckItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-4 py-6 border-b border-brand-ink/5 group hover:bg-white px-2 transition-all">
      <CheckCircle2 className="w-5 h-5 text-brand-accent mt-1 shrink-0 group-hover:scale-125 transition-transform" />
      <span className="text-lg md:text-xl text-brand-ink/90">{text}</span>
    </div>
  );
}

function ExpectationCard({ text }: { text: string }) {
  return (
    <div className="p-6 border border-brand-red/20 rounded-xs">
      <p className="text-brand-ink/80 font-bold uppercase text-[10px] tracking-widest">{text}</p>
    </div>
  );
}
