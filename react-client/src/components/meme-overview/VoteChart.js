import React from "react";
import Chart from "react-google-charts";

export default class VoteChart extends React.Component{
    constructor(props) {
        super(props);
    }

    render(){
        const memes = this.props.memes

        let data = [
            ['x', 'votes'],
            [0,0]
        ]

        let elem = []

        //the data to be shown in the chart is created here
        if(this.props.i !== null){
            if(memes[this.props.i]){
                let upAndDown = memes[this.props.i].upMinusDownVotes
                for(let i=1; i<upAndDown.length; i++){
                    elem = [i, upAndDown[i]]
                    data.push(elem)

                }
            }
        }

        return(
            <div>
                <Chart
                    width={'600px'}
                    height={'400px'}
                    chartType="LineChart"
                    loader={<div>Loading Chart</div>}
                    data={data}
                    options={{
                        hAxis: {
                            title: 'Time',
                        },
                        vAxis: {
                            title: 'Up- minus DownVotes',
                        },
                    }}

                />
            </div>
        )
    }
}
