import { useState } from 'react';
import { Card, Box, Link } from '@material-ui/core';
import logo from './logo.png';

function DeployCard(props) {
  const [file, setFile] = useState(null);

  const submitFile = async () => {
    console.log('submiteFile')
    try {
      if (!file) {
        throw new Error('Please select a file');
      }
      const formData = new FormData();
      formData.append('file', file[0]);
      console.log('formData', formData);
      await fetch('api/v1/files/upload', {
        method: 'POST',
        body: formData,
      })
      .then(response => response.json())
      .then(result => {
        console.log('Success:', result);
      })
      // handle success
    } catch (error) {
      alert(error);
    }
  };

  return (
    <Card className={props.classes.card}>
      <h2 className={props.classes.cardHeader}>Store files in S3, locally</h2>
      <p>Click the button below to upload an image from your computer.</p>
      <p>The image will be stored in a local S3 bucket, powered by LocalStack - a fully functional local AWS cloud stack.</p>
      <form onSubmit={submitFile}>
        <input type="file" onChange={event => setFile(event.target.files)} />
        <button type="submit">Upload</button>
      </form>
    </Card>
  );
}

export default DeployCard;
