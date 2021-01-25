import React, { useEffect, createRef, useState } from "react";
import Text from "./Text";


import { useScreenshot, createFileName } from "use-react-screenshot";

const TestHelper = (props) => {
  const ref = createRef(null);
  const [width, setWidth] = useState(300);
  const [image, takeScreenShot] = useScreenshot();

  const download = (image, { name = "img", extension = "png" } = {}) => {
    const a = document.createElement("a");
    a.href = image;
    a.download = createFileName(extension, name);
    a.click();
  };

  const getImage = () => takeScreenShot(ref.current);
  const downloadImage = () => takeScreenShot(ref.current);

  useEffect(() => {
    if (image) {
      download(image, { name: "lorem-ipsum", extension: "png" });
    }
  }, [image]);

  return (
    <div>
      <div>
        <button style={{ marginBottom: "10px" }} onClick={getImage}>
          {props.text}
        </button>
        <button onClick={downloadImage}>download</button>
        <label style={{ display: "block", margin: "10px 0" }}>
          Width:
          <input value={width} onChange={e => setWidth(e.target.value)} />
        </label>
      </div>
      <img width={width} src={image} alt={"ScreenShot"} />
      <div
        ref={ref}
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          marginTop: "20px"
        }}
      >
        <Text />
      </div>
    </div>
  );
};

export default class Test extends React.Component {
  render() {
    return (
        <TestHelper text={'take it screeeen'} />
    )
    }
}