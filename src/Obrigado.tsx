import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserCheck, AlertCircle } from 'lucide-react';

const WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/LHOEUdVmQqA9MAfML9KlP7";

function DiscoveryItem({ title, text }: { title: string, text: string }) {
  return (
    <div className="space-y-2">
      <h5 className="text-lg font-black uppercase tracking-widest text-brand-accent">/ {title}</h5>
      <p className="text-lg text-white/70 leading-relaxed font-light">{text}</p>
    </div>
  );
}

export default function Obrigado() {
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);
  const [activeModal, setActiveModal] = useState<'terms' | null>(null);

  useEffect(() => {
    const data = localStorage.getItem('inscricao_pilares_saudaveis');
    if (data) {
      setIsAlreadyRegistered(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white relative overflow-x-hidden selection:bg-brand-accent/20 font-sans text-brand-ink">
      <div className="bg-brand-red text-white text-center py-4 px-4 text-xs md:text-base font-black tracking-widest uppercase sticky top-0 z-50 shadow-lg">
         🗓 MasterClass Gratuita em Breve
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
              className="inline-flex items-center justify-center bg-[#25D366] text-white font-black px-6 py-2 rounded-none hover:bg-brand-ink transition-all shadow-2xl shadow-green-500/20 text-sm md:text-lg uppercase tracking-widest active:scale-95 leading-none h-auto min-h-0"
            >
              CONCLUIR INSCRIÇÃO
            </a>
            
            <p className="mt-8 text-sm font-bold text-brand-ink/40 uppercase tracking-widest">
              Fique tranquila: o grupo é silenciado e só nossa equipe enviará os avisos importantes.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 border-t border-brand-ink/10 pt-20 items-start">
            <div className="space-y-10">
              <div>
                <span className="text-xs font-black uppercase tracking-[0.4em] text-brand-accent mb-4 block">Enquanto a data não chega...</span>
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
      </main>

      <footer className="bg-brand-ink py-24 px-6 text-white overflow-hidden relative">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 items-start mb-20 border-b border-white/10 pb-20">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.4em] text-brand-accent mb-6">Data Reservada</p>
              <p className="serif text-3xl">Em Breve</p>
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
                  <div className="space-y-6 text-sm text-brand-ink/70 leading-relaxed font-medium">
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
