import { cn } from "~/lib/utils";

export function JSIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="6 6 38 38">
      <path
        fill="#ffffff"
        stroke="#000000"
        strokeWidth={2}
        strokeLinecap="round"
        strokeMiterlimit={10}
        d="M6.667,45C5.75,45,5,44.25,5,43.333V6.667C5,5.75,5.75,5,6.667,5h36.667C44.25,5,45,5.75,45,6.667v36.667C45,44.25,44.25,45,43.333,45H6.667z"
      />
      <path d="M32,36c0.818,1.335,1.707,2.614,3.589,2.614c1.581,0,2.411-0.79,2.411-1.882c0-1.308-0.858-1.772-2.598-2.533l-0.954-0.409c-2.753-1.173-4.583-2.643-4.583-5.749c0-2.862,2.18-5.04,5.588-5.04c2.426,0,4.17,0.844,5.427,3.055l-2.971,1.908c-0.654-1.173-1.36-1.635-2.456-1.635c-1.118,0-1.826,0.709-1.826,1.635c0,1.145,0.709,1.608,2.346,2.317l0.954,0.409C40.17,32.079,42,33.496,42,36.683C42,40.118,39.301,42,35.677,42c-3.544,0-5.557-1.787-6.677-4L32,36z" />
      <path d="M18.143,36.097C18.75,37.173,19.673,38,21,38c1.269,0,2-0.496,2-2.426V23h4v13.182C27,40.18,24.656,42,21.234,42c-3.092,0-5.324-2.073-6.234-4L18.143,36.097z" />
    </svg>
  );
}

export function CIcon() {
  return <></>;
}

export function CPPIcon() {
  return (
    <svg
      fill="#ffffff"
      viewBox="0 0 24 24"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>C++ icon</title>
      <path d="M22.393 6c-.167-.29-.398-.543-.652-.69L12.925.22c-.508-.293-1.339-.293-1.847 0L2.26 5.31c-.508.293-.923 1.013-.923 1.6v10.18c0 .294.104.62.271.91.167.29.398.543.652.689l8.816 5.091c.508.293 1.339.293 1.847 0l8.816-5.091c.254-.146.485-.399.652-.689s.271-.616.271-.91V6.91c.002-.294-.102-.62-.269-.91zM12 19.109c-3.92 0-7.109-3.189-7.109-7.109S8.08 4.891 12 4.891a7.133 7.133 0 0 1 6.156 3.552l-3.076 1.781A3.567 3.567 0 0 0 12 8.445c-1.96 0-3.554 1.595-3.554 3.555S10.04 15.555 12 15.555a3.57 3.57 0 0 0 3.08-1.778l3.077 1.78A7.135 7.135 0 0 1 12 19.109zm7.109-6.714h-.79v.79h-.79v-.79h-.79v-.79h.79v-.79h.79v.79h.79v.79zm2.962 0h-.79v.79h-.79v-.79h-.789v-.79h.789v-.79h.79v.79h.79v.79z" />
    </svg>
  );
}

export function GHIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 98 98"
      className="fill-white hover:fill-accent-foreground"
      preserveAspectRatio="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
      />
    </svg>
  );
}

