import Hotel from '../models/Hotel.js'
import Room from '../models/Room.js'

export const createHotel = async (req, res, next) => {
    const newHotel = new Hotel(req.body)
    try {
        const savedHotel = await newHotel.save()
        res.status(200).json(savedHotel)
    } catch (err) {
        next(err)
    }
}

export const updateHotel = async (req, res, next) => {
    try {
        const updateHotel = await Hotel.findByIdAndUpdate(req.params.id,
            { $set: req.body },
            { new: true })
        res.status(200).json(updateHotel)
    } catch (err) {
        next(err)
    }
}

export const deleteHotel = async (req, res, next) => {
    try {
        await Hotel.findByIdAndDelete(req.params.id)
        res.status(200).json("Hotel Deleted")
    } catch (err) {
        next(err)
    }
}

export const getHotel = async (req, res, next) => {
    try {
        const hotel = await Hotel.findById(req.params.id)
        res.status(200).json(hotel)
    } catch (err) {
        next(err)
    }
}

export const getHotels = async (req, res, next) => {
    try {
        const { min, max, limit, ...others } = req.query;
        const minPrice = parseInt(min, 10) || 0;
        const maxPrice = parseInt(max, 10) || Number.MAX_SAFE_INTEGER;
        const limitValue = parseInt(limit, 10) || 10;

        const hotels = await Hotel.find({ 
            ...others, 
            cheapestPrice: { $gt: minPrice, $lt: maxPrice } 
        }).limit(limitValue);

        res.status(200).json(hotels);
    } catch (err) {
        next(err);
    }
};

export const countByCity = async (req, res, next) => {
    const cities = req.query.cities.split(",")
    try {
        const list = await Promise.all(cities.map(city => {
            return Hotel.countDocuments({ city: city })
        }))
        res.status(200).json(list)
    } catch (err) {
        next(err)
    }
}

export const countByType = async (req, res, next) => {
    try {
        const [
            hotelCount,
            apartmentCount,
            resortCount,
            villaCount,
            cabinCount
        ] = await Promise.all([
            Hotel.countDocuments({ type: "hotel" }),
            Hotel.countDocuments({ type: "apartment" }),
            Hotel.countDocuments({ type: "resort" }),
            Hotel.countDocuments({ type: "villa" }),
            Hotel.countDocuments({ type: "cabin" })
        ]);

        res.status(200).json([
            { type: "hotel", count: hotelCount },
            { type: "apartment", count: apartmentCount },
            { type: "resort", count: resortCount },
            { type: "villa", count: villaCount },
            { type: "cabin", count: cabinCount }
        ]);
    } catch (err) {
        next(err);
    }
}

export const getHotelRooms = async (req, res, next) => {
    try {
        const hotel = await Hotel.findById(req.params.id); 
        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }

        const roomPromises = hotel.rooms.map(roomId => {
            return Room.findById(roomId); 
        });

        const rooms = await Promise.all(roomPromises); 
        res.status(200).json(rooms);
    } catch (err) {
        next(err);
    }
};