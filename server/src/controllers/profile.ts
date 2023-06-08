import {
  Controller,
  FormField,
  Post,
  Request,
  Route,
  Security,
  Tags,
  UploadedFile,
} from "tsoa";
import { User } from "../entities";
import { Profile } from "../entities/Profile";
import {
  ProfileService,
  TProfileCreatePayload,
} from "../services/profile";

export type TCreateProfilePayload = Omit<
  TProfileCreatePayload,
  "user" | "socials"
>

@Route("profiles")
@Tags("User")
export class ProfileController extends Controller {
  private profileService;
  constructor() {
    super();
    this.profileService = new ProfileService();
  }


  @Post("/")
  @Security("jwt")
  public async createProfile(
    @FormField() facebook: string,
    @FormField() twitter: string,
    @FormField() github: string,
    @FormField() linkedin: string,
    @UploadedFile("avatar") avatar: Express.Multer.File,
    @Request() req: any
  ): Promise<Profile> {

    const user = req.user;

    // Create profile using SocialLinks and User
    const profile = await this.profileService.createProfile({
      avatar: avatar.originalname,
      user: new User()
    });

    return profile;
  }
}
