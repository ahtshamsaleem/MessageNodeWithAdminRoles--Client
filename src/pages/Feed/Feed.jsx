import  axios  from '../../util/axiosInstance';
import React, { useEffect, useState } from 'react';

import Post from '../../components/Feed/Post/Post';
import Button from '../../components/Button/Button';
import FeedEdit from '../../components/Feed/FeedEdit/FeedEdit';
import Input from '../../components/Form/Input/Input';
import Paginator from '../../components/Paginator/Paginator';
import Loader from '../../components/Loader/Loader';
import ErrorHandler from '../../components/ErrorHandler/ErrorHandler';
import './Feed.css';
import { errorMsgHandler } from '../../util/errorHandler';

const Feed = (props) => {
    const [state, setState] = useState({
        isEditing: false,
        posts: [],
        totalPosts: 0,
        editPost: null,
        status: '',
        postPage: 1,
        postsLoading: true,
        editLoading: false,
    });

    useEffect(() => {
        loadPosts();
    }, [state.posts.length]);

    useEffect(() => {
        async function getStatus() {
            const { data } = await axios.get(`/auth/status`, { headers: { Authorization: 'Bearer ' + props.token }});
            setState(prev => ({...prev, status: data.status}));
            
        
        }
        getStatus();

        
    }, [])
    
    console.log(props.role);
   // console.log(state.posts)

// LOAD FEED POSTS
    const loadPosts = async (direction) => {
        let page = state.postPage;
        if (direction) {
            direction === 'next' ? page++ : direction === 'previous' ? page-- : null;
            setState(prevState => ({ ...prevState, postPage: page, postsLoading: true, }));
        }

        try {
            const { data } = await axios.get( `/feed/posts?page=${page}`, { headers: { Authorization: 'Bearer ' + props.token } } );
            setState((prevState) => ({ ...prevState, posts: data.posts, totalPosts: data.totalItems, postsLoading: false, }));
        } catch (error) {
            const errorMsg = errorMsgHandler(error);
            setState((prev) => ({ ...prev, error: { message: errorMsg } }));
        }
    };

    // STATUS UPDATE HANDLER
    const statusUpdateHandler = async (event) => {
        event.preventDefault();

        const res = await axios.patch(`/auth/status`, {status: state.status}, {headers: { Authorization: 'Bearer ' + props.token }})
        console.log(res);


    };




    const newPostHandler = () => {
        setState(p => ({ ...p, isEditing: true }));
    };



    const startEditPostHandler = (postId) => {
        setState((prevState) => {
            const loadedPost = { ...prevState.posts.find((p) => p._id === postId), };
            return { ...prevState, isEditing: true, editPost: loadedPost, };
        });
    };

    const cancelEditHandler = () => {
        setState(p => ({ ...p, isEditing: false, editPost: null }));
    };


// SAVE NEW POST HANDLer
    const finishEditHandler = async (postData) => {
        setState(prev => ({ ...prev, editLoading: true, }));

        const formData = new FormData();
        formData.append('title', postData.title);
        formData.append('content', postData.content);
        formData.append('image', postData.image);

        let resData;

        try {

            if (state.editPost) {
                resData = await axios.put( `/feed/post/${state.editPost._id}`, formData, { headers: { Authorization: `Bearer ${props.token}`, }, } );
            } else {
                resData = await axios.post( `/feed/post`, formData, { headers: { Authorization: `Bearer ${props.token}`, }, } );
            }

            const post = { _id: resData.data.post._id, title: resData.data.post.title, content: resData.data.post.content, creator: resData.data.post.creator, createdAt: resData.data.post.createdAt, };

            setState((prevState) => {
                let updatedPosts = [...prevState.posts];
                if (prevState.editPost) {
                    const postIndex = prevState.posts.findIndex(
                        (p) => p._id === prevState.editPost._id
                    );
                    updatedPosts[postIndex] = post;
                } else if (prevState.posts.length < 2) {
                    updatedPosts = prevState.posts.concat(post);
                }
                return { ...prevState, posts: updatedPosts, isEditing: false, editPost: null, editLoading: false, };
            });

        } catch (error) {
            const errorMsg = errorMsgHandler(error);
            setState(prev => ({ ...prev, isEditing: false, editPost: null, editLoading: false, error: {message: errorMsg} }));
        }
    };



    const statusInputChangeHandler = (input, value) => {
        setState(p => ({ ...p, status: value }));
    };

    // DELETE POST HANDLER
    const deletePostHandler = async (postId) => {
        setState(prev => ({ ...prev, postsLoading: true }));

        try {
            const res = await axios.delete(`/feed/post/${postId}`, {headers: { Authorization: `Bearer ${props.token}` }});
            setState((prevState) => {
            const updatedPosts = prevState.posts.filter( (p) => p._id !== postId );
            return { ...prevState, posts: updatedPosts, postsLoading: false, };
        });

        } catch (error) {
            const errorMsg = errorMsgHandler(error, 'Deleting a post failed!');
            setState((prev) => ({ ...prev, postsLoading: false, error: {message: errorMsg} }));

        }

    };



    const errorHandler = () => {
        setState(prev => ({ ...prev, error: null }));
    };

    const catchError = (error) => {
        setState(prev => ({ ...prev, error: error }));
    };

    return (
        <>
            <ErrorHandler error={state.error} onHandle={errorHandler} />
            <FeedEdit editing={state.isEditing} selectedPost={state.editPost} loading={state.editLoading} onCancelEdit={cancelEditHandler} onFinishEdit={finishEditHandler} />
            <section className='feed__status'>
                <form onSubmit={statusUpdateHandler}>
                    <Input type='text' placeholder='Your status' control='input' onChange={statusInputChangeHandler} value={state.status} />
                    <Button mode='flat' type='submit'>Update</Button>
                </form>
            </section>
            {props.role !== 'client' ? 
            <section className='feed__control'>
                <Button mode='raised' design='accent' onClick={newPostHandler}   >  New Post </Button>
            </section> :
            null}
            <section className='feed'>
                {state.postsLoading && (
                    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                        <Loader />
                    </div>
                )}
                {state.posts?.length <= 0 && !state.postsLoading ? (
                    <p style={{ textAlign: 'center' }}>No posts found.</p>
                ) : null}
                {!state.postsLoading && (
                    <Paginator
                        onPrevious={() => loadPosts('previous')}
                        onNext={() => loadPosts('next')}
                        lastPage={Math.ceil(state.totalPosts / 2)}
                        currentPage={state.postPage}
                    >
                        {state.posts?.map((post) => (
                            <Post key={post._id} id={post._id} author={post.creator.name} date={new Date( post.createdAt ).toLocaleDateString('en-US')} title={post.title} image={post.imageUrl} content={post.content} onStartEdit={() => startEditPostHandler(post._id) } onDelete={() => deletePostHandler(post._id)} role={props.role}/>
                        ))}
                    </Paginator>
                )}
            </section>
        </>
    );
};

export default Feed;
