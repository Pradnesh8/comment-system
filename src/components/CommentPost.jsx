import React, { useContext } from 'react'
import Profile from './Profile'
import userContext from "../utils/userContext";
const CommentPost = () => {
    const { user, setUser } = useContext(userContext);
    return (
        <div className='comment-post'>
            <Profile user={user} />
            <div className='comment-content'>
                Actually, now that I try out the links on my message, above,
                none of them take me to the secure site. Only my shortcut
                on my desktop, which I created years ago.

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