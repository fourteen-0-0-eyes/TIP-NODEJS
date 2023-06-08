// tslint:disable-next-line:no-implicit-dependencies
import {TPartialUser, TUserCredentials} from "src/entities/User";
import {ValidateError} from "tsoa";
import {getRepository, MoreThan, Repository} from "typeorm";
import {Address, Contract, Order, OrderItem, User} from "../entities";
import sendMail from "../utils/sendMail";
import {UserAddress} from "../entities/Address";


export interface IMessageResponse {
  message: string;
}

export type TRegisterPayload = {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  firstName?: string;
  lastName?: string;
};


export type TLoginPayload = {
  email: string;
  password: string;
};

export type TLoginResponse = { token: string; user: TPartialUser };


export type TPasswordResetPayload = {
  password: string;
  confirmPassword: string;
  resetPasswordToken: string;
};

export class UserService {
  private userRepository: Repository<User>;
  private addressRepository: Repository<Address>
  private contractRepository: Repository<Contract>
    private orderRepository: Repository<Order>
    private orderItemRepository: Repository<OrderItem>
  constructor() {
    this.userRepository = getRepository(User);
    this.addressRepository = getRepository(Address)
      this.contractRepository = getRepository(Contract)
      this.orderRepository = getRepository(Order)
      this.orderItemRepository = getRepository(OrderItem)
  }

  public async getUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  public async getUser(id: number): Promise<User | null> {
    const user = await this.userRepository.findOne({ id });
    return user || null;
  }

    public async getUserAddress(id: number): Promise<Address | null> {
        const user = await this.userRepository.findOne({ id });
        const address = await this.addressRepository.findOne({ user })
        return address || null;
    }

    public async getUserCredentials(id: number): Promise<TUserCredentials | null> {
        const user = await this.userRepository.findOne({ id });
        const address = await this.addressRepository.findOne({ user })
        if (user && address) {
            return {
                firstname: user.firstName ? user.firstName : "",
                lastname: user.lastName ? user.lastName : "",
                idNumber: user.verificationCode ? user.verificationCode : "",
                address: address.street
            };
        }
        return null;
    }

  public async updateUser(id: number, payload : TUserCredentials): Promise<User | null> {
      const user = await this.userRepository.findOne({ id });
      let address = await this.addressRepository.findOne({ user })
      if (user){
          if (!address){
              address = UserAddress.create()
              address.user = user;
              address.updatedAt = new Date()
              address.createdAt = new Date()
              address.street = payload.address;
              await address.save()
          }

          address.street = payload.address
          await address.save();
          user.firstName = payload.firstname;
          user.lastName = payload.lastname;
          user.verificationCode = payload.idNumber;
          await user.save();
      }

      return user || null;
  }

  public async orderContract(id: number, userId: number): Promise<OrderItem | null> {
      const user = await this.userRepository.findOne(userId);
      const contract = await this.contractRepository.findOne({id})
      const address = await this.addressRepository.findOne({ user })
      let order: Order | undefined = await this.orderRepository.findOne({street: address?.street})
      let orderItem: OrderItem | undefined = await this.orderItemRepository.findOne({
          where: [{ order, contractId: id }]
      })

      if (orderItem || !contract || !address)
          return null;

      const expDate = new Date()
      switch (id) {
          case 1: expDate.setDate(expDate.getDate() + 365); break;
          case 2: expDate.setDate(expDate.getDate() + 365 * 3); break;
          case 3: expDate.setDate(expDate.getDate() + 365 * 7); break;
      }

      if (!order){
          order = Order.create()
          order.street = address.street
          order.createdAt = new Date()
          order.updatedAt = new Date()
          await order.save()
      }

      orderItem = OrderItem.create()
      orderItem.order = order
      orderItem.quantity = 1
      orderItem.createdAt = new Date()
      orderItem.updatedAt = expDate
      orderItem.contract = contract
      orderItem.save()

      return orderItem;
  }

  public async getUserContracts(id: number) : Promise<OrderItem[] | null> {
      const user = await this.userRepository.findOne(id);
      const address = await this.addressRepository.findOne({ user })
      const order: Order | undefined = await this.orderRepository.findOne({street: address?.street})
      if (!order)
          return null;

      const orderItems: OrderItem[] | undefined = await this.orderItemRepository.find({
          where: [{ order }],
          order: { updatedAt: "ASC" }
      })
      return orderItems;
  }

  public async renewalContract(contractId: number): Promise<OrderItem | null> {
      const orderItem = await this.orderItemRepository.findOne({id: contractId})
      if (!orderItem)
          return null;

      const expDate = orderItem?.updatedAt
      expDate.setDate(expDate.getDate() + 365);
      orderItem.updatedAt = expDate
      return orderItem.save()
  }

