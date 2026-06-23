import {prisma} from "../../config/db.js";
import http from "http2";

const getEquipmentById = async (req, res) => {

    const id = req.params.id;

    console.log("aaha ok");

    const equipmentCategory = await prisma.equipmentCategory.findUnique({
        where: { id: id },
    });

    if (!equipmentCategory) {
        return res.status(http.constants.HTTP_STATUS_NOT_FOUND).json({
            message: "This category does not exist",
        })
    }

    return res.status(http.constants.HTTP_STATUS_OK).json({
        ...equipmentCategory,
    })
}

export {getEquipmentById}