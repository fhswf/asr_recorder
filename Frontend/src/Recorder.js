import './App.css';
import React from 'react';
import { ReactMediaRecorder } from "react-media-recorder";

class Recorder extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state =
    {
      currentAudioUrl: null, 
      textes: [],
      selectedText: "",
    }
    this.fillTextesSelection();

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  fillTextesSelection()
  {
    fetch('http://localhost:9000/asrRecorder/getTextes')
      .then(r => r.json())
      .then(rData => 
        {
          this.setState
          ({
            textes: rData.textes,
            selectedText: rData.textes[0],
          });
        })
      .catch(err => alert(err));
  }

  async handleSubmit(event)
  {
    event.preventDefault();

    //to avoid sending an empty audio file to backend
    if (this.state.currentAudioUrl === null)
    {
      return;
    }

    var blob = new Blob(); 
    blob = await fetch(this.state.currentAudioUrl).then(r => r.blob())

    const timestamp = new Date();
    // Form-Data definieren
    let metadataAudio = 
    {
      filename: timestamp.toISOString(),
      extesion: 'wav',
      author: this.props.user,
      text: this.state.selectedText,
    };

    const formData = new FormData();
    formData.append('metadataAudio', JSON.stringify(metadataAudio));
    formData.append('file', blob);

    // Fetch ans Backend senden
    let payload = 
    {
      method: 'POST',
      mode: 'cors',
      credentials: 'omit', //has to be omit, so the response of the backend can be received
      redicrect: 'follow',
      referrerPolicy: 'no-referrer',
      body: formData
    };

    fetch('http://localhost:9000/asrRecorder/uploadAudio', payload)
    .then(response => response.json())
    .then((responseData) => 
    {
      alert("Audiodatei erfolgreich abgeschickt!");
      this.setState
      ({
          currentAudioUrl: null,
      });
    })
    .catch(err => alert(err));
  }

  render()
  {
  const textes = this.state.textes; 
  const audioPlayer = !(this.state.currentAudioUrl === null) && <audio src={this.state.currentAudioUrl} controls autoplay />;

  return (
    <div>
      <div>
        <label for="textes">Wählen sie einen Text zum Vorsprechen aus:</label><br/>
        <select name="textes" id="textes" onChange={(e) => this.setState({selectedText: e.target.value})}>
          {textes.map((option) => (
              <option value={option}>{option}</option>
            ))}
        </select>
      </div>
      <br/>
      <div>
        <form onSubmit={this.handleSubmit}>
          <input type="submit" disabled={this.state.currentAudioUrl === null} value="Audio speichern"/>
        </form>
      </div>
      <ReactMediaRecorder
        audio
        onStop={(url) => this.setState({currentAudioUrl: url})}
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
        {audioPlayer}
      </div>
    </div>
  );
  }
}

export default Recorder;
