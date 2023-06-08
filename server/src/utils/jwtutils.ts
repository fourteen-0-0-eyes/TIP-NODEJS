import {User} from "../entities";
import jwt from "jsonwebtoken";
import {getRepository} from "typeorm";

const jwtGetUser = async (
    request: any
): Promise<User | undefined> => {
    const authorization = request.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(authorization, process.env.SECRET);
    const userRepository = getRepository(User);
    // @ts-ignore
    return userRepository.findOne(decoded.id);
};

export default jwtGetUser;
