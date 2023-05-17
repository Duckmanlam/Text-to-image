import React from "react";
import Tesseract from "tesseract.js";

import "./style.css";

const App = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [images, setImages] = React.useState([]);
  const [texts, setTexts] = React.useState([]);
  const [progress, setProgress] = React.useState(0);

  const handleImageChange = (event) => {
    const files = event.target.files;
    const urls = [];

    for (let i = 0; i < files.length; i++) {
      urls.push(URL.createObjectURL(files[i]));
    }

    setImages(urls);
  };

  const handleConvertClick = async () => {
    setIsLoading(true);
    const convertedTexts = [];
    const numFiles = images.length;
    let numConverted = 0;

    for (let i = 0; i < numFiles; i++) {
      const { data } = await Tesseract.recognize(images[i], "vie", {
        lang: "vie",
        tessedit_char_whitelist: "0123456789",
        psm: Tesseract.PSM.SINGLE_BLOCK,
        oem: Tesseract.OEM.TESSERACT_ONLY,
        logger: (m) => {
          console.log(m);
          if (m.status === "recognizing text") {
            const progress = parseInt(
              ((numConverted + m.progress) / numFiles) * 100
            );
            setProgress(progress);
          }
        },
      });

      convertedTexts.push(data.text);
      numConverted++;
    }

    setTexts(convertedTexts);
    setIsLoading(false);
    setProgress(100);
  };

  return (
    <div className="container" style={{ height: "100vh" }}>
      <div className="row h-100">
        <div className="col-md-5 mx-auto h-100 d-flex flex-column justify-content-center">
          {!isLoading && (
            <h1 className="text-center py-5 mc-5">Image To Text</h1>
          )}
          {isLoading && (
            <>
              <progress className="form-control" value={progress} max="100">
                {progress}%{" "}
              </progress>{" "}
              <p className="text-center py-0 my-0">
                Đã chuyển đổi : {progress} %
              </p>
            </>
          )}
          {!isLoading && texts.length === 0 && (
            <>
              <input
                type="file"
                multiple
                onChange={handleImageChange}
                className="form-control mt-5 mb-2"
              />
              <input
                type="button"
                onClick={handleConvertClick}
                className="btn btn-primary mt-5"
                value="Convert"
              />
            </>
          )}
          {!isLoading && texts.length > 0 && (
            <>
              <div>
                <h3>Văn bản đã chuyển đổi</h3>
                <textarea
                  className="form-control w-100 mt-5"
                  rows="10"
                  value={texts.join("\n\n")}
                  onChange={(e) => setTexts([e.target.value])}
                ></textarea>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
