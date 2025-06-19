
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface HistoryEntry {
  id: string;
  query: string;
  response: any;
  timestamp: Date;
  type: 'query' | 'question_generation';
}

export interface SavedTopic {
  id: string;
  title: string;
  query: string;
  response: any;
  savedAt: Date;
}

interface AppContextType {
  history: HistoryEntry[];
  savedTopics: SavedTopic[];
  addToHistory: (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => void;
  saveTopic: (topic: Omit<SavedTopic, 'id' | 'savedAt'>) => void;
  removeSavedTopic: (id: string) => void;
  getHistoryByDate: (date: string) => HistoryEntry[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [savedTopics, setSavedTopics] = useState<SavedTopic[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('eduMentor_history');
    const savedTopicsData = localStorage.getItem('eduMentor_savedTopics');
    
    if (savedHistory) {
      const parsedHistory = JSON.parse(savedHistory).map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp)
      }));
      setHistory(parsedHistory);
    }
    
    if (savedTopicsData) {
      const parsedTopics = JSON.parse(savedTopicsData).map((item: any) => ({
        ...item,
        savedAt: new Date(item.savedAt)
      }));
      setSavedTopics(parsedTopics);
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('eduMentor_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('eduMentor_savedTopics', JSON.stringify(savedTopics));
  }, [savedTopics]);

  const addToHistory = (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => {
    const newEntry: HistoryEntry = {
      ...entry,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date()
    };
    setHistory(prev => [newEntry, ...prev]);
  };

  const saveTopic = (topic: Omit<SavedTopic, 'id' | 'savedAt'>) => {
    const newTopic: SavedTopic = {
      ...topic,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      savedAt: new Date()
    };
    setSavedTopics(prev => [newTopic, ...prev]);
  };

  const removeSavedTopic = (id: string) => {
    setSavedTopics(prev => prev.filter(topic => topic.id !== id));
  };

  const getHistoryByDate = (date: string) => {
    return history.filter(entry => 
      entry.timestamp.toDateString() === new Date(date).toDateString()
    );
  };

  return (
    <AppContext.Provider value={{
      history,
      savedTopics,
      addToHistory,
      saveTopic,
      removeSavedTopic,
      getHistoryByDate
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
