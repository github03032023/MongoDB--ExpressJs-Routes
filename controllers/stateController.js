const stateModel = require("../model/stateModel");


module.exports = {
    // Add State
    addState: async (req, res) => {
        try {
            const { name, population, area, capital, climate } = req.body;
            console.log("Request Body is -", req.body);

            // ✅ Handle missing fields
            if (!name || !population || !area || !capital || !climate) {
                return res.status(400).json({
                    success: false,
                    statusCode: 400,
                    message: "All fields (name, population, area, capital, climate) are required",
                });
            }


            // ✅ Check if state already exists
            const existingState = await stateModel.findOne({ name });
            if (existingState) {
                return res.status(400).json({
                    success: false,
                    statusCode: 400,
                    message: "State with the same name already exists!",
                });
            }

            if (population > 1500000000 || area > 3300000) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid population or area size."
                });
            }

            // ✅ Save new state
            const newState = new stateModel({
                name,
                population,
                area,
                capital,
                climate
            });

            const savedState = await newState.save();

            console.log("State saved:", savedState);
            return res.status(201).json({
                success: true,
                statusCode: 201,
                message: "State added successfully",
                data: savedState,
            });

        } catch (error) {
            console.error("Error:", error);
            //CastError
            if (error.name === 'CastError') {
                return res.status(400).json({ error: 'Invalid ID format' });
            }
            //Validation Errors:
            if (error.name === 'ValidationError') {
                return res.status(400).json({ error: 'Validation failed', details: error.message });
            }
            return res.status(500).json({
                success: false,
                statusCode: 500,
                message: "Internal Server Error",
                error: error.message,
            });
        }
    },
    //Get the population of a specific state by name , EndPoint is /states/:name/population
    getStatePopulation: async (req, res) => {
        try {
            const { name } = req.params; // Get the state name from URL params
            console.log("Fetching population for state:", name);

            if (!name) {
                return res.status(400).json({
                    success: false,
                    statusCode: 400,
                    message: "State name is required."
                });
            }

            // Find the state by name (case insensitive)
            const state = await stateModel.findOne({ name: new RegExp(`^${name}$`, 'i') });

            if (!state) {
                return res.status(404).json({
                    success: false,
                    statusCode: 404,
                    message: "State not found."
                });
            }

            return res.status(200).json({
                success: true,
                statusCode: 200,
                state: state.name,
                population: state.population
            });

        } catch (error) {
            console.error("Error fetching state population:", error);
            return res.status(500).json({
                success: false,
                statusCode: 500,
                message: "Internal Server Error"
            });
        }
    },
    getTotalPopulation: async (req, res) => {
        try {
            // Aggregate total population across all states
            const result = await stateModel.aggregate([
                {
                    $group: {
                        _id: null,
                        totalPopulation: { $sum: "$population" }
                    }
                }
            ]);

            // Check if result is empty (no states found)
            if (result.length === 0) {
                return res.status(404).json({
                    success: false,
                    statusCode: 404,
                    message: "No states found"
                });
            }

            return res.status(200).json({
                success: true,
                statusCode: 200,
                message: "Total population calculated successfully",
                totalPopulation: result[0].totalPopulation
            });

        } catch (error) {
            console.error("Error calculating total population:", error);
            return res.status(500).json({
                success: false,
                statusCode: 500,
                message: "Internal Server Error"
            });
        }
    },
    getAveragePopulationDensity: async (req, res) => {
        try {
            const result = await stateModel.aggregate([
                {
                    $project: {
                        _id: 0,
                        state: "$name",
                        populationDensity: { $divide: ["$population", "$area"] }
                    }
                }
            ]);

            res.status(200).json({
                success: true,
                statusCode: 200,
                message: "Average population density calculated successfully.",
                data: result
            });

        } catch (error) {
            console.error("Error calculating average population density:", error);
            res.status(500).json({
                success: false,
                statusCode: 500,
                message: "Internal Server Error"
            });
        }
    },
    getAllStates: async (req, res) => {
        try {
            const states = await stateModel.find({});

            if (states.length === 0) {
                return res.status(404).json({
                    success: false,
                    statusCode: 404,
                    message: "No states found."
                });
            }

            res.status(200).json({
                success: true,
                statusCode: 200,
                message: "States retrieved successfully.",
                data: states
            });

        } catch (error) {
            console.error("Error fetching states:", error);
            res.status(500).json({
                success: false,
                statusCode: 500,
                message: "Internal Server Error"
            });
        }
    }
};
