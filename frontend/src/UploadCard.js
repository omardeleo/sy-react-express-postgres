import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Card, GridList, GridListTile, Link, Box } from '@material-ui/core';
import logo from './logo.png';

function UploadCard(props) {
  const inputEl = useRef(null);
  const [file, setFile] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  console.log(props)

  const fetchData = () => {
    fetch('api/v1/files')
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          console.log('result', result)
          const bucket = result['Name'];
          const filenames = result['Contents'].map(file => `${bucket}/${file['Key']}`).reverse();
          setData(filenames);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }

  useEffect(() => fetchData(), []);

  const submitFile = async (e) => {
    e.preventDefault();
    // const ref = useRef();
    try {
      if (!file) {
        throw new Error('Please select a file');
      }
      const formData = new FormData();
      formData.append('file', file[0]);
      console.log('formData', formData);
      await axios.post('/api/v1/files/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      inputEl.current.value = "";
      fetchData();
    } catch (error) {
      alert(error);
    }
  };

  return (
    <Card className={props.classes.card}>
      <h2 className={props.classes.cardHeader}>Store files in S3, locally</h2>
      <p>Click below to select and upload an image from your computer.</p>
      <p>The image will be stored in a local S3 bucket, powered by <Link
          color="secondary"
          target="_blank"
          rel="noopener"
          href="https://github.com/localstack/localstack"
        >
          LocalStack
        </Link> - a fully functional local AWS cloud stack.</p>
        <Box display="flex" flexDirection="column" alignItems="center"> <form onSubmit={e => submitFile(e)}>
            <Box>
          <input ref={inputEl} type="file"
            onChange={
              event => {
                setFile(event.target.files);
              }
            }
          />
          </Box>
          <Box>
          <button type="submit">Upload</button>
          </Box>
        </form>
        </Box>

      { data ?
      <div className={props.classes.gridContainer}>
        <GridList cellHeight={100} className={props.classes.gridList} cols={1}>
          {data.map((src) => (
            <GridListTile key={src} cols={1} mb={5}>
              <img src={src} alt="Uploaded to LocalStack" />
            </GridListTile>
          ))}
        </GridList>
      </div>
      : "" }
    </Card>
  );
}

export default UploadCard;
