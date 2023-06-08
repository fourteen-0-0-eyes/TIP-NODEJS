import { config } from "dotenv";
import { Request } from "express-serve-static-core";
import passport, { PassportStatic } from "passport";
import {
  ExtractJwt,
  Strategy,
  StrategyOptions,
  VerifiedCallback,
} from "passport-jwt";
import { getRepository } from "typeorm";
import { TJWTPayload, User } from "../entities/User";
import jwt from "jsonwebtoken";
import jwtGetUser from "../utils/jwtutils";

config();

export const authenticateUser = (passport: PassportStatic) => {
  const options: StrategyOptions = {
    secretOrKey: process.env.SECRET || "",
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
  };

  passport.use(
    new Strategy(
      options,
      async ({ id }: TJWTPayload, done: VerifiedCallback) => {
        try {
          const userRepository = getRepository(User);
          const user = await userRepository.findOne({ id });
          if (!user) throw new Error("Пользователь не авторизован");
          return done(null, user.getUserInfo());
        } catch (error) {
          return done(null, false);
        }
      }
    )
  );

    /* passport.use(
        new Strategy(
            options,
            async (token, done) => {
                try {
                    return done(null, token);
                } catch (error) {
                    return done(error);
                }
            }
        )
    ); */
};

export const expressAuthentication = async (
  _request: Request,
  securityName: string,
  _scopes?: string[]
): Promise<any> => {
  if (securityName === "jwt"){
      if (_request.headers.authorization){
          try{
              if(await jwtGetUser(_request)){
                  return passport.authenticate("jwt", {
                      session: false, failWithError : true
                  });
              }
          }
          // tslint:disable-next-line:no-empty
          catch {}
      }
  }

};
