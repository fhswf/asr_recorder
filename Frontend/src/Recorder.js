import './Recorder.css';
import React from 'react';
import { ReactMediaRecorder } from "react-media-recorder";
import env from "react-dotenv";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMicrophoneAlt } from '@fortawesome/free-solid-svg-icons'
import { faStop } from '@fortawesome/free-solid-svg-icons'

//React-Component-Class for audiorecorder functionallities and views
class Recorder extends React.Component
{
  //Initiates attributes in this.state, gets textes from database, binds saveRecord-function
  //Parameter props: here: for receiving the "user"-html-tag-attribute
  constructor(props)
  {
    super(props);
    this.state =
    {
      currentAudioUrl: null, 
      textes: [],
      selectedText: "",
    }
    this.getTextes(); 
    this.saveRecord = this.saveRecord.bind(this);
  }

  //Sending get-request to backend for saving textes in "textes"-array-attribute
  getTextes()
  {
    fetch(env.GET_TEXTES_URI)
      .then(r => r.json())
      .then(rData => 
        {
          this.setState
          ({
            textes: rData.textes,
          });
          this.selectRandomText();
        })
      .catch(err => alert(err));
  }

  //Selects randomly a text from the "textes"-Attribute and saves it in "selectedText"-Attribute
  selectRandomText()
  {
    const textes = this.state.textes; 
    this.setState({selectedText: textes[Math.floor(Math.random() * textes.length)]});
    this.setState({currentAudioUrl: null});
  }

  //Submit-function for sending audiodata via http-post to backend
  async saveRecord(event)
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
    // Define Form data
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

    // Send fetch to backend
    let payload = 
    {
      method: 'POST',
      mode: 'cors',
      credentials: 'omit', //has to be omit, so the response of the backend can be received
      redicrect: 'follow',
      referrerPolicy: 'no-referrer',
      body: formData
    };

    fetch(env.UPLOAD_AUDIO_FILE_URI, payload)
    .then(response => response.json())
    .then((responseData) => 
    {
      alert("Audiodatei erfolgreich abgeschickt!");
      this.setState
      ({
          currentAudioUrl: null,
      });
      this.selectRandomText();
    })
    .catch(err => alert(err));
  }

  //render elements for the audiorecorder
  render()
  {
  const audioPlayer = !(this.state.currentAudioUrl === null) && <audio src={this.state.currentAudioUrl} controls autoplay />;
  const buttonSave = !(this.state.currentAudioUrl === null) && <input type="submit" value="speichern"/>
  const buttonDelete = !(this.state.currentAudioUrl === null) && 
    <button onClick={() => this.setState({currentAudioUrl: null})} >löschen</button>

  return (
    <div>
      <div>
        <p>Bitte lesen sie den folgenden Text nach Start der Aufnahme vor: </p>
        <p id="text">{this.state.selectedText}</p>
        <button onClick={() => this.selectRandomText()}>Text wechseln</button>
      </div>
      <br/>
      <ReactMediaRecorder
        audio
        onStop={(url) => this.setState({currentAudioUrl: url})}
        render={({ status, startRecording, stopRecording}) => (
          <div>
            <div>
              <p>{status !== "recording" ? "Aufnahme starten" : "Sprachnachricht wird aufgezeichnet ..."}</p>
          	  <button id="buttonRecording" disabled={this.state.currentAudioUrl !== null} onClick={status !== "recording" ? startRecording : stopRecording}>
                {status !== "recording" ? <FontAwesomeIcon  size="2x" icon={faMicrophoneAlt} /> : <FontAwesomeIcon size="1x" icon={faStop} />}
              </button>
            </div>
          </div>
        )}
      />
      <br/>
      <div>
        <form onSubmit={this.saveRecord}>
          {audioPlayer}
          {buttonSave}
          {buttonDelete}
        </form>
      </div> 
    </div>
  );
  }
}

export default Recorder;
