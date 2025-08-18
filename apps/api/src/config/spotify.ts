// Spotify API 설정

export const spotifyConfig = {
  clientId: process.env.SPOTIFY_CLIENT_ID || '',
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET || '',
  baseUrl: 'https://api.spotify.com/v1',
  tokenUrl: 'https://accounts.spotify.com/api/token',
  
  // API 제한
  maxSearchResults: 50,
  requestTimeout: 5000,
}

// TODO: 환경 변수 확인 함수
export const validateSpotifyConfig = () => {
  if (!spotifyConfig.clientId || !spotifyConfig.clientSecret) {
    throw new Error('Spotify API credentials are required')
  }
}