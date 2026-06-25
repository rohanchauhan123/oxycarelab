import React from 'react';
import { RefreshCcw, AlertTriangle, Home, Trash2 } from 'lucide-react';
import Button from '../ui/Button';
import Dexie from 'dexie';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Global Error Boundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    // Clear potentially corrupt data
    const keysToClear = [
      'oxycare_user',
      'oxycare_packages',
      'oxycare_labs',
      'oxycare_tests',
      'oxycare_testCategories',
      'oxycare_addresses',
      'oxycare_members',
      'oxycare_users',
      'oxycare_bookings',
      'oxycare_cart',
      'oxycare_offers',
      'oxycare_blogs',
      'oxycare_jobApplications',
      'oxycare_partnerships',
      'oxycare_callbackRequests',
      'oxycare_slots',
      // Clear hydration flags too
      'oxycare_packages_hydrated',
      'oxycare_labs_hydrated',
      'oxycare_tests_hydrated',
      'oxycare_testCategories_hydrated',
      'oxycare_blogs_hydrated',
      'oxycare_offers_hydrated',
      'oxycare_cities_hydrated'
    ];
    keysToClear.forEach(key => localStorage.removeItem(key));
    // Reload the application
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-display">
          <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl border border-gray-100 p-10 text-center animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-bounce">
              <AlertTriangle size={40} />
            </div>
            
            <h1 className="text-3xl font-black text-dark-text mb-4">Oops! Something went wrong</h1>
            <p className="text-grey-text mb-8 text-sm leading-relaxed">
              The application encountered an unexpected error. This is often caused by incompatible data in your browser's storage.
            </p>

            <div className="space-y-4">
              <Button 
                onClick={this.handleReset}
                className="w-full h-14 bg-medical-green hover:bg-medical-green/90 text-white rounded-2xl font-black uppercase tracking-widest gap-2 shadow-lg shadow-medical-green/20"
              >
                <RefreshCcw size={18} /> Repair & Restart
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/'}
                className="w-full h-14 border-gray-200 text-dark-text rounded-2xl font-black uppercase tracking-widest gap-2"
              >
                <Home size={18} /> Go to Home
              </Button>

              <div className="pt-4 border-t border-gray-100 mt-4">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Persistent Issues?</p>
                <button
                    onClick={async () => {
                        if (window.confirm("NUCLEAR RESET: This will delete the entire local database (Cart, Bookings, etc.) and reset the app. Proceed?")) {
                            try {
                                localStorage.clear();
                                const db = new Dexie('OxyCareLabsDB');
                                await db.delete();
                                window.location.href = '/';
                            } catch (e) {
                                console.error("Reset failed:", e);
                                window.location.href = '/';
                            }
                        }
                    }}
                    className="w-full py-3 bg-red-50 text-red-500 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                    <Trash2 size={14} /> Full Factory Reset
                </button>
              </div>
            </div>

            {import.meta.env.DEV && (
              <div className="mt-8 p-4 bg-gray-100 rounded-2xl text-left overflow-auto max-h-40">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Error Details (Dev Only)</p>
                <code className="text-[10px] text-red-500 font-mono break-all font-bold">
                  {this.state.error?.toString()}
                </code>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
