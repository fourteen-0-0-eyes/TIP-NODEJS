import {
    Body,
    Controller,
    Get,
    Path,
    Post,
    Put, Request,
    Route, Security,
    SuccessResponse,
    Tags,
} from "tsoa";
import {Address, OrderItem, User} from "../entities";
import {TPartialUser, TUserCredentials} from "../entities/User";
import {
  IMessageResponse,
  TLoginPayload,
  TPasswordResetPayload,
  TRegisterPayload,
  UserService,
} from "../services/user";
import jwtGetUser from "../utils/jwtutils";


type TAuthHeader = { Authorization: string };


@Route("users")
@Tags("User")
export class UserController extends Controller {
  private userService;
  constructor() {
    super();
    this.userService = new UserService();
  }


  @SuccessResponse(200, "Get all users successfully")
  @Get("/")
  public async getUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }


  @SuccessResponse(200, "Get user with given id successfully")
  @Get("/:id")
  @Security('jwt')
  public async getUser(@Path() id: number,
                       @Request() req: any): Promise<User | null> {
      if(req.isAuthenticated()){
          const user = await jwtGetUser(req);
          if (user) {
              return this.userService.getUser(id);
          }
      }
      return null;
  }

  @Post("/login")
  @SuccessResponse<{ Authorization: string }>(
    "Logged in successfully, received user info and jwt token in header"
  )
  public async login(
    @Body() body: TLoginPayload
  ): Promise<TPartialUser> {
    const response = await this.userService.login(body);
    this.setHeader("Authorization", response.token);
    return response.user;
  }

  @SuccessResponse("201", "User account created")
  @Post("/register")
  public async register(
    @Body() body: TRegisterPayload
  ): Promise<TPartialUser> {
    return this.userService.register(body);
  }


  @Get("/verify-account/:verificationCode")
  @SuccessResponse("200", "User account verified succesfully")
  public async verificateCode(
    @Path() verificationCode: string
  ): Promise<TPartialUser> {
    return this.userService.verificateCode(verificationCode);
  }

  @SuccessResponse(
    200,
    "Reset password request successful, email with reset password link sent to the given email"
  )
  @Post("/reset-password/")
  public async resetPassword(
    @Body() body: { email: string }
  ): Promise<IMessageResponse> {
    const { email } = body;
    return this.userService.resetPassword(email);
  }

  @Get("/reset-password/:resetPasswordToken")
  public async resetPasswordCheck(
    @Path() resetPasswordToken: string
  ): Promise<boolean> {
    return this.userService.resetPasswordCheck(resetPasswordToken);
  }

  @Put("reset-password")
  public async resetPasswordSave(
    @Body() body: TPasswordResetPayload
  ): Promise<IMessageResponse> {
    return this.userService.resetPasswordSave(body);
  }

    @SuccessResponse(200, "User with given id has modified")
    @Post("/:id")
    public async updateUser(@Path() id: number,
                            @Body() body: TUserCredentials,
                            @Request() req: any): Promise<User | null> {
        return this.userService.updateUser(id ,body);
    }

    @SuccessResponse(200, "Get user address with given id successfully")
    @Get("/:id/credentials")
    public async getUserCredentials(@Path() id: number,
                                    @Request() req: any): Promise<TUserCredentials | null> {
      return this.userService.getUserCredentials(id)
    }

    @Get("/:id/contracts")
    public async getUserContracts(@Path() id: number): Promise<OrderItem[] | null> {
        return this.userService.getUserContracts(id);
    }
}
