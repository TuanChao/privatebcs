import React from "react";
import logoContent from "src/assets/images/bcs-layout-1.png";
import subBigBanner from "src/assets/images/service2.png.jpeg";
import subBanner from "src/assets/images/bkav-sbbn.jpg";
import "./HomeSubBanner.css";

const HomeSubBanner: React.FC = () => {
  const tagIcon = (
    <svg width="12" height="15" viewBox="0 0 12 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5.21268 0.0467155C5.14111 -0.0155718 5.03374 -0.0155718 4.96217 0.0467155L1.7413 1.91534L1.59814 2.03991L0.059289 4.12654C-0.0122858 4.15768 -0.012277 4.25111 0.0235104 4.3134L4.99795 14.9023C5.06952 15.0268 5.24847 15.0268 5.32004 14.9334L11.9765 6.11974C12.0123 6.05745 12.0123 5.96402 11.9407 5.93287L5.21268 0.0467155Z"
        fill="#ffffff"
        data-darkreader-inline-fill=""
      ></path>
    </svg>
  );

  const textContent = (
    <>
      Bkav là Tập đoàn công nghệ hoạt động trong các lĩnh vực an ninh mạng, phần mềm, 
      chính phủ điện tử, nhà sản xuất smartphone, thiết bị điện tử thông minh, Smart City và AI camera.
       Bkav là 1 trong 10 thương hiệu Nổi tiếng nhất Việt Nam do Hội Sở hữu trí tuệ Việt Nam bình chọn,
        nằm trong Top 10 Dịch vụ hoàn hảo do Hội Tiêu chuẩn Bảo vệ Người tiêu dùng Việt Nam bình chọn.
      <br />
      <br />
      Xây dựng một Việt Nam hùng cường nhờ công nghệ.<br />

      Đây là khát vọng thôi thúc Bkav và tất cả những việc Bkav làm đều hướng tới thực hiện được khát vọng đó.<br />

      VIỆT NAM SẼ LÀ CON RỒNG CHÂU Á !<br />

      Những việc hữu ích cho xã hội và sử dụng đến Công nghệ thì Bkav sẽ làm.<br />

    LÀM CHỦ CÔNG NGHỆ - ĐƯA CÔNG NGHỆ VIỆT NAM VƯƠN TẦM THẾ GIỚI !<br />
    </>
  );

  return (
    <div className="sub-banner-container">
      <div className="sub-banner row  animate-me">
        <div className="sub-banner-image-container col-lg-6 col-sm-12">
          <img src={subBanner} alt="sub-banner" className="sub-banner-image" loading="lazy" />
        </div>
        <div className="sub-banner-content col-lg-6 col-sm-12">
          <img src={logoContent} alt="logo-content" width={200} className="logo-content" loading="lazy" />

          <div className="vision-content">
            {tagIcon}

            <span className="vision-content-text">Bkav Cyber Security</span>
          </div>

          <p className="sub-banner-team-description">{textContent}</p>
        </div>
      </div>

      <div className="sub-banner row  animate-me" style={{ maxWidth: "100%" }}>
        <img src={subBigBanner} alt="logo-content" className="sub-big-banner" loading="lazy" />
      </div>
    </div>
  );
};

export default HomeSubBanner;
