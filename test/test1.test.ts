import {expect, use} from 'chai';
import {deployContract, MockProvider, solidity} from 'ethereum-waffle';
import {deployCryptoKittiesMock} from '../src/deploy';

use(solidity);

describe('Test 1', () => {
    const [deployer] = new MockProvider().getWallets();

    it('Deploy', async () => {
        await deployCryptoKittiesMock(deployer);
    });

});
