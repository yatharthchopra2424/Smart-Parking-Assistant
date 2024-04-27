import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './History.css';

const DataDisplay = () => {
    const [data, setData] = useState({ in: [], out: [] });

    useEffect(() => {
        axios.get('http://127.0.0.1:5002/data')
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error('Error fetching data: ', error);
            });
    }, []);

    return (
        <div className="container">
            <div className="in-section">
                <h2><button className="in-button">IN</button></h2>
                <table className="in-table styled-table">
                    <thead>
                        <tr className="active-row">
                            <th>Name</th>
                            <th>License Plate</th>
                            <th>Time</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.in.map((item, index) => (
                            <tr key={index}>
                                <td>{item.name}</td>
                                <td>{item.licensePlate}</td>
                                <td>{item.time}</td>
                                <td>{item.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="out-section">
                <h2><button className="out-button">OUT</button></h2>
                <table className="out-table styled-table">
                    <thead>
                        <tr className="active-row">
                            <th>Name</th>
                            <th>License Plate</th>
                            <th>Time</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.out.map((item, index) => (
                            <tr key={index}>
                                <td>{item.name}</td>
                                <td>{item.licensePlate}</td>
                                <td>{item.time}</td>
                                <td>{item.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DataDisplay;