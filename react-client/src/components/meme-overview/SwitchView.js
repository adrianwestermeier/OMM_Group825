import React from "react";
import SingleView from "./SingleView";
import Grid from "./GridView";
import option from 'react-select';
import optionsState from 'react-select';

export default class SwitchView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
           search: '',
           template: 'all',
        }
    }

    // sort after date, upvotes or downvotes
    updateSort(event){
        let newPostList = this.props.memes;
        if (event.target.value === 'creationDateNew'){
            newPostList.sort(function(a,b){
                return new Date(b.date).getTime() -
                               new Date(a.date).getTime()
            })
        } else if (event.target.value === 'creationDateOld'){
            newPostList.sort(function(a,b){
                return new Date(a.date).getTime() -
                               new Date(b.date).getTime()
            })
        } else if (event.target.value === 'upvotes'){
            newPostList.sort(function(a,b){
                return parseInt(b.upVotes) - parseInt(a.upVotes);
            })
        } else if (event.target.value === 'downvotes'){
            newPostList.sort(function(a,b){
                return parseInt(b.downVotes) - parseInt(a.downVotes);
            })
        }
        this.setState({
            sortAfter: event.target.value,
            postList: newPostList
        });

    }

    // gets updated by selecting a template in the dropdown menu
    updateTemplate(event) {
        this.setState({template: event.target.value});
    }

    // gets updated by typing in <input>
    updateSearch(event){
        this.setState({search: event.target.value.substr(0,20)});
    }

    render() {
        <option valueTemplate={option.valueTemplate} selected={optionsState === option.valueTemplate}>{option.label}</option>
        let view;
        let memesList;
        const templateList = ['all'];
        this.props.memes.map((element) => {
            if(templateList.includes(element.template) === false){
                templateList.push(element.template)
            }
        })
        // switch view
        if (this.props.isSingleView) {
        // get sorted list if defined
            if (this.state.postList === undefined){
                memesList = this.props.memes
            }else{
                memesList = this.state.postList
            }
            view = <SingleView
                memes={
                    memesList.filter(
                        (meme) => {
                            if(this.state.template === meme.template || this.state.template === 'all'){
                                return(
                                    meme.title.toLowerCase().indexOf(
                                        this.state.search.toLowerCase()) !== -1
                        )}
                        }
                )}
                getMemes={() => {this.props.getMemes()}}
            />
        } else if(!this.props.isSingleView){
            // get sorted list if defined
            if (this.state.postList === undefined){
                memesList = this.props.memes
            }else{
                memesList = this.state.postList
            }
            view = <Grid
                memes={
                    memesList.filter(
                        (meme) => {
                            if(this.state.template === meme.template || this.state.template === 'all'){
                                return(
                                    meme.title.toLowerCase().indexOf(
                                        this.state.search.toLowerCase()) !== -1
                                )}
                        }
                )}
                getMemes={() => {this.props.getMemes()}}
            />;
        }
        return(
            <div>
                Sort after creation date or votes:
                <select value={this.state.sortAfter} onChange={this.updateSort.bind(this)}>
                    <option value="creationDateOld">Creation date oldest first</option>
                    <option value="creationDateNew">Creation date newest first</option>
                    <option value="upvotes">Up Votes</option>
                    <option value="downvotes">Down Votes</option>
                </select>
                Filter after used template:
                <select value={this.state.template} onChange={this.updateTemplate.bind(this)}>
                     {templateList.map((element) => (
                        <option value={element} key={element}>{element}</option>
                     ))}
                </select>
                Search after (parts of) the title:
                <input type = "text"
                    placeholder="meme title"
                    value = {this.state.search}
                    onChange={this.updateSearch.bind(this)}
                />{view}
            </div>
        )
    }
}
