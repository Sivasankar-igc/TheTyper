const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://sahoosivasankar33:1498543163@cluster0.6chvwem.mongodb.net/theTyper?retryWrites=true&w=majority")
.then(()=>console.log("TypingMasterDatabase connected"))
.catch((err)=>console.error(`The error in the database connection is : ${err}`));

const Schema = mongoose.Schema({
    emailId:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        unique:false
    },
    userId:{
        type:String
    },
    data:[
        {
            time:{
                type:String
            },
            passage:{
                type:String
            },
            wpm:{
                type:Number
            },
            accuracy:{
                type:Number
            }
        }
    ],
    totalMatch:{
        type:Number,
        default:0
    },
    highestWpm:{
        type:Number,
        default:0
    },
    highestAccuracy:{
        type:Number,
        default:0
    },
    highestOnPassage:{
        type:String
    }
})

const paragraphSchema = mongoose.Schema({
    PName : {type:String,unique:false},
    PContent: {type:String, unique:false}
})

const user_collection = new mongoose.model("userData", Schema);
const paragraph_collection = new mongoose.model("paragraphCollcetion", paragraphSchema);
module.exports = {user_collection, paragraph_collection};