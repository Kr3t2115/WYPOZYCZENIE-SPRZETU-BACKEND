import {prisma} from "../config/db.js";

const getUserExistByEmail = async (email) => {
   return prisma.user.findUnique({
       where: {email: email}
   });
}

const getUserById = async (userId) => {
    return prisma.user.findUnique({
        where: {id: userId}
    });
}




export {getUserExistByEmail, getUserById};