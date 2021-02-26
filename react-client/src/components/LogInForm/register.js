import React from "react";
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField} from "@material-ui/core";

class RegisterDialog extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            username: "",                       // username entered in the corresponding text field
            password: "",                       // password entered in the corresponding text field
            repeatedPassword: "",               // repeated password entered in the corresponding text field
            open: false,                        // controls if the dialog is open (true) or closed (false)
            users: this.props.users,            // list of all users saved in the db
            usernames: this.props.usernames     // list of ll usernames saved in the db
        };
    }

    componentDidMount() {

        let usernames = []
        let users = this.props.users

        // creates a list containing all usernames saved on the db
        for(let i = 0; i<users.length; i++){
            usernames.push(users[i].username)
            this.setState({
                usernames: usernames
            })

        }
    }

    getUsers = () => {
        this.props.getUsers();
    }

    // is performed after clicking the 'register' button and controls the registering process
    handleRegister(){


        if(this.state.username === ''){         // check, if a usernames was entered
            alert('please enter a username')
            return;
        }
        if(this.props.usernames.includes(this.state.username)){     // check if the username already exists on the db
            alert('this username is already taken')
            return;
        }
        if(this.state.password === ''){     //check if a password was entered
            alert('please enter a password')
            return;
        }
        if(this.state.password !== this.state.repeatedPassword){    //check if the entered repeated password matches the first password
            alert("the passwords do not match");
            return;
        }
        this.setState({
            open: false             //closes the dialog if everything is entered correctly
        })

        // post the new user ti the db
        fetch(`http://localhost:3005/users/postUser`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password,

            })
        })
        .then(jsonResponse => jsonResponse.json()
            .then(responseObject => {
                alert(JSON.stringify( responseObject.message ))
                this.getUsers() // after getting the responses from the backend reload the users
            })
            .catch(jsonParseError => {
                console.error(jsonParseError);
            })
        ).catch(requestError => {
            console.error(requestError);
        });

    }

    // close the dialog when clicking on cancel
    handleCancel() {
        this.setState({
            open: false
        })
    }

    // opens the dialog when clicking on register
    handleClickOpen(){
        this.setState({
            open: true
        })
    }

    render() {
        return(
            <div>
                <button color="primary" onClick={() => {this.handleClickOpen()}}>
                    register here
                </button>
                <Dialog open={this.state.open} onClose={() => {this.handleCancel()}} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Register</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            To register please enter a username and password.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="username"
                            type="string"
                            fullWidth
                            variant="outlined"
                            onChange={e => {this.setState({username: e.target.value})}}
                        />

                        <TextField
                            autoFocus
                            margin="dense"
                            id="password"
                            label="password"
                            type="password"
                            fullWidth
                            variant="outlined"
                            onChange={e => {this.setState({password: e.target.value})}}
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="repeatPassword"
                            label="repeat password"
                            type="password"
                            fullWidth
                            variant="outlined"
                            onChange={e => {this.setState({repeatedPassword: e.target.value})}}
                        />
                    </DialogContent>
                    <DialogActions>
                        <button onClick={() => {this.handleCancel()}} color="primary">
                            Cancel
                        </button>
                        <button onClick={() => {this.handleRegister()}} color="primary">
                            Register
                        </button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }


}

export default RegisterDialog;