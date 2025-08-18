import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import SearchResults from '../components/search/SearchResults'

// TODO: 실제 API와 연결할 때 사용할 타입들
interface Track {
  id: string
  title: string
  artist: string
  album: string
  duration: string
  image_url: string | null
  preview_url: string | null
  spotify_url: string
}

interface Artist {
  id: string
  name: string
  image_url: string | null
  followers: number
  spotify_url: string
}

interface Album {
  id: string
  name: string
  artist: string
  release_date: string
  image_url: string | null
  spotify_url: string
}

interface SearchData {
  tracks: Track[]
  artists: Artist[]
  albums: Album[]
}

// 디바운싱 훅
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

const SearchPage: React.FC = () => {
  const { query } = useParams<{ query: string }>()

  const [searchData, setSearchData] = useState<SearchData>({
    tracks: [],
    artists: [],
    albums: [],
  })
  const [isSearching, setIsSearching] = useState(false)

  // 300ms 디바운싱
  const debouncedSearchTerm = useDebounce(query || '', 300)

  // 검색 API 호출 (디바운싱된 검색어로)
  useEffect(() => {
    const performSearch = async () => {
      if (debouncedSearchTerm.length < 2) {
        setSearchData({ tracks: [], artists: [], albums: [] })
        return
      }

      setIsSearching(true)
      try {
        // TODO: 실제 API 호출로 교체
        // const response = await fetch(`/api/music/search?q=${encodeURIComponent(debouncedSearchTerm)}`)
        // const data = await response.json()

        // Mock 데이터로 시뮬레이션
        await new Promise(resolve => setTimeout(resolve, 500)) // 로딩 시뮬레이션

        const mockData: SearchData = {
          tracks: [
            {
              id: '1',
              title: `${debouncedSearchTerm} - 검색된 곡 1`,
              artist: '아티스트 A',
              album: '앨범 A',
              duration: '3:42',
              image_url: null,
              preview_url: null,
              spotify_url: 'https://open.spotify.com/track/1',
            },
            {
              id: '2',
              title: `${debouncedSearchTerm} - 검색된 곡 2`,
              artist: '아티스트 B',
              album: '앨범 B',
              duration: '4:15',
              image_url: null,
              preview_url: null,
              spotify_url: 'https://open.spotify.com/track/2',
            },
          ],
          artists: [
            {
              id: '1',
              name: `${debouncedSearchTerm} - 아티스트`,
              image_url: null,
              followers: 1200000,
              spotify_url: 'https://open.spotify.com/artist/1',
            },
          ],
          albums: [
            {
              id: '1',
              name: `${debouncedSearchTerm} - 앨범`,
              artist: '아티스트 C',
              release_date: '2023',
              image_url: null,
              spotify_url: 'https://open.spotify.com/album/1',
            },
          ],
        }

        setSearchData(mockData)
      } catch (error) {
        console.error('Search failed:', error)
        setSearchData({ tracks: [], artists: [], albums: [] })
      } finally {
        setIsSearching(false)
      }
    }

    performSearch()
  }, [debouncedSearchTerm])

  const totalResults =
    searchData.tracks.length + searchData.artists.length + searchData.albums.length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* 검색 상태 */}
        {isSearching && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            <span className="ml-3 text-gray-600">검색 중...</span>
          </div>
        )}

        {/* 검색 결과가 없는 경우 */}
        {!isSearching && debouncedSearchTerm.length >= 2 && totalResults === 0 && (
          <div className="text-center py-16">
            <MagnifyingGlassIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              "{debouncedSearchTerm}"에 대한 검색 결과가 없습니다
            </h3>
            <p className="text-gray-500">다른 검색어를 시도해보세요</p>
          </div>
        )}

        {/* 검색 결과 */}
        {!isSearching && debouncedSearchTerm.length >= 2 && totalResults > 0 && (
          <SearchResults searchData={searchData} />
        )}
      </div>
    </div>
  )
}

export default SearchPage
