import React, { useContext } from 'react'
import Profile from './Profile'
import userContext from "../utils/userContext";
import parse from 'html-react-parser';
import getCalculatedDateTime from '../utils/timeCalculation';
// const ReactMarkdown = require("react-markdown/with-html"); //for displaying html
const CommentPost = ({ post }) => {
    const { content, email, name, reactions, replyFlag, userPicture, uploadDateTime } = post;
    const { user, setUser } = useContext(userContext);
    const [days, hours, minutes, seconds] = getCalculatedDateTime(uploadDateTime, Date.now())
    return (
        <div className='comment-post'>
            <Profile user={{ email, displayName: name, photoURL: userPicture }} />
            <div className='comment-content'>
                {/* <div className="ql-editor" style={{ padding: 0 }}>
                    <Markdown skipHtml={true}>{content}</Markdown>
                </div> */}
                {parse(content)}
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
                    {hours > 0 && `${hours} h`} {minutes > 0 && `${minutes} m`}  {seconds} s ago
                </span>
            </div>
            <div>Replies</div>
        </div>
    )
}

export default CommentPost