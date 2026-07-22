import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "antd/dist/reset.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from './context';
import { MatchesProvider } from './context/MatchContext';
import { FeedbackProvider } from './context/FeedbackContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>  
      <MatchesProvider>
        <FeedbackProvider>
            <App />
            <ToastContainer position='bottom-center' />
        </FeedbackProvider>   
        </MatchesProvider>  
    </AuthProvider>
  </React.StrictMode>
);

