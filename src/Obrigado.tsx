import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserCheck, AlertCircle } from 'lucide-react';
import { db } from './lib/firebase';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

const WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/LHOEUdVmQqA9MAfML9KlP7";

export default function Obrigado() {
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);
  const [activeModal, setActiveModal] = useState<'terms' | null>(null);

  useEffect(() => {
    // Log page view
    const logVisit = async () => {
      try {
        await addDoc(collection(db, 'analytics_events'), {
          type: 'EXIBICAO_PAGINA',
          path: '/obrigado',
          createdAt: serverTimestamp()
        });
      } catch (err) {
        console.error("Erro ao registrar acesso", err);
      }
    };
    logVisit();

    const data = localStorage.getItem('inscricao_pilares_saudaveis');
    if (data) {
      setIsAlreadyRegistered(true);
    }
  }, []);

  const handleWhatsAppClick = async () => {
    try {
      await addDoc(collection(db, 'analytics_events'), {
        type: 'CLIQUE_WHATSAPP',
        path: '/obrigado',
        createdAt: serverTimestamp()
      });

      const data = localStorage.getItem('inscricao_pilares_saudaveis');
      if (data) {
        const inscricao = JSON.parse(data);
        if (inscricao.id) {
          const docRef = doc(db, 'inscricoes', inscricao.id);
          await updateDoc(docRef, { entrouGrupo: true, updatedAt: serverTimestamp() });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-x-hidden selection:bg-brand-accent/20 font-sans text-brand-ink">
      <div className="bg-brand-red text-white text-center py-4 px-4 text-xs md:text-base font-black tracking-widest uppercase sticky top-0 z-50 shadow-lg">
         GRUPO EXCLUSIVO GRATUITO | A HISTÓRIA DO DINHEIRO EM MEU SISTEMA FAMILIAR
      </div>

      <main className="relative z-10 w-full overflow-hidden">
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
                <span className="text-base font-black uppercase tracking-widest">Sua inscrição já consta no sistema!</span>
              </div>
            )}
            
            <div className="relative mb-12 pt-6">
              <div className="inline-flex flex-col items-center justify-center space-y-8">
                <div className="relative">
                   <div className="absolute -inset-4 bg-brand-red/10 blur-xl rounded-full animate-pulse"></div>
                   <div className="w-20 h-20 bg-brand-red text-white shadow-[0_0_40px_rgba(255,77,0,0.3)] rounded-full flex items-center justify-center relative z-10 animate-bounce">
                     <AlertCircle className="w-10 h-10" />
                   </div>
                </div>
                <h2 className="serif text-3xl md:text-4xl lg:text-5xl text-brand-ink leading-tight font-black uppercase max-w-4xl mx-auto px-4">
                  Falta só <span className="text-brand-red pb-1 border-b-4 border-brand-red">mais um passo</span> para confirmar sua inscrição!
                </h2>
              </div>
            </div>
            
            <div className="max-w-3xl mx-auto p-8 md:p-10 bg-[#f4fce3] border border-[#d2e8ab] border-l-8 border-l-[#808000] rounded-r-2xl mb-12 relative overflow-hidden shadow-lg">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#808000]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
              <p className="text-xl md:text-2xl leading-relaxed text-brand-ink font-medium relative z-10">
                O seu cadastro está quase pronto. Para não perder nada, os comunicados, o acesso, os avisos VIP e <strong className="font-black text-[#4e4e00] uppercase tracking-wide bg-[#808000]/10 px-2 py-1 mx-1 rounded whitespace-nowrap">conteúdos exclusivos</strong> serão liberados APENAS dentro do nosso Grupo do WhatsApp.
              </p>
            </div>

            <a
              href={WHATSAPP_GROUP_URL}
              target="_blank"
              onClick={handleWhatsAppClick}
              rel="no-referrer"
              className="group relative inline-flex items-center justify-center bg-[#25D366] text-white font-black px-12 py-6 rounded-2xl hover:bg-[#20bd5a] transition-all duration-300 shadow-[0_0_40px_rgba(37,211,102,0.4)] hover:shadow-[0_0_60px_rgba(37,211,102,0.8)] hover:-translate-y-1 hover:scale-105 text-xl md:text-2xl uppercase tracking-[0.2em] overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 w-0 group-hover:w-full transition-all duration-500 ease-out opacity-0 group-hover:opacity-100" />
              <span className="relative z-10 flex items-center gap-3">
                CONCLUIR INSCRIÇÃO
              </span>
            </a>
            
            <p className="mt-8 text-sm font-bold text-brand-ink/40 uppercase tracking-widest">
              Não se preocupe: o grupo é silenciado e só nossa equipe enviará os avisos importantes.
            </p>
          </div>

          <div className="max-w-4xl mx-auto border-t border-brand-ink/10 pt-20 text-center">
            <div className="space-y-10">
              <div>
                <span className="text-xs font-black uppercase tracking-[0.4em] text-brand-accent mb-4 block">E no nosso grupo exclusivo...</span>
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
                  Não é falta de sorte. Não é misticismo. É ciência sistêmica. No nosso grupo exclusivo, você vai entender a essência do método que está limpando memórias de luto, falências e segredos familiares.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

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

              {activeModal === 'terms' && (
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
