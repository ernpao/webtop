import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import OllamaChat from './pages/OllamaChat';
import reportWebVitals from './reportWebVitals';
import { RouterProvider, createBrowserRouter } from 'react-router';
import App from './App';
import Layout from './layouts/Layout';
import Dashboard from './pages/Dashboard';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter([
  {
    Component: App,
    children: [
      {
        path: '/chat_gpt_clone',
        Component: Layout,
        children: [
          {
            index: true,
            Component: OllamaChat,
          },
          {
            path: '/chat_gpt_clone/dashboard',
            Component: Dashboard,
          },
        ],
      },
    ],
  },
]);


root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
