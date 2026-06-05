const getAllAttributes = async (req, res) => {
    if (req.user) {
        return res.status(200).json({
            message: "Logowanie udane"
        });
    }
    else {
        return res.status(401).json({
            message: "Logowanie nieudane sadeg"
        });
    }
}

export {getAllAttributes}