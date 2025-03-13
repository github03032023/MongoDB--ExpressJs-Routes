const District = require('../model/districtModel');
const State = require('../model/stateModel');

module.exports = {
    //  Add a new district
    addDistrict: async (req, res) => {
        try {
            const { name, population, state_id } = req.body;

            // Check if state exists
            const stateExists = await State.findById(state_id);
            if (!stateExists) {
                return res.status(400).json({
                    success: false,
                    message: "State ID is invalid or does not exist."
                });
            }

            // Create new district
            const newDistrict = new District({ name, population, state_id });
            await newDistrict.save();

            res.status(201).json({
                success: true,
                message: "District added successfully",
                data: newDistrict
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
            res.status(500).json({
                success: false,
                statusCode: 500,
                message: "Internal Server Error",
                error: error.message,
            });
        }
    },
    // Update District Population
    updateDistrictPopulation: async (req, res) => {
        try {
            // Get district name from URL params
            const { name } = req.params;
            // Get new population from request body
            const { population } = req.body;

            console.log(`Updating population for district: ${name} to ${population}`);

            // Validate request data
            if (!name || !population || isNaN(population) || population <= 0) {
                return res.status(400).json({
                    success: false,
                    statusCode: 400,
                    message: "Valid district name and positive population number are required."
                });
            }

            // Find and update the district
            const updatedDistrict = await District.findOneAndUpdate(
                { name: new RegExp(`^${name}$`, 'i') }, // Case insensitive search
                { $set: { population } },
                { new: true } // Return updated document
            );

            if (!updatedDistrict) {
                return res.status(404).json({
                    success: false,
                    statusCode: 404,
                    message: "District not found."
                });
            }

            return res.status(200).json({
                success: true,
                statusCode: 200,
                message: "District population updated successfully.",
                district: updatedDistrict
            });

        } catch (error) {
            console.error("Error updating district population:", error);
            return res.status(500).json({
                success: false,
                statusCode: 500,
                message: "Internal Server Error"
            });
        }
    },
    deleteDistrictData: async (req, res) => {
        try {
            console.log("Inside deleteDistrict***************");
            const districtName = req.params.name;
            console.log(" District is-", districtName);

            // Find and delete the district by name
            const deletedDistrict = await District.findOneAndDelete({ name: districtName });
            console.log("Deleted District is-", deletedDistrict);

            if (!deletedDistrict) {
                return res.status(404).json({
                    success: false,
                    statusCode: 404,
                    message: "District not found"
                });
            }

            return res.status(200).json({
                success: true,
                statusCode: 200,
                message: `District '${districtName}' deleted successfully`,
                data: deletedDistrict
            });

        } catch (error) {
            console.error("Error deleting district:", error);
            return res.status(500).json({
                success: false,
                statusCode: 500,
                message: "Internal Server Error"
            });
        }
    },
    // Group and Sort Districts by Population
    groupAndSortDistrictsByState: async (req, res) => {
        try {
            const result = await District.aggregate([
                {
                    $group: {
                        _id: "$state_id", // Group by state_id
                        totalPopulation: { $sum: "$population" }
                    }
                },
                {
                    $lookup: {
                        from: "states", // Name of the states collection
                        localField: "_id", // state_id from districts
                        foreignField: "_id", // _id from states
                        as: "stateInfo"
                    }
                },
                {
                    $unwind: "$stateInfo" // Convert stateInfo array into object
                },
                {
                    $project: {
                        _id: 0, // Hide _id
                        state: "$stateInfo.name", // Get state name
                        totalPopulation: 1
                    }
                },
                {
                    $sort: { totalPopulation: -1 } // Sort by total population (desc)
                }
            ]);

            return res.status(200).json({
                success: true,
                statusCode: 200,
                message: "Districts grouped and sorted by state successfully.",
                data: result
            });

        } catch (error) {
            console.error("Error:", error);
            return res.status(500).json({
                success: false,
                statusCode: 500,
                message: "Internal Server Error"
            });
        }

    },

    // Join States with Districts
    getDistrictsWithStates: async (req, res) => {
        try {
            const result = await District.aggregate([
                {
                    $lookup: {
                        from: "states", // Name of the states collection
                        localField: "state_id", // state_id from districts
                        foreignField: "_id", // _id from states
                        as: "stateDetails"
                    }
                },
                {
                    $unwind: "$stateDetails" // Convert stateDetails array into object
                },
                {
                    $project: {
                        _id: 0, // Hide _id
                        district: "$name", // District name
                        population: 1,
                        state: "$stateDetails.name", // State name
                        statePopulation: "$stateDetails.population",
                        stateArea: "$stateDetails.area",
                        stateCapital: "$stateDetails.capital"
                    }
                }
            ]);

            return res.status(200).json({
                success: true,
                statusCode: 200,
                message: "Districts joined with states successfully.",
                data: result
            });

        } catch (error) {
            console.error("Error:", error);
            return res.status(500).json({
                success: false,
                statusCode: 500,
                message: "Internal Server Error"
            });
        }


    },
    // Get All Districts
    getAllDistricts: async (req, res) => {
        try {
            const districts = await District.find({}).populate('state_id', 'name');

            if (districts.length === 0) {
                return res.status(404).json({
                    success: false,
                    statusCode: 404,
                    message: "No districts found."
                });
            }

            res.status(200).json({
                success: true,
                statusCode: 200,
                message: "Districts retrieved successfully.",
                data: districts
            });

        } catch (error) {
            console.error("Error fetching districts:", error);
            res.status(500).json({
                success: false,
                statusCode: 500,
                message: "Internal Server Error"
            });
        }
    }


};
