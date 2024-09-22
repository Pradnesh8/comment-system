import React, { useContext, useEffect, useState } from 'react'
import Profile from './Profile'
import userContext from "../utils/userContext";
import parse from 'html-react-parser';
import getCalculatedDateTime from '../utils/timeCalculation';
import image from './../assets/image.png'
import { storage } from "../utils/firebase.utils";
import { ref, getMetadata } from 'firebase/storage';
import { addReaction, updateReactionCount } from '../utils/firebaseDb.utils';
// const ReactMarkdown = require("react-markdown/with-html"); //for displaying html
const CommentPost = ({ post }) => {
    const { content, email, name, reactions, replyFlag, userPicture, attachmentUrl, uploadDateTime, id } = post;
    const [reactEmoji, setReactEmoji] = useState([]);
    const [previewFlag, setPreviewFlag] = useState(false);
    const [metadata, setMetadata] = useState(null);
    const { user, setUser } = useContext(userContext);
    const [days, hours, minutes, seconds] = getCalculatedDateTime(uploadDateTime, Date.now())
    // create separate db to store reactions
    // post id, user id, reaction emoji, id, timestamp
    // crate index on postid, userid for efficient lookup
    // also store reaction count in commnents collection like_count, devil_count, clap_count, etc
    const selectEmoji = (event) => {
        // console.log(event.target.innerHTML)
        const selectedEmoji = event.target.innerHTML
        const emojiObj = {}
        emojiObj[selectedEmoji] = 1
        emojiObj['email'] = user.email;
        emojiObj['name'] = user.displayName;
        emojiObj['photoURL'] = user.photoURL;
        emojiObj['postid'] = id;
        emojiObj['emoji'] = selectedEmoji;
        updateReactionCount(emojiObj)
        addReaction(emojiObj)
        setReactEmoji([emojiObj, ...reactEmoji])
    }
    const getAttachmentPreview = async () => {
        const attachmentRef = ref(storage, `${attachmentUrl}`);
        const metadata = await getMetadata(attachmentRef)
        console.log("METADATA", metadata);
        if (metadata.contentType === 'image/png' || metadata.contentType === 'image/jpg' || metadata.contentType === 'image/jpeg') {
            setPreviewFlag(true)
        }
        setMetadata(metadata)
    }
    useEffect(() => {
        attachmentUrl && getAttachmentPreview()
    }, [])
    return (
        <div className='comment-post'>
            <Profile user={{ email, displayName: name, photoURL: userPicture }} />
            <div className='comment-content'>
                {previewFlag && <img src={attachmentUrl} alt="Attachment" className='attachment-preview' style={{ height: "30vh", width: "100%" }} />}
                {!previewFlag && <a href={attachmentUrl} target='blank' ><span>{metadata?.name}</span></a>}
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