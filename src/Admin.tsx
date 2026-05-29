import React, { useState, useEffect } from 'react';
import { db, auth } from './lib/firebase';
import { collection, query, getDocs, orderBy, Timestamp, deleteDoc, doc } from 'firebase/firestore';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { Loader2, LogOut, FileDown, RefreshCw, Mail, Phone, Calendar, User as UserIcon, Lock, Trash2, CheckCircle2, XCircle, Search, Filter, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility for Tailwind class merging
 */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const [inscricoes, setInscricoes] = useState<any[]>([]);
  const [fetchingInscricoes, setFetchingInscricoes] = useState(false);
  const [stats, setStats] = useState({ homeVisits: 0, obrigadoVisits: 0, whatsappClicks: 0 });
  const [filtroGrupo, setFiltroGrupo] = useState<'TODOS' | 'ENTROU' | 'NAO_ENTROU'>('TODOS');
  const [busca, setBusca] = useState('');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      if (u) {
        fetchInscricoes();
      }
    });
    return () => unsub();
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Ocorreu um erro na autenticação.');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setInscricoes([]);
  };

  const fetchInscricoes = async () => {
    setFetchingInscricoes(true);
    try {
      const q = query(collection(db, 'inscricoes'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setInscricoes(data);

      const qStats = query(collection(db, 'analytics_events'));
      const statsSnapshot = await getDocs(qStats);
      let homeVisits = 0;
      let obrigadoVisits = 0;
      let whatsappClicks = 0;

      statsSnapshot.forEach(doc => {
        const item = doc.data();
        if (item.type === 'EXIBICAO_PAGINA') {
          if (item.path === '/') homeVisits++;
          if (item.path === '/obrigado') obrigadoVisits++;
        }
        if (item.type === 'CLIQUE_WHATSAPP') {
          whatsappClicks++;
        }
      });
      setStats({ homeVisits, obrigadoVisits, whatsappClicks });

    } catch (err: any) {
      console.error(err);
      if (err.message.includes('permission-denied')) {
        setAuthError('Você não tem permissão para visualizar os dados.');
      } else {
        setAuthError('Erro ao carregar dados.');
      }
    } finally {
      setFetchingInscricoes(false);
    }
  };

  const handleWhatsAppMessage = (inscrito: any) => {
    let msg = '';
    if (inscrito.entrouGrupo) {
      msg = `Olá ${inscrito.nome}, vi que você se inscreveu na Masterclass e já está no nosso grupo VIP! Seja bem-vindo(a)!`;
    } else {
      msg = `Olá ${inscrito.nome}, vi que você se inscreveu na Masterclass! Ainda não entrou no grupo VIP? Acesse este link para não perder nada: https://chat.whatsapp.com/LHOEUdVmQqA9MAfML9KlP7`;
    }
    
    const to = inscrito.whatsapp.replace(/\D/g, '');
    const url = `https://wa.me/${to}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleDelete = async (id: string, nome: string) => {
    if (window.confirm(`Tem certeza que deseja excluir '${nome}'?`)) {
      try {
        await deleteDoc(doc(db, 'inscricoes', id));
        setInscricoes(prev => prev.filter(i => i.id !== id));
      } catch (err: any) {
        console.error('Erro ao excluir:', err);
        alert('Falha ao excluir o registro.');
      }
    }
  };

  const filteredInscricoes = inscricoes.filter(i => {
    const matchBusca = i.nome?.toLowerCase().includes(busca.toLowerCase()) || i.email?.toLowerCase().includes(busca.toLowerCase()) || i.whatsapp?.includes(busca);
    if (filtroGrupo === 'ENTROU') return matchBusca && i.entrouGrupo;
    if (filtroGrupo === 'NAO_ENTROU') return matchBusca && !i.entrouGrupo;
    return matchBusca;
  });

  const exportCSV = () => {
    const headers = ['Nome', 'Email', 'WhatsApp', 'Data de Inscrição', 'Entrou no Grupo'];
    const rows = filteredInscricoes.map(i => [
      i.nome,
      i.email,
      i.whatsapp,
      i.createdAt ? format(i.createdAt.toDate(), 'dd/MM/yyyy HH:mm:ss') : 'N/A',
      i.entrouGrupo ? 'Sim' : 'Nao'
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `inscricoes_${format(new Date(), 'dd-MM-yyyy')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-ink">
        <Loader2 className="w-12 h-12 text-brand-accent animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-brand-petroleum flex items-center justify-center px-4">
        <div className="bg-brand-ink text-white p-10 max-w-md w-full shadow-2xl border-t-8 border-brand-accent">
          <div className="text-center mb-8">
            <Lock className="w-12 h-12 text-brand-accent mx-auto mb-4" />
            <h2 className="serif text-3xl mb-2 text-brand-accent">Área Administrativa</h2>
            <p className="text-white/60 font-light text-sm uppercase tracking-widest">{isRegistering ? 'Criar Primeira Conta' : 'Fazer Login'}</p>
          </div>
          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-white/60">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-white/10 border border-white/20 px-5 py-4 focus:border-brand-accent outline-none transition-all placeholder:text-white/20"
                placeholder="admin@exemplo.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-white/60">Senha</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-white/10 border border-white/20 px-5 py-4 focus:border-brand-accent outline-none transition-all placeholder:text-white/20"
                placeholder="******"
                required
              />
            </div>
            {authError && <p className="text-brand-red text-xs font-bold uppercase">{authError}</p>}
            <button
              type="submit"
              className="w-full bg-brand-accent text-white font-black py-4 uppercase tracking-widest hover:bg-white hover:text-brand-ink transition-all shadow-xl active:scale-95"
            >
              {isRegistering ? 'Criar Conta' : 'Entrar'}
            </button>
            
            <button 
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
              className="w-full text-[11px] font-bold uppercase tracking-wider text-white/40 hover:text-brand-accent transition-colors pt-4"
            >
              {isRegistering ? 'Já tenho uma conta? Entrar' : 'Não tenho conta? Criar acesso único'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-brand-ink">
      <header className="bg-brand-ink text-white py-6 px-8 flex justify-between items-center shadow-lg sticky top-0 z-50">
        <div>
          <h1 className="serif text-2xl md:text-3xl font-black tracking-tight text-white m-0">Inscritos</h1>
          <p className="text-brand-accent text-xs uppercase tracking-widest font-bold mt-1">Visão Geral de Leads</p>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-sm font-medium text-white/60 hidden md:inline">{user.email}</span>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-white/60 hover:text-brand-red transition-colors text-xs font-black uppercase tracking-widest"
          >
            <LogOut className="w-5 h-5" /> Sair
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 md:p-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div className="flex flex-wrap gap-4">
            <div className="bg-white p-6 shadow-sm border border-black/5 min-w-[180px] border-l-4 border-brand-accent">
              <p className="text-[11px] font-black uppercase tracking-widest text-black/40 mb-1">Total de Inscritos</p>
              <p className="text-4xl font-black text-brand-ink">{inscricoes.length}</p>
            </div>
            <div className="bg-white p-6 shadow-sm border border-black/5 min-w-[180px] border-l-4 border-brand-ink">
              <p className="text-[11px] font-black uppercase tracking-widest text-black/40 mb-1">Acessos à Página</p>
              <p className="text-4xl font-black text-brand-ink">{stats.homeVisits}</p>
            </div>
            <div className="bg-white p-6 shadow-sm border border-black/5 min-w-[180px] border-l-4 border-[#25D366]">
              <p className="text-[11px] font-black uppercase tracking-widest text-black/40 mb-1">Entraram no WhatsApp</p>
              <p className="text-4xl font-black text-brand-ink">{stats.whatsappClicks}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={fetchInscricoes}
              className="flex items-center gap-2 bg-white text-brand-ink px-6 py-3 border border-black/10 hover:border-brand-accent font-bold text-xs uppercase tracking-widest shadow-sm transition-all hover:bg-black/5 active:scale-95"
            >
              <RefreshCw className={cn("w-4 h-4", fetchingInscricoes && "animate-spin")} /> Atualizar
            </button>
            <button 
              onClick={exportCSV}
              className="flex items-center gap-2 bg-brand-ink text-white px-6 py-3 hover:bg-brand-accent font-bold text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95"
            >
              <FileDown className="w-4 h-4" /> Exportar CSV
            </button>
          </div>
        </div>

        <div className="mb-6 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-black/40" />
            <input 
              type="text" 
              placeholder="Buscar por nome, e-mail ou whatsapp..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
              className="w-full bg-white border border-black/10 pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-brand-ink focus:ring-1 focus:ring-brand-ink transition-all"
            />
          </div>
          <div className="flex bg-white border border-black/10 rounded-sm">
            <button
              onClick={() => setFiltroGrupo('TODOS')}
              className={cn("px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all border-r border-black/10", filtroGrupo === 'TODOS' ? "bg-brand-ink text-white" : "bg-transparent text-black/60 hover:text-black")}
            >
              Todos
            </button>
            <button
              onClick={() => setFiltroGrupo('ENTROU')}
              className={cn("px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all border-r border-black/10 flex items-center gap-2", filtroGrupo === 'ENTROU' ? "bg-brand-ink text-white" : "bg-transparent text-black/60 hover:text-black")}
            >
               <CheckCircle2 className="w-3 h-3" /> No Grupo
            </button>
            <button
              onClick={() => setFiltroGrupo('NAO_ENTROU')}
              className={cn("px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2", filtroGrupo === 'NAO_ENTROU' ? "bg-brand-ink text-white" : "bg-transparent text-black/60 hover:text-black")}
            >
               <XCircle className="w-3 h-3" /> Não Entrou
            </button>
          </div>
        </div>

        <div className="bg-white shadow-sm border border-black/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#FAFAFA] border-b border-black/5 text-[11px] font-black uppercase tracking-widest text-black/40">
                <tr>
                  <th className="p-5 font-bold">Nome</th>
                  <th className="p-5 font-bold">Email</th>
                  <th className="p-5 font-bold">WhatsApp</th>
                  <th className="p-5 font-bold">Data</th>
                  <th className="p-5 font-bold">Grupo WhatsApp</th>
                  <th className="p-5 font-bold text-right">Ação</th>
                </tr>
              </thead>
              <tbody>
                {filteredInscricoes.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-black/40">
                      {fetchingInscricoes ? 'Carregando...' : 'Nenhum inscrito encontrado.'}
                    </td>
                  </tr>
                ) : (
                  filteredInscricoes.map((inscrito, index) => (
                    <tr key={inscrito.id} className="border-b border-black/5 hover:bg-brand-accent/5 transition-colors">
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-brand-ink/5 flex items-center justify-center text-brand-accent">
                            <UserIcon className="w-4 h-4" />
                          </div>
                          <span className="font-bold text-brand-ink">{inscrito.nome}</span>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-2 text-black/60">
                          <Mail className="w-4 h-4 opacity-50" />
                          <a href={`mailto:${inscrito.email}`} className="hover:text-brand-accent transition-colors">{inscrito.email}</a>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-2 text-black/60">
                          <Phone className="w-4 h-4 opacity-50" />
                          <a href={`https://wa.me/55${inscrito.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="hover:text-brand-accent transition-colors font-medium">
                            {inscrito.whatsapp}
                          </a>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-2 text-black/40 text-xs font-semibold uppercase tracking-wider">
                          <Calendar className="w-4 h-4" />
                          {inscrito.createdAt ? format(inscrito.createdAt.toDate(), 'dd/MM/yy HH:mm') : '-'}
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-2">
                          {inscrito.entrouGrupo ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-[10px] font-black uppercase tracking-widest border border-green-200">
                              <CheckCircle2 className="w-3 h-3" /> Sim
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-[10px] font-black uppercase tracking-widest border border-red-200">
                              <XCircle className="w-3 h-3" /> Não
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleWhatsAppMessage(inscrito)}
                            className="bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest"
                            title="Enviar WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" /> Mensagem
                          </button>
                          <button
                            onClick={() => handleDelete(inscrito.id, inscrito.nome)}
                            className="text-black/30 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-black/5 inline-flex items-center justify-center"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
