import React, { useEffect, useState } from "react";
import AnimatedList from "src/components/pages/About/AboutOrganisms/AnimatedList";
import axios from "axios";
import "./AboutTl.css";

interface Introduce {
  id: number;
  year: number;
  name: string;
  description: string;
}

export default function TimelineAnimated() {
  const [timelineData, setTimelineData] = useState<Introduce[]>([]);

  useEffect(() => {
    axios.get<Introduce[]>("/api/Manage/Introduce/Public")
      .then(res => setTimelineData(res.data))
      .catch(() => setTimelineData([]));
  }, []);

  const renderTimelineItem = (
    item: Introduce,
    idx: number,
    selected: boolean
  ) => (
    <div
      className={`timeline-item ${selected ? "selected" : ""}`}
      style={{
        background: selected ? "#F0551F" : "rgba(0,0,0,0.6)",
        color: "#fff",
        transform: selected ? "scale(1.02)" : undefined, 
        borderLeftColor: "#F0551F",
      }}
    >
      <div className="timeline-header">
        <span>{item.year} - {item.name}</span>
      </div>
      <div className="timeline-content">{item.description}</div>
    </div>
  );

  return (
    <div className="timeline-container">
      <h2 className="timeline-title">Một số sự kiện An ninh mạng</h2>
      <AnimatedList
        items={timelineData}
        renderItem={renderTimelineItem}
        showGradients={false}
        displayScrollbar={false}
        enableArrowNavigation={true}
      />
    </div>
  );
}
