import React from 'react';
import RegisterDialog from "./register";

class LogInForm extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            usernames: []
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
            ()=>{
                let users = this.state.users
                let username = ''
                let usernames = []
                console.log(this.state.users)
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
                <h1>neues Log In Form</h1>
                <RegisterDialog
                    users={this.state.users}
                    usernames={this.state.usernames}
                />
                <button onClick={this.logIn}>Log In</button>
            </div>
        )
    }
}



export default LogInForm;