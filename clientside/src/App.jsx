import { BrowserRouter, Routes, Route } from "react-router-dom";
import TypingPage from "./component/typingPage";
import SignIn from "./component/signInPage";
import LogIn from "./component/loginPage";
import Profile from "./component/profile";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<TypingPage/>}/>
                <Route path="signInPage" element={<SignIn/>}/>
                <Route path="loginPage" element={<LogIn/>}/>
                <Route path="profilePage" element={<Profile/>}/>
            </Routes>
        </BrowserRouter>
    )
}
export default App;