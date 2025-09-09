

import React from "react";
import { DocsContextProvider } from "./Context/docsContext";
import DocsTemplate from "./DocsTemplate";
import "./docs.css";

const files = [
    { id: 1, name: "Bkav Anti DDOS", src: "/FilePDF/bkav-antiddos-datasheet.pdf" },
    { id: 2, name: "Bkav BTI", src: "/FilePDF/bkav-bti-datasheet.pdf" },
    { id: 3, name: "Bkav IPS", src: "/filePDF/bkav-ips-datasheet.pdf" },
    { id: 4, name: "Bkav PAM", src: "/filePDF/bkav-pam-datasheet.pdf" },
    { id: 5, name: "Bkav SIEM", src: "/filePDF/bkav-siem-datasheet.pdf" },
    { id: 6, name: "Bkav WAF", src: "/filePDF/bkav-waf-datasheet.pdf" },
    { id: 7, name: "Bkav SOAR", src: "/filePDF/bkav-soar-datasheet.pdf" },
];

const Docs: React.FC = () => {
    return (
        <DocsContextProvider value={{}}>
            <div className="Docs">
                <DocsTemplate />
                <h1>Tài Liệu</h1>
                <p>Đây hoàn toàn là tài liệu miễn phí, bạn có thể tải về và đọc.</p>
                <div className="docs-grid">
                    {files.map((file) => {
                        return (
                            <a className="docs-link" key={file.id} href={file.src} download>{file.name}  
                            </a>
                        );
                    })}
                </div>
            </div>
        </DocsContextProvider>
    );
};

export default Docs;
