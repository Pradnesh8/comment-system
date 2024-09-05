import React from 'react'
import TextEditor from './Texteditor'

const CommentBox = () => {

    return (
        <div className='comment-box'>
            <TextEditor />
            {/* <textarea name="comment-textfield" rows={4} className="comment-textfield"></textarea> */}
            <hr />
            <div className='action-bar'>
                <div className='text-decoration-bar'>
                    <span><b>B</b></span>
                    <span>I</span>
                    <span>U</span>
                    <span><i className="fa-solid fa-paperclip"></i></span>
                </div>
                <button className='send-comment-btn'>Send</button>
            </div>
        </div>
    )
}

export default CommentBox