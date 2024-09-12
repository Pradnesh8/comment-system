import React, { useContext } from 'react'
import Profile from './Profile'
import userContext from "../utils/userContext";
import { displayName } from 'react-quill';
const CommentPost = ({ post }) => {
    const { content, email, name, reactions, replyFlag, userPicture } = post;
    const { user, setUser } = useContext(userContext);
    return (
        <div className='comment-post'>
            <Profile user={{ email, displayName: name, photoURL: userPicture }} />
            <div className='comment-content'>{content}
                <span className='show-more-btn'><br />show more</span>
            </div>
            {/* Footer - emoji icon | reply | time since post */}
            <div className='post-footer'>
                <span className='emoji-btn'>
                    😀
                </span>
                |
                <span className='reply-btn-post'>
                    Reply
                </span>
                |
                <span className='time-since-post'>
                    6 hour
                </span>
            </div>
            <div>Replies</div>
        </div>
    )
}

export default CommentPost