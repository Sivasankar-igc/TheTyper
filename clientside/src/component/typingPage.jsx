import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import React from "react";
import axios from "axios";
import ParagraphHeading from "./paragraphHeading";
import TopPlayerTableHead from "./topPlayersTableHead";
import "../CSS/homePage_table.css"
import "../CSS/homePage_typingArea.css"
import "../CSS/homePage.css"

const TypingPage = () => {

    let paragraph = "-----------PLEASE CHOOSE ONE PARAGRAPH-----------";
    let paragraph_field = useRef();
    let input_field = useRef();
    let index = 0;
    let totalWords = paragraph.trim().split(" ").length;
    let isTimerCalled = false;
    let time = 120;

    const navigate = useNavigate();
    const loc = useLocation();

    let canVisitProfile = false;

    if (loc.state != null) {
        canVisitProfile = true;
    }

    const [topData, setTopData] = useState();

    useEffect(() => {

        paragraph.split("").forEach(span => {
            let spanEle = `<span>${span}</span>`;
            paragraph_field.current.innerHTML += spanEle;
        })

        document.addEventListener("keydown", () => input_field.current.focus());
    }, [])

    useEffect(() => {
        axios.post("/getTop50Data")
            .then((res) => res.data != undefined ? setTopData(res.data) : window.alert("Top Players Data could not be retrieved.."))
            .catch((err) => console.error(err))
    }, [])

    const saveUserData = (wpm, accuracy) => {
        const user = loc.state.userId;
        axios.post("/saveUserData", { user, paragraph, wpm, accuracy })
            .then(() => console.log("the data has been saved"))
            .catch((err) => console.error(err))
    }

    const handleResult = () => {
        let wordsOfParagraph = paragraph.split(" ");
        let wordsOfTypedParagraph = input_field.current.value.split(" ");
        index = 0;
        let correctWords = 0, wrongWords = 0;

        wordsOfTypedParagraph.forEach(word => {
            if (word === wordsOfParagraph[index++]) {
                correctWords++;
            }
            else{
                wrongWords++;
            }
        })

        let gross_wpm = Math.floor(wordsOfTypedParagraph/(time/60));
        let net_wpm = Math.floor(gross_wpm - (wrongWords/(time/60)));
        let accuracy = ((net_wpm/gross_wpm)*100).toFixed(2);

        document.querySelector("#wpm").innerHTML = `${gross_wpm}`;
        document.querySelector("#accuracy").innerHTML = `${accuracy}%`;
        document.querySelector("#totalwords").innerHTML = `${wordsOfTypedParagraph.length}`;
        document.querySelector("#correct-words").innerHTML = `${correctWords}`;

        saveUserData(gross_wpm, accuracy);
    }

    let stop;

    const stopTimer = () => {
        input_field.current.disabled = true;
        clearInterval(stop);
        handleResult();
    }

    const startTimer = () => {

        stop = setInterval(() => {

            document.querySelector('#time').innerHTML = time;

            if (time == 0) {
                stopTimer();
            }
            time--;
        }, 1000)
    }

    const handleTypingLogic = () => {
        const letters = paragraph_field.current.querySelectorAll("span");
        let typedLetters = input_field.current.value.split("")[index];

        if (typedLetters == null) {
            index--;
            letters[index].classList.remove("correct", "incorrect");

        } else {
            if (letters[index].innerText === typedLetters) {
                letters[index].classList.add("correct");
            } else {
                letters[index].classList.add("incorrect");
            }

            index++;
        }

        letters.forEach(span => span.classList.remove("active"));
        letters[index].classList.add("active");
    }

    const typing = () => {

        if (!isTimerCalled) {
            startTimer();
            isTimerCalled = true;
        }

        if (input_field.current.value.split(" ").length <= totalWords) {

            if (input_field.current.value.split(" ").length == totalWords) {
                let lettersLength = input_field.current.value.split(" ")[input_field.current.value.split(" ").length - 1].split("").length;

                if (lettersLength < paragraph.split(" ")[totalWords - 1].split("").length) {
                    handleTypingLogic();
                }
                else {
                    input_field.current.disabled = true;
                    stopTimer();
                }
            }
            else {
                handleTypingLogic();
            }
        }
        else {
            input_field.current.disabled = true;
            stopTimer();
        }
    }

    const setInnerHTML = (para) => {

        paragraph = para;
        totalWords = paragraph.trim().split(" ").length

        paragraph_field.current.innerHTML = "";
        paragraph.split("").forEach(span => {
            let spanEle = `<span>${span}</span>`;
            paragraph_field.current.innerHTML += spanEle;
        })

        document.addEventListener("keydown", () => input_field.current.focus());
        paragraph_field.current.addEventListener("click", () => input_field.current.focus());
    }

    const chooseParagraph = (paragraph_value) => {
        axios.post("/chooseParagraph", { paragraph_value })
            .then((res) => {
                setInnerHTML(res.data.PContent);
            })
            .catch((err) => console.error(err));
    }

    const handleProfileVisiting = () => {
        if (canVisitProfile) {
            const user = loc.state.userId;
            const email = loc.state.emailId;
            navigate("/profilePage", { state: { userId: user, emailId: email } });
        }
    }


    return (
        <div className="wrapper">

                <nav className="navigation">
                    <ul className="logo-img"> <div></div></ul>
                    <ul className="logo-name"><span>The Typer</span> </ul>

                    <input type="checkbox" id="check" />
                    <label htmlFor="check" id="checkbtn">
                        <ul>
                            <li className="hamburger"></li>
                            <li className="hamburger"></li>
                            <li className="hamburger"></li>
                        </ul>
                    </label>
                    <ul className="navigation-items">
                        <li><a onClick={() => navigate("/signInPage")}>SIGN IN</a> </li>
                        <li><a onClick={() => navigate("/logInPage")}>LOG IN</a></li>
                        <li><a onClick={handleProfileVisiting}>PROFILE</a></li>
                    </ul>
                </nav>

            <div className="typingArea">
                <div className="paragraph-container">
                    <p id="paragraph" ref={paragraph_field}></p>
                </div>
                <input type="text" id="input-field" ref={input_field} onChange={typing} />

                <div className="progress-field">
                    <div><span>TIME(sec) : </span><span id="time"></span></div>
                    <div><span>ACCURACY : </span><p id="accuracy"></p></div>
                    <div><span>WPM : </span><p id="wpm"></p></div>
                    <div><span>TOTAL WORDS TYPED : </span><p id="totalwords"></p></div>
                    <div><span>CORRECT WORDS TYPED : </span><p id="correct-words"></p></div>
                </div>
                <button type="button" onClick={() => location.reload()}>START AGAIN</button>

                <select name="paragraph-heading" id="paragraph-heading" onChange={(e) => chooseParagraph(e.target.value)}>
                    <option disabled selected hidden>-choose-paragraph-</option>
                    <ParagraphHeading />
                </select>
            </div>

            <div className="topTableData">
                <header>TOP-TYPERS</header>
                <div className="topData-table">
                    <TopPlayerTableHead playerData={topData} />
                </div>
            </div>
        </div>
    )

}
export default TypingPage;