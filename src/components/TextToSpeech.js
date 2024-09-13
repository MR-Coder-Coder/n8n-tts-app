import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Import Firestore instance
import { collection, getDocs } from 'firebase/firestore';
import './TextToSpeech.css';

const TextToSpeech = () => {
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [text, setText] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch voices from Firestore
  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'voices'));
        const voicesList = querySnapshot.docs.map(doc => ({
          id: doc.data().voice_id, // voice_id
          name: doc.data().voice_name // voice_name for display
        }));
        setVoices(voicesList);
      } catch (error) {
        console.error('Error fetching voices:', error);
      }
    };
    fetchVoices();
  }, []);

  // Handle the submission of text-to-speech request
  const fetchAudioFile = async () => {
    if (!selectedVoice || !text) {
      alert('Please select a voice and enter some text.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('https://n8n.ltbventures.com/webhook/generate-voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          voice_id: selectedVoice, // Use the selected voice ID
          text: text // Use the input text
        })
      });

      if (!response.ok) {
        throw new Error('Error fetching audio file');
      }

      // Create object URL from the mpga file blob
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (error) {
      console.error('Error fetching TTS file:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = () => {
    if (audioUrl) {
      const link = document.createElement('a');
      link.href = audioUrl;
      link.download = 'response.mpga'; // Default filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="text-to-speech-container">
      <h2><span role="img" aria-label="microphone">🎤</span> Text-to-Speech Generator</h2>
      <p className="welcome-message">👤 Welcome, cryptoboyz64@gmail.com!</p>

      {/* Dropdown for selecting voice */}
      <div className="input-container">
        <label>Select Voice</label>
        <select
          value={selectedVoice}
          onChange={e => setSelectedVoice(e.target.value)}
        >
          <option value="">-- Choose a voice --</option>
          {voices.map(voice => (
            <option key={voice.id} value={voice.id}>
              {voice.name}
            </option>
          ))}
        </select>
      </div>

      {/* Text input */}
      <div className="input-container">
        <label>Enter Text</label>
        <textarea
          rows="4"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Enter the text to convert to speech"
        ></textarea>
      </div>

      {/* Submit button */}
      <button className="generate-button" onClick={fetchAudioFile} disabled={loading}>
        {loading ? 'Loading...' : '🎧 Generate Voice'}
      </button>

      {/* Audio player and download option */}
      {audioUrl && (
        <div>
          <audio controls>
            <source src={audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
          <button onClick={downloadFile} className="generate-button">
            Download Audio
          </button>
        </div>
      )}
    </div>
  );
};

export default TextToSpeech;
