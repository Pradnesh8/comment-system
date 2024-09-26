import React, { useContext, useEffect, useState } from 'react'
import Profile from './Profile'
import userContext from "../utils/userContext";
import parse from 'html-react-parser';
import getCalculatedDateTime from '../utils/timeCalculation';
import image from './../assets/image.png'
import { storage } from "../utils/firebase.utils";
import { ref, getMetadata } from 'firebase/storage';
import { addReaction, getEmojiText, getReactions, updateReactionCount } from '../utils/firebaseDb.utils';
import toast from 'react-hot-toast';
// const ReactMarkdown = require("react-markdown/with-html"); //for displaying html
const CommentPost = ({ post }) => {
    const { content, email, name, reactions, replyFlag, userPicture, attachmentUrl, uploadDateTime, id,
        // emoji count
        like_count,
        love_count,
        clap_count,
        laugh_count,
        devil_count } = post;
    const [reactEmoji, setReactEmoji] = useState({
        like_count: like_count,
        love_count: love_count,
        clap_count: clap_count,
        laugh_count: laugh_count,
        devil_count: devil_count,
    });
    const [selectedReaction, setSelectedReaction] = useState("");
    const [previewFlag, setPreviewFlag] = useState(false);
    const [metadata, setMetadata] = useState(null);
    const { user, setUser } = useContext(userContext);
    const [replies, setReplies] = useState([]);
    const [days, hours, minutes, seconds] = getCalculatedDateTime(uploadDateTime, Date.now())
    // create separate db to store reactions
    // post id, user id, reaction emoji, id, timestamp
    // crate index on postid, userid for efficient lookup
    // also store reaction count in commnents collection like_count, devil_count, clap_count, etc
    const selectEmoji = (event) => {
        if (!(user?.email?.length > 0)) {
            // alert('Please sign in to post a comment')
            toast('Please sign in to react to comment')
            return
        }
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
        const getEmojiTextVal = getEmojiText(selectedEmoji) + "_count";
        const tempObj = { ...reactEmoji }
        // console.log("TEMPOBJ", tempObj)
        tempObj[getEmojiTextVal] = tempObj[getEmojiTextVal] + 1
        setReactEmoji({ ...tempObj })
        getSelectedEmoji()
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
    const getSelectedEmoji = async () => {
        const obj = {}
        obj['postid'] = id
        obj['email'] = user.email;
        const reaction = await getReactions(obj)
        console.log("Selected reaction by user", reaction)
        const getSelectedReaction = (reaction) => {
            switch (reaction) {
                case 'like':
                    return '👍';
                case 'love':
                    return '😍';
                case 'clap':
                    return '👏';
                case 'laugh':
                    return '😂';
                case 'devil':
                    return '😈';
                default:
                    return ''

            }
        }
        setSelectedReaction(getSelectedReaction(reaction))

    }
    useEffect(() => {
        attachmentUrl && getAttachmentPreview();
        getSelectedEmoji();
    }, [user])
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
                {/* TODO: implement show more content if length is more */}
                {/* <span className='show-more-btn'><br />show more</span> */}
            </div>
            {/* Footer - emoji icon | reply | time since post */}
            <div className='post-footer'>
                <span className='emoji-btn'>
                    {
                        selectedReaction === '' &&
                        <img src={image} alt="emoji icon" className='emoji-icon' />
                    }
                    {/* Selected reaction */}
                    {
                        selectedReaction?.length > 0 &&
                        <span>{selectedReaction}</span>
                    }
                    <div className='list-of-emojis' onClick={selectEmoji}>
                        <span>👍</span>
                        <span>😍</span>
                        <span>👏</span>
                        <span>😂</span>
                        <span>😈</span>
                    </div>
                </span>
                {
                    // reactEmoji?.map((emoji, index) => (
                    //     <span className='emoji-btn'>
                    //         {Object.keys(emoji)[0]}{Object.values(emoji)[0]}
                    //     </span>
                    // ))
                    reactEmoji.like_count > 0 && (
                        <span className='emoji-btn'>👍{reactEmoji.like_count}</span>
                    )
                }
                {
                    reactEmoji.love_count > 0 && (
                        <span className='emoji-btn'>😍{reactEmoji.love_count}</span>
                    )
                }
                {
                    reactEmoji.clap_count > 0 && (
                        <span className='emoji-btn'>👏{reactEmoji.clap_count}</span>
                    )
                }
                {
                    reactEmoji.laugh_count > 0 && (
                        <span className='emoji-btn'>😂{reactEmoji.laugh_count}</span>
                    )
                }
                {
                    reactEmoji.devil_count > 0 && (
                        <span className='emoji-btn'>😈{reactEmoji.devil_count}</span>
                    )
                }
                |
                <span className='reply-btn-post'>
                    Reply
                </span>
                |
                <span className='time-since-post'>
                    {days > 0 && `${days} d`} {hours > 0 && `${hours} h`} {minutes > 0 && `${minutes} m`}  {seconds} s ago
                </span>
            </div>
            {
                replies.length > 0 &&
                <div>Replies</div>
            }
        </div>
    )
}

export default CommentPost