import React, { useEffect, useState } from 'react'
import CommentPost from './CommentPost';
import Header from './Header';
import CommentBox from './CommentBox';
import { getComments } from '../utils/firebaseDb.utils';
import ReactPaginate from 'react-paginate';
const CommentPostContainer = () => {
    const [commentPosts, setCommentPosts] = useState([]);
    // Here we use item offsets; we could also use page offsets
    // following the API or data you're working with.
    const [itemOffset, setItemOffset] = useState(0);
    const [currentItems, setCurrentItems] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const itemsPerPage = 5;


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
    const getCommentsFromDb = async () => {
        try {
            const res = await getComments();
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
    }, []);
    // to update page after on click of page number
    useEffect(() => {
        setPagination(commentPosts);
    }, [itemOffset])
    return (
        <div className='container'>
            <Header commentsLength={commentPosts.length} />
            <CommentBox />
            <>
                {/* Paginated posts */}
                {
                    currentItems?.map((post, id) => (
                        <CommentPost key={post.name + id} post={post} />
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
        </div>
    )
}

export default CommentPostContainer