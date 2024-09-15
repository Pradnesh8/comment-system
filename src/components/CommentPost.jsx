import React, { useContext } from 'react'
import Profile from './Profile'
import userContext from "../utils/userContext";
// import { displayName } from 'react-quill';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
// import { ReactMarkdown } from 'react-markdown/with-html'
import Markdown from 'react-markdown'
import parse from 'html-react-parser';
// const ReactMarkdown = require("react-markdown/with-html"); //for displaying html
const CommentPost = ({ post }) => {
    const { content, email, name, reactions, replyFlag, userPicture } = post;
    const { user, setUser } = useContext(userContext);
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
                    6 hour
                </span>
            </div>
            <div>Replies</div>
        </div>
    )
}

export default CommentPost