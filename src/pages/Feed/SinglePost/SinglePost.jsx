import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../../util/axiosInstance';

import Image from '../../../components/Image/Image';
import './SinglePost.css';

const SinglePost = (props) => {
    const [state, setState] = useState({
        title: '',
        author: '',
        date: '',
        image: '',
        content: '',
    });

    const { postId } = useParams();

    useEffect(() => {
        const singlePost = async () => {
            try {
                const res = await axios.get(`/feed/post/${postId}`, {headers: {
                Authorization: `Bearer ${props.token}`
                }});
                if (res.status !== 200) {
                    throw new Error('Failed to fetch status');
                }
                
                setState({
                    title: res.data.post.title,
                    author: res.data.post.creator.name,
                    image: `${axios.defaults.baseURL}/` + res.data.post.imageUrl,
                    date: new Date(res.data.post.createdAt).toLocaleDateString( 'en-US' ),
                    content: res.data.post.content,
                });
                
            } catch (error) {
                console.log(error);
                
            }
        }

        singlePost();
    }, []);




















































    // useEffect(() => {
    //     fetch('/feed/post/' + postId)
    //         .then((res) => {
    //             console.log(res);
    //             if (res.status !== 200) {
    //                 throw new Error('Failed to fetch status');
    //             }
    //             return res.json();
    //         })
    //         .then((resData) => {
    //             console.log(resData);

    //             setState({
    //                 title: resData.post.title,
    //                 author: resData.post.creator.name,
    //                 image: '/' + resData.post.imageUrl,
    //                 date: new Date(resData.post.createdAt).toLocaleDateString(
    //                     'en-US'
    //                 ),
    //                 content: resData.post.content,
    //             });
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         });
    // }, []);

    return (
        <section className='single-post'>
            <h1>{state.title}</h1>
            <h2>
                Created by {state.author} on {state.date}
            </h2>
            <div className='single-post__image'>
                <Image contain imageUrl={state.image} />
            </div>
            <p>{state.content}</p>
        </section>
    );
};

export default SinglePost;
