import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

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

    useEffect(async () => {
        try {
            const res = await axios.get(`http://localhost:8080/feed/post/${postId}`, {headers: {
            Authorization: `Bearer ${props.token}`
            }});
            if (res.status !== 200) {
                throw new Error('Failed to fetch status');
            }

            setState({
                title: res.post.title,
                author: res.post.creator.name,
                image: 'http://localhost:8080/' + res.post.imageUrl,
                date: new Date(res.post.createdAt).toLocaleDateString( 'en-US' ),
                content: res.post.content,
            });
            
        } catch (error) {
            console.log(error);
            
        }
    }, []);




















































    // useEffect(() => {
    //     fetch('http://localhost:8080/feed/post/' + postId)
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
    //                 image: 'http://localhost:8080/' + resData.post.imageUrl,
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
