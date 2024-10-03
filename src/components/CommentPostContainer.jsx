import React, { useContext, useEffect, useState } from 'react'
import CommentPost from './CommentPost';
import Header from './Header';
import CommentBox from './CommentBox';
import { getComments } from '../utils/firebaseDb.utils';
import ReactPaginate from 'react-paginate';
import appContext from '../utils/appContext';
const CommentPostContainer = () => {
    const [commentPosts, setCommentPosts] = useState([]);
    // Here we use item offsets; we could also use page offsets
    // following the API or data you're working with.
    const [itemOffset, setItemOffset] = useState(0);
    const [currentItems, setCurrentItems] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const itemsPerPage = 8;
    const { commentMode, setCommentMode } = useContext(appContext);


    // Invoke when user click to request another page.
    const handlePageClick = (event) => {
        console.log(event);
        const newOffset = (event.selected * itemsPerPage) % commentPosts.length;
        console.log(
            `User requested page number ${event.selected}, which is offset ${newOffset}`
        );
        setItemOffset(newOffset);
        // setPagination(commentPosts)
    };
    const setPagination = (items) => {
        // Simulate fetching items from another resources.
        // (This could be items from props; or items loaded in a local state
        // from an API endpoint with useEffect and useState)
        const endOffset = itemOffset + itemsPerPage;
        console.log(`Loading items from ${itemOffset} to ${endOffset}`);
        const getCurrentItems = items.slice(itemOffset, endOffset);
        setCurrentItems(getCurrentItems);
        const getPageCount = Math.ceil(items.length / itemsPerPage);
        setPageCount(getPageCount);
    }
    const getPopularity = (post) => {
        return parseInt(post?.like_count) +
            parseInt(post?.love_count) +
            parseInt(post?.clap_count) +
            parseInt(post?.laugh_count) +
            parseInt(post?.devil_count)
    }
    const getCommentsFromDb = async () => {
        try {
            const res = await getComments();
            if (commentMode === 'latest') {
                res.sort((a, b) => b.uploadDateTime - a.uploadDateTime)
            } else {
                res.sort((a, b) => getPopularity(b) - getPopularity(a))
            }
            setCommentPosts(res)
            console.log("Fetched comments successfully")
            // console.log("Comments", commentPosts);
            setPagination(res);
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getCommentsFromDb();
    }, [commentMode]);
    // to update page after on click of page number
    useEffect(() => {
        setPagination(commentPosts);
    }, [itemOffset])
    return (
        <div className='container'>
            <Header commentsLength={commentPosts.length} />
            {/* rerender comments on add */}
            <CommentBox onAddComment={getCommentsFromDb} parentId={''} isReply={false} />
            <>
                {commentPosts.length === 0 && <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 1rem' }}>No comments posted</div>}
                {/* Paginated posts */}
                {
                    currentItems?.map((post, id) => (
                        !post?.replyFlag && <CommentPost key={post.uploadDateTime} post={post} />
                    ))
                }
                {/* {JSON.stringify(commentPosts)} */}
                {
                    <ReactPaginate
                        breakLabel="..."
                        nextLabel=">"
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={5}
                        pageCount={pageCount}
                        previousLabel="<"
                        renderOnZeroPageCount={null}
                        marginPagesDisplayed={5}
                        containerClassName="pagination justify-content-center"
                        pageClassName="page-item"
                        pageLinkClassName="page-link"
                        previousClassName="page-item"
                        previousLinkClassName="page-link"
                        nextClassName="page-item"
                        nextLinkClassName="page-link"
                        activeClassName="active"
                    />
                }
            </>
        </div >
    )
}

export default CommentPostContainer