  public async register(
    payload: TRegisterPayload
  ): Promise<TPartialUser> {
    try {
      if (payload.password != payload.confirmPassword)
        throw new Error("Пароли не совпадают");

      const user = await this.userRepository.save(User.create(payload));

      const html = `
    <h1>Добро пожаловать на платформу Могилевоблгаза, ${user.username}</h1>
    <p>Подтвердите аккаунт, перейдя по данной ссылке:</p>
    <a href='http://localhost:1234/users/verify-account/${user.verificationCode}'>Link</a>
    `;

      const isSent = await sendMail(
        user.email,
        "Подтверждение аккаунта",
        "Пожалуста, подтвердите аккаунт.",
        html
      );

      if (isSent) return user.getUserInfo();
      else this.userRepository.delete({ id: user.id });
      throw new Error("Невозможно отправить письмо");
    } catch (error) {

      const err = new ValidateError({}, "");
      err.status = 400;

      if (error.code === "23505") {
        if (error.detail.includes("(email)"))
          err.message = "Почта уже занята";
        throw err;
      }

      err.message = error.message;
      throw err;
    }
  }

  public async login(payload: TLoginPayload): Promise<TLoginResponse> {
    const { email, password } = payload;

    const error = new ValidateError({}, "Неправильный пароль или почта");
    error.status = 400;

    const user = await this.userRepository
      .createQueryBuilder("user")
      .where("user.email=:email", { email })
      .addSelect("user.password")
      .getOne();

    if (!user) throw error;


    const verify = await user.comparePassword(password);

    if (!verify) throw error;


    const token = user.generateJWT();

    return { user: user.getUserInfo(), token };
  }

  public async verificateCode(
    verificationCode: string
  ): Promise<TPartialUser> {

    const user = await this.userRepository.findOne({
      verificationCode,
    });


    if (!user) {
      const error = new ValidateError({}, "Некорректный код подтверждения");
      error.status = 400;
      throw error;
    }


    await this.userRepository.update(
      { id: user.id },
      { verificationCode: null, verified: true }
    );

    return user.getUserInfo();
  }

  public async resetPassword(email: string): Promise<IMessageResponse> {
    try {

      const user = await this.userRepository.findOne({ email });

      if (!user) {
        return { message: "Сообщение со ссылкой на сброс пароля отправлено на почту" };
      }

      user.generatePasswordReset();
      await this.userRepository.save(user);


      const html = `
    <h1>Привествуем, ${user.username}</h1>
    <p>Для сброса пароля перейдите по даннной ссылке:</p>
    <a href='http://localhost:1234/users/reset-password/${user.resetPasswordToken}'>Link</a>
    `;


      await sendMail(
        user.email,
        "Сброс пароля",
        "Перейдите по ссылке для сброса пароля",
        html
      );

      return { message: "Сообщение со ссылкой на сброс пароля отправлено на почту" };
    } catch (error) {

      return { message: "Сообщение со ссылкой на сброс пароля отправлено на почту" };
    }
  }

  public async resetPasswordCheck(
    resetPasswordToken: string
  ): Promise<boolean> {

    const user = await this.userRepository.findOne({
      where: {
        resetPasswordExp: MoreThan(new Date(Date.now())),
        resetPasswordToken,
      },
    });


    if (!user) {
      const error = new ValidateError(
        {},
        "Некорректный токен сброса пароля"
      );
      error.status = 400;
      throw error;
    }

    return true;
  }


  public async resetPasswordSave(
    payload: TPasswordResetPayload
  ): Promise<IMessageResponse> {
    try {
      const { password, confirmPassword, resetPasswordToken } = payload;


      if (password !== confirmPassword)
        throw new Error("Пароли не совпадают");


      const user = await this.userRepository.findOne({
        resetPasswordToken,
        resetPasswordExp: MoreThan(new Date(Date.now())),
      });


      if (!user) throw new Error("Некорректный запрос сброса пароля");


      user.password = password;
      await user.hashPassword();
      await user.save();

      const html = `
    <h1>Приветствуем, ${user.username}</h1>
    <p>Ваш пароль был изменен</p>
    `;

      await sendMail(
        user.email,
        "Пароль успешно изменен",
        "Ваш пароль был изменен",
        html
      );

      return { message: "Пароль успешно сброшен" };
    } catch (error) {

      const err = new ValidateError({}, "");
      err.status = 400;
      err.message = error.message;
      throw err;
    }
  }
}
