import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate, Link } from 'react-router-dom';

import axios from './util/axiosInstance'

import Layout from './components/Layout/Layout';
import Backdrop from './components/Backdrop/Backdrop';
import Toolbar from './components/Toolbar/Toolbar';
import MainNavigation from './components/Navigation/MainNavigation/MainNavigation';
import MobileNavigation from './components/Navigation/MobileNavigation/MobileNavigation';
import ErrorHandler from './components/ErrorHandler/ErrorHandler';
import FeedPage from './pages/Feed/Feed';
import SinglePostPage from './pages/Feed/SinglePost/SinglePost';
import LoginPage from './pages/Auth/Login';
import SignupPage from './pages/Auth/Signup';
import './App.css';
import Users from './pages/Users/Users';

const App = (props) => {
    const navigate = useNavigate();
    const [state, setState] = useState({
        showBackdrop: false,
        showMobileNav: false,
        isAuth: false,
        token: null,
        userId: null,
        authLoading: false,
        error: null,
        role: null
    });


    

    
    useEffect(() => {
        const token = localStorage.getItem('token');
        const expiryDate = localStorage.getItem('expiryDate');
        if (!token || !expiryDate) {
            return;
        }
        if (new Date(expiryDate) <= new Date()) {
            logoutHandler();
            return;
        }
        const userId = localStorage.getItem('userId');
        const role = localStorage.getItem('role');
        const remainingMilliseconds =
            new Date(expiryDate).getTime() - new Date().getTime();
        setAutoLogout(remainingMilliseconds);
        
        
        setState({...state, isAuth: true, token: token, userId: userId, role: role });

    }, []);





    const mobileNavHandler = (isOpen) => {
        setState({...state, showMobileNav: isOpen, showBackdrop: isOpen });
    };

    const backdropClickHandler = () => {
        setState({...state,
            showBackdrop: false,
            showMobileNav: false,
            error: null,
        });
    };

    const logoutHandler = () => {
        setState({...state, isAuth: false, token: null, role: null });
        localStorage.removeItem('token');
        localStorage.removeItem('expiryDate');
        localStorage.removeItem('userId');

        return navigate('/');
    };







   // LOGIN HANDLER
    const loginHandler = async ({email, password}) => {
        setState(prev => ({...prev, authLoading: true }));
        
        try {
            const {data} = await axios.post('/auth/login', {email, password});
            console.log(data)
            setState(prev => ({...prev, isAuth: true, token: data.token, authLoading: false, userId: data.userId, role:data.role }));

            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('role', data.role);
            const remainingMilliseconds = 60 * 60 * 1000;
            const expiryDate = new Date( new Date().getTime() + remainingMilliseconds );
            localStorage.setItem('expiryDate', expiryDate.toISOString());
            setAutoLogout(remainingMilliseconds);

        } catch (error) {
            console.log(error)
            let errorObj = error.response ? error.response.data : error
            setState(prev => ({...prev, isAuth: false, authLoading: false, error: errorObj }));

        }
    };







// SIGN UP HANDLER
const signupHandler = async ({email, password, name}) => {
    setState(prev => ({...prev, authLoading: true }));

    try {
        const res = await axios.put('/auth/signup', { email, password, name });
        setState(prev => ({...prev, isAuth: false, authLoading: false }));
        navigate('/');
        
    } catch (error) {
        console.log(error);
        let errorMsg;
        

        if(error.response) {
            error.response?.data.status === 422 ? errorMsg = "Validation failed. Make sure the email address isn't used yet!"
            : error.response?.data.status !== 200 && error.response?.data.status !== 201 ? errorMsg = 'Creating a user failed!'
            : null

        } else {
            errorMsg = error.message;
        }
        console.log(errorMsg);
        setState(prev => ({ ...prev, isAuth: false, authLoading: false, error: {message: errorMsg} }));
    }

}

    






    const setAutoLogout = (milliseconds) => {
        setTimeout(() => {
            logoutHandler();
        }, milliseconds);
    };

    const errorHandler = () => {
        setState({...state, error: null });
    };



    
    // ROUTES

    let routes = (
        <Routes>
            <Route path='/' element={ <LoginPage onLogin={loginHandler} loading={state.authLoading} /> } />
            <Route path='/signup' element={ <SignupPage onSignup={signupHandler} loading={state.authLoading} /> } />
           
            
        </Routes>
    );
    if (state.isAuth) {
        routes = (
            <Routes>
                <Route path='/' element={ <FeedPage userId={state.userId} token={state.token} role={state.role}/> } />
                <Route path='/:postId' element={ <SinglePostPage userId={state.userId} token={state.token} role={state.token}/> } />
                <Route path='/users' element={ <Users isAuth={state.isAuth} role={state.role}  token={state.token}/> }/> 
            </Routes>
        );


    }
    


    return (
        <>
            {state.showBackdrop && ( <Backdrop onClick={backdropClickHandler} /> )}
            <ErrorHandler error={state.error} onHandle={errorHandler} />
            <Layout 
                header={
                    <Toolbar>
                        <MainNavigation onOpenMobileNav={() => mobileNavHandler(true)} onLogout={logoutHandler} isAuth={state.isAuth} role= {state.role}/>
                    </Toolbar>
                }
                mobileNav={
                    <MobileNavigation open={state.showMobileNav} mobile onChooseItem={() => mobileNavHandler(false)} onLogout={logoutHandler} isAuth={state.isAuth} />
                }
            />
            {routes}
        </>
    );
};

export default App;
