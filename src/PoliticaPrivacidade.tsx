import { ArrowLeft } from 'lucide-react';

export default function PoliticaPrivacidade() {
  return (
    <div className="min-h-screen bg-brand-petroleum text-white">
      <header className="bg-brand-ink/50 py-6 px-8 border-b border-white/10 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <a href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-brand-accent transition-colors text-sm font-black uppercase tracking-widest">
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 md:p-12">
        <div className="prose prose-invert prose-brand prose-lg w-full max-w-none">
          <h1 className="serif text-4xl md:text-5xl mb-12 uppercase tracking-widest text-[#FF4D00]">Política de Privacidade</h1>
          
          <div className="space-y-12 text-white/80 leading-relaxed font-light">
            <p className="text-xl">Seus dados são tratados com o máximo rigor e segurança, em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).</p>
            
            <section className="bg-white/5 p-8 border border-white/10 shadow-xl">
              <h4 className="text-[#FF4D00] font-black uppercase tracking-widest text-sm mb-4">1. Coleta de Dados</h4>
              <p>Coletamos seu nome, e-mail e número de WhatsApp exclusivamente para garantir seu acesso ao evento "Os 5 Pilares da Vida Saudável" e para enviar comunicações relevantes sobre o método sistêmico.</p>
            </section>

            <section className="bg-white/5 p-8 border border-white/10 shadow-xl">
              <h4 className="text-[#FF4D00] font-black uppercase tracking-widest text-sm mb-4">2. Finalidade</h4>
              <p>O tratamento dos dados visa:</p>
              <ul className="list-disc pl-5 mt-4 space-y-2 opacity-80">
                <li>Enviar o link de acesso às aulas;</li>
                <li>Enviar materiais complementares;</li>
                <li>Informar sobre futuros treinamentos e mentorias de Roberto Firmino dos Santos.</li>
              </ul>
            </section>

            <section className="bg-white/5 p-8 border border-white/10 shadow-xl">
              <h4 className="text-[#FF4D00] font-black uppercase tracking-widest text-sm mb-4">3. Seus Direitos</h4>
              <p>Você tem total direito de solicitar a exclusão de seus dados, retificação ou revogação do consentimento a qualquer momento. Basta entrar em contato através do e-mail: <a href="mailto:robertofirmino.suporte@gmail.com" className="text-brand-accent hover:underline">robertofirmino.suporte@gmail.com</a>.</p>
            </section>

            <section className="bg-white/5 p-8 border border-white/10 shadow-xl">
              <h4 className="text-[#FF4D00] font-black uppercase tracking-widest text-sm mb-4">4. Segurança</h4>
              <p>Utilizamos tecnologias de mercado para proteger suas informações contra acessos não autorizados. Seus dados nunca serão vendidos ou compartilhados com terceiros para fins comerciais alheios a este programa.</p>
            </section>
          </div>
        </div>
      </main>

      <footer className="bg-brand-ink py-10 mt-20 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6 text-center text-[11px] font-black uppercase tracking-widest opacity-30">
          <p>© 2026 • Os 5 Pilares da Vida Saudável</p>
        </div>
      </footer>
    </div>
  );
}
