import React, { useContext, useState } from 'react'
import { addComment } from '../utils/firebaseDb.utils';
import userContext from '../utils/userContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const CommentBox = () => {
    const [content, setContent] = useState("");
    const { user } = useContext(userContext);
    const finalContent = () => {
        // console.log("final content", finalContent)
        // setContent(finalContent);
        addCommentToDB()
    }
    const addCommentToDB = async () => {
        if (content === '') {
            alert("Please add content in comment")
            return
        }
        // data : 
        // name: data.name,
        // email: data.email,
        // content: data.content,
        // reactions: [],
        // replyFlag: data.replyFlag
        console.log("USER", user)
        try {
            const commentInput = {
                name: user.displayName,
                email: user.email,
                content: content,
                reactions: [],
                replyFlag: false,
                photoURL: user.photoURL
            }
            const res = await addComment(commentInput);
            console.log("res from add comment", res);
            if (!res) {
                alert("Error adding comment, Please try again!")
            } else {
                console.log("Comment added successfully")
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    return (
        <div className='comment-box'>
            <ReactQuill theme="snow" value={content} onChange={setContent} />
            <div className='commentSendBtn-container'>
                <button className='commentSendBtn' onClick={finalContent}>Send</button>
            </div>
            {/* <TextEditor finalContent={finalContent} /> */}
            {/* <textarea name="comment-textfield" rows={4} className="comment-textfield" onChange={(e) => setContent(e.target.value)}></textarea>
            <hr />
            <div className='action-bar'>
                <div className='text-decoration-bar'>
                    <span><b>B</b></span>
                    <span>I</span>
                    <span>U</span>
                    <span><i className="fa-solid fa-paperclip"></i></span>
                </div>
                <button className='send-comment-btn' onClick={addCommentToDB}>Send</button>
            </div> */}
        </div>
    )
}

export default CommentBox