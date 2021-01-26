import './App.css';
import React from 'react';
import { ReactMediaRecorder } from "react-media-recorder"

class Recorder extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state =
    {
      history: [], //used array to save serveral records for future purposes
      apiResponse: "no api response received", 
    }

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  customOnStop(blobUrl)
  {
      const history = this.state.history;
      // history.push(blobUrl) for future purposes
      history[0] = blobUrl;
      this.setState
      ({
          history: history,
      });
  }

  performPost()
  {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");

    var urlencoded = new URLSearchParams();
    urlencoded.append("foo", "Performed post test");

    var requestOptions = 
    {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
      redirect: 'follow',
    };

    fetch("http://localhost:9000/bar", requestOptions)
      .then((response) => response.json())
      .then((responseData) => 
        {
          alert(responseData.bar);
          this.setState({ apiResponse: responseData.bar});
        })
      .catch(error => alert(error + " Error Test alert"));
  }

  async handleSubmit(event)
  {
    event.preventDefault();

    var blob = new Blob(); 
    blob = await fetch(this.state.history[0]).then(r => r.blob())

    //TODO: Prüfung, ob this.state.history nicht leer

    // Form-Data definieren
    let metadataAudio = 
    {
      filename: 'audioTest',
      extesion: 'wav',
      author: this.props.user,
      text: 'dies ist der text'
    };

    const formData = new FormData();
    formData.append('metadataAudio', JSON.stringify(metadataAudio));
    formData.append('file', blob);

    // Fetch ans Backend senden
    let payload = 
    {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {}, // WICHTIG!!! Die Header müssen für den File-Upload leer gelassen werden. Ansonsten wird eine Boundry benötigt
      redicrect: 'follow',
      referrerPolicy: 'no-referrer',
      body: formData
    };
  
    fetch('http://localhost:9000/asrRecorder/uploadAudio', payload)
    .then(response => response.json())
    .then((responseData) => alert(responseData.bar + " response"))
    .catch(err => {alert(err)});
  }

  render()
  {
    const history = this.state.history; 

    const records = history.map
    ((item, index) => 
      {
          return(
            <li key={index}>
              <p>{item}</p>
              <audio src={item} controls autoplay loop />
            </li>
          );
      } 
    );

  return (
    <div>
      <div> 
         <p>{this.state.apiResponse}</p>
      </div>
      <div>
        <p><button onClick={() => this.performPost()}>test Post</button></p>
        <form onSubmit={this.handleSubmit}>
          <input type="submit" disabled={history.length === 0} value="Audio speichern"/>
        </form>
      </div>
      <ReactMediaRecorder
        audio
        onStop={(url) => this.customOnStop(url)}
        render={({ status, startRecording, stopRecording}) => (
          <div>
            <div>
              <p>{status}</p>
              <button onClick={status !== "recording" ? startRecording : stopRecording}>{status !== "recording" ? "Start Aufnahme" : "Aufnahme beenden"}</button>
            </div>
          </div>
        )}
      />
      <div>
        <ul>
          {records}
        </ul>
      </div>
    </div>
  );
  }
}

export default Recorder;
