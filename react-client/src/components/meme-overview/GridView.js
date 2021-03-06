import React from "react";
import OverviewElem from "./OverviewElem";

export default class Grid extends React.Component{
    constructor(props) {
        super(props);
    }

    getMemesFromDb = () => {
        this.props.getMemes();
    }

    render() {
        const items = [];       //this array later will contain all the elements to be shown in the overview
        let memes = this.props.memes
        for (let i = 0; i < memes.length; i++) {
            const id = this.props.memes[i]._id

            items.push(<OverviewElem
                key={id}
                className="gridItem"
                meme={memes[i]}
                user={this.props.user}
                getMemes={() => {this.getMemesFromDb()}}
            />)
        }

        return (
            <div>
                <div className="MemeOverview">
                    {items}
                </div>
            </div>
        )
    }
}
