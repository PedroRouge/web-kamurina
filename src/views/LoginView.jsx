import React from 'react';

export default function LoginView({
  isLoginView,
  setIsLoginView,
  loginUser,
  setLoginUser,
  loginPass,
  setLoginPass,
  error,
  handleEmailAuth,
  handleGoogleLogin,
  handleKeyDownEnter
}) {
  return (
    <div translate="no" className="notranslate min-h-screen bg-stone-950 text-white flex items-center justify-center p-4 md:p-8 font-sans">
      <div className={`p-6 md:p-8 rounded-3xl w-full max-w-sm backdrop-blur-xl transition-all duration-500 border ${isLoginView ? 'bg-stone-900/40 border-stone-800' : 'bg-stone-900/60 border-stone-600 shadow-2xl shadow-stone-800/50'}`}>
        
        <h1 className="text-3xl font-bold mb-1 text-center tracking-tighter">
          {isLoginView ? 'Atelier Kamurina' : 'Nueva Cuenta'}
        </h1>
        <p className="text-center text-stone-400 text-sm mb-8 transition-opacity">
          {isLoginView ? 'Ingresa para continuar' : 'Regístrate para solicitar pedidos'}
        </p>
        
        <form onSubmit={handleEmailAuth} onKeyDown={handleKeyDownEnter} className="space-y-4">
          <input 
            type="email"
            placeholder="Correo electrónico" 
            value={loginUser}
            onChange={(e) => setLoginUser(e.target.value)}
            className="w-full bg-stone-950 p-3 rounded-xl border border-stone-800 outline-none focus:border-stone-500 transition-colors" 
            required 
          />
          <input 
            type="password" 
            placeholder="Contraseña" 
            value={loginPass}
            onChange={(e) => setLoginPass(e.target.value)}
            className="w-full bg-stone-950 p-3 rounded-xl border border-stone-800 outline-none focus:border-stone-500 transition-colors" 
            required 
          />
          {error && <p className="text-red-400 text-xs text-center">{error}</p>}
          
          <button 
            type="submit" 
            className={`w-full py-3 rounded-xl font-bold transition-all duration-300 ${isLoginView ? 'bg-white text-stone-950 hover:bg-stone-200' : 'bg-stone-800 text-white hover:bg-stone-700 border border-stone-600'}`}
          >
            {isLoginView ? 'Iniciar Sesión' : 'Registrarme'}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center space-x-2">
          <div className="h-px bg-stone-800 w-full"></div>
          <span className="text-xs text-stone-500 uppercase tracking-widest">O</span>
          <div className="h-px bg-stone-800 w-full"></div>
        </div>

        <button 
          onClick={handleGoogleLogin} 
          type="button" 
          className="w-full mt-6 bg-stone-950 text-white py-3 rounded-xl font-bold border border-stone-800 hover:bg-stone-900 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continuar con Google
        </button>

        <p className="mt-6 text-center text-sm text-stone-400">
          {isLoginView ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
          <button 
            onClick={() => setIsLoginView(!isLoginView)} 
            className="text-white hover:underline font-bold transition-colors"
          >
            {isLoginView ? 'Regístrate aquí' : 'Inicia sesión'}
          </button>
        </p>

      </div>
    </div>
  );
}
