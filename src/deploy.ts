import {Wallet} from 'ethers';
import {CryptoKittiesMockFactory} from '../build';


export async function deployCryptoKittiesMock(deployer: Wallet) {
    console.log('Starting deployment of CryptoKittiesMock:');

    const factory = new CryptoKittiesMockFactory(deployer);
    const contract = await factory.deploy();
    await contract.deployed();
    console.log(`Contract deployed at ${contract.address}`);

    return contract.address;
}

