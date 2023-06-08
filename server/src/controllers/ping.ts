import {Get, Request, Route, Security, SuccessResponse, Tags} from "tsoa";
import {authenticateUser} from "../middlewares/auth";
import passport from "passport";
import {IMessageResponse, UserService} from "../services/user";
import {ProfileService} from "../services/profile";
import {Controller} from "@tsoa/runtime";
import jwt from "jsonwebtoken";
import jwtGetUser from "../utils/jwtutils";

interface PingResponse {
  message: string;
}

@Route("ping")
export class PingController extends Controller {

    private userService;
    constructor() {
        super();
        this.userService = new UserService();
    }

  @Get("/")
  @Security("jwt")
  public async getMessage(
      @Request() req: any
  ): Promise<PingResponse> {
     // req.logout();
      if(req.isAuthenticated()){
          const user = await jwtGetUser(req);
          if (user) {
              return {
                  message: "pong",
              };
          }
      }

      return {
          message: "no access",
      };
  }

    @Get("/logout")
    @SuccessResponse("200", "Logout successful")
    public async logout (
        @Request() req: any
    ): Promise<PingResponse> {
        return {
            message: "Вы вышли из аккаунта"
        };
    }
}
