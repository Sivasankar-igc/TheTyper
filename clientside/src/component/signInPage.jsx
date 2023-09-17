import { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../CSS/signin.css"

const SignIn = () => {

    const [emailId, setEmailId] = useState();
    const [password, setPassword] = useState();
    const [userId, setUserId] = useState();

    const navigate = useNavigate();
    const pass = useRef();

    const handleSignIn = () => {
        axios.post("/signIn", { emailId, password, userId })
            .then((res) => {
                if (res.data === "userSaved") {
                    navigate("/", { state: { emailId: emailId, password: password, userId: userId } })
                } else if (res.data === "user couldn't be saved") {
                    window.alert("something went wrong....")
                } else if (res.data === "userExist") {
                    window.alert("User Already Exist...try to log in")
                }
            })
            .catch((err) => console.error(err));
    }

    const showPassword=()=>{
        pass.current.type === "password" ? pass.current.type = "text" : pass.current.type = "password";
    }

    return (
        <>
            <div className="signin-wrapper">
                <div className="signin-container">
                    <div id="image-container"></div>
                    <div id="input-email">
                        <input type="email" id="email" onChange={(e) => setEmailId(e.target.value)} required/><br />
                        <label htmlFor="email">E-MAIL</label>
                    </div>
                    <div id="input-pass">
                        <input type="password" id="password" ref={pass} onChange={(e) => setPassword(e.target.value)} required/><span id="show-password" onClick={showPassword}></span><br /><br />
                        <label htmlFor="password">PASSWORD</label>
                    </div>
                    <div id="input-user">
                        <input type="text" id="userId" onChange={(e) => setUserId(e.target.value)} required/><br />
                        <label htmlFor="userId">USER-ID </label>
                    </div>
                    {/* <input type="checkbox" name="t&c" id="t&c"/> */}

                    <a onClick={() => navigate("/logInPage")} target="_parent" rel="noopener noreferrer">Have An Account ?</a>
                    
                </div>
                <button onClick={handleSignIn}>SIGN IN</button>
            </div>
        </>
    )
}

export default SignIn;