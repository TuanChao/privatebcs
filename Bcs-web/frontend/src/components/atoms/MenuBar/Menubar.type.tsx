import routesName from "../../../routes/enum.routes";

export type MenuItem = {
  title: string;
  url: string;
};

export const MENU_ARRAY: MenuItem[] = [
  { title: "Trang chủ", url: routesName.ROOT },
  {title: "Giải pháp", url: routesName.PRODUCT},
  { title: "Dịch vụ", url: routesName.SERVICE },
  // { title: "Sản phẩm & Giải Pháp", url: routesName.GALLERY },
  // { title: "Báo Giá", url: routesName.ORDER },
  { title: "Tin tức", url: routesName.NEWS },
  // { title: "Tài Liệu", url: routesName.DOCS },
  { title: "Giới thiệu", url: routesName.ABOUT },
];

export const SOCIAL_HEADER = [
  {
    icon:(
      <svg xmlns="http://www.w3.org/2000/svg"
       xmlnsXlink="http://www.w3.org/1999/xlink" 
       width="50" 
       height="30" 
       viewBox="10 -10 30 30"
       aria-label="Forum"
       >
  <defs>
    <linearGradient id="linear-gradient" x1="0.295" y1="0.063" x2="0.973" y2="1.437" gradientUnits="objectBoundingBox">
      <stop offset="0.005" stopColor="#ffffff"/>
      <stop offset="0.05" stopColor="#ffffff"/>
      <stop offset="0.115" stopColor="#ffffff"/>
      <stop offset="0.188" stopColor="#ffffff"/>
      <stop offset="0.269" stopColor="#ffffff"/>
      <stop offset="0.36" stopColor="#ffffff"/>
      <stop offset="0.456" stopColor="#ffffff"/>
      <stop offset="0.554" stopColor="#ffffff"/>
      <stop offset="0.645" stopColor="#ffffff"/>
    </linearGradient>
    <linearGradient id="linear-gradient-2" y1="0.5" x2="1" y2="0.5" gradientUnits="objectBoundingBox">
      <stop offset="0" stopColor="#ffffff"/>
      <stop offset="1" stopColor="#ffffff"/>
    </linearGradient>
    <linearGradient id="linear-gradient-3" x1="1.033" y1="0.721" x2="0.222" y2="0.37" gradientUnits="objectBoundingBox">
      <stop offset="0.005" stopColor="#ffffff"/>
      <stop offset="0.056" stopColor="#ffffff"/>
      <stop offset="0.157" stopColor="#ffffff"/>
      <stop offset="0.251" stopColor="#ffffff"/>
      <stop offset="0.336" stopColor="#ffffff"/>
      <stop offset="0.401" stopColor="#ffffff"/>
      <stop offset="0.573" stopColor="#ffffff"/>
      <stop offset="0.931" stopColor="#ffffff"/>
      <stop offset="1" stopColor="#ffffff"/>
    </linearGradient>
    <linearGradient id="linear-gradient-5" x1="0.034" y1="0.5" x2="0.895" y2="0.5" href="#linear-gradient-2"/>
    <linearGradient id="linear-gradient-6" x1="0.132" y1="0.773" x2="0.983" y2="-0.085" gradientUnits="objectBoundingBox">
      <stop offset="0" stopColor="#ffffff"/>
      <stop offset="1" stopColor="#ffffff"/>
    </linearGradient>
    <linearGradient id="linear-gradient-7" x1="0.132" y1="0.773" x2="0.983" y2="-0.085" href="#linear-gradient-6"/>
    <linearGradient id="linear-gradient-8" x1="0.949" y1="69.711" x2="0.397" y2="70.268" href="#linear-gradient-6"/>
  </defs>
  <g id="Group_6148" data-name="Group 6148" transform="translate(-24.531 -188.185)">
    <g id="Group_4726" data-name="Group 4726" transform="translate(24.532 188.442)">
      <path id="Path_265" data-name="Path 265" d="M39.211,206.117s-6.127-13.777-6.471-14.549a4.078,4.078,0,0,0-3.718-2.381H24.532l6.791,15.241s1.339,2.434,3.726,2.434h1.858A4.908,4.908,0,0,0,39.211,206.117Z" transform="translate(-24.532 -189.187)" fill="url(#linear-gradient)"/>
      <image id="Rectangle_2862" data-name="Rectangle 2862" width="7.428" height="9.478" transform="translate(6.146 7.387)" opacity="0.4" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAAlCAYAAAC+uuLPAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHFSURBVFhH7VQxUsQwDEw4oIGGYyhoqPkALRUVJRU1BQ08h5aKjgdwj2CoeAI19wMurEzkkWXZsY/LVdmZnZXtxCvJiduu65ptY6fXrWIyHRWT6aiYTEdFlenj8XwjSVbdvTDdh6xAemn19L1c6+IuNoXhAcSZ9fRxrXlNu3bBWc8gRkIzsEVchKJKseEJhCsMqrRiVE5xEqWmpxDLRM9ZCUQGg+2F4RmE2snk9lpzco3jCCVnyhvwJntqrCnn6azpiw+QNcUL5xC9IZGMiXItRXouwFCluWpSa5pU7SHUY8jUvdRrDa13PJJfL7K7gOivU4/1PM8Rf8TYreFLXkKzlepMJXPt5TXr3B1MU1R5CZEPDxmUrjlE7YXhFUS3KzWujtHir6BSGF5DZGaapb9JrvqmfZgf3UCz2RXE1phJCOaoUiujEupqctUFa+5M0dZbDCgLztbKmuZS1cj5VEy/zCfUf72UAZ1XlJVgbm2QbEiQprQh/1sbM4fZO/iB2MP/MmjxHcRqS1GMjRfQIshfxsxUMaoQZm81hoTgckC1932Yq47v1AZmr6S1sG4kNiawYWAMsxfo2ohMGZY5zJ7/hv9B0/wCmcsLmlZAIgIAAAAASUVORK5CYII=" style={{ mixBlendMode:'overlay', isolation:'isolate'}}/>
      <path id="Path_266" data-name="Path 266" d="M60.3,204.519l6.829-15.332H62.647a4.089,4.089,0,0,0-3.738,2.417c-.195.432-5.085,11.417-5.683,12.752a1.319,1.319,0,0,1-2.418-.056,4.057,4.057,0,0,0,3.745,2.562h2.111A4.1,4.1,0,0,0,60.3,204.519Z" transform="translate(-44.077 -189.187)" fill="url(#linear-gradient-2)"/>
      <path id="Path_267" data-name="Path 267" d="M131.885,192.107s-1.057-2.395-3.2-2.395h-3.3a6.172,6.172,0,0,0-1.4.7s6.1,13.691,6.36,14.281a4.2,4.2,0,0,0,3.761,2.521,5.177,5.177,0,0,0,3.772-1.669Z" transform="translate(-98.506 -189.578)" fill="url(#linear-gradient-3)"/>
      <image id="Rectangle_2863" data-name="Rectangle 2863" width="7.428" height="9.478" transform="translate(31.25 7.387)" opacity="0.4" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAAlCAYAAAC+uuLPAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHNSURBVFhH7VYxTgMxEExIaBAFhIqWmpoHUNHT0CAKBA08h5KOD6BUfICOkm+EH0CYsbzWes++WydKqow0mvX67PFufKeMl8vlaNvYi7pV7Ew3ip3pRrEz3SiaTJ9PZhNwHIcro7XSCThd19z9wYfJIeQvkotS/LL4obrRYnoEKZrqGAcY3LClvVNFtjm02tLTelel2OQUYqtK1RnN4lLl3kpZxT5YrRDU+RSzcmiGQVMsOoPIRjQmZXMvM3gq1YtrVZbIZ8PzOPgBNKHXFA+fQ0ob1lg6lJgnDFVqF+rN7Jy0vvZcQvX2osoLiNxGTS7QN1Xntdo8b/IC2lupp7raXClPBvSZyoN9m3iY1qN7fN/Lppi8hNjFQxyqnuRv3v1NYXgFsb+NJ9ZkvjQXcuOn2fG1TQ7EreNOzPZKS+yXxtMuPdbzvQztRUtvMOAp7InT6ZSW5rwxX5tvMb3VE2DzZmbciWH2BQ1IFwnGd5DqokKsxzafcjD7hGbQpveQbIEhc6U8SdDgI8a9yF4ZGD9AuIneXOLfGHeMYTaHumE/DvybITdTbqTEcrvTHMzeWw2JrFIC1T7GkLCVhRhGb9CV0TEVGHOCZq8xXgOj0T80LTRWKkyHuwAAAABJRU5ErkJggg==" style={{ mixBlendMode:'overlay', isolation:'isolate'}}/>
      <path id="Path_268" data-name="Path 268" d="M158.292,204.519l6.829-15.332h-4.484A4.089,4.089,0,0,0,156.9,191.6c-.195.432-5.085,11.417-5.684,12.752a1.319,1.319,0,0,1-2.417-.056,4.057,4.057,0,0,0,3.745,2.562h2.111A4.1,4.1,0,0,0,158.292,204.519Z" transform="translate(-116.967 -189.187)" fill="url(#linear-gradient-2)"/>
      <image id="Rectangle_2864" data-name="Rectangle 2864" width="7.428" height="9.222" transform="translate(26.639 1.496)" opacity="0.4" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAAkCAYAAAB15jFqAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAG4SURBVFhH7ZY9TsQwEIUTOAHLVSioqOjoaKmhgeNQUVDScQEuQE+JOAI/FUL8hveSjDUZj50/BZp90ujZM2N/9m6U3bKqqmKuzrZXJ+0w0vnT80U7DJoFzcG0LHgSdChMS4NHQafAtASchQJyDCub2XwloQAdwTYQhEnIXHySIihghzANs6BcbbAI5iICD2AfKj6NezUdX4hvxA+iV+Xpamsfbm9B0W1ezyU2zTzVF0ToHh0hjXqBbEDZuu2z46gPH+0lvIbutkkW9WIvlxvbOVXnAbtqpo3qBwnf6Q7HCLuwL+fVOnUAr+EdsUjJA/Heun5Ycjkb7Al9HpCqoSjewbynkuHlU736MOxxJTelpFEvkjHDu7FElMNFbuCuAhRNDzC9kBDZjO7BpGbH9KT0TSm7UDazwZrUo+8XF7iFJ2WhGmQ/ztQhvHpWHShO+Aizmwlcf9y6LqEPmZW9KeVt6OX0Iej1GAe/h2cVQbHoDSYbh81GRK+SP+J4S8nbpfOGUTldq/M48Au8V9l/DlbtQQJEhUBf4b0aBbVShyCQv6mDNAs6VTzln2sNXVRr6KJaQxfVP0CL4hdNiSfWTI6xfQAAAABJRU5ErkJggg==" style={{ mixBlendMode:'overlay', isolation:'isolate'}}/>
      <path id="Path_269" data-name="Path 269" d="M98.012,191.53l-6.829,15.332h4.484a4.09,4.09,0,0,0,3.738-2.417c.195-.432,5.085-11.417,5.683-12.752a1.319,1.319,0,0,1,2.418.056,4.057,4.057,0,0,0-3.745-2.562H101.65A4.1,4.1,0,0,0,98.012,191.53Z" transform="translate(-74.11 -189.187)" fill="url(#linear-gradient-5)"/>
      <path id="Path_270" data-name="Path 270" d="M160.637,189.187A4.089,4.089,0,0,0,156.9,191.6c-.195.432-5.085,11.417-5.684,12.752a1.319,1.319,0,0,1-2.417-.056,4.966,4.966,0,0,0,.437.785,1.458,1.458,0,0,0,2.183-.571c.6-1.334,5.542-12.477,5.737-12.909a4.089,4.089,0,0,1,3.738-2.417Z" transform="translate(-116.967 -189.187)" fill="#ffe600" style={{ mixBlendMode:'overlay', isolation:'isolate'}}/>
      <path id="Path_271" data-name="Path 271" d="M69.869,190.673a3.657,3.657,0,0,0-.465.753s-3.537,7.9-4.648,10.4a19.687,19.687,0,0,0,9.96-6.412c.8-1.8,1.462-3.281,1.659-3.719a1.678,1.678,0,0,1,.1-.18l1.036-2.325H73.022A4.027,4.027,0,0,0,69.869,190.673Z" transform="translate(-54.452 -189.187)" opacity="0.3" fill="url(#linear-gradient-6)"/>
      <path id="Path_272" data-name="Path 272" d="M167.859,190.673a3.657,3.657,0,0,0-.465.753s-3.537,7.9-4.648,10.4a19.685,19.685,0,0,0,9.96-6.412c.8-1.8,1.462-3.281,1.659-3.719a1.681,1.681,0,0,1,.1-.18l1.036-2.325h-4.484A4.027,4.027,0,0,0,167.859,190.673Z" transform="translate(-127.342 -189.187)" opacity="0.3" fill="url(#linear-gradient-7)"/>
      <path id="Path_273" data-name="Path 273" d="M62.637,189.187A4.089,4.089,0,0,0,58.9,191.6c-.195.432-5.085,11.417-5.684,12.752A1.319,1.319,0,0,1,50.8,204.3a4.967,4.967,0,0,0,.437.785,1.458,1.458,0,0,0,2.183-.571c.6-1.334,5.542-12.477,5.737-12.909a4.089,4.089,0,0,1,3.738-2.417Z" transform="translate(-44.07 -189.187)" fill="#ffe600" style={{ mixBlendMode:'overlay', isolation:'isolate'}}/>
      <path id="Path_274" data-name="Path 274" d="M99.964,201.824a19.685,19.685,0,0,0,9.96-6.412c.8-1.8,1.462-3.281,1.659-3.719a1.319,1.319,0,0,1,2.418.056,4.057,4.057,0,0,0-3.745-2.562h-2.111a4.044,4.044,0,0,0-2.732,1.106,3.835,3.835,0,0,0-.8,1.132S101.075,199.325,99.964,201.824Z" transform="translate(-80.642 -189.187)" opacity="0.3" fill="url(#linear-gradient-8)"/>
      <path id="Path_275" data-name="Path 275" d="M107.964,211.18a4.089,4.089,0,0,0,3.738-2.417c.195-.432,5.085-11.417,5.684-12.752a1.318,1.318,0,0,1,2.417.056,4.959,4.959,0,0,0-.437-.785,1.458,1.458,0,0,0-2.183.571c-.6,1.334-5.542,12.477-5.737,12.909a4.089,4.089,0,0,1-3.738,2.417Z" transform="translate(-86.402 -193.505)" fill="#ffe600" style={{ mixBlendMode:'overlay', isolation:'isolate'}}/>
    </g>
  </g>
</svg>
    ),
    url : "https://vnreview.vn/forums/",
  },
  {
    icon:(
      <svg xmlns="http://www.w3.org/2000/svg" 
      width="30" 
      height="30" 
      viewBox="0 0 30 30"
      aria-label="Whitehat"
      >
  <g id="Group_8410" data-name="Group 8410" transform="translate(-6032 107)">
    <g id="Group_669" data-name="Group 669" transform="translate(6032 -107)">
      <path id="Path_476" data-name="Path 476" d="M-60.195,303.381c-.146.125-.3.243-.45.362C-60.493,303.624-60.342,303.506-60.195,303.381Z" transform="translate(83.963 -277.946)" fill="#fff"/>
      <path id="Path_477" data-name="Path 477" d="M-79.376,304.218a15.27,15.27,0,0,1-1.368-1.09A14.462,14.462,0,0,0-79.376,304.218Z" transform="translate(85.589 -277.925)" fill="#fff"/>
      <path id="Path_478" data-name="Path 478" d="M-77.625,305.3c-.11-.059-.221-.116-.33-.177C-77.846,305.187-77.735,305.246-77.625,305.3Z" transform="translate(85.364 -278.087)" fill="#fff"/>
      <path id="Path_479" data-name="Path 479" d="M-58.157,301.346l-.09.109C-58.217,301.419-58.186,301.383-58.157,301.346Z" transform="translate(83.769 -277.781)" fill="#fff"/>
      <path id="Path_480" data-name="Path 480" d="M-78.7,304.673c-.175-.11-.353-.216-.522-.334C-79.05,304.457-78.874,304.562-78.7,304.673Z" transform="translate(85.466 -278.023)" fill="#fff"/>
      <path id="Path_481" data-name="Path 481" d="M-82.4,301.439l-.052-.062Z" transform="translate(85.727 -277.783)" fill="#fff"/>
      <path id="Path_482" data-name="Path 482" d="M-61.674,304.5c.124-.082.244-.168.365-.254C-61.43,304.332-61.55,304.419-61.674,304.5Z" transform="translate(84.046 -278.016)" fill="#fff"/>
      <path id="Path_483" data-name="Path 483" d="M-81.287,302.631c-.114-.109-.222-.224-.333-.338C-81.51,302.408-81.4,302.521-81.287,302.631Z" transform="translate(85.66 -277.858)" fill="#fff"/>
      <path id="Path_484" data-name="Path 484" d="M-59.3,302.584c.088-.086.172-.177.257-.266C-59.132,302.406-59.215,302.5-59.3,302.584Z" transform="translate(83.854 -277.86)" fill="#fff"/>
      <path id="Path_485" data-name="Path 485" d="M-68.276,299.885c.141-.369.5-.324,1.1-.175,1.872.465,1.655-.132,1.64-.9s-.063-.766.391-.987.408-.472.256-.625-.289-.206-.085-.276c.644-.177.607-.42.483-.76s-.433-.7.434-.76.766-.337.057-1.838c-.46-.92-.735-1.076-.46-1.588.354-.5.289-.56-.122-1.4,2.142-1.017,3.42-2.092,3.235-2.893s-1.774-1.165-4.108-1.087a2.633,2.633,0,0,0-.057-.388l-.99-3.2-.011-.05A2.49,2.49,0,0,0-69.5,281.1l-6.936,1.767a2.579,2.579,0,0,0-1.851,3.1l.491,3.251a2.934,2.934,0,0,0,.108.348c-2.2,1.03-3.507,2.118-3.323,2.935.18.784,1.706,1.15,3.958,1.092a11.559,11.559,0,0,0,.276,1.131,16.993,16.993,0,0,0,1.459,2.652,10.276,10.276,0,0,1,.735,2.547c.231,1.258-.63,2.583-1.71,4.131a14.38,14.38,0,0,0,5.118.951,14.373,14.373,0,0,0,6.854-1.73C-65.98,301.79-68.489,300.444-68.276,299.885Z" transform="translate(85.613 -276.137)" fill="#ffffff"/>
      <path id="Path_486" data-name="Path 486" d="M-79.223,304.337l-.032-.023Z" transform="translate(85.469 -278.021)" fill="#ea4117"/>
      <path id="Path_487" data-name="Path 487" d="M-62.845,305.187c.371-.206.727-.43,1.075-.664-.352.233-.711.454-1.084.655Z" transform="translate(84.142 -278.038)" fill="#ea4117"/>
      <path id="Path_488" data-name="Path 488" d="M-78.011,305.092c-.219-.122-.429-.256-.641-.39C-78.442,304.836-78.229,304.968-78.011,305.092Z" transform="translate(85.42 -278.053)" fill="#ea4117"/>
      <path id="Path_489" data-name="Path 489" d="M-76.041,306.053l.023-.032a14.45,14.45,0,0,1-1.578-.7A15.434,15.434,0,0,0-76.041,306.053Z" transform="translate(85.335 -278.102)" fill="#ea4117"/>
      <path id="Path_490" data-name="Path 490" d="M-60.7,303.775c-.19.149-.383.294-.581.434C-61.079,304.068-60.886,303.924-60.7,303.775Z" transform="translate(84.014 -277.978)" fill="#ea4117"/>
      <path id="Path_491" data-name="Path 491" d="M-59.372,302.607c-.252.247-.514.483-.783.711C-59.886,303.09-59.624,302.853-59.372,302.607Z" transform="translate(83.923 -277.883)" fill="#ea4117"/>
      <path id="Path_492" data-name="Path 492" d="M-58.31,301.465c-.227.271-.468.529-.713.784Q-58.652,301.868-58.31,301.465Z" transform="translate(83.832 -277.791)" fill="#ea4117"/>
      <path id="Path_493" data-name="Path 493" d="M-81.682,302.224c-.244-.253-.484-.51-.71-.78Q-82.05,301.847-81.682,302.224Z" transform="translate(85.723 -277.789)" fill="#ea4117"/>
      <path id="Path_494" data-name="Path 494" d="M-80.786,303.09c-.159-.142-.32-.28-.472-.429C-81.1,302.809-80.945,302.95-80.786,303.09Z" transform="translate(85.631 -277.887)" fill="#ea4117"/>
      <path id="Path_495" data-name="Path 495" d="M-62.7,301.5c.152-.119.3-.237.45-.362.269-.228.531-.464.783-.711.088-.086.171-.177.257-.266.245-.255.486-.513.713-.784l.09-.109a14.371,14.371,0,0,0,3.258-9.13,14.435,14.435,0,0,0-14.435-14.435,14.435,14.435,0,0,0-14.435,14.435,14.374,14.374,0,0,0,3.278,9.158l.052.063c.225.27.466.528.71.78.11.114.219.229.333.338.153.149.313.288.472.429A15.278,15.278,0,0,0-79.8,302l.032.023c.169.118.347.223.522.334.211.133.422.267.641.39.108.062.22.119.33.177a14.454,14.454,0,0,0,1.578.7c1.081-1.549,1.941-2.873,1.71-4.131a10.276,10.276,0,0,0-.735-2.547,16.993,16.993,0,0,1-1.459-2.652,11.558,11.558,0,0,1-.276-1.131c-2.252.058-3.777-.308-3.958-1.092-.184-.816,1.128-1.9,3.323-2.935a2.936,2.936,0,0,1-.108-.348l-.491-3.251a2.579,2.579,0,0,1,1.851-3.1l6.936-1.767a2.49,2.49,0,0,1,2.992,1.862l.011.05.99,3.2a2.631,2.631,0,0,1,.057.388c2.334-.078,3.924.286,4.108,1.087s-1.093,1.876-3.235,2.893c.411.839.476.9.122,1.4-.276.512,0,.668.46,1.588.709,1.5.81,1.776-.057,1.838s-.557.42-.434.76.161.583-.483.76c-.2.07-.068.123.085.276s.2.4-.255.625-.406.221-.391.987.233,1.364-1.64.9c-.6-.149-.962-.195-1.1.175-.213.559,2.3,1.905,3.952,3.392.372-.2.732-.423,1.084-.655.124-.082.244-.168.365-.254C-63.081,301.8-62.888,301.652-62.7,301.5Z" transform="translate(86.016 -275.706)" fill="transparent"/>
    </g>
  </g>
</svg>
    ),
    url: "https://whitehat.vn/",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="30"
        fill="currentColor"
        className="bi bi-facebook"
        viewBox="0 0 22 22"
        aria-label="Facebook"
      >
<path d="M22 12.07C22 6.48 17.52 2 12 2S2 6.48 2 12.07c0 5.01 3.66 9.17 8.44 9.92v-7.03H7.9V12.1h2.54V9.79c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.23.19 2.23.19v2.4h-1.26c-1.24 0-1.63.77-1.63 1.55v1.87h2.78l-.44 2.86h-2.34v7.03c4.78-.75 8.44-4.91 8.44-9.92z" fill="#ffffff"/>
</svg>
    ),

    url: "https://www.facebook.com/BkavCS",
  },

];

