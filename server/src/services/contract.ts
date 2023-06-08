import { validateOrReject } from "class-validator";
import { getRepository } from "typeorm";
import { Contract } from "../entities";
import { ELevel, ESize } from "../entities/Contract";

export interface IGetContractsPayload {
  page: number;
  limit: number;
  where?: { [name: string]: string };
}

export interface IGetContractsReturn {
  products: Contract[];
  next: boolean;
}

export const getContracts = async (
  paginationOptions: IGetContractsPayload
): Promise<IGetContractsReturn> => {
  const { limit, page, where } = paginationOptions;
  const contractRepository = getRepository(Contract);
  const contracts = await contractRepository.find({
    where,
    take: limit + 1,
    skip: page * limit,
  });
  const next = contracts.length === limit + 1;
  return { products: contracts.slice(0, limit), next };
};

export const getContract = async (
  id: number
): Promise<Contract | null> => {
  const contractRepository = getRepository(Contract);
  const contract = await contractRepository.findOne({ id });
  return contract || null;
};

export interface ICreateContractpayload {
  name: string;
  description: string;
  longDescription: string;
  price: number;
  discount?: number;
  countInStock: number;
  size: ESize;
  sold?: number;
}

export const createContract = async ({
  countInStock,
  description,
  longDescription,
  name,
  price,
  size,
  discount,
  sold,
}: ICreateContractpayload): Promise<Contract | null> => {
  const contractRepository = getRepository(Contract);
  const contract = new Contract();
  contract.name = name;
  contract.description = description;
  contract.longDescription = longDescription;
  contract.price = price;
  contract.countInStock = countInStock;
  contract.discount = discount || 0;
  contract.size = size;
  contract.sold = sold || 0;

  await validateOrReject(contract);

  return contractRepository.save(contract);
};
