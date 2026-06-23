import {prisma} from "../config/db.js";

const checkUserExistByEmail = async (email) => {
   let a=  await prisma.user.findUnique({
       where: {email: email}
   });

   return a;
}




export {checkUserExistByEmail};