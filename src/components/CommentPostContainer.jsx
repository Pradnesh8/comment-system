import React from 'react'
import CommentPost from './CommentPost';
import Header from './Header';
import CommentBox from './CommentBox';
const CommentPostContainer = () => {
    return (
        <div className='container'>
            <Header />
            <CommentBox />
            {
                new Array(9).fill("").map((post, id) => (
                    <div key={id}>
                        <CommentPost />
                    </div>
                ))
            }
        </div>
    )
}

export default CommentPostContainer