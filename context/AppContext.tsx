import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { AppConfig } from '../types';

interface AppContextType {
  config: AppConfig;
  refreshConfig: () => Promise<void>;
  loading: boolean;
}

const defaultConfig: AppConfig = {
  app_name: 'Pharmelo',
  logo_url: '',
  twitter_url: '#',
  instagram_url: '#',
  linkedin_url: '#',
  contact_email: 'pharmeloshop@gmail.com'
};

const AppContext = createContext<AppContextType>({
  config: defaultConfig,
  refreshConfig: async () => {},
  loading: true
});

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<AppConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);

  const fetchConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('app_config')
        .select('*')
        .limit(1)
        .single();

      if (data) {
        setConfig(data);
      }
    } catch (error) {
      console.error('Error fetching app config:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  return (
    <AppContext.Provider value={{ config, refreshConfig: fetchConfig, loading }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppConfig = () => useContext(AppContext);