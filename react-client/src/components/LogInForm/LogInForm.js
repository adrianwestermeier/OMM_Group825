import React from 'react';
import RegisterDialog from "./register";
import {TextField} from "@material-ui/core";

class LogInForm extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            usernames: [],
            username: '',
            password: ''
        }
    }

    componentDidMount() {
        this.getUsers()
    }

    logIn = (user) => {
        console.log(user)
        this.props.logIn(user);
    }

    performLogIn(){
        let users = this.state.users
        let usernames = this.state.usernames
        let username = this.state.username
        let enteredPassword = this.state.password
        let userPassword = ''
        let user = null

        if(usernames.includes(username)) {
            let i = usernames.indexOf(username)
            user = users[i]
            userPassword = users[i].password
        } else {
            alert('This user does not exist. Please check the data or register.')
            return;
        }
        if(enteredPassword === userPassword){
            this.logIn(this.state.username);
        } else {
            alert('wrong password')
        }

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
            ()=>{
                let users = this.state.users
                let username = ''
                let usernames = []
                for(let i=0; i<users.length; i++){
                    username = users[i].username
                    usernames.push(username)
                    this.setState({
                        usernames: usernames
                    })
                }
            }
        );
    }

    render() {
        return(
            <div>
                <h1>LogIn</h1>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="username"
                    type="string"
                    width="200"
                    variant="outlined"
                    onChange={e => {this.setState({username: e.target.value})}}
                />
                <br/>
                <TextField
                    autoFocus
                    margin="dense"
                    id="password"
                    label="password"
                    type="password"
                    width="200"
                    variant="outlined"
                    onChange={e => {this.setState({password: e.target.value})}}
                />
                <RegisterDialog
                    users={this.state.users}
                    usernames={this.state.usernames}
                    getUsers={() => {this.getUsers()}}
                />
                <button onClick={() => {this.performLogIn()}}>Log In</button>
            </div>
        )
    }
}



export default LogInForm;