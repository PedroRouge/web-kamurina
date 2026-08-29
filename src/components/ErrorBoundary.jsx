import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary capturó un error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-xl mx-auto my-12 p-8 bg-stone-900 border border-stone-800 rounded-3xl text-center space-y-4">
          <div className="text-4xl">⚠️</div>
          <h2 className="text-xl font-bold text-white">Hubo un problema al cargar esta sección</h2>
          <p className="text-stone-400 text-xs leading-relaxed">
            {this.state.error?.message || 'Ocurrió un error inesperado al renderizar la vista.'}
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="bg-white text-stone-950 font-bold px-4 py-2 rounded-xl text-xs hover:bg-stone-200 transition-colors"
            >
              Reintentar
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-stone-800 text-stone-300 font-medium px-4 py-2 rounded-xl text-xs hover:bg-stone-700 transition-colors border border-stone-700"
            >
              Recargar Página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
