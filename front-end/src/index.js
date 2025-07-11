import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { store } from './redux/store'
import { Provider } from 'react-redux'
import 'antd/dist/antd.min.js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Tạo một instance của QueryClient
const queryClient = new QueryClient();
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <Provider store={store}>  {/* Redux Provider */}
    <QueryClientProvider client={queryClient}>  {/* React Query Provider */}
      <App />
    </QueryClientProvider>
  </Provider>
  // </React.StrictMode>
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
