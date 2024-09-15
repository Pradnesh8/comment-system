import React, { useContext } from 'react'
import appContext from '../utils/appContext';

const Header = ({ commentsLength }) => {
    const { commentMode, setCommentMode } = useContext(appContext);
    return (
        <div className='heading'>
            {/* {commentMode} */}
            <h4>Comments ({commentsLength})</h4>
            <div className='toggler'>
                <span className={commentMode === 'latest' && 'active'} onClick={() => setCommentMode('latest')}>Latest</span>
                <span className={commentMode === 'popular' && 'active'} onClick={() => setCommentMode('popular')}>Popular</span>
            </div>
        </div>
    )
}

export default Header