import React from "react";
import SingleView from "./SingleView";
import Grid from "./GridView";

export default class SwitchView extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.isSingleView) {
            return(
                <SingleView
                    memes={this.props.memes}
                    getMemes={() => {this.props.getMemes()}}
                />
            )
        } else if(!this.props.isSingleView){
            return(
                <Grid
                    memes={this.props.memes}
                    getMemes={() => {this.props.getMemes()}}
                />
            )
        }
        return(
            <div>error: neither single view nor grid view</div>
        )
    }
}
