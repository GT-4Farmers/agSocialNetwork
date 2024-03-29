import React, { useContext, useState, useEffect } from 'react';
import { withRouter, Link } from "react-router-dom";
import Axios from 'axios';
import { useHistory, useParams } from 'react-router';
import AuthContext from '../states/AuthContext';
import logo from './logo.png';
import '../css/header.css';
import { MdNotificationAdd } from 'react-icons/md';
import { GoCommentDiscussion } from 'react-icons/go';
import { BsGearFill } from 'react-icons/bs';

function Header(props) {

  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const { user, setUser } = useContext(AuthContext);
  const { profileDummy, setProfileDummy } = useContext(AuthContext);
  const { areNotifications, setAreNotifications } = useContext(AuthContext);

  useEffect(() => {
    async function fetchData() {
      const res = await Axios.get("http://localhost:3001/profile/friends/incomingRequests");
      if (res && res.data.incomingRequests[0].length !== 0) {
        setAreNotifications(true);
      }
    }
    fetchData();

    // unmount cleanup
    // return () => {};
  });
  
  function renderNav() {
    if ( (!(props.location.pathname === '/' || (props.location.pathname === '/register')) && isLoggedIn) ) {
      return (
        <>
          <nav>
            <ul className="navBox">
              <li>
                <div id="headerLogo">
                  <img id="logo" alt='Haystack Logo' src={logo}/>
                  <h1>HAYSTACK</h1>
                </div>
              </li>
              <li>
                <div className="navButton">
                  <Link to='/home'><svg alt="" width="26" height="24" viewBox="0 0 26 24" fill="inherit">
                    <path d="M12.2026 6.22623L4.17865 14.362V23.1428C4.17865 23.3701 4.25202 23.5882 4.3826 23.7489C4.51319 23.9097 4.69031 24 4.87499 24L9.75193 23.9845C9.936 23.9833 10.1122 23.8925 10.2421 23.7319C10.3719 23.5712 10.4448 23.3538 10.4448 23.1272V17.9993C10.4448 17.772 10.5181 17.5539 10.6487 17.3932C10.7793 17.2324 10.9564 17.1421 11.1411 17.1421H13.9264C14.1111 17.1421 14.2882 17.2324 14.4188 17.3932C14.5494 17.5539 14.6228 17.772 14.6228 17.9993V23.1235C14.6225 23.2363 14.6403 23.348 14.6752 23.4523C14.71 23.5567 14.7613 23.6515 14.826 23.7314C14.8907 23.8113 14.9675 23.8746 15.0521 23.9179C15.1368 23.9611 15.2275 23.9834 15.3191 23.9834L20.1943 24C20.379 24 20.5561 23.9097 20.6867 23.7489C20.8173 23.5882 20.8907 23.3701 20.8907 23.1428V14.3561L12.8685 6.22623C12.7741 6.13264 12.6567 6.08161 12.5355 6.08161C12.4144 6.08161 12.2969 6.13264 12.2026 6.22623ZM24.8772 11.756L21.2388 8.06394V0.642929C21.2388 0.472414 21.1838 0.308882 21.0859 0.18831C20.9879 0.0677371 20.8551 0 20.7166 0H18.2794C18.1409 0 18.0081 0.0677371 17.9101 0.18831C17.8122 0.308882 17.7572 0.472414 17.7572 0.642929V4.53318L13.8607 0.586673C13.4868 0.207869 13.0176 0.000757234 12.5333 0.000757234C12.0491 0.000757234 11.5799 0.207869 11.206 0.586673L0.189533 11.756C0.136649 11.8098 0.0928969 11.8759 0.060775 11.9505C0.0286532 12.0251 0.00879154 12.1068 0.00232495 12.1909C-0.00414164 12.275 0.00291357 12.3598 0.0230875 12.4406C0.0432613 12.5213 0.0761585 12.5963 0.119899 12.6614L1.22968 14.3223C1.2733 14.3876 1.32696 14.4417 1.38757 14.4814C1.44819 14.5212 1.51458 14.5458 1.58294 14.5539C1.65129 14.562 1.72028 14.5534 1.78595 14.5287C1.85161 14.5039 1.91267 14.4635 1.96562 14.4096L12.2026 4.02956C12.2969 3.93597 12.4144 3.88494 12.5355 3.88494C12.6567 3.88494 12.7741 3.93597 12.8685 4.02956L23.1059 14.4096C23.1587 14.4635 23.2197 14.504 23.2853 14.5288C23.3508 14.5537 23.4197 14.5623 23.488 14.5544C23.5563 14.5464 23.6227 14.522 23.6833 14.4824C23.744 14.4429 23.7977 14.389 23.8414 14.3239L24.9511 12.663C24.9948 12.5976 25.0276 12.5221 25.0475 12.4411C25.0675 12.36 25.0742 12.2748 25.0673 12.1906C25.0604 12.1063 25.0401 12.0245 25.0075 11.9499C24.9748 11.8753 24.9305 11.8094 24.8772 11.756Z"/>
                  </svg> Home</Link>
                </div>
              </li>
              <li>
                <div className="navButton">
                  <Link to={`/${user}`} onClick={() => {setProfileDummy(profileDummy+1)}}><svg alt="" width="28" height="27" viewBox="0 0 28 27" fill="inherit">
                    <path d="M13.7588 0C6.30113 0 0.258789 6.04234 0.258789 13.5C0.258789 20.9577 6.30113 27 13.7588 27C21.2165 27 27.2588 20.9577 27.2588 13.5C27.2588 6.04234 21.2165 0 13.7588 0ZM13.7588 5.22581C16.4044 5.22581 18.5491 7.37056 18.5491 10.0161C18.5491 12.6617 16.4044 14.8065 13.7588 14.8065C11.1132 14.8065 8.96847 12.6617 8.96847 10.0161C8.96847 7.37056 11.1132 5.22581 13.7588 5.22581ZM13.7588 23.9516C10.5634 23.9516 7.70012 22.5036 5.78399 20.2391C6.80738 18.3121 8.8106 16.9839 11.1459 16.9839C11.2765 16.9839 11.4072 17.0056 11.5324 17.0438C12.24 17.2724 12.9804 17.4194 13.7588 17.4194C14.5372 17.4194 15.283 17.2724 15.9852 17.0438C16.1104 17.0056 16.241 16.9839 16.3717 16.9839C18.707 16.9839 20.7102 18.3121 21.7336 20.2391C19.8175 22.5036 16.9542 23.9516 13.7588 23.9516Z"/>
                  </svg> Profile</Link>
                </div>
              </li>
              <li>
                <div className="navButton">
                  <Link to='/notifications'>
                    {areNotifications ? <MdNotificationAdd /> :
                    <svg width="22" height="27" viewBox="0 0 22 27" fill="inherit">
                    <path d="M11 26.8125C12.5125 26.8125 13.75 25.575 13.75 24.0625H8.25C8.25 25.575 9.47375 26.8125 11 26.8125ZM19.25 18.5625V11.6875C19.25 7.46625 16.995 3.9325 13.0625 2.9975V2.0625C13.0625 0.92125 12.1412 0 11 0C9.85875 0 8.9375 0.92125 8.9375 2.0625V2.9975C4.99125 3.9325 2.75 7.4525 2.75 11.6875V18.5625L0 21.3125V22.6875H22V21.3125L19.25 18.5625Z"/>
                    </svg>} Notifications
                  </Link>
                </div>
              </li>
              <li>
                <div className="navButton">
                  <Link to='/forums'>
                  <GoCommentDiscussion /> Forum</Link>
                </div>
              </li>
              <li>
                <div className="navButton">
                  <Link to='/searchUser'><svg alt="" width="27" height="27" viewBox="0 0 27 27" fill="inherit">
                    <path d="M19.2967 16.9811H18.0772L17.6449 16.5643C19.1578 14.8045 20.0686 12.5197 20.0686 10.0343C20.0686 4.49228 15.5763 0 10.0343 0C4.49228 0 0 4.49228 0 10.0343C0 15.5763 4.49228 20.0686 10.0343 20.0686C12.5197 20.0686 14.8045 19.1578 16.5643 17.6449L16.9811 18.0772V19.2967L24.6998 27L27 24.6998L19.2967 16.9811ZM10.0343 16.9811C6.19039 16.9811 3.08748 13.8782 3.08748 10.0343C3.08748 6.19039 6.19039 3.08748 10.0343 3.08748C13.8782 3.08748 16.9811 6.19039 16.9811 10.0343C16.9811 13.8782 13.8782 16.9811 10.0343 16.9811Z"/>
                  </svg> Search</Link>
                </div>
              </li>
              <li>
                <div className="navButton">
                  <Link to='/settings'>
                    <BsGearFill /> Settings</Link>
                </div>
              </li>
              <li>
                <div className="navButton">
                  <button id="navLogOut" onClick={() => logout()}><svg width="25" height="25" viewBox="0 0 25 25" fill="inherit">
                    <path d="M9.84722 17.4861L11.8056 19.4444L18.75 12.5L11.8056 5.55556L9.84722 7.51389L13.4306 11.1111H0V13.8889H13.4306L9.84722 17.4861ZM22.2222 0H2.77778C1.23611 0 0 1.25 0 2.77778V8.33333H2.77778V2.77778H22.2222V22.2222H2.77778V16.6667H0V22.2222C0 23.75 1.23611 25 2.77778 25H22.2222C23.75 25 25 23.75 25 22.2222V2.77778C25 1.25 23.75 0 22.2222 0Z"/>
                  </svg> Logout</button>
                </div>
              </li>
            </ul>
          </nav>
        </>
      )
    }
  }

  const history = useHistory();

  const logout = () => {
    async function fetchData() {
      const res = await Axios.post('/logout');
      if (res && res.data.success) {
          history.push("/");
      }
    }
    fetchData();
  };

  return (
    <>
      {renderNav()}
    </>
  )
}
export default withRouter(Header);