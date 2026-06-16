import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const filePath = path.join(process.cwd(), 'src/app/api/leaderboard/leaderboard.json')

interface LeaderboardEntry {
  address: string
  name: string
  score: number
  date: string // YYYY-MM-DD
}

const initialData: LeaderboardEntry[] = []

function readLeaderboard(): LeaderboardEntry[] {
  try {
    if (!fs.existsSync(filePath)) {
      const dirPath = path.dirname(filePath)
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true })
      }
      fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2))
      return initialData
    }
    const data = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading leaderboard file:', error)
    return initialData
  }
}

function writeLeaderboard(data: LeaderboardEntry[]) {
  try {
    const dirPath = path.dirname(filePath)
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error('Error writing leaderboard file:', error)
  }
}

export async function GET() {
  const data = readLeaderboard()
  const todayStr = new Date().toLocaleDateString('en-CA') // YYYY-MM-DD in local time zone

  // Daily: only scores from today
  const dailyData = data.filter(entry => entry.date === todayStr)
  const dailySorted = [...dailyData].sort((a, b) => b.score - a.score)

  // All-time: highest score per address across all time
  const allTimeMap = new Map<string, LeaderboardEntry>()
  for (const entry of data) {
    const existing = allTimeMap.get(entry.address)
    if (!existing || entry.score > existing.score) {
      allTimeMap.set(entry.address, entry)
    }
  }
  const allTimeSorted = Array.from(allTimeMap.values()).sort((a, b) => b.score - a.score)

  return NextResponse.json({
    daily: dailySorted,
    allTime: allTimeSorted
  })
}

export async function POST(request: Request) {
  try {
    const { address, score } = await request.json()

    if (!address || typeof score !== 'number') {
      return NextResponse.json({ error: 'Missing address or score' }, { status: 400 })
    }

    const data = readLeaderboard()
    const todayStr = new Date().toLocaleDateString('en-CA')

    // Format display name
    let displayName = 'Guest Player'
    if (address !== 'guest') {
      displayName = `${address.slice(0, 8)}...${address.slice(-6)}`
    }

    // Find if user already has a record for today
    const existingIndex = data.findIndex(entry => entry.address === address && entry.date === todayStr)

    if (existingIndex > -1) {
      // Update today's score if this round is higher
      if (score > data[existingIndex].score) {
        data[existingIndex].score = score
        data[existingIndex].name = displayName
      }
    } else {
      // Add new record for today
      data.push({
        address,
        name: displayName,
        score,
        date: todayStr
      })
    }

    writeLeaderboard(data)

    // Return the updated data structure
    const dailyData = data.filter(entry => entry.date === todayStr)
    const dailySorted = [...dailyData].sort((a, b) => b.score - a.score)

    const allTimeMap = new Map<string, LeaderboardEntry>()
    for (const entry of data) {
      const existing = allTimeMap.get(entry.address)
      if (!existing || entry.score > existing.score) {
        allTimeMap.set(entry.address, entry)
      }
    }
    const allTimeSorted = Array.from(allTimeMap.values()).sort((a, b) => b.score - a.score)

    return NextResponse.json({
      daily: dailySorted,
      allTime: allTimeSorted
    })
  } catch (error: any) {
    console.error('Leaderboard post error:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
