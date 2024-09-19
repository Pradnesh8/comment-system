import React, { useContext, useState } from 'react'
import Profile from './Profile'
import userContext from "../utils/userContext";
import parse from 'html-react-parser';
import getCalculatedDateTime from '../utils/timeCalculation';
import image from './../assets/image.png'
// const ReactMarkdown = require("react-markdown/with-html"); //for displaying html
const CommentPost = ({ post }) => {
    const { content, email, name, reactions, replyFlag, userPicture, uploadDateTime } = post;
    const [reactEmoji, setReactEmoji] = useState([]);
    const { user, setUser } = useContext(userContext);
    const [days, hours, minutes, seconds] = getCalculatedDateTime(uploadDateTime, Date.now())
    const selectEmoji = (event) => {
        // console.log(event.target.innerHTML)
        const selectedEmoji = event.target.innerHTML
        const emojiObj = {}
        emojiObj[selectedEmoji] = 1
        setReactEmoji([emojiObj, ...reactEmoji])
    }
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
                    <img src={image} alt="emoji icon" className='emoji-icon' />
                    <div className='list-of-emojis' onClick={selectEmoji}>
                        <span>👍</span>
                        <span>😍</span>
                        <span>👏</span>
                        <span>😂</span>
                        <span>😈</span>
                    </div>
                </span>
                {
                    reactEmoji?.map((emoji, index) => (
                        <span className='emoji-btn'>
                            {Object.keys(emoji)[0]}{Object.values(emoji)[0]}
                        </span>
                    ))
                }
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