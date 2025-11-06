import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext();

const initialState = {
  assignments: [],
  submissions: [],
  loading: false,
  error: null
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_ASSIGNMENTS':
      return { ...state, assignments: action.payload, loading: false };
    case 'ADD_ASSIGNMENT':
      return { ...state, assignments: [...state.assignments, action.payload] };
    case 'SET_SUBMISSIONS':
      return { ...state, submissions: action.payload, loading: false };
    case 'ADD_SUBMISSION':
      return { ...state, submissions: [...state.submissions, action.payload] };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const createAssignment = (assignment) => {
    const newAssignment = {
      ...assignment,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    dispatch({ type: 'ADD_ASSIGNMENT', payload: newAssignment });
  };

  const submitAssignment = (submission) => {
    const newSubmission = {
      ...submission,
      id: Date.now().toString(),
      submittedAt: new Date().toISOString()
    };
    dispatch({ type: 'ADD_SUBMISSION', payload: newSubmission });
  };

  const value = {
    ...state,
    createAssignment,
    submitAssignment
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};