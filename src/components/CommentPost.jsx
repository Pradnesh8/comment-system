import React, { useContext, useEffect, useState } from 'react'
import Profile from './Profile'
import userContext from "../utils/userContext";
import parse from 'html-react-parser';
import getCalculatedDateTime from '../utils/timeCalculation';
import image from './../assets/image.png'
import { storage } from "../utils/firebase.utils";
import { ref, getMetadata } from 'firebase/storage';
import { addReaction, decrementReactionCount, deleteReaction, getEmojiText, getReactions, getReplyCommentsByParentId, updateReactionCount } from '../utils/firebaseDb.utils';
import toast from 'react-hot-toast';
import CommentBox from './CommentBox';
// const ReactMarkdown = require("react-markdown/with-html"); //for displaying html
const CommentPost = ({ post }) => {
    const { content, email, name, reactions, replyFlag, userPicture, attachmentUrl, uploadDateTime, id, parentPostId,
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
    const [addReplyFlag, setAddReplyFlag] = useState(false)
    const [days, hours, minutes, seconds] = getCalculatedDateTime(uploadDateTime, Date.now())
    const enableReply = () => {
        setAddReplyFlag(!addReplyFlag);
    }

    const getPostReplies = async () => {
        // console.log("called search reply")
        const obj = {}
        obj['parentPostId'] = id
        const foundReplies = await getReplyCommentsByParentId(obj);
        // console.log("FOUND replies", foundReplies)
        setReplies(foundReplies)
        if (addReplyFlag) setAddReplyFlag(!addReplyFlag)
    }
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

    // create separate db to store reactions
    // post id, user id, reaction emoji, id, timestamp
    // crate index on postid, userid for efficient lookup
    // also store reaction count in commnents collection like_count, devil_count, clap_count, etc
    const selectEmoji = async (event) => {
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
        // console.log("Selected", selectedEmoji, selectedReaction)
        const getEmojiTextVal = getEmojiText(selectedEmoji) + "_count";
        const tempObj = { ...reactEmoji }
        if ((selectedEmoji === selectedReaction) && selectedReaction !== '') {
            // call delete reaction
            const isDeleted = await deleteReaction(emojiObj)
            if (isDeleted) {
                // setSelectedReaction('');
                const decrement = await decrementReactionCount(emojiObj);
                if (!decrement) {
                    toast("Something went wrong")
                    return
                }
                tempObj[getEmojiTextVal] = tempObj[getEmojiTextVal] - 1
                setReactEmoji({ ...tempObj })
            }
            else toast("Something went wrong")
        }
        else if ((selectedEmoji !== selectedReaction) && selectedReaction !== '') {
            // call delete reaction
            const isDeleted = await deleteReaction(emojiObj)
            if (isDeleted) {
                // setSelectedReaction('');
                emojiObj['emoji'] = selectedReaction; // => to decrement previously selected emoji count
                const decrement = await decrementReactionCount(emojiObj);
                if (!decrement) {
                    toast("Something went wrong")
                    return
                }
                let getEmojiTextOldVal = getEmojiText(selectedReaction) + "_count";
                tempObj[getEmojiTextOldVal] = tempObj[getEmojiTextOldVal] - 1
                emojiObj['emoji'] = selectedEmoji; // => to increment newly selected emoji count
                const updated = await updateReactionCount(emojiObj)
                if (!updated) {
                    toast("Something went wrong")
                    return
                }
                const added = await addReaction(emojiObj)
                if (added === "") {
                    toast("Something went wrong")
                    return
                }
                // console.log("TEMPOBJ", tempObj)
                tempObj[getEmojiTextVal] = tempObj[getEmojiTextVal] + 1
                setReactEmoji({ ...tempObj })
            }
            else toast("Something went wrong")
        }
        else {
            const updated = await updateReactionCount(emojiObj)
            if (!updated) {
                toast("Something went wrong")
                return
            }
            const added = await addReaction(emojiObj)
            if (added === "") {
                toast("Something went wrong")
                return
            }
            // console.log("TEMPOBJ", tempObj)
            tempObj[getEmojiTextVal] = tempObj[getEmojiTextVal] + 1
            setReactEmoji({ ...tempObj })
        }
        getSelectedEmoji()
    }
    const getAttachmentPreview = async () => {
        const attachmentRef = ref(storage, `${attachmentUrl}`);
        const metadata = await getMetadata(attachmentRef)
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

        const selected = getSelectedReaction(reaction)
        setSelectedReaction(selected)
    }
    useEffect(() => {
        attachmentUrl && getAttachmentPreview();
        getPostReplies();
    }, [])
    useEffect(() => {
        getSelectedEmoji();
    }, [user])
    return (
        <div className='comment-post'>
            <Profile user={{ email, displayName: name, photoURL: userPicture }} />
            <div className='comment-content'>
                {previewFlag && <img src={attachmentUrl} alt="Attachment" className='attachment-preview' style={{ height: "30vh", width: "100%" }} />}
                {!previewFlag && <a href={attachmentUrl} target='blank' ><span>{metadata?.name}</span></a>}

                {parse(content)}
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
                <span className='reply-btn-post' onClick={enableReply}>
                    Reply
                </span>
                |
                <span className='time-since-post'>
                    {days > 0 && `${days} d`} {hours > 0 && `${hours} h`} {minutes > 0 && `${minutes} m`}  {seconds} s ago
                </span>
            </div>
            {
                addReplyFlag &&
                <div style={{ width: "100%" }}>
                    <CommentBox onAddComment={getPostReplies} parentId={id} isReply={true} />
                </div>
            }
            {
                // render replies
                replies?.map((post, id) => (
                    <div style={{ width: "100%" }}>
                        <CommentPost key={post.uploadDateTime} post={post} />
                    </div>
                ))

            }
        </div>
    )
}

export default CommentPost