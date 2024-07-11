import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import useFetch from "../../hooks/useFetch";
import { useContext, useState, useEffect } from "react";
import { SearchContext } from "../../context/SearchContext";
import './reserve.css';
import axiosInstance from "../../hooks/axiosInstance";

const Reserve = ({ setOpen, hotelId }) => {
    const { data, loading, error } = useFetch(`/hotels/room/${hotelId}`);
    const [selectedRooms, setSelectedRooms] = useState([]);
    const { dates } = useContext(SearchContext);

    useEffect(() => {
        if (dates && dates[0].startDate && dates[0].endDate) {
            const selectedDates = getDatesInRange(dates[0].startDate, dates[0].endDate);
            const timestamps = selectedDates.map(date => date.getTime()); // Convert each date to timestamp
            console.log("Selected dates timestamps:", timestamps);
        } else {
            console.error("Invalid dates:", dates);
        }
    }, [dates]);

    const getDatesInRange = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const date = new Date(start.getTime());

        let list = [];

        while (date <= end) {
            list.push(new Date(date.getTime()));
            date.setDate(date.getDate() + 1);
        }

        return list;
    };

    const alldates = getDatesInRange(dates[0].startDate, dates[0].endDate);

    const isAvailable = (roomNumber) => {
        if (!roomNumber.unavailableDates) {
            return true;
        }
        const isFound = roomNumber.unavailableDates.some(date =>
            alldates.includes(new Date(date).getTime())
        );

        const isSelected = selectedRooms.includes(roomNumber._id);

        return !isFound && !isSelected;
    };

    const handleSelect = (e) => {
        const roomId = e.target.value;
        const isChecked = e.target.checked;

        if (isChecked) {
            setSelectedRooms((prevSelectedRooms) => [
                ...prevSelectedRooms,
                roomId,
            ]);
        } else {
            setSelectedRooms((prevSelectedRooms) =>
                prevSelectedRooms.filter((id) => id !== roomId)
            );
        }
    };

    const handleClick = async () => {
        try {
            await Promise.all(
                selectedRooms.map(roomId => {
                    const res = axiosInstance.put(`/rooms/availability/${roomId}`, {
                        dates: alldates
                    })
                    return res.data;
                })
            );
        } catch (err) {
            console.error("Error updating room availability:", err);
        }
    };

    return (
        <div className="reserve">
            <div className="rContainer">
                <FontAwesomeIcon
                    icon={faTimesCircle}
                    className="rClose"
                    onClick={() => setOpen(false)}
                />
                <span>Select your rooms: </span>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>Error: {error.message}</p>
                ) : (
                    data.map((item, index) => (
                        <div className="rItem" key={index}>
                            <div className="rItemInfo">
                                <div className="rTitle">{item.title}</div>
                                <div className="rDescription">{item.desc}</div>
                                <div className="rMax">
                                    Max People: <b>{item.maxPeople}</b>
                                </div>
                                <div className="rPrice">${item.price}</div>
                            </div>
                            <div className="rSelectRooms">
                                {item.roomNumbers.map((roomNumber) => (
                                    <div className="room">
                                        <label>{roomNumber.number}</label>
                                        <input
                                            type="checkbox"
                                            value={roomNumber._id}
                                            onChange={handleSelect}
                                            disabled={!isAvailable(roomNumber)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
                <button onClick={handleClick} className="rButton">Reserve Now!</button>
            </div>
        </div>
    );
};

export default Reserve;
