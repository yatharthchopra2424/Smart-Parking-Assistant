import React, { useRef, useState, useEffect } from 'react';
import Webcam from "react-webcam";
import axios from 'axios';
import './scans.css'; // Import the CSS file

const LicensePlateScanner = () => {
    const webcamRef = useRef(null);
    const [result, setResult] = useState(null);
    const [licensePlate, setLicensePlate] = useState('');
    const [error, setError] = useState(null);
    const [name, setName] = useState('');
    const [inOut, setInOut] = useState('');
    const [time, setTime] = useState(new Date().toLocaleTimeString());
    const [date, setDate] = useState(new Date().toLocaleDateString()); // Add this line

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date().toLocaleTimeString());
            setDate(new Date().toLocaleDateString()); // Add this line
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleSave = (event) => {
        event.preventDefault();
        axios.post('http://127.0.0.1:5002/save', { name, inOut, licensePlate, time, date }) // Add date here
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    const addLicensePlate = () => {
        setLicensePlate(result);
    };

    const takeScreenshotAndScan = React.useCallback(() => {
        const screenshot = webcamRef.current.getScreenshot({type: 'image/jpeg', quality: 1});
        const base64Response = screenshot.split(',')[1];
        const blob = atob(base64Response);
        let array = [];
        for(let i = 0; i < blob.length; i++) {
            array.push(blob.charCodeAt(i));
        }
        let file = new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
        const data = new FormData();
        data.append('image', file);

        axios.post('http://127.0.0.1:5001/scan', data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(function (response) {
            setResult(response.data.license_plates);
            setError(null);
        })
        .catch(function (error) {
            console.log(error);
            setError('An error occurred while scanning the image pls try again!');
            setResult(null);
        });
    }, [webcamRef]);

    return (
        <div className="container">
            <div className="webcam-container">
                <Webcam 
                    audio={false} 
                    ref={webcamRef} 
                    screenshotFormat="image/jpeg" 
                    videoConstraints={{
                        width: 640,
                        height: 480,
                    }}
                />
                <button onClick={takeScreenshotAndScan}>SCAN</button>
                <button onClick={addLicensePlate}>ADD</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {result && <div className="result-box">{result}</div>}
            </div>
            <div className="form-container">
                <form onSubmit={handleSave}>
                    <label>
                        Name:
                        <input type="text" value={name} onChange={e => setName(e.target.value)} />
                    </label>
                    <label>
                        In/Out:
                        <select value={inOut} onChange={e => setInOut(e.target.value)}>
                            <option defaultValue={""} value="">select</option>
                            <option value="in">In</option>
                            <option value="out">Out</option>
                        </select>
                    </label>
                    <label>
                        License Plate Number:
                        <input type="text" value={licensePlate} readOnly />
                    </label>
                    <label>
                        Time:
                        <input type="text" value={time} readOnly />
                    </label>
                    <label>
                        Date: {/* Add this label */}
                        <input type="text" value={date} readOnly />
                    </label>
                    <button type="submit">Save</button>
                </form>
            </div>
        </div>
    );
};

export default LicensePlateScanner;