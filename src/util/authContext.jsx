import React, { useEffect, useState } from "react";




export const AuthContext = React.createContext({});


export const AuthProvider = ({children}) => {

    const [userId, setUserId] = useState()
    const [isAuth, setIsAuth] = useState(false)
    const [role, setRole] = useState('');
    const [token, setToken] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        const expiryDate = localStorage.getItem('expiryDate');
        const role = localStorage.getItem('role');
        if (!token || !expiryDate) {
            return;
        }
        if (new Date(expiryDate) <= new Date()) {
            logoutHandler();
            return;
        }
        const userId = localStorage.getItem('userId');
        const remainingMilliseconds = new Date(expiryDate).getTime() - new Date().getTime();
        
        console.log('items set in authcontext');
        
        setUserId(userId);
        setIsAuth(true);
        setRole(role);
        setToken(token);

        setAutoLogout(remainingMilliseconds);
    }, []);


    const logoutHandler = () => {
        setUserId(null);
        setIsAuth(false);
        setRole('');
        setToken(null);

        localStorage.removeItem('token');
        localStorage.removeItem('expiryDate');
        localStorage.removeItem('userId');
        localStorage.removeItem('role');
    };


    
    const setAutoLogout = (milliseconds) => {
        setTimeout(() => {
            logoutHandler();
        }, milliseconds);
    };




    return (
        <>
            <AuthContext.Provider value={{
                userId:userId,
                isAuth:isAuth,
                token:token,
                role: role
            }}>
            {children}

            </AuthContext.Provider>
        </>
    )
}

