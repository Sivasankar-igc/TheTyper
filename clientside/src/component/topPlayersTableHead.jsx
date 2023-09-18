const TopPlayerTableHead = ({playerData})=>{
    if(playerData != undefined)
    {
        let rank = 1;
        return (
            <>
                <table>
                    
                    <thead>
                        <tr>
                            <th>RANK</th>
                            <th>USER ID</th>
                            <th>WPM</th>
                            <th>ACCURACY</th>
                            <th>PARAGRAPH</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            playerData.map((i,index)=>(
                                <tr key={index}>
                                    <td>{rank++}</td>
                                    <td>{i.userId}</td>
                                    <td>{i.highestWpm}</td>
                                    <td>{i.highestAccuracy}%</td>
                                    <td>{i.highestOnPassage}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </>
        )
    }
}

export default TopPlayerTableHead;