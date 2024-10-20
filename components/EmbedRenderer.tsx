import React, { useState } from 'react';
import { Cast, Embed, Frame } from '@/types/neynar';
import { PlayerWithControls } from '@/components/PlayerWithControls';
import { getSrc } from '@livepeer/react/external';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ImageGallery from './ImageGallery';
import { useNeynarContext } from '@neynar/react';

// Import necessary viem functions and types
import {
  http,
  custom,
  createWalletClient,
  createPublicClient,
  encodeFunctionData,
  type Address,
} from 'viem';
import { mainnet, base } from 'viem/chains';

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface EmbedRendererProps {
  embeds?: Embed[];
  frames?: Frame[];
  cast_hash?: string;
  cast?: Cast;
}

const EmbedRenderer: React.FC<EmbedRendererProps> = ({
  embeds = [],
  frames = [],
  cast,
  cast_hash,
}) => {
  const [currentFrame, setCurrentFrame] = useState<Frame | null>(
    frames[0] || null
  );
  const { user } = useNeynarContext();
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const imageEmbeds = embeds.filter((embed) => embed.metadata?.image);
  const videoEmbed = embeds.find((embed) => embed.metadata?.video);
  const linkEmbed = embeds.find((embed) => embed.metadata?.html);

  const images = imageEmbeds.map((embed) => ({
    url: embed.url || '',
    width: embed.metadata?.image?.width_px || 0,
    height: embed.metadata?.image?.height_px || 0,
  }));

  const renderLinkPreview = (embed: Embed) => (
    <div onClick={(e) => e.stopPropagation()}>
      <a
        href={embed.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <div className="flex items-center">
            {embed.metadata?.html?.ogImage &&
              embed.metadata.html.ogImage[0] && (
                <div className="flex-shrink-0 w-1/3">
                  <div className="relative w-full pt-[56.25%]">
                    <Image
                      src={embed.metadata.html.ogImage[0].url}
                      alt={embed.metadata.html.ogTitle || 'Link preview'}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
            <div className="flex-grow p-4">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-1">
                <ExternalLink size={14} className="mr-1" />
                {embed.metadata?.html?.ogSiteName ||
                  new URL(embed.url).hostname}
              </div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 mb-1">
                {embed.metadata?.html?.ogTitle}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                {embed.metadata?.html?.ogDescription}
              </p>
            </div>
          </div>
        </div>
      </a>
    </div>
  );

  const LoadingOverlay = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
    </div>
  );

  const handleFrameAction = async (button: {
    index: number;
    title: string;
    action_type: string;
    target: string;
  }) => {
    if (!currentFrame || !user) return;

    setIsLoading(true);

    if (button.action_type === 'link') {
      window.open(button.target, '_blank');
      setIsLoading(false);
      return;
    }

    if (button.action_type === 'mint') {
      try {
        // Parse the target string to extract chainId, contractAddress, and tokenId
        // Example target: "eip155:8453:0xf5a3b6dee033ae5025e4332695931cadeb7f4d2b:1"
        const targetParts = button.target.split(':');
        if (targetParts.length < 3) {
          console.error('Invalid target format');
          setIsLoading(false);
          return;
        }

        const [namespace, chainIdStr, contractAddress, tokenIdStr] = targetParts;
        const chainId = `${namespace}:${chainIdStr}`; // e.g., "eip155:8453"
        const tokenId = tokenIdStr ? BigInt(tokenIdStr) : BigInt(0);

        // Define the contract ABI
        const abi = [
          // Replace with the actual ABI of the contract
          // Here's an example of an ERC721 mint function
          {
            "inputs": [
              { "internalType": "address", "name": "to", "type": "address" },
              { "internalType": "uint256", "name": "tokenId", "type": "uint256" }
            ],
            "name": "mint",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          }
        ];

        // Connect to wallet and switch chain if necessary
        const { address, walletClient } = await connectWallet(chainId);

        // Prepare function data using encodeFunctionData
        const functionData = encodeFunctionData({
          abi,
          functionName: 'mint',
          args: [address, tokenId],
        });

        // Send the transaction
        const hash = await walletClient.sendTransaction({
          account: address as Address,
          to: contractAddress as Address,
          value: 0n,
          data: functionData,
          chain: getChainConfig(chainId),
        });

        // Wait for transaction confirmation
        const publicClient = createPublicClient({
          chain: getChainConfig(chainId),
          transport: http(),
        });

        await publicClient.waitForTransactionReceipt({ hash });

        // Optionally, you can display a success message or update the UI
        console.log('Transaction successful:', hash);

        // After the transaction, you might want to update the frame or perform additional actions

      } catch (error) {
        console.error('Error handling mint action:', error);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Existing code for other action types
    try {
      const response = await fetchWithTimeout('/api/frame-action', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          signerUuid: user.signer_uuid,
          castHash: cast_hash || cast?.hash,
          action: {
            button: button,
            frames_url: currentFrame.frames_url,
            post_url: currentFrame.post_url || currentFrame.frames_url,
            input: {
              text: inputValue,
            },
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (button.action_type === 'post_redirect') {
        window.open(data.url || button.target, '_blank');
        setIsLoading(false);
        return;
      } else if (button.action_type === 'post') {
        // Update the current frame with the new data
        setCurrentFrame({
          version: data.version,
          title: data.title || currentFrame.title,
          image: data.image,
          image_aspect_ratio: data.image_aspect_ratio,
          buttons: data.buttons,
          input: data.input,
          state: data.state,
          frames_url: data.frames_url,
          post_url: data.post_url || button.target,
        });
      }

      setInputValue(''); // Clear input after action
    } catch (error) {
      console.error('Error handling frame action:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderFrame = (frame: Frame) => (
    <div
      className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      <Image
        src={frame.image}
        alt={frame.title}
        width={500}
        height={frame.image_aspect_ratio === '1:1' ? 500 : 300}
        className="w-full h-auto"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{frame.title}</h3>
        {frame.input && frame.input.text && (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={frame.input.text}
            className="w-full p-2 mb-2 border border-gray-300 dark:border-gray-600 rounded"
          />
        )}
        <div className="flex flex-wrap gap-2">
          {frame.buttons.map((button) => (
            <Button
              key={button.index}
              onClick={() => handleFrameAction(button)}
            >
              {button.title}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  // Helper functions for wallet connection and chain switching

  const getChainConfig = (chainId: string) => {
    switch (chainId) {
      case 'eip155:1':
        return mainnet;
      case 'eip155:8453':
        return base;
      // Add other chains as needed
      default:
        throw new Error('Unsupported chain');
    }
  };

  const switchChain = async (chainId: string) => {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('Injected wallet is not installed.');
    }

    const targetChain = getChainConfig(chainId);
    const chainIdHex = `0x${targetChain.id.toString(16)}`;
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: chainIdHex,
                chainName: targetChain.name,
                rpcUrls: targetChain.rpcUrls.default?.http ?? [],
                nativeCurrency: targetChain.nativeCurrency,
              },
            ],
          });
        } catch (addError) {
          console.error('Failed to add chain to injected wallet.', addError);
          throw new Error('Failed to add chain to injected wallet.');
        }
      } else {
        console.error('Failed to switch chain in injected wallet.', switchError);
        throw new Error('Failed to switch chain in injected wallet.');
      }
    }
  };

  const connectWallet = async (chainId: string) => {
    await switchChain(chainId);

    const targetChain = getChainConfig(chainId);

    const walletClient = createWalletClient({
      chain: targetChain,
      transport: custom(window.ethereum),
    });

    const addresses = await walletClient.requestAddresses();
    if (addresses.length === 0) {
      throw new Error('No wallet addresses found.');
    }
    const address = addresses[0] as Address;
    return { address, walletClient };
  };

  function fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeout: number = 8000
  ): Promise<Response> {
    return Promise.race([
      fetch(url, options),
      new Promise<Response>((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out')), timeout)
      ),
    ]);
  }

  return (
    <>
      {isLoading && <LoadingOverlay />}
      {images.length > 0 && <ImageGallery images={images} />}
      {videoEmbed && videoEmbed.url && (
        <PlayerWithControls src={getSrc(videoEmbed.url) || []} />
      )}
      {linkEmbed && frames.length === 0 && renderLinkPreview(linkEmbed)}
      {currentFrame && renderFrame(currentFrame)}
    </>
  );
};

export default EmbedRenderer;
