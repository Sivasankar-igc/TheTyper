import express from "express";
import cors from "cors";
import { user_collection, paragraph_collection } from "./database.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const web = express();
web.use(express.urlencoded({ extended: false }));
web.use(express.json());
web.use(cors());

// web.use((req, res, next)=>{
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
//     res.setHeader("Access-Control-Allow-Headers", "Content-Type");
//     next();
// })

const PORT = process.env.PORT || 8000;


const getTime = () => {
    let hour = new Date().getHours();
    let minute = new Date().getMinutes();
    let seconds = new Date().getSeconds();
    let day = new Date().getDay();
    let year = new Date().getFullYear();
    let months = new Date().getMonth();
    let date = new Date().getDate();

    var ampm = (hour >= 12) ? "PM" : "AM";
    let dayInWord;

    switch (day) {
        case 0:
            dayInWord = "SUN"
            break;
        case 1:
            dayInWord = "MON"
            break;
        case 2:
            dayInWord = "TUES"
            break;
        case 3:
            dayInWord = "WED"
            break;
        case 4:
            dayInWord = "THUR"
            break;
        case 5:
            dayInWord = "FRI"
            break;
        case 6:
            dayInWord = "SAT"
            break;
        default:
            break;
    }

    return `${date}-${months + 1}-${year} :: ${dayInWord} :: ${hour - 12}:${minute}:${seconds} ${ampm}`;
}

web.post("/signIn", async (req, res) => {
    try {
        const { emailId, password, userId } = req.body;

        const isUserMailExist = await user_collection.findOne({ emailId: emailId });
        const isUserNameExist = await user_collection.findOne({userId: userId});

        if (isUserNameExist === null && isUserMailExist === null) {
            const user = new user_collection({
                emailId: emailId,
                password: password,
                userId: userId
            })

            await user.save();

            const data = await user_collection.findOne({ emailId: emailId });

            data != null ? res.status(200).send("userSaved") : res.status(200).send("user couldn't be saved");
        }
        else if(isUserMailExist !== null){
            res.status(200).send("userMailExist");
        }
        else if(isUserNameExist !== null){
            res.status(200).send("userNameExist");
        }
        
    } catch (error) {
        res.send(200).send("user couldn't be saved");
        console.error(error);
    }
})

web.post("/chooseParagraph", async (req, res) => {
    try {
        const { paragraph_value } = req.body;
        const data = await paragraph_collection.findOne({ PName: paragraph_value });

        data != null ? res.status(200).send(data) : res.status(200).send(null);
    } catch (error) {
        console.error(error);
    }
})

web.post("/saveUserData", async (req, res) => {
    try {
        const { user, paragraph, gross_wpm, accuracy } = req.body;
        const findUser = await user_collection.findOne({ userId: user });
        const PName = await paragraph_collection.findOne({ PContent: paragraph });
        if (findUser != null) {
            await user_collection.updateOne({ userId: user }, {
                $push: {
                    data: {
                        time: getTime(),
                        passage: PName.PName,
                        wpm: gross_wpm,
                        accuracy: accuracy
                    }
                },
                $inc: { totalMatch: 1 }
            })
            if (findUser.highestWpm < gross_wpm) {
                await user_collection.updateOne({ userId: user }, { $set: { highestWpm: gross_wpm, highestAccuracy: accuracy, highestOnPassage: PName.PName } })
            }
        }
    } catch (error) {
        console.warn(`This is a warning :- ${error}... your data might not be saved...`)
    }
})

web.post("/getUserData", async (req, res) => {
    try {
        const { userId } = req.body;
        const userData = await user_collection.findOne({ userId: userId });

        userData != null ? res.status(200).send(userData) : res.status(200).send(null);
    } catch (error) {
        console.error(error);
    }
})

web.post("/logIn", async (req, res) => {
    try {
        const { userId, password } = req.body;

        const data = await user_collection.findOne({ userId: userId, password: password });

        data != null ? res.status(200).send(data) : res.status(200).send(null);
    } catch (error) {
        console.error(error);
    }
})

web.post("/getTop50Data", async (req, res) => {
    try {
        const topData = await user_collection.find({}).sort({ highestWpm: -1 }).limit(50);

        res.status(200).send(topData);
    } catch (error) {
        console.error(error);
    }
})

web.post("/getParagraphHeading", async (req, res) => {
    try {
        res.status(200).send(await paragraph_collection.find({}, { PName: 1, _id: 0 }));
    } catch (error) {
        console.error(error);
    }
})

web.use(express.static(path.join(__dirname, "./clientside/dist")))
web.get("*", (req,res)=>{
    try {
        res.sendFile(path.join(__dirname, "./clientside/dist/index.html"))
    } catch (error) {
        console.log(`error in getting the clientside file ==> ${error}`)
    }
})

web.listen(PORT, () => console.log(`Server Running At Port Number ${PORT}`));
