import React from 'react'

const Profile = ({ user }) => {
    return (
        <div className="profile-name-dp">
            <span className="pic">
                <img src={user?.photoURL} alt="profile photo" className="profile-img" />
            </span>
            <span className="uname">
                {user?.displayName}
            </span>
        </div>
    )
}

export default Profile