import { NextResponse } from 'next/server'
import { privateKeyToAccount } from 'viem/accounts'
import { keccak256, encodePacked } from 'viem'

export async function POST(request: Request) {
  try {
    const { recipient, score } = await request.json()

    if (!recipient || !score) {
      return NextResponse.json({ error: 'Missing recipient or score' }, { status: 400 })
    }

    // Determine the USDm amount based on the score
    // 1 USDm = 10^18 units.
    // score 8 to 10: 15 USDm
    // score > 10: 30 USDm
    let rewardAmountStr = '0';
    if (score >= 8 && score <= 10) {
      rewardAmountStr = (15n * 10n**18n).toString(); // 15 USDm
    } else if (score > 10) {
      rewardAmountStr = (30n * 10n**18n).toString(); // 30 USDm
    } else {
      return NextResponse.json({ error: 'Score is not eligible' }, { status: 400 })
    }

    const amount = BigInt(rewardAmountStr);
    
    // Generate a unique nonce
    const nonce = BigInt(Math.floor(Math.random() * 1000000000));
    
    // Expiry in 1 hour
    const expiresAt = BigInt(Math.floor(Date.now() / 1000) + 3600);

    const contractAddress = process.env.NEXT_PUBLIC_DISTRIBUTOR_ADDRESS;
    const privateKey = process.env.SIGNER_PRIVATE_KEY;

    if (!contractAddress || !privateKey) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
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
