import React, { useContext, useState } from 'react'
import { addComment } from '../utils/firebaseDb.utils';
import userContext from '../utils/userContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import toast from 'react-hot-toast';
import {
    ref,
    uploadBytes,
    getDownloadURL,
} from "firebase/storage";
import { storage } from "../utils/firebase.utils";

const CommentBox = ({ onAddComment }) => {
    const [content, setContent] = useState("");
    const { user } = useContext(userContext);
    const [openAttachFile, setOpenAttachFile] = useState(false)

    const [fileUpload, setFileUpload] = useState(null);
    // const [fileUrls, setFileUrls] = useState([]);

    // const fileListRef = ref(storage, "files/");
    const toggleAttachFile = () => {
        if (openAttachFile) setFileUpload(null)
        setOpenAttachFile(!openAttachFile)
    }
    const uploadFile = async () => {
        if (fileUpload == null) return "";
        try {
            const fileRef = ref(storage, `files/${fileUpload.name + crypto.randomUUID()}`);
            const snapshot = await uploadBytes(fileRef, fileUpload)
            const url = await getDownloadURL(snapshot.ref)
            return url
        } catch (err) {
            console.log(err);
            toast('Error while attaching file')
            return "";
        }
    };

    const finalContent = async () => {
        if (!(user?.email?.length > 0)) {
            // alert('Please sign in to post a comment')
            toast('Please sign in to post a comment')
            return
        }
        if (content === '') {
            // alert("Please add content in comment")
            toast('Please add content in comment')
            return
        }
        const attachmentUrl = await uploadFile();
        // when attachment is not added
        if (attachmentUrl === '' && !fileUpload) {
            addCommentToDB("");
        }
        // when attachment is added
        else if (attachmentUrl !== '' && fileUpload)
            addCommentToDB(attachmentUrl)
        else {
            toast("Error adding a comment, Please try again")
        };
    }
    const addCommentToDB = async (attachmentUrl) => {
        // data : 
        // name: data.name,
        // email: data.email,
        // content: data.content,
        // reactions: [],
        // replyFlag: data.replyFlag
        try {
            const commentInput = {
                name: user.displayName,
                email: user.email,
                content: content,
                // reactions: [],
                // like_count: 0,
                // love_count: 0,
                // clap_count: 0,
                // laugh_count: 0,
                // devil_count: 0,
                replyFlag: false,
                attachmentUrl: attachmentUrl,
                photoURL: user.photoURL,
                uploadDateTime: Date.now()
            }
            const res = await addComment(commentInput);
            console.log("res from add comment", res);
            if (!res) {
                // alert("Error adding comment, Please try again!")
                toast('Error adding comment, Please try again!')
            } else {
                console.log("Comment added successfully")
                toast('Comment added')
                setContent("")
                setFileUpload(null)
                setOpenAttachFile(false)
                onAddComment();
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    return (
        <div className='comment-box'>
            {/* {JSON.stringify(fileUrls)} */}
            <ReactQuill theme="snow" value={content} onChange={setContent} />
            {openAttachFile && <input type="file" name="upload-file" id="upload-file" onChange={(e) => setFileUpload(e.target.files[0])} />}
            <div className='commentSendBtn-container'>
                <button className='attachFileBtn' onClick={toggleAttachFile}>
                    {
                        openAttachFile ? 'Discard file' : 'Attach file'
                    }
                </button>
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