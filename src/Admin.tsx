import { useState, useEffect } from 'react';
import { db, auth } from './lib/firebase';
import { collection, query, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { Loader2, LogOut, FileDown, RefreshCw, Mail, Phone, Calendar, User as UserIcon, Lock } from 'lucide-react';
import { format } from 'date-fns';

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const [inscricoes, setInscricoes] = useState<any[]>([]);
  const [fetchingInscricoes, setFetchingInscricoes] = useState(false);

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
    } catch (err: any) {
      console.error(err);
      if (err.message.includes('permission-denied')) {
        setAuthError('Você não tem permissão para visualizar os inscritos.');
      } else {
        setAuthError('Erro ao carregar inscritos.');
      }
    } finally {
      setFetchingInscricoes(false);
    }
  };

  const exportCSV = () => {
    const headers = ['Nome', 'Email', 'WhatsApp', 'Data de Inscrição'];
    const rows = inscricoes.map(i => [
      i.nome,
      i.email,
      i.whatsapp,
      i.createdAt ? format(i.createdAt.toDate(), 'dd/MM/yyyy HH:mm:ss') : 'N/A'
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
          <div className="flex gap-4">
            <div className="bg-white p-6 shadow-sm border border-black/5 min-w[200px] border-l-4 border-brand-accent">
              <p className="text-[11px] font-black uppercase tracking-widest text-black/40 mb-1">Total de Inscritos</p>
              <p className="text-4xl font-black text-brand-ink">{inscricoes.length}</p>
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

        <div className="bg-white shadow-sm border border-black/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#FAFAFA] border-b border-black/5 text-[11px] font-black uppercase tracking-widest text-black/40">
                <tr>
                  <th className="p-5 font-bold">Nome</th>
                  <th className="p-5 font-bold">Email</th>
                  <th className="p-5 font-bold">WhatsApp</th>
                  <th className="p-5 font-bold">Data</th>
                </tr>
              </thead>
              <tbody>
                {inscricoes.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-black/40">
                      {fetchingInscricoes ? 'Carregando...' : 'Nenhum inscrito ainda.'}
                    </td>
                  </tr>
                ) : (
                  inscricoes.map((inscrito, index) => (
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
