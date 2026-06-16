import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const filePath = path.join(process.cwd(), 'src/app/api/leaderboard/leaderboard.json')

interface LeaderboardEntry {
  address: string
  name: string
  allTimeScore: number
  dailyScore: number
  dailyScoreDate: string
}

// Initial empty data if file doesn't exist
const initialData: LeaderboardEntry[] = []

function readLeaderboard(): LeaderboardEntry[] {
  try {
    if (!fs.existsSync(filePath)) {
      // Create directory and file if they don't exist
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
  const todayStr = new Date().toDateString()
  
  // Sort daily: where dailyScoreDate is today, by dailyScore desc
  const daily = data
    .filter(entry => entry.dailyScoreDate === todayStr && entry.dailyScore > 0)
    .map(entry => ({
      address: entry.address,
      name: entry.name,
      score: entry.dailyScore
    }))
    .sort((a, b) => b.score - a.score)

  // Sort allTime: by allTimeScore desc
  const allTime = data
    .map(entry => ({
      address: entry.address,
      name: entry.name,
      score: entry.allTimeScore
    }))
    .sort((a, b) => b.score - a.score)

  return NextResponse.json({ daily, all: allTime })
}

export async function POST(request: Request) {
  try {
    const { address, score } = await request.json()

    if (!address || typeof score !== 'number') {
      return NextResponse.json({ error: 'Missing address or score' }, { status: 400 })
    }

    const data = readLeaderboard()
    const todayStr = new Date().toDateString()
    
    // Format display name
    let displayName = 'Guest Player'
    if (address !== 'guest') {
      displayName = `${address.slice(0, 8)}...${address.slice(-6)}`
    }

    const existingIndex = data.findIndex(entry => entry.address === address)

    if (existingIndex > -1) {
      const entry = data[existingIndex]
      // Update all-time score if higher
      if (score > entry.allTimeScore) {
        entry.allTimeScore = score
      }
      
      // Update daily score
      if (entry.dailyScoreDate === todayStr) {
        if (score > entry.dailyScore) {
          entry.dailyScore = score
        }
      } else {
        entry.dailyScore = score
        entry.dailyScoreDate = todayStr
      }
      entry.name = displayName
    } else {
      data.push({
        address,
        name: displayName,
        allTimeScore: score,
        dailyScore: score,
        dailyScoreDate: todayStr
      })
    }

    writeLeaderboard(data)

    const daily = data
      .filter(entry => entry.dailyScoreDate === todayStr && entry.dailyScore > 0)
      .map(entry => ({
        address: entry.address,
        name: entry.name,
        score: entry.dailyScore
      }))
      .sort((a, b) => b.score - a.score)

    const allTime = data
      .map(entry => ({
        address: entry.address,
        name: entry.name,
        score: entry.allTimeScore
      }))
      .sort((a, b) => b.score - a.score)

    return NextResponse.json({ daily, all: allTime })
  } catch (error: any) {
    console.error('Leaderboard post error:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
