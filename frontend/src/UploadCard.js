import { useEffect, useRef, useState } from 'react';
import { Box, Card, GridList, GridListTile, Link } from '@material-ui/core';

import localStackLogo from './localStackLogo.png';

function UploadCard(props) {
  const inputEl = useRef(null);
  const [file, setFile] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const fetchData = () => {
    fetch('api/v1/files')
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          const bucket = result['Name'];
          const filenames = result['Contents']
            .map(file => `${bucket}/${file['Key']}`)
            .reverse();
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

    try {
      if (!file) {
        throw new Error('Please select an image');
      }
      const formData = new FormData();
      formData.append('file', file[0]);
      await fetch('/api/v1/files/upload/', {
        method: 'POST',
        body: formData
      })
      inputEl.current.value = "";
      fetchData();
    } catch (error) {
      alert(error);
    }
  };

  return (
    <Card className={props.classes.card}>
      <h2>Store files in S3, locally</h2>
      <Box display="flex" flexDirection="row" alignItems="center" mt={-4} mb={-1}>
        <Box mr={1}>
          <h3>Powered by</h3>
        </Box>
        <img width="75px" height="100%" src={localStackLogo} alt="Express Logo"/>
      </Box>
      <p>Click below to select and upload an image from your computer.</p>
      <p>The image will be <b>stored in a local S3 bucket</b>, powered by <Link
          color="secondary"
          target="_blank"
          rel="noopener"
          href="https://github.com/localstack/localstack"
        >
          <b>LocalStack</b>
        </Link> - a fully functional local AWS cloud stack, and displayed below.</p>
        <Box display="flex" flexDirection="column" alignItems="center" mt={5} mb={5}>
          <form onSubmit={e => submitFile(e)}>
            <Box>
              <input ref={inputEl} type="file"
                accept=".jpg,.jpeg,.png,.gif"
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
        <GridList
          cellHeight={100}
          className={props.classes.gridList}
          cols={3}
        >
          {data.map((src) => (
            <GridListTile key={src} cols={1}>
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
