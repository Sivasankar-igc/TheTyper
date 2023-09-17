import { useState, useEffect } from "react";
import axios from "axios";

const ParagraphHeading = () => {

    const [paragraphHeading, setParagraphHeading] = useState();
    useEffect(() => {
        axios.post("/getParagraphHeading")
            .then((res) => res.data != null ? setParagraphHeading(res.data) : window.alert("please reload the page"))
            .catch((warn) => console.warn(warn))
    }, [])

    if (paragraphHeading != undefined) {

        return (

            paragraphHeading.map((i, index) => {
                return (
                    <option value={i.PName} key={index}>{i.PName}</option>
                )
            })

        )
    }
}

export default ParagraphHeading;