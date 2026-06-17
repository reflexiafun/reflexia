import { NextResponse } from 'next/server'
import { privateKeyToAccount } from 'viem/accounts'
import { keccak256, encodePacked, createWalletClient, createPublicClient, http } from 'viem'
import { celo } from 'viem/chains'

const DISTRIBUTOR_ABI = [
  {
    inputs: [
      { name: "recipient", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "nonce", type: "uint256" },
      { name: "expiresAt", type: "uint256" },
      { name: "signature", type: "bytes" },
    ],
    name: "claim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export async function POST(request: Request) {
  try {
    const { recipient, score, amount: requestedAmount, type } = await request.json()

    if (!recipient || !requestedAmount) {
      return NextResponse.json({ error: 'Missing recipient or amount' }, { status: 400 })
    }

    const numAmount = parseFloat(requestedAmount)
    if (isNaN(numAmount)) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    if (type === 'daily') {
      const validDailyAmounts = [0.0001, 0.0002, 0.0003, 0.0005, 0.0007, 0.0010, 0.0020]
      const isValidAmount = validDailyAmounts.some(val => Math.abs(val - numAmount) < 0.00001)
      if (!isValidAmount) {
        return NextResponse.json({ error: 'Invalid daily reward amount' }, { status: 400 })
      }
    } else {
      if (score === undefined || score < 8) {
        return NextResponse.json({ error: 'Score is not eligible or missing' }, { status: 400 })
      }
      if (numAmount < 0.001 || numAmount > 0.0101) {
        return NextResponse.json({ error: 'Invalid amount range (must be between 0.001 and 0.01 USDm)' }, { status: 400 })
      }
    }

    const amount = BigInt(Math.floor(numAmount * 1e18));
    
    // Generate a unique nonce
    const nonce = BigInt(Math.floor(Math.random() * 1000000000));
    
    // Expiry in 1 hour
    const expiresAt = BigInt(Math.floor(Date.now() / 1000) + 3600);

    const contractAddress = process.env.NEXT_PUBLIC_DISTRIBUTOR_ADDRESS;
    let privateKey = process.env.SIGNER_PRIVATE_KEY;

    if (!contractAddress || !privateKey) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    // Add 0x prefix if missing
    if (!privateKey.startsWith('0x')) {
      privateKey = `0x${privateKey}`;
    }

    const account = privateKeyToAccount(privateKey as `0x${string}`);

    // Compute message hash:
    // abi.encodePacked(recipient, amount, nonce, expiresAt, address(this))
    // Types: address, uint256, uint256, uint256, address
    const messageHash = keccak256(
      encodePacked(
        ['address', 'uint256', 'uint256', 'uint256', 'address'],
        [recipient as `0x${string}`, amount, nonce, expiresAt, contractAddress as `0x${string}`]
      )
    )

    // Sign message using EIP-191 standard
    const signature = await account.signMessage({
      message: { raw: messageHash }
    })

    // Create wallet and public clients to submit transaction to Celo
    const rpcUrl = process.env.CELO_RPC_URL || 'https://forno.celo.org';
    const walletClient = createWalletClient({
      account,
      chain: celo,
      transport: http(rpcUrl)
    })

    const publicClient = createPublicClient({
      chain: celo,
      transport: http(rpcUrl)
    })

    // Submit claim transaction on-chain (backend pays the gas fee)
    const hash = await walletClient.writeContract({
      address: contractAddress as `0x${string}`,
      abi: DISTRIBUTOR_ABI,
      functionName: 'claim',
      args: [
        recipient as `0x${string}`,
        amount,
        nonce,
        expiresAt,
        signature as `0x${string}`
      ]
    })

    // Wait for 1 block confirmation to ensure it went through
    await publicClient.waitForTransactionReceipt({ hash })

    return NextResponse.json({
      success: true,
      transactionHash: hash
    })
  } catch (error: any) {
    console.error('Error processing sponsored claim:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
