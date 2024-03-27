
saveBranch = async (Model, userData, res) => {
    try {

        const newBar = new Model({
            branch_name: userData.branch_name,
            branch_email: userData.branch_email,
            branch_description: userData.branch_description,
            // branch_contact: userData.branch_contact,
            // branch_city: userData.branch_city,
            // branch_area: userData.branch_area,
            branch_address: userData.branch_address,
            branch_geocordinate: userData.branch_geocordinate,
            branch_type: userData.branch_type,
            parking_capacity: userData.parking_capacity,
            image: userData.image,
            // outdoor: userData.outdoor,
            // no_of_hall: userData.no_of_hall,
            // no_of_partition: userData.no_of_partition,
        });

        const branchName = userData.email ? userData.email : "";
        const savedBranch = await newBar.save();

        res.status(200).json({
            status: 200,
            data: {
                newBar
            },
            message: 'Branch has been created',
        });
    } catch (error) {
        console.error('Save Branch Error:', error);
        res.status(500).json({ status: 500, error: 'Internal Server Error during Branch creation' });
    }
};


upDateBranch = async (Model, branchData, imagePath) => {
    try {
        const { branch_name, branch_email, branch_description, branch_address, branch_geocordinate, branch_type, parking_capacity } = branchData;

        const updatedData = {
            branch_name,
            branch_email,
            branch_description,
            branch_address,
            branch_geocordinate,
            branch_type,
            parking_capacity,
            image: imagePath
        };

        // Assuming Model is the Mongoose model for branches
        const updatedBranch = await Model.findByIdAndUpdate(branchData.branch_id, updatedData, { new: true });

        return updatedBranch;
    } catch (error) {
        console.error('Update Branch Error:', error);
        throw new Error('Internal Server Error during Branch update');
    }
};

module.exports = {
    saveBranch,
    upDateBranch
}
