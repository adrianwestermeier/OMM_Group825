import React from 'react';
import './templateExpansion.css';
import UserProvidedUrl from './user-provided-url/userProvidedUrl';
import FileUpload from './file-upload/fileUpload';
import Snapshot from './snapshot/snapshot';
import Screenshot from './screenshot/screenshot';


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