import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES } from '../config/contracts';
import TetherWaveABI from '../utils/abi/Tether.json';
import USDTABI from '../utils/abi/USDT.json';

export const getContracts = (signer: ethers.Signer) => {
    const tetherWave = new ethers.Contract(
        CONTRACT_ADDRESSES.TETHER_WAVE,
        TetherWaveABI,
        signer
    );

    const usdt = new ethers.Contract(
        CONTRACT_ADDRESSES.USDT,
        USDTABI,
        signer
    );

    return { tetherWave, usdt };
}; 