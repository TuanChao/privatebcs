import React, { useEffect, useState } from "react";
import "./Service.css";
import { ServiceContextProvider } from "./Context";
import { Link } from "react-router-dom";

const ServicePage: React.FC = () => {
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/Manage/CsService/Public")
            .then(res => res.json())
            .then(data => {
                const arr = Array.isArray(data) ? data : data.data || [];
                setServices(arr);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <ServiceContextProvider value={{}}>
            <div className="service-page animate-me">
                <h1 className="service-title">DỊCH VỤ AN NINH MẠNG</h1>
                <div className="service-product">
                    {loading ? (
                        <div>Đang tải...</div>
                    ) : services.length === 0 ? (
                        <div>Không có dịch vụ nào</div>
                    ) : (
                        services.map(service => (
                            <Link to={`/service/${service.id}`} className="service-link" key={service.id}>
                                <div
                                    className="product"
                                    style={{ backgroundImage: `url(${service.image})` }}
                                >
                                    <div className="service-item">
                                        <h2>{service.name}</h2>
                                        <p>{service.description}</p>
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </ServiceContextProvider>
    );
};

export default ServicePage;

