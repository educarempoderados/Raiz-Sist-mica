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
        source: 'A Historia do Dinheiro',
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
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[1.05] text-brand-ink tracking-tight uppercase flex flex-col gap-1 md:gap-2">
                    <span className="text-[#FF4D00]">A HISTÓRIA DO DINHEIRO</span>
                    <span className="text-[#808000]">EM MEU SISTEMA FAMILIAR</span>
                  </h1>
                  <p className="mt-6 text-lg md:text-xl text-brand-ink/80 font-medium max-w-3xl mx-auto">
                    Descubra a raiz sistêmica dos seus bloqueios financeiros e como a história da sua família afeta sua prosperidade hoje.
                  </p>
                </div>

                <div className="max-w-md mx-auto">
                  
                  {/* FORM ON THE LEFT */}
                  <div id="inscricao-form" className="relative group w-full">
                    <div className="absolute -inset-2 bg-blue-500/20 rounded-2xl blur-2xl group-hover:bg-blue-500/30 transition-all opacity-0 group-hover:opacity-100" />
                    <form 
                      onSubmit={handleSubmit(onSubmit)} 
                      className="bg-[#003B95] text-white p-8 md:p-10 shadow-[0_20px_60px_-15px_rgba(0,59,149,0.4)] rounded-2xl relative border border-white/10"
                    >
                      <div className="text-center mb-8">
                        <div className="bg-brand-red text-white border border-brand-red/20 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] py-1.5 px-4 mb-4 rounded-full inline-flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                          🔥 Grupo Exclusivo Gratuito - Participe Agora
                        </div>
                        <h2 className="text-2xl md:text-4xl font-black mb-3 text-white leading-tight">CADASTRE-SE AGORA</h2>
                        <p className="text-white/80 text-[13px] md:text-sm font-medium leading-relaxed px-4">
                          Preencha e garanta seu acesso gratuito ao nosso grupo exclusivo.
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
                              <ArrowRight className="w-5 h-5" /> QUERO ENTRAR NO GRUPO EXCLUSIVO
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

                </div>
              </section>
            </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-[#808000] py-24 px-6 text-white overflow-hidden relative">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-[11px] font-black uppercase tracking-widest opacity-70 border-t border-white/10 pt-10">
            <p>© 2026 • A História do Dinheiro em Meu Sistema Familiar</p>
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
