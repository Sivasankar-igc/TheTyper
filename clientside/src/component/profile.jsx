import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import TableBody from "./tableBody";
import axios from "axios";
import "../CSS/profile.css"

const Profile = () => {
    const userId = useLocation().state.userId;
    const emailId = useLocation().state.emailId;

    const [userData, setUserData] = useState();

    useEffect(() => {
        axios.post("/getUserData", { userId })
            .then((res) => res.data != null ? setUserData(res.data) : window.alert("connection error ... try again later..."))
            .catch((err) => console.error(err))
    }, [])

    if (userData != undefined) {
        let sum_wpm = 0;
        let sum_acc = 0;
        let prev_wpm;
        userData.data.map((i) => {
            sum_wpm += i.wpm;
            sum_acc += i.accuracy;
            prev_wpm = i.wpm;
        })
        return (
            <>
                <div className="profile-wrapper">

                    <div className="profile-header">
                        <div id="profile-logo-container">
                            <div></div>
                        </div>
                        <div className="user-details">
                            <div><span>user id : </span> <span>{userId}</span></div><br />
                            <div><span>email id : </span><span>{emailId}</span></div><br />
                            <div><span>Total Paragraph typed : </span><span>{userData.totalMatch}</span></div><br />
                        </div>
                        <div className="highlighted-box">
                            <div id="highest-score"><span className="about">Highest Score : </span><span className="data"><span>{userData.highestWpm}</span></span></div>
                            <div id="average-score"><span className="about">Average Score : </span><span className="data"><span>{Math.floor(sum_wpm / userData.totalMatch)}</span></span></div>
                            <div id="average-accuracy"><span className="about">Average Accuracy : </span><span className="data"><span>{Math.floor(sum_acc / userData.totalMatch)}%</span></span></div>
                            <div id="previous-score"><span className="about">Previous Score : </span><span className="data"><span>{prev_wpm}</span></span></div>
                        </div>
                    </div>
                    <div className="profile-table">
                        <header>YOUR DATA</header>
                        <div className="userData-table">
                            <table >
                                <thead>
                                    <tr>
                                        <th>SL NO</th>
                                        <th>TIME</th>
                                        <th>PASSAGE NAME</th>
                                        <th>WPM</th>
                                        <th>ACCURACY</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <TableBody userData={userData} />
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default Profile;