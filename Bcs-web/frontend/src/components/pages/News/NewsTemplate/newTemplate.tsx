import React from "react";
import NewsBanner from "../NewsBanner";
import NewsDetail from "../NewsDentail";
// import NewsDetail from "../NewsDentail";

const NewsTemplate: React.FC=()=> {
  return (
    <div className="news-page-container">
      <NewsBanner />
      {/* <NewsDetail /> */}
    </div>
  );
}

export default NewsTemplate;