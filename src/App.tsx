import { useEffect } from 'react';
import './App.css'
import { Toaster } from "./components/ui/toaster";
import { useAuthStore } from './context/auth-store';
import PrivateRoutes from './pages/PrivateRoutes';
import { jwtDecode } from 'jwt-decode';
import { AxiosError } from 'axios';
import Home from './pages/Home';
import Login from './pages/Login';
import { api } from './helper/api';

function App() {
  const user = useAuthStore(state=>state.user);
  const token = useAuthStore(state=>state.token);
  const login = useAuthStore(state=>state.login)
  const logout = useAuthStore(state=>state.logout)

  useEffect(()=>{
      api
      .get('auth/validar-token')
      .then(()=>{
          const decodedToken = jwtDecode(token || '')
          // @ts-ignore
          login({token: token || '', user: decodedToken.user})
      }) 
      .catch((error:AxiosError)=>{
          if(error.response?.status == 401){
              logout()
          }else{
              console.log('ERRO-PRIVATE-ROUTES-LOGIN-VALIDATE:', error)
          }
      })
  }, [])

  return (
    <>
      {user ? <Home /> : <Login/>}
    <Toaster/>
    </>
  )
}

export default App
