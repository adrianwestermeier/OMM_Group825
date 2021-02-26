import React from 'react';
import RegisterDialog from "./register";
import {TextField} from "@material-ui/core";

class LogInForm extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            users: [],          // all users saved on the db
            usernames: [],      // the corresponding usernames for all users
            username: '',       // the username entered in the corresponding username form field
            password: ''        // the password entered in the corresponding password form field
        }
    }

    componentDidMount() {
        this.getUsers()
    }

    logIn = (user) => {
        this.props.logIn(user);
    }

    performLogIn(){
        let users = this.state.users                // all users saved on the db
        let usernames = this.state.usernames        // the corresponding usernames for all users
        let username = this.state.username          // the username entered in the corresponding username form field
        let enteredPassword = this.state.password   // the password entered in the corresponding password form field
        let userPassword = ''                       // the password saved in the db for the corresponding username


        if(usernames.includes(username)) {          // check if the entered username is already saved on the db
            let i = usernames.indexOf(username)     // the index at which the entered username is
            userPassword = users[i].password        // get the password saved on the db for the entered username
        } else {
            alert('This user does not exist. Please check the data or register.')
            return;
        }
        if(enteredPassword === userPassword){       // check if the entered password matches the one saved on the db for the entered username
            this.logIn(this.state.username);        // perform LogIn
        } else {
            alert('wrong password')
        }

    }


    /*
    * this function gets all users saved on the db and saves them in this.state. users
    * aver getting the response from the backend it also creates a list with all usernames and saves ist in this. state.usernames
    * */
    getUsers() {
        // get the memes from the express server
        fetch('http://localhost:3005/users/getUsers')
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
                //creating list with only usernames
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