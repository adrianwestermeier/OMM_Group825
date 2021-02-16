import React from 'react';
import RegisterDialog from "./register";
import axios from "axios";

class LogInForm extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            users: []
        }
    }

    componentDidMount() {
        this.getUsers()
    }

    logIn = () => {
        this.props.logIn();
    }



    getUsers() {
        // get the memes from the express server
        fetch('/users/getUsers')
            .then(res => {

                return res.json()
            })
            .then(users => {
                this.setState({
                    users: users.users,
                })
            }).then(
            ()=>{console.log(this.state.users)}
        );
    }

    render() {
        return(
            <div>
                <h1>neues Log In Form</h1>
                <RegisterDialog/>
                <button onClick={this.logIn}>Log In</button>
                <button onClick={() => {this.getUsers()}}>getUsers</button>
            </div>
        )
    }
}



export default LogInForm;