import React from "react";
import "./HomeTeam.css";

const HomeTeam: React.FC = () => {
  return (
    <div className="home-team-container  animate-me">
      <div className="home-team">
        <div className="team-title-container">
          <svg width="21" height="26" viewBox="0 0 12 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M5.21268 0.0467155C5.14111 -0.0155718 5.03374 -0.0155718 4.96217 0.0467155L1.7413 1.91534L1.59814 2.03991L0.059289 4.12654C-0.0122858 4.15768 -0.012277 4.25111 0.0235104 4.3134L4.99795 14.9023C5.06952 15.0268 5.24847 15.0268 5.32004 14.9334L11.9765 6.11974C12.0123 6.05745 12.0123 5.96402 11.9407 5.93287L5.21268 0.0467155Z"
              fill="#0A2DE9"
            ></path>
          </svg>

          <div className="team-title">OUR TEAM</div>
          <div className="team-sub-title">(Coming soon)</div>
        </div>

        {/* <ArtistContainer>
          {mockListTeam.map((team) => (
            <Artist key={team.id} detailMember={team} type="team" onSelectArtist={onSelect} />
          ))}
        </ArtistContainer> */}
      </div>
    </div>
  );
};

export default HomeTeam;