export function GLIcon() {
  return (
    <svg
      fill="#ffffff"
      viewBox="0 0 24 18"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>OpenGL icon</title>
      <path d="M7.921 11.382v.376h.009a.696.696 0 0 1 .362-.336c.165-.07.346-.105.543-.105.219 0 .411.039.574.118.163.079.298.185.406.319a1.4 1.4 0 0 1 .244.464c.055.175.082.361.082.558 0 .197-.027.383-.08.558a1.325 1.325 0 0 1-.241.459 1.126 1.126 0 0 1-.406.308 1.345 1.345 0 0 1-.568.113 1.457 1.457 0 0 1-.488-.091.984.984 0 0 1-.239-.132.722.722 0 0 1-.189-.207h-.009v1.432H7.45v-3.835h.471zm1.671.986a1.01 1.01 0 0 0-.159-.33.78.78 0 0 0-.274-.231.849.849 0 0 0-.392-.086c-.157 0-.29.03-.4.091a.783.783 0 0 0-.268.239.992.992 0 0 0-.151.335 1.577 1.577 0 0 0 .003.775.966.966 0 0 0 .156.335.785.785 0 0 0 .276.233c.113.059.25.088.411.088.161 0 .295-.03.402-.091a.744.744 0 0 0 .26-.241c.066-.1.113-.214.142-.343.029-.129.044-.261.044-.397a1.343 1.343 0 0 0-.05-.377zm2.951 1.611c-.213.157-.48.236-.803.236a1.5 1.5 0 0 1-.591-.107 1.17 1.17 0 0 1-.421-.301 1.272 1.272 0 0 1-.256-.461 2.157 2.157 0 0 1-.096-.585c0-.211.033-.404.099-.579.066-.175.159-.327.278-.456a1.25 1.25 0 0 1 .424-.3c.163-.072.342-.107.537-.107.253 0 .463.051.63.153.167.102.301.232.402.39.101.158.171.33.209.516.039.186.054.364.047.532h-2.127c-.004.121.011.237.044.345a.779.779 0 0 0 .159.289.778.778 0 0 0 .28.201c.113.05.247.075.401.075a.826.826 0 0 0 .486-.134.654.654 0 0 0 .25-.408h.462c-.064.31-.201.544-.414.701zm-.114-1.78a.792.792 0 0 0-.743-.477.827.827 0 0 0-.326.062.737.737 0 0 0-.249.169.81.81 0 0 0-.164.249.926.926 0 0 0-.071.302h1.628a.93.93 0 0 0-.075-.305zm1.327-.817v.44h.009c.195-.337.504-.505.928-.505.188 0 .344.025.469.075.125.05.226.12.304.21.077.09.132.196.163.32s.047.261.047.411v1.827h-.471v-1.879a.546.546 0 0 0-.154-.408.582.582 0 0 0-.424-.15.978.978 0 0 0-.372.065.696.696 0 0 0-.262.183.785.785 0 0 0-.157.276 1.096 1.096 0 0 0-.052.346v1.568h-.471v-2.777h.443zm5.174 2.747a1.67 1.67 0 0 1-.644.131c-.342 0-.649-.058-.922-.174a1.976 1.976 0 0 1-.691-.48 2.112 2.112 0 0 1-.431-.719c-.1-.275-.15-.572-.15-.89 0-.326.05-.629.15-.909.1-.279.243-.523.43-.731.187-.208.417-.371.69-.49a2.3 2.3 0 0 1 .922-.177c.229 0 .451.034.665.101.215.068.408.167.581.297a1.6 1.6 0 0 1 .634 1.144h-.937c-.058-.244-.171-.427-.338-.55a1 1 0 0 0-.606-.183c-.221 0-.408.042-.563.125s-.279.196-.375.337a1.444 1.444 0 0 0-.209.48 2.327 2.327 0 0 0 0 1.092c.044.173.114.329.21.468.096.139.221.25.375.333.154.084.342.125.563.125.325 0 .577-.08.754-.241.177-.16.281-.393.31-.698h-.987v-.717h1.872v2.358h-.623l-.1-.495a1.44 1.44 0 0 1-.58.463zM21.825 9.8v3.55H24v.809h-3.154V9.8h.979zM3.801 13.98c.053.03.107.059.164.085.267.124.578.186.933.186.355 0 .666-.062.933-.186s.491-.292.67-.503c.179-.211.314-.454.404-.728.09-.274.135-.56.135-.856 0-.297-.045-.582-.135-.856a2.135 2.135 0 0 0-.404-.728 1.966 1.966 0 0 0-.67-.506 2.17 2.17 0 0 0-.933-.189c-.355 0-.666.063-.933.189l-.03.015c1.425-1.199 4.034-2.001 7.017-2.001 2.512 0 4.765.516 6.263 1.412-1.635-1.501-4.566-2.555-7.918-2.556C4.162 6.757 0 9.103 0 11.999c0 2.895 4.161 5.243 9.294 5.244 3.338.001 6.262-1.051 7.901-2.541-1.498.89-3.741 1.397-6.244 1.397-3.078-.001-5.759-.856-7.15-2.119zm.395-3.638c.196-.104.43-.156.702-.156.272 0 .506.052.702.156.196.104.357.241.483.412.125.171.217.363.276.577a2.43 2.43 0 0 1 0 1.3c-.059.214-.15.406-.276.576a1.393 1.393 0 0 1-.483.412c-.197.104-.43.155-.702.155a1.49 1.49 0 0 1-.702-.155 1.402 1.402 0 0 1-.483-.412 1.765 1.765 0 0 1-.276-.576 2.43 2.43 0 0 1 0-1.3 1.74 1.74 0 0 1 .276-.577c.125-.171.286-.308.483-.412z" />
    </svg>
  );
}

export function TSIcon() {
  return (
    <svg fill="#ffffff" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 16v16h32v-32h-32zM25.786 14.724c0.813 0.203 1.432 0.568 2.005 1.156 0.292 0.312 0.729 0.885 0.766 1.026 0.010 0.042-1.38 0.974-2.224 1.495-0.031 0.021-0.156-0.109-0.292-0.313-0.411-0.599-0.844-0.859-1.505-0.906-0.969-0.063-1.594 0.443-1.589 1.292-0.005 0.208 0.042 0.417 0.135 0.599 0.214 0.443 0.615 0.708 1.854 1.245 2.292 0.984 3.271 1.635 3.88 2.557 0.682 1.031 0.833 2.677 0.375 3.906-0.51 1.328-1.771 2.234-3.542 2.531-0.547 0.099-1.849 0.083-2.438-0.026-1.286-0.229-2.505-0.865-3.255-1.698-0.297-0.323-0.87-1.172-0.833-1.229 0.016-0.021 0.146-0.104 0.292-0.188s0.682-0.396 1.188-0.688l0.922-0.536 0.193 0.286c0.271 0.411 0.859 0.974 1.214 1.161 1.021 0.542 2.422 0.464 3.115-0.156 0.281-0.234 0.438-0.594 0.417-0.958 0-0.37-0.047-0.536-0.24-0.813-0.25-0.354-0.755-0.656-2.198-1.281-1.651-0.714-2.365-1.151-3.010-1.854-0.406-0.464-0.708-1.010-0.88-1.599-0.12-0.453-0.151-1.589-0.057-2.042 0.339-1.599 1.547-2.708 3.281-3.036 0.563-0.109 1.875-0.068 2.427 0.068zM18.276 16.063l0.010 1.307h-4.167v11.839h-2.948v-11.839h-4.161v-1.281c0-0.714 0.016-1.307 0.036-1.323 0.016-0.021 2.547-0.031 5.62-0.026l5.594 0.016z" />
    </svg>
  );
}

export function IconBase({
  children: icon,
  link,
  className,
}: {
  children: React.ReactNode;
  link?: string;
  className?: string;
}) {
  return (
    <a href={link} className={cn("min-w-8 text-center", className ?? "")}>
      {icon}
    </a>
  );
}
