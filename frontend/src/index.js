import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './assets/main.css'
import reportWebVitals from './reportWebVitals';
import App from './App'
import { UserProvider } from "./context/UserContext"

const APP_NAME = "MyFinancesApp"

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
   <StrictMode>
      <UserProvider >
         <App appName={APP_NAME} />
      </UserProvider>
   </StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
