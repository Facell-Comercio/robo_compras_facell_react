import {Outlet, Navigate} from 'react-router-dom';
import { useAuthStore } from '@/context/auth-store';
import { useEffect } from 'react';
import { api } from '@/helper/api';
import { AxiosError } from 'axios';
import { jwtDecode } from 'jwt-decode';

const PrivateRoutes = ()=>{
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
        user ? <Navigate to="/login" /> : <Navigate to="/login" />
        // user ? <Outlet /> : <Navigate to="/login" />
    )
}

export default PrivateRoutes