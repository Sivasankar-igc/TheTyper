import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useRef, useState } from "react";
import "../CSS/login.css"

const LogIn = () => {

    const navigate = useNavigate();
    const [userId, setUserId] = useState();
    const [password, setPassword] = useState();
    const pass = useRef();

    const handleSubmit = () => {
        axios.post("/logIn", { userId, password })
            .then((res) => res.data != null ? navigate("/", { state: { emailId: res.data.emailId, password: password, userId: userId } }) : window.alert("userId not found"))
            .catch((err) => console.error(err));
    }

    const showPassword=()=>{
        pass.current.type === "password" ? pass.current.type = "text" : pass.current.type = "password";
    }

    return (
        <>

            <div className="login-wrapper">
                <div className="login-container">
                    <div id="image-container"></div>
                    <div id="userid-input">
                        <input type="text" id="userId" onChange={(e) => setUserId(e.target.value)} required/> <br />
                        <label htmlFor="userId">USER ID</label>
                    </div>
                    <div id="password-input">
                        <input type="password" ref={pass} id="password" onChange={(e) => setPassword(e.target.value)} required/> <span id="show-password" onClick={showPassword}></span><br />
                        <label htmlFor="password">PASSWORD</label>
                    </div>
                    <a onClick={() => navigate("/signInPage")}>Don't have an account ?</a>                    
                </div>
                <button onClick={handleSubmit}>LOG IN</button>
            </div>
        </>
    )
}

export default LogIn;