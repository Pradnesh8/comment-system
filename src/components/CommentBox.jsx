import React, { useContext, useRef, useState } from 'react'
import { addComment, getUserNamesBySearch } from '../utils/firebaseDb.utils';
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
const CommentBox = ({ onAddComment, isReply, parentId }) => {
    const [content, setContent] = useState("");
    const { user } = useContext(userContext);
    const [openAttachFile, setOpenAttachFile] = useState(false)

    const [fileUpload, setFileUpload] = useState(null);
    // const [fileUrls, setFileUrls] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [cursorPosition, setCursorPosition] = useState(null);
    const quillRef = useRef(null);
    const handleChange = async (value, delta, source, editor) => {
        setContent(value);

        const cursorPosition = editor.getSelection()?.index;
        const textBeforeCursor = editor.getText(0, cursorPosition);

        const atIndex = textBeforeCursor.lastIndexOf("@");
        if (atIndex !== -1) {
            const query = textBeforeCursor.substring(atIndex + 1);
            const suggestionList = await getUserNamesBySearch(query)
            // console.log("suggestions", suggestionList)
            const matchingSuggestions = suggestionList.map((s) => {
                return {
                    name: s.name,
                    userPicture: s.userPicture
                }
            }
            );
            setFilteredSuggestions(matchingSuggestions);
            setShowSuggestions(true);
            setCursorPosition(atIndex + 1); // position after "@"
        } else {
            setShowSuggestions(false);
        }
    };
    // Insert suggestion at cursor position
    const handleSuggestionClick = (suggestion) => {
        const editor = quillRef.current.getEditor();
        const currentContent = editor.getText(0);

        // Replace "@" and text after it with the suggestion
        const contentBeforeAt = currentContent.substring(0, cursorPosition - 1);
        const contentAfterAt = currentContent.substring(
            cursorPosition + suggestion.length
        );

        const updatedContent = `${contentBeforeAt}@${suggestion} ${contentAfterAt}`;

        setContent(updatedContent);
        editor.setText(updatedContent); // Update the editor content
        setShowSuggestions(false);
    };
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
                replyFlag: isReply,
                parentPostId: parentId || '',
                attachmentUrl: attachmentUrl,
                photoURL: user.photoURL,
                uploadDateTime: Date.now()
            }
            const res = await addComment(commentInput);
            // console.log("res from add comment", res);
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
            <ReactQuill ref={quillRef} theme="snow" value={content} onChange={handleChange} />
            {showSuggestions && (
                <ul
                    style={{
                        position: "absolute",
                        top: "80%", // Adjust based on editor height
                        left: "5%", // Adjust as per requirements
                        backgroundColor: "white",
                        border: "1px solid #ccc",
                        listStyle: "none",
                        padding: 0,
                        margin: 0,
                        zIndex: 10,
                    }}
                >
                    {filteredSuggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion.name)}
                            style={{
                                padding: "5px 10px",
                                cursor: "pointer",
                            }}
                        >
                            <div className="profile-name-dp">
                                <span className="pic">
                                    <img src={suggestion.userPicture} alt="profile photo" className="profile-img" />
                                </span>
                                <span className="uname">
                                    {suggestion.name}
                                </span>
                            </div>

                        </li>
                    ))}
                </ul>
            )}
            {openAttachFile && <input type="file" name="upload-file" id="upload-file" onChange={(e) => setFileUpload(e.target.files[0])} />}
            <div className='commentSendBtn-container'>
                <button className='attachFileBtn' onClick={toggleAttachFile}>
                    {
                        openAttachFile ? 'Discard file' : 'Attach file'
                    }
                </button>
                <button className='commentSendBtn' onClick={finalContent}>Send</button>
            </div>
        </div>
    )
}

export default CommentBox