"use client";

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import Image from 'next/image';
import { useEffect } from 'react';

export const WalletConnect = () => {
    const { isConnected } = useAccount();
    const router = useRouter();

    useEffect(() => {
        if (isConnected) {
            router.push('/dashboard');
        }
    }, [isConnected, router]);

    return (
        <ConnectButton.Custom>
            {({
                account,
                chain,
                openChainModal,
                openConnectModal,
                mounted,
            }) => {
                if (!mounted) return null;

                const connected = mounted && account && chain;

                return (
                    <div>
                        {(() => {
                            if (!connected) {
                                return (
                                    <Button
                                        onClick={() => {
                                            try {
                                                if (openConnectModal) {
                                                    openConnectModal();
                                                }
                                            } catch (error) {
                                                console.log("Connection modal error:", error);
                                            }
                                        }}
                                        variant="default"
                                        className="bg-[#f3ba2f] text-black hover:bg-[#f3ba2f]/90 shadow-[4px_4px_12px_#f3ba2f90,-4px_-4px_12px_#f3ba2f90] h-10 font-semibold transition-all duration-300"
                                    >
                                        Launch App
                                    </Button>
                                );
                            }

                            if (chain?.unsupported) {
                                return (
                                    <Button
                                        onClick={openChainModal}
                                        variant="default"
                                        className="bg-red-500 hover:bg-red-600 text-white shadow-[4px_4px_12px_#ef444450,-4px_-4px_12px_#ef444450] h-10 font-semibold transition-all duration-300"
                                    >
                                        Wrong Network
                                    </Button>
                                );
                            }

                            return (
                                <Button
                                    variant="default"
                                    className="bg-[#f3ba2f] text-black hover:bg-[#f3ba2f]/90 h-10 font-semibold transition-all duration-300 flex items-center gap-2"
                                >
                                    {chain?.hasIcon && (
                                        <div
                                            style={{
                                                background: chain.iconBackground,
                                                width: 16,
                                                height: 16,
                                                borderRadius: '50%',
                                                overflow: 'hidden',
                                            }}
                                        >
                                            {chain.iconUrl && (
                                                <Image
                                                    alt={chain.name ?? 'Chain icon'}
                                                    src={chain.iconUrl}
                                                    style={{ width: '100%', height: '100%' }}
                                                    width={16}
                                                    height={16}
                                                />
                                            )}
                                        </div>
                                    )}
                                    <span>{chain?.name || 'Unknown Chain'}</span>
                                </Button>
                            );
                        })()}
                    </div>
                );
            }}
        </ConnectButton.Custom>
    );
};