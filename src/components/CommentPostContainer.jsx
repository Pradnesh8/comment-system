import React, { useEffect, useState } from 'react'
import CommentPost from './CommentPost';
import Header from './Header';
import CommentBox from './CommentBox';
import { getComments } from '../utils/firebaseDb.utils';
const CommentPostContainer = () => {
    const [commentPosts, setCommentPosts] = useState([]);
    const getCommentsFromDb = async () => {
        try {
            const res = await getComments();
            setCommentPosts(res)
            console.log("Fetched comments successfully")
            console.log("Comments", commentPosts);
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getCommentsFromDb();
    }, []);
    return (
        <div className='container'>
            <Header commentsLength={commentPosts.length} />
            <CommentBox />
            {
                commentPosts.map((post, id) => (
                    <CommentPost post={post} />
                ))
            }
        </div>
    )
}

export default CommentPostContainer