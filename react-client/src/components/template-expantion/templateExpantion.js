import React from 'react';
import './templateExpansion.css';
import UserProvidedUrl from './user-provided-url/userProvidedUrl';
import FileUpload from './file-upload/fileUpload';
import Snapshot from './snapshot/snapshot';
import Screenshot from './screenshot/screenshot';

/**
* class that renders all the template generation functions
*/
// class Snapshot extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//         snaphot: '',
//         snaphotTaken: false,
//         name: null,
//         url: null,
//         icon: <BsChevronRight/>,
//         expanded: false,
//     }
//   }

//   isMediaDevicesCapable() {
//     return navigator.mediaDevices &&
//       navigator.mediaDevices.getUserMedia;
//   }

//   getSnapshot = () => {
//     console.log("[templateExpantion] in getSnapshot");

//     const video = document.getElementById('camera');
//     /**
//      *  generates an image from the stream in the <video>
//      *  sets snapshot to image source in state
//      */
//     let context;
//     const width = video.offsetWidth;
//     const height = video.offsetHeight;
//     const canvas = document.createElement('canvas');
//     canvas.width = width;
//     canvas.height = height;
//     context = canvas.getContext('2d');
//     context.drawImage(video, 0, 0, width, height);
//     this.setState({
//       snapshot: canvas.toDataURL('image/png'),
//       snapshotTaken: true,
//     })
//     // hide video after snapshot is taken
//     document.getElementById('video-wrapper').style.display = 'none';
//   }

//   componentDidMount() {
//     if (this.isMediaDevicesCapable()) {
//       console.log('mediaDevices.getUserMedia supported');
//     } else {
//       console.log('sorry, mediaDevices.getUserMedia unsupported');
//     }
  
//     let requestedPermissions = {
//       audio: false,
//       video: true
//     };
//     // get the first video element in the DOM
//     const video = document.getElementById('camera');
//     if(!video) {
//       console.log("[templateExpantion] video not defined");
//     }
    
//     if (navigator.mediaDevices.getUserMedia) {
//       navigator.mediaDevices.getUserMedia(requestedPermissions)
//       .then(function(stream) {
//         video.srcObject = stream;
//       }).catch(function(error) {
//         document.write(error);
//       });
//     }

//   }

//   expand = () => {
//     if(!this.state.expanded) {
//       document.getElementById("video-snapshot-group").style.display = "inline";
//       this.setState({
//         icon: <BsChevronDown/>,
//         expanded: true,
//       })
//     } else {
//       document.getElementById("video-snapshot-group").style.display = "none";
//       this.setState({
//         icon: <BsChevronRight/>,
//         expanded: false,
//       })
//     }
//   }

//   changeName = (event) => {
//     event.preventDefault();
//     this.setState({
//         name: event.target.value,
//     })
//   }

//   onSubmit = () => {
//     if(!this.state.name) {
//       alert('please enter a name');
//       return;
//     }

//     const image = this.state.snapshot;
//     const name = this.state.name;

//     console.log("[templateExpantion] image: " + image)

//     fetch(`/images/saveTemplateSnapshot`, {
//         method: "POST",
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//           img: image,
//           name: name,
//         })
//       }).then(jsonResponse => jsonResponse.json()
//           .then(responseObject => {
//             console.log('[TemplateExpantion] recieved answer for post request: ' + JSON.stringify( responseObject ));
//             alert(JSON.stringify( responseObject.message ))
//           })
//           .catch(jsonParseError => {
//             console.error(jsonParseError);
//           })
//         ).catch(requestError => {
//             console.error(requestError);
//           });
//   }

//   render() {
//     let createdSnapshot;
//     createdSnapshot = this.state.snapshot;
    
//     let input;
//     let snapshotButton;
//     let submitButton;
//     if(this.state.snapshotTaken) {
//       input = <input type="text" placeholder="enter a name" name="name" id="name-input" onChange={this.changeName}/>
//       submitButton = <button id="submit-button" onClick={this.onSubmit}>save as template</button>
//     } else {
//       snapshotButton = <button id="snapshot-button" onClick={this.getSnapshot}>get snapshot</button>
//     }
    
//     return (
//       <div>
//         <div className="header-button-group">
//           <h2>Create a template from a custom camera snapshot</h2>
//           <button onClick={this.expand}>{this.state.icon}</button>
//         </div>
//         <div className="video-snapshot-group" id="video-snapshot-group">
//           <div id="video-wrapper">
//             <video id="camera" autoPlay></video>
//           </div>
//           {snapshotButton}
//           <div class="snapshot-group">
//             <img src={createdSnapshot} alt="User-provided Snapshot" id='snapshot' ref={this.componentRef}/>
//             <div>
//               {input}
//               {submitButton}
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }
// }

/**
* GET a screenshot from user provided url
*/
// class Screenshot extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//         url: null,
//         icon: <BsChevronRight/>,
//         expanded: false,
//     }
//   }

//   expand = () => {
//     if(!this.state.expanded) {
//       document.getElementById("screenshot-group").style.display = "inline";
//       this.setState({
//         icon: <BsChevronDown/>,
//         expanded: true,
//       })
//     } else {
//       document.getElementById("screenshot-group").style.display = "none";
//       this.setState({
//         icon: <BsChevronRight/>,
//         expanded: false,
//       })
//     }
//   }

//   changeName = (event) => {
//     event.preventDefault();
//     this.setState({
//         url: event.target.value,
//     })
//   }

//   onSubmit = () => {
//     if(!this.state.url) {
//       alert('please enter an url');
//       return;
//     }

//     const url = this.state.url;
//     const name = this.state.name;

//     fetch(`/screenshot/create`, {
//         method: "POST",
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//           url: url,
//           name: name,
//         })
//       }).then(jsonResponse => jsonResponse.json()
//           .then(responseObject => {
//             console.log('[TemplateExpantion] recieved answer for post request: ' + JSON.stringify( responseObject ));
//             alert(JSON.stringify( responseObject.message ))
//           })
//           .catch(jsonParseError => {
//             console.error(jsonParseError);
//           })
//         ).catch(requestError => {
//             console.error(requestError);
//           });
//   }

//   render() {
//     return(
//       <div>
//         <div className="header-button-group">
//           <h2>Create a template from a website screenshot</h2>
//           <button onClick={this.expand}>{this.state.icon}</button>
//         </div>
//         <div className="screenshot-group" id="screenshot-group">
//           <input type="text" placeholder="enter your website url" name="name" id="name-input" onChange={this.changeName}/>
//           <button id="submit-button" onClick={this.onSubmit}>create screenshot & save as template</button>
//           <p>(this may take a few seconds)</p>
//         </div>
//       </div>
       
      
//     )
//   }
// }


// class that renders all the meme generation functions
export default class Expander extends React.Component {
  // eslint-disable-next-line
    constructor(props){
        super(props);
    }

    render() {
      return (
        <div className="template-expansion">
            <UserProvidedUrl/>
            <FileUpload/>
            <Snapshot/>
            <Screenshot/>
        </div>
      );
    }
}