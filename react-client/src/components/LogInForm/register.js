import React from "react";
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField} from "@material-ui/core";

class RegisterDialog extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            repeatedPassword: "",
            open: false,
            users: this.props.users,
            usernames: this.props.usernames
        };
    }

    componentDidMount() {

        let usernames = []
        let users = this.props.users

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

    handleRegister(){

        if(this.state.username === ''){
            alert('please enter a username')
            return;
        }
        if(this.props.usernames.includes(this.state.username)){
            alert('this username is already taken')
            return;
        }
        if(this.state.password === ''){
            alert('please enter a password')
            return;
        }
        if(this.state.password !== this.state.repeatedPassword){
            alert("the passwords do not match");
            return;
        }
        this.setState({
            open: false
        })

        fetch(`/users/postUser`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password,

            })
        }).then(
            () => {
                console.log('THEN')
                this.getUsers()
            }
        ).then(jsonResponse => jsonResponse.json()
            .then(responseObject => {
                alert(JSON.stringify( responseObject.message ))
            })
            .catch(jsonParseError => {
                console.error(jsonParseError);
            })
        ).catch(requestError => {
            console.error(requestError);
        });

    }

    handleCancel() {
        this.setState({
            open: false
        })
    }

    handleClickOpen(){
        this.setState({
            open: true
        })
    }

    render() {
        return(
            <div>
                <button variant="outlined" color="primary" onClick={() => {this.handleClickOpen()}}>
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