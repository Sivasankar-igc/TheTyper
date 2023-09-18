import axios from "axios";
import { useState, useEffect } from "react";

const TableBody = ({ userData}) => {

    if (userData != undefined) {
        let slno = 0;
        return(
            userData.data.map((i, index) => {
                slno += 1;
                return (
                    <tr key={index}>
                        <td>{slno}</td>
                        <td>{i.time}</td>
                        <td>{i.passage}</td>
                        <td>{i.wpm}</td>
                        <td>{i.accuracy}%</td>
                    </tr>
                )
                
            })
        )
    }

   
}

export default TableBody;