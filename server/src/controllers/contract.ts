import { Body, Get, Path, Post, Route, Tags, Controller } from "tsoa";
import {Contract, OrderItem} from "../entities";
import {
  createContract,
  getContract,
  getContracts,
  ICreateContractpayload,
  IGetContractsPayload,
  IGetContractsReturn,
} from "../services/contract";
import {UserService} from "../services/user";

@Route("contracts")
@Tags("Contract")
export class ContractsController extends Controller{

    private userService;
    constructor() {
        super();
        this.userService = new UserService();
    }

  @Post("/")
  public async getContracts(
    @Body() payload: IGetContractsPayload
  ): Promise<IGetContractsReturn> {
    return getContracts(payload);
  }

  @Get("/:id")
  public async getContract(@Path() id: string): Promise<Contract | null> {
    return getContract(Number(id));
  }

  @Post("/create")
  public async createContract(
    @Body() payload: ICreateContractpayload
  ): Promise<Contract | null> {
    return createContract(payload);
  }

    @Post("/order")
  public async orderContract(
      @Body() payload: {id: number, userId: number}
  ): Promise<OrderItem | null> {
      return this.userService.orderContract(payload.id, payload.userId)
  }

  @Post("/:id/renewal")
  public async contractRenewal(@Path() id: number): Promise<OrderItem | null> {
        return this.userService.renewalContract(id);
  }
}
