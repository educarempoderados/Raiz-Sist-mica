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
      // Simplificado: removemos a verificação de duplicidade para garantir o fluxo
      // e evitar problemas de permissão de leitura não autorizada
      await addDoc(collection(db, 'inscricoes'), {
        ...data,
        createdAt: serverTimestamp(),
        source: 'A Raiz Sistêmica'
      });
      setIsAlreadyRegistered(false);

      localStorage.setItem('inscricao_pilares_saudaveis', JSON.stringify(data));
      setSavedData(data);
      setIsSubmitted(true);
      window.scrollTo(0, 0);
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
         🗓 Aula Ao Vivo e Gratuita | Data: 21/05/2026 | Horário: 20h
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
                    <p className="text-brand-red font-black uppercase tracking-widest text-sm mb-4">Para você que cansou de lutar contra o próprio corpo e contra o saldo bancário.</p>
                    <h1 className="serif text-4xl md:text-6xl font-bold leading-tight mb-8 text-slate-900 uppercase tracking-tight">
                      <span className="text-orange-600 font-extrabold block md:inline">DOR</span> NA COLUNA,<br className="hidden md:block" />
                      <span className="text-orange-600 font-extrabold block md:inline">DOR</span> NO OMBRO,<br className="hidden md:block" />
                      <span className="text-orange-600 font-extrabold block md:inline">DOR CRÔNICA</span> E DOENÇA <span className="text-orange-600 font-extrabold block md:inline">CRÔNICA</span>,<br className="hidden md:block" />
                      <span className="text-orange-600 font-extrabold block md:inline">ANSIEDADE E DEPRESSÃO.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-brand-ink font-light leading-relaxed mb-10">
                      A dor lombar, a queimação na coluna e a escassez financeira não são castigos — são mensagens. Descubra como silenciar a dor física e emocional que está travando a sua vida e a sua prosperidade.
                    </p>
                    
                    <div className="flex items-center gap-4 p-6 bg-brand-petroleum-light border border-brand-petroleum/10 shadow-sm border-l-8 border-l-brand-accent">
                      <p className="text-sm md:text-base font-bold text-brand-petroleum uppercase tracking-wider">
                        O CAMINHO PRÁTICO: COMO CURAR DORES CRÔNICAS, VENCER A ANSIEDADE E DESTRAVAR SUAS FINANÇAS NO PRIMEIRO MÊS.
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
                        <h2 className="serif text-2xl md:text-3xl mb-4 text-brand-accent">Garante sua vaga gratuita</h2>
                        <p className="text-white/50 text-[11px] font-bold tracking-[0.1em] leading-relaxed uppercase">
                          ⚠️ Atenção: As vagas são limitadas e o link de acesso à aula será enviado exclusivamente no nosso Grupo VIP do WhatsApp.
                        </p>
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
                              GARANTIR MINHA VAGA
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
              <section className="py-12 md:py-20 bg-brand-ink text-white">
                <div className="max-w-6xl mx-auto px-6">
                  <h2 className="serif text-4xl md:text-6xl text-center mb-12">Se você sente que:</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <IdentificationCard text="Convive com <span class='text-orange-600 font-black'>dores na lombar</span>, coluna ou joelhos que nunca passam" />
                    <IdentificationCard text="O <span class='text-orange-600 font-black'>ciático</span> ataca e você se sente limitada para viver" />
                    <IdentificationCard text="Acorda já <span class='text-orange-600 font-black'>cansada</span>, como se não tivesse descansado nada" />
                    <IdentificationCard text="Sua mente não desacelera e a <span class='text-orange-600 font-black'>ansiedade</span> te consome" />
                    <IdentificationCard text="Você tenta organizar a vida… mas o <span class='text-orange-600 font-black'>dinheiro</span> nunca sobra" />
                    <IdentificationCard text="Sente um <span class='text-orange-600 font-black'>peso</span> nos ombros que não parece ser seu" />
                  </div>
                  
                  <div className="mt-16 text-center">
                    <p className="text-2xl md:text-3xl text-white/60 mb-8 font-light italic">
                      "Então provavelmente isso não é falta de esforço."
                    </p>
                    <p className="text-3xl md:text-5xl serif text-brand-accent font-bold">
                      É porque algo dentro da sua vida está desorganizado.
                    </p>
                  </div>
                </div>
              </section>

              {/* OS 5 PILARES */}
              <section className="py-12 md:py-20 px-6 bg-brand-petroleum-light">
                <div className="max-w-5xl mx-auto">
                  <div className="text-center mb-12">
                    <h2 className="serif text-3xl md:text-5xl text-brand-ink">A Reorganização dos 5 Pilares</h2>
                    <p className="mt-6 text-xl text-brand-ink/70 font-light max-w-2xl mx-auto">
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
              <section className="py-12 md:py-20 px-6 bg-brand-petroleum-light">
                <div className="max-w-4xl mx-auto">
                  <h2 className="serif text-4xl md:text-5xl mb-12 text-center text-brand-ink">O que você vai aprender:</h2>
                  <div className="space-y-4 mb-12">
                    <LargeCheckItem text="Por que seu corpo continua <span class='text-orange-600 font-bold'>doendo</span> mesmo tentando cuidar" />
                    <LargeCheckItem text="O que está por trás da sua <span class='text-orange-600 font-bold'>sobrecarga emocional</span>" />
                    <LargeCheckItem text="Por que sua vida parece não <span class='text-orange-600 font-bold'>sair do lugar</span>" />
                    <LargeCheckItem text="O que está travando sua relação com o <span class='text-orange-600 font-bold'>dinheiro</span>" />
                    <LargeCheckItem text="Como começar a reorganizar isso na <span class='text-orange-600 font-bold'>prática</span>" />
                  </div>
                  
                  <div className="bg-white p-8 shadow-2xl border-t-[12px] border-brand-accent text-center">
                    <p className="text-2xl md:text-4xl serif italic text-brand-red font-black leading-tight">
                      "Resultados que podem ser percebidos já no primeiro mês."
                    </p>
                  </div>
                </div>
              </section>

              {/* PROVA SOCIAL (VÍDEOS) */}
              <section className="py-12 md:py-20 px-6 bg-white border-t border-brand-ink/5">
                <div className="max-w-6xl mx-auto">
                  <div className="text-center mb-12">
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
              <section className="py-12 md:py-20 px-6 bg-brand-petroleum-light">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="relative group">
                    <div className="absolute -inset-6 bg-brand-accent/10 -z-10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <img 
                      src={robertoImg} 
                      alt="Roberto Firmino dos Santos - Especialista" 
                      className="w-full aspect-[4/5] object-cover shadow-2xl border-b-[12px] border-brand-ink"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="space-y-6">
                    <h3 className="serif text-5xl md:text-6xl text-brand-ink leading-[1.1]">Com quem você vai aprender?</h3>
                    <p className="text-xl md:text-2xl font-black text-brand-red uppercase tracking-wider">
                      Roberto Firmino dos Santos
                    </p>
                    <div className="space-y-6 text-xl md:text-2xl text-brand-ink font-light leading-relaxed">
                      <p className="font-bold border-l-4 border-brand-accent pl-6">
                        Você não vai ouvir teorias de quem leu meia dúzia de livros. Será guiada por quem saiu da faxina para mentorar bilionários.
                      </p>
                      <p>
                        São 30 anos de prática clínica unindo Constelação, Cinesiologia Aplicada e Gestão real. Ele entende a dor física porque curou centenas, e entende de dinheiro porque viveu a transformação na pele.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* FINAL CTA */}
              <section className="py-12 md:py-20 px-6 text-center bg-brand-ink text-white">
                <div className="max-w-3xl mx-auto">
                  <h2 className="serif text-4xl md:text-7xl mb-8 text-brand-accent leading-tight">O seu sistema familiar espera por coragem.</h2>
                  <p className="text-2xl text-white/60 mb-12 font-light">Essa pessoa corajosa para mudar a história de escassez e dor é você?</p>
                  <button 
                    onClick={scrollToForm}
                    className="bg-brand-accent text-white font-black px-12 py-6 rounded-none hover:bg-white hover:text-brand-ink transition-all text-base uppercase tracking-[0.4em] shadow-2xl group active:scale-95"
                  >
                    GARANTIR MINHA VAGA
                  </button>
                </div>
              </section>
            </motion.div>
          ) : (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 md:py-20 px-6 max-w-6xl mx-auto"
            >
              <div className="text-center mb-20">
                {isAlreadyRegistered && (
                  <div className="mb-8 bg-brand-petroleum-light py-4 px-8 border-l-4 border-brand-accent inline-flex items-center gap-4 text-brand-petroleum">
                    <UserCheck className="w-6 h-6" />
                    <span className="text-base font-black uppercase tracking-widest">Você já está inscrita no sistema!</span>
                  </div>
                )}
                
                <h2 className="serif text-4xl md:text-7xl mb-8 text-brand-red leading-tight font-black uppercase">
                  🚨 FALTA SÓ MAIS UM PASSO PARA CONFIRMAR SUA INSCRIÇÃO!
                </h2>
                
                <div className="max-w-3xl mx-auto p-10 bg-brand-petroleum-light shadow-sm mb-12">
                  <p className="text-xl md:text-2xl leading-relaxed text-brand-ink font-light">
                    O seu cadastro está quase pronto, mas o link da aula <strong className="text-brand-red">não será enviado por e-mail</strong>. Para evitar que você perca essa oportunidade, o acesso será liberado APENAS dentro do Grupo VIP do WhatsApp.
                  </p>
                </div>

                <a
                  href={WHATSAPP_GROUP_URL}
                  target="_blank"
                  rel="no-referrer"
                  className="inline-flex items-center justify-center bg-[#25D366] text-white font-black px-10 py-5 rounded-none hover:bg-brand-ink transition-all shadow-2xl shadow-green-500/20 text-sm md:text-lg uppercase tracking-widest active:scale-95 leading-none h-auto min-h-0"
                >
                  CONCLUIR INSCRIÇÃO
                </a>
                
                <p className="mt-8 text-sm font-bold text-brand-ink/40 uppercase tracking-widest">
                  Fique tranquila: o grupo é silenciado e só nossa equipe enviará os avisos importantes.
                </p>
              </div>

              {/* AQUECIMENTO / SEÇÃO DE VENDA DA AULA */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 border-t border-brand-ink/10 pt-20 items-start">
                <div className="space-y-10">
                  <div>
                    <span className="text-xs font-black uppercase tracking-[0.4em] text-brand-accent mb-4 block">Enquanto o dia 21/05 não chega...</span>
                    <h3 className="serif text-4xl md:text-5xl text-brand-ink leading-tight">Conheça a base do Programa: A HISTÓRIA DO DINHEIRO EM MEU SISTEMA FAMILIAR</h3>
                  </div>
                  <div className="space-y-6 text-lg md:text-xl text-brand-ink font-light leading-relaxed">
                    <p>
                      Muitas pessoas tentam trabalhar mais ou trocar de emprego para ganhar dinheiro. Outras tomam remédios fortes tentando calar a dor no corpo.
                    </p>
                    <p className="font-bold text-brand-red italic">
                      O que elas não sabem é que o prejuízo financeiro e a dor crônica vêm do mesmo bloqueio inconsciente.
                    </p>
                    <p>
                      Não é falta de sorte. Não é misticismo. É ciência sistêmica. Na nossa aula ao vivo, você vai entender a essência do método que está limpando memórias de luto, falências e segredos.
                    </p>
                  </div>
                </div>

                <div className="bg-brand-ink text-white p-10 md:p-16 shadow-2xl relative border-l-8 border-brand-accent">
                  <h4 className="serif text-3xl text-brand-accent uppercase tracking-widest mb-12">O que você vai descobrir com esse método:</h4>
                  
                  <div className="space-y-10">
                    <DiscoveryItem 
                      title="A Transição de Postura" 
                      text="Como sair da postura infantil e vitimista perante a vida e assumir a posição de adulto, o único capaz de gerar verdadeira abundância." 
                    />
                    <DiscoveryItem 
                      title="O Sintoma é um Mensageiro" 
                      text="A doença não é o problema, mas a tentativa do seu corpo de alertar que a estrutura familiar está fora de ordem." 
                    />
                    <DiscoveryItem 
                      title="Destravando a Prosperidade" 
                      text="Como limpar as memórias de luto, falências e dores do passado para não precisar repetir os fracassos dos seus antepassados por 'lealdade invisível'." 
                    />
                  </div>
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

function PillarCard({ title, text }: { title: string, text: string }) {
  return (
    <div className="p-8 bg-white shadow-xl shadow-brand-ink/5 border-t-4 border-brand-accent hover:-translate-y-2 transition-all group">
      <h4 className="serif text-2xl mb-4 text-brand-ink group-hover:text-brand-accent transition-colors">{title}</h4>
      <p className="text-base text-brand-ink/70 leading-relaxed">{text}</p>
    </div>
  );
}

function DiscoveryItem({ title, text }: { title: string, text: string }) {
  return (
    <div className="space-y-2">
      <h5 className="text-lg font-black uppercase tracking-widest text-brand-accent">/ {title}</h5>
      <p className="text-lg text-white/70 leading-relaxed font-light">{text}</p>
    </div>
  );
}

function IdentificationCard({ text }: { text: string }) {
  return (
    <div className="p-10 bg-white/5 border border-white/10 hover:border-brand-accent hover:bg-white/10 transition-all group">
      <p 
        className="text-2xl md:text-3xl font-light text-white opacity-80 group-hover:opacity-100 leading-relaxed"
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
        className="text-2xl md:text-3xl text-brand-ink/80 leading-relaxed"
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
