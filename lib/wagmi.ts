import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  sepolia,
} from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Lanternade',
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID || '',
  chains: [
    mainnet,
    optimism,
    arbitrum,
    base,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [sepolia] : []),
  ],
  ssr: true,
});
