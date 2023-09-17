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

web.use((req, res, next)=>{
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
})

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

        const isUserExist = await user_collection.findOne({ emailId: emailId });

        if (isUserExist === null) {
            const user = new user_collection({
                emailId: emailId,
                password: password,
                userId: userId
            })

            await user.save();

            const data = await user_collection.findOne({ emailId: emailId });

            data != null ? res.status(200).send("userSaved") : res.status(200).send("user couldn't be saved");
        }
        else {
            res.status(200).send("userExist");
        }
    } catch (error) {
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
        const { user, wpm, accuracy, paragraph } = req.body;
        const findUser = await user_collection.findOne({ userId: user });
        const PName = await paragraph_collection.findOne({ PContent: paragraph });
        if (findUser != null) {
            await user_collection.updateOne({ userId: user }, {
                $push: {
                    data: {
                        time: getTime(),
                        passage: PName.PName,
                        wpm: wpm,
                        accuracy: accuracy
                    }
                },
                $inc: { totalMatch: 1 }
            })
            if (findUser.highestWpm < wpm) {
                await user_collection.updateOne({ userId: user }, { $set: { highestWpm: wpm, highestAccuracy: accuracy, highestOnPassage: PName.PName } })
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

async function saveParagraph() {
   
    const p1 = new paragraph_collection({
        PName:"OUR ENVIRONMENT",
        PContent:"Our environment is nature's most precious and vital gift, and it needs to be handled with utmost care. It is the natural ecological system where we live, depending on each other for survival. The environment is divided into physical and biological components. The atmosphere, lithosphere and hydrosphere constitute the physical category, and the biological category comprises human beings and other living beings. In simple terms, the environment is defined as the combination and interrelation between all biotic and abiotic components. The ecosystem of our environment needs to be maintained in a proper balance, and if any part of it is disturbed, the whole ecosystem gets affected."
    })
    const p2 = new paragraph_collection({
        PName:"SUPERBIKE WORLD CHAMPIONSHIP",
        PContent:"Superbike World Championship (also known as SBK) is the premier international superbike Championship. The championship was founded in 1988. It is regulated by the FIM and managed and promoted by FGSport. The most successful rider thus far has been Northern Irelands Jonathan Rea, who won the championship six times (2015, 2016, 2017, 2018, 2019, 2020). Ducati has been the most successful manufacturer in the series over the years, accumulating 15 manufacturer championships. Honda has won it 6 times, with Suzuki claiming one championship. Australia's Troy Bayliss won the 2006 and 2008 titles riding for Xerox Ducati and James Toseland, from the UK, was the winner of the 2007 championship riding for Hannspree Ten Kate Honda."
    })
    const p3 = new paragraph_collection({
        PName:"PEACE",
        PContent:"Peace is liked by all. It is for peace that we pray to God every morning and evening. Peace hath her victories no less glorious than war. It is in peace time that we have great men, high thoughts and golden deeds. Peace encourages education, trade, commerce and industry. Greater than personal peace is the peace of the nation and still greater is the world peace. This is possible when there is no war in any corner of the world. Unfortunately the world peace was badly disturbed twice. The beast in man was uppermost then. The World War I was fought, as they said, to end war. Its results were horrible. One third of the world population was killed. At its close the League of Nations was set up at Geneva. Its aim was to check war in future. But it had no power. The World War II came in 1939 and lasted up to 1945. Hitler and Mussolini threw every code of human morality to wind. But they were defeated in the end."
    })
    const p4 = new paragraph_collection({
        PName:"EDUCATION",
        PContent:"Education is of course one of the most important elements of any culture. Countries around the world as well as individuals of all nationalities often invest huge amounts of time and money to ensure that their children get the best possible learning experience. Expats are no different factors, relating to the schools and universities in a country are important considerations for any expat family before they make the decision to move abroad with children. However, education is not the same around the world, there are bound to be differences in quality, access, outcomes, and so on, as a result of which the education systems in some countries are better than those in others. To some extent, assessing an education system can be a bit subjective, as individual aptitudes, interests, and desires may be better met by some systems than by others. However, there are also objective parameters on which education systems can be assessed and compared, and there are a considerable number of studies and reports that look into this."
    })
    const p5 = new paragraph_collection({
        PName:"WHO",
        PContent:"The WHO is vital in promoting its various countries' health and safety. In this regard, the organization has made significant progress. It works with its different member states to coordinate responses to health emergencies and share knowledge and expertise to deal with outbreaks (Sohrabi, 2020). The WHO's achievements range from eradicating smallpox and the continued fight to eliminate polio. The organization has also worked on a vaccine for Ebola. Their work has a crucial impact on the local level. Nurses as primary healthcare workers can involve themselves in the WHO's different initiatives spearheaded. They can seek employment and deployment in remote areas of the world to effectively stop and control health emergencies such as the Covid19 virus or other pandemics such as Ebola or Zika. Their knowledge is essential in implementing WHO strategies in these scenarios."
    })
    const p6 = new paragraph_collection({
        PName:"CRICKET",
        PContent:"Cricket is celebrated and practiced as a sport in many countries. It is played within a 22-yard oval field with two teams competing against each other. Each team includes 11 players who can be batters, all-rounders as well as bowlers. The game starts with a toss and is played on the basis of overs where each over has 6 balls to be bowled. Runs can be scored by hitting the ball out of the boundary in the form of fours and sixes or by running between the wickets to take singles. The total number of overs depends on the format of the game. India plays cricket both as a sport and a recreation. Youngsters can be seen with their bats and balls in every nook and corner of the country. The Indian Cricket teams of both men and women represent the nation in different tournaments. The dedication and popularity of this game make it larger than life everywhere!"
    })
    const p7 = new paragraph_collection({
        PName:"DEFORESTATION",
        PContent:"We live in a country where the temperatures are comparatively higher. In these tropical countries, the tree plays a significant role in bringing rainfall. Trees take care of the water cycle. They initiate precipitation and cloud formation. Trees can also be beneficial in case of flood protection. The mangrove of Sundarbans protects the area from devastating floods. Flood still occurs in these areas regularly, but the impact is controlled due to the mangroves. If we keep cutting den trees haphazardly and randomly, the soil structure will see massive changes. Soil erosion is an authentic problem. It degrades the quality of soil that is being used by the farmers for agriculture. Trees provide fresh oxygen to the people. Trees are also the shelter for various birds and animals. Most nocturnal birds and migratory birds find their homes in the trees. The effects of deforestation have made millions of birds, close their habitat."
    })
    const p8 = new paragraph_collection({
        PName:"ANIME",
        PContent:"The word anime - pronounced (ah-knee-may) - is an abbreviation of the word animation. In Japan, the word is used to refer to all animation. However, outside of Japan, it has become the catch-all term for animation from Japan. For decades, anime was produced by and for Japan - a local product, with a distinct look-and-feel to not just the artwork but the storytelling, the themes, and the concepts. Over the last forty years, it has become an international phenomenon, attracting millions of fans and being translated into many languages. A whole generation of viewers in the West has grown up with it and are now passing it on to their own children. Because all things anime tend to be lumped together, it's tempting to think of anime as a genre. It isn't, at least no more than animation itself is a genre, but rather a description of how the material is produced. Anime shows, like books or movies, fall into any number of existing genres: comedy, drama, sci-fi, action-adventure, horror and so on."
    })
    const p9 = new paragraph_collection({
        PName:"PARGRAPH",
        PContent:'Paragraphs are the building blocks of papers. Many students define paragraphs in terms of length: a paragraph is a group of at least five sentences, a paragraph is half a page long, etc. In reality, though, the unity and coherence of ideas among sentences is what constitutes a paragraph. A paragraph is defined as "a group of sentences or a single sentence that forms a unit" (Lunsford and Connors 116). Length and appearance do not determine whether a section in a paper is a paragraph. For instance, in some styles of writing, particularly journalistic styles, a paragraph can be just one sentence long. Ultimately, a paragraph is a sentence or group of sentences that support one main idea. In this handout, we will refer to this as the "controlling idea," because it controls what happens in the rest of the paragraph.'
    })
    const p10 = new paragraph_collection({
        PName:"INDIA",
        PContent:'India is a beautiful land with a variety of wildlife and rich cultural diversity. The Bengal Tiger is considered the national animal of India. India celebrates its Independence Day on 15th August every year. It is observed to commemorate the freedom of India from the British. The tri-coloured national flag is called Tiranga, designed with saffron, white and green with the Ashok Chakra in navy blue at the centre of the flag. "Lion Capital of Ashoka" is the country’s national emblem. The national motto is "Satyameva Jayate" which means truth alone wins. In order to run the country smoothly, and make it an independent country, there was a need for a constitution which came into force on 26th January 1950. We observe this day as Republic Day every year.'
    })

    await paragraph_collection.insertMany([p1, p2, p3, p4, p5, p6, p7, p8, p9, p10]);
}

// saveParagraph();

web.use(express.static(path.join(__dirname, "./clientside/dist")))
web.get("*", (req,res)=>{
    try {
        res.sendFile(path.join(__dirname, "./clientside/dist/index.html"))
    } catch (error) {
        console.log(`error in getting the clientside file ==> ${error}`)
    }
})

web.listen(PORT, () => console.log(`Server Running At Port Number ${PORT}`));
