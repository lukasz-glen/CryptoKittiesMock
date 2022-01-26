import {expect, use} from 'chai';
import {deployContract, MockProvider, solidity} from 'ethereum-waffle';
import {deployCryptoKittiesMock} from '../src/deploy';
import {CryptoKittiesMockFactory} from "../build/CryptoKittiesMockFactory";
import sinon from 'sinon';

use(solidity);

describe('Test 2', () => {
    const [deployer, alice, bob] = new MockProvider().getWallets();
    let cryptoKittiesMockAddress: string;

    beforeEach(async () => {
        cryptoKittiesMockAddress = await deployCryptoKittiesMock(deployer);
    });

    it('Mint', async () => {
        const cryptoKittiesMock = CryptoKittiesMockFactory.connect(cryptoKittiesMockAddress, alice);
        let tx = await cryptoKittiesMock.mint(1, alice.address);
        await tx.wait();
        expect(await cryptoKittiesMock.totalSupply()).to.eq(1);
        expect(await cryptoKittiesMock.ownerOf(1)).to.eq(alice.address);
        expect(await cryptoKittiesMock.balanceOf(alice.address)).to.eq(1);
        expect((await cryptoKittiesMock.tokensOfOwner(alice.address)).length).to.eq(1);
        expect(await cryptoKittiesMock.kittyIndexToOwner(1)).to.eq(alice.address);
        tx = await cryptoKittiesMock.mint(100, alice.address);
        await tx.wait();
        expect(await cryptoKittiesMock.totalSupply()).to.eq(2);
        expect(await cryptoKittiesMock.ownerOf(100)).to.eq(alice.address);
        expect(await cryptoKittiesMock.balanceOf(alice.address)).to.eq(2);
        expect((await cryptoKittiesMock.tokensOfOwner(alice.address)).length).to.eq(2);
        expect(await cryptoKittiesMock.kittyIndexToOwner(100)).to.eq(alice.address);
    });

    it('Mint (2)', async () => {
        const cryptoKittiesMockA = CryptoKittiesMockFactory.connect(cryptoKittiesMockAddress, alice);
        let tx = await cryptoKittiesMockA.mint(1, alice.address);
        await tx.wait();
        const cryptoKittiesMockB = CryptoKittiesMockFactory.connect(cryptoKittiesMockAddress, bob);
        await expect(cryptoKittiesMockB.mint(1, bob.address)).to.be.revertedWith('CryptoKittiesMock: tokenId already taken');
    });

    it('Transfer', async () => {
        const cryptoKittiesMockA = CryptoKittiesMockFactory.connect(cryptoKittiesMockAddress, alice);
        let tx = await cryptoKittiesMockA.mint(3, alice.address);
        await tx.wait();
        tx = await cryptoKittiesMockA.transfer(bob.address, 3);
        await tx.wait();
        expect(await cryptoKittiesMockA.ownerOf(3)).to.eq(bob.address);
    });

    it('TransferFrom', async () => {
        const cryptoKittiesMockA = CryptoKittiesMockFactory.connect(cryptoKittiesMockAddress, alice);
        let tx = await cryptoKittiesMockA.mint(3, alice.address);
        await tx.wait();
        tx = await cryptoKittiesMockA.approve(deployer.address, 3);
        await tx.wait();
        expect(await cryptoKittiesMockA.kittyIndexToApproved(3)).to.eq(deployer.address);

        let sinonClock;
        let date;
        date = new Date();
        date.setDate(date.getDate() + 1);  // + days
        sinonClock = sinon.useFakeTimers({now: date, toFake: ['Date']});

        const cryptoKittiesMockD = CryptoKittiesMockFactory.connect(cryptoKittiesMockAddress, deployer);
        tx = await cryptoKittiesMockD.transferFrom(alice.address, bob.address, 3);
        await tx.wait();
        expect(await cryptoKittiesMockD.ownerOf(3)).to.eq(bob.address);

        sinonClock.restore();
    });


});
