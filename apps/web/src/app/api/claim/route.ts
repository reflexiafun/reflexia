import { NextResponse } from 'next/server'
import { privateKeyToAccount } from 'viem/accounts'
import { keccak256, encodePacked } from 'viem'

export async function POST(request: Request) {
  try {
    const { recipient, score, amount: requestedAmount } = await request.json()

    if (!recipient || !score || !requestedAmount) {
      return NextResponse.json({ error: 'Missing recipient, score, or amount' }, { status: 400 })
    }

    if (score < 8) {
      return NextResponse.json({ error: 'Score is not eligible' }, { status: 400 })
    }

    const numAmount = parseFloat(requestedAmount)
    if (isNaN(numAmount) || numAmount < 0.001 || numAmount > 0.0101) {
      return NextResponse.json({ error: 'Invalid amount range (must be between 0.001 and 0.01 USDm)' }, { status: 400 })
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

    return NextResponse.json({
      recipient,
      amount: amount.toString(),
      nonce: nonce.toString(),
      expiresAt: expiresAt.toString(),
      signature
    })
  } catch (error: any) {
    console.error('Error signing claim:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
