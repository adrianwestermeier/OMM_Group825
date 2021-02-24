import React from "react";
import SingleView from "./SingleView";
import Grid from "./GridView";
import option from 'react-select';
import optionsState from 'react-select';

export default class SwitchView extends React.Component {
    /*
    * initialize the local state by assigning search and template to this.state
    */
    constructor(props) {
        super(props);
        this.state = {
           search: '',
           template: 'all',
        }
    }

    /*
    * In this function the memes list is copied into the @newPostList. The current value in the dropdown
    * menu "Sort after creation date or votes:" is used to determine how the list should be re-sorted.
    * There are the options Sort by date (newest or oldest first) or descending by UpVotes or DownVotes.
    * With the sort() method the list is sorted. With setState() the component sortAfter (after which
    * attribute is sorted) and postList (sorted list) is updated.
    */
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

    /*
    * With setState() the component template gets updated by selecting a template from the dropdown
    * menu "Filter after used template".
    */
    updateTemplate(event) {
        this.setState({template: event.target.value});
    }

    /*
    * With setState() the componente search gets updated by typing in <input>
    */
    updateSearch(event){
        this.setState({search: event.target.value.substr(0,20)});
    }

    /*
    * @view defines either the SingleView or the GridView and serves to return it.
    * @memesList is declared to store the sorted list from updateSort() later, if sorting was done.
    * @templateList is initialized with 'all' as this value is added extra if all templates are to be shown.
    * Then the map() method is used to store all used templates of the generated memes once in the templateList.
    * This serves to have a list for the DropDown menu.
    *
    * inside SingleView/Grid:
    * The filter() method is used to filter for the state.value in the memesList. If the value this.state.search
    * cannot be found in the title of the meme, then the meme is not to be returned. So that the upper and
    * lower case is irrelevant, the method toLowerCase() was added.
    */
    render() {
        let view;
        let memesList;
        const templateList = ['all'];
        this.props.memes.map((element) => {
            if(templateList.includes(element.template) === false){
                templateList.push(element.template)
            }
        })
        // if statement whether SingleView or GridView is required
        if (this.props.isSingleView) {
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
                user={this.props.user}
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
        /*
        * As output two dropdown menus and an input text field with text lines as well as the SingleView
        * or GridView with the memes are returned.
        */
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
                    // show the used template from templateList in dropdown menu
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
