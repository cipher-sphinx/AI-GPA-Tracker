import React from 'react';
import { MDBListGroup, MDBListGroupItem } from 'mdb-react-ui-kit';

const RecommendedVideos = ({ videos }) => {
  return (
    <div>
      <MDBListGroup>
        {videos?.map((video, index) => (
          <MDBListGroupItem key={index}>
            <a href={video.startsWith('http://') || video.startsWith('https://') ? video : `http://${video}`} target="_blank" rel="noopener noreferrer">
              {video}
            </a>
          </MDBListGroupItem>
        ))}
      </MDBListGroup>
    </div>
  );
};

export default RecommendedVideos;
