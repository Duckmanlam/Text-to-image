import React from "react";
import Tesseract from "tesseract.js";
import "./style.css";
const { Configuration, OpenAIApi } = require("openai");
const config = new Configuration({
  apiKey: "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",
});
// Delete it
delete config.baseOptions.headers['User-Agent'];

const openai = new OpenAIApi(config);

const App = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [image, setImage] = React.useState("");
  const [text, setText] = React.useState("");
  const [resultText, setResultText] = React.useState("");
  const [progress, setProgress] = React.useState(0);

  const callChatGPT = async (text) => {
    try {
      const prompt = `
      ${text}
    
      Từ đoạn văn bản trên hãy tóm tắt và tạo 5 câu hỏi trắc nghiệm gồm 4 câu trả lời`;

      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 2048,
        temperature: 1,
      });

      console.log("callChatGPT::", response.data.choices[0].text)
      setResultText(response.data.choices[0].text);

      //     setResultText(`
      //     Tóm tắc:
      // Sông Mã, Tây Tiến là một nơi nhớ thương của người dân Mường với rừng núi, sương lấp đoàn quân mỏi Mường Lát, hoa về trong đêm hơi, các quân đội cọp trêu người đêm khuya và cơm lên khói nếp xôi tại Mai Châu.

      // Câu hỏi trắc nghiệm:
      // 1. Ai là những người dân sống tại Tây Tiến?
      // A. Người Mường
      // B. Người Tày
      // C. Người H’Mông
      // D. Người Thái

      // 2. Trong đêm hơi, cái gì xuất hiện trong làng Mường Lát?
      // A. Sương lấp đoàn quân mỏi
      // B. Hoa về trong đêm hơi
      // C. Cọp trêu người đêm khuya
      // D. Súng ngửi trời
      //                                                                                                         t
      // 3. Những người dân Mường nhớ về địa danh Tây Tiến để làm gì?
      // A. Chơi vơi Sài Khao
      // B. Ăn cơm lên khói
      // C. Lặn đá
      // D. Chụp ảnh

      // 4. Địa danh nào là thuộc về Mường?
      // A. Sông Mã
      // B. Tây Tiến
      // C. Mai Châu
      // D. Pha Luông

      // 5.Điều gì xảy ra trong chiều chiều oai linh thác gầm thét?
      // A. Trời rơi mưa
      // B. Đoàn quân mỏi Mường Lát
      // C. Dân Mường lên cầu lửa
      // D. Gục lên súng mũ bỏ quên đời
      //     `);
      setIsLoading(false);
    } catch (error) {
      console.error("callChatGPT::", error)
    }
  }

  const handleSubmit = () => {
    setIsLoading(true);
    Tesseract.recognize(image, "vie", {
      lang: "vie",
      tessedit_char_whitelist: "0123456789",
      psm: Tesseract.PSM.SINGLE_BLOCK,
      oem: Tesseract.OEM.TESSERACT_ONLY,
      logger: (m) => {
        if (m.status === "recognizing text") {
          setProgress(parseInt(m.progress * 100));
        }
      },
    })
      .catch((err) => {
        console.error("handleSubmit::", err);
      })
      .then((result) => {
        console.log("handleSubmit::", result.data);
        setText(result.data.text);
        // callChatGPT(result.data.text);
      });
  };

  return (
    <div className="container" style={{ height: "100vh" }}>
      <div className="row h-100">
        <div className="d-flex flex-column justify-content-center">
          {/* Header */}
          {!isLoading && (
            <div>
              <h1 className="text-center">Image To Question!</h1>
            </div>
          )}
          {/* Loadin */}
          {isLoading && (
            <>
              <progress className="form-control" value={progress} max="100">
                {progress}%
              </progress>
              <p className="text-center py-0 my-0">Converting:- {progress} %</p>
            </>
          )}
          {/* Button  */}
          <div className="d-flex justify-content-center gap-5 text-center">
            {!isLoading && !resultText && (
              <div>
                <div>
                  <input
                    type="file"
                    onChange={(e) =>
                      setImage(URL.createObjectURL(e.target.files[0]))
                    }
                    className="form-control mt-4"
                  />
                  <input
                    type="button"
                    onClick={handleSubmit}
                    className="btn btn-primary mt-4"
                    value="Convert"
                  />
                </div>
                <div>
                  <img src={image} alt="" className="w-100 mt-4" />
                </div>
              </div>
            )}
            {/* Result */}
            {!isLoading &&
              <div className="d-flex justify-content-center gap-5">
                {
                  text &&
                  <div>
                    <h4>Text</h4>
                    <textarea
                      className="form-control"
                      rows="15"
                      value={text}
                      style={{ width: 400 }}
                    ></textarea>
                  </div>
                }
                {
                  resultText &&
                  <div>
                    <h4>Result</h4>
                    <textarea
                      className="form-control"
                      rows="15"
                      value={resultText}
                      style={{ width: 400 }}
                    ></textarea>
                  </div>
                }
              </div>
            }
          </div>
        </div>
      </div>
    </div >
  );
};

export default App;
