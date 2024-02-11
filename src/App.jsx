import React, { Fragment, useEffect, useState } from 'react';
import { Route, Navigate, Routes, useNavigate, Link } from 'react-router-dom';
import { withRouter } from './util/withRouter';
import axios from 'axios';

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

const App = (props) => {
    const [state, setState] = useState({
        showBackdrop: false,
        showMobileNav: false,
        isAuth: false,
        token: null,
        userId: null,
        authLoading: false,
        error: null,
    });

    const navigate = useNavigate()

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
        const remainingMilliseconds =
            new Date(expiryDate).getTime() - new Date().getTime();
        setState({...state, isAuth: true, token: token, userId: userId });
        setAutoLogout(remainingMilliseconds);
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
        setState({...state, isAuth: false, token: null });
        localStorage.removeItem('token');
        localStorage.removeItem('expiryDate');
        localStorage.removeItem('userId');
    };







   // LOGIN HANDLER
    const loginHandler = async ({email, password}) => {
        setState(prev => ({...prev, authLoading: true }));
        
        try {
            const {data} = await axios.post('http://localhost:8080/auth/login', {email, password});
            console.log(data)
            setState(prev => ({...prev, isAuth: true, token: data.token, authLoading: false, userId: data.userId }));

            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.userId);
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
        const res = await axios.put('http://localhost:8080/auth/signup', { email, password, name });
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
                <Route path='/' element={ <FeedPage userId={state.userId} token={state.token} /> } />
                <Route path='/:postId' element={ <SinglePostPage userId={state.userId} token={state.token} /> } />
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
                        <MainNavigation onOpenMobileNav={() => mobileNavHandler(true)} onLogout={logoutHandler} isAuth={state.isAuth} />
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
