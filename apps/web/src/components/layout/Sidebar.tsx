import {
  HomeIcon,
  MusicalNoteIcon,
  PlusIcon,
  UsersIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import clsx from 'clsx'
import React from 'react'
import { NavLink } from 'react-router-dom'
import { Badge } from 'ui'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  // Mock data - 나중에 실제 데이터와 연결
  const mockPlaylists = [
    { id: '1', title: '내가 좋아하는 K-POP', trackCount: 42, isOnline: true },
    { id: '2', title: '팀 프로젝트 BGM', trackCount: 18, isOnline: false },
    { id: '3', title: '운동할 때 듣는 음악', trackCount: 25, isOnline: true },
    { id: '4', title: '로파이 힙합 모음', trackCount: 67, isOnline: false },
    { id: '5', title: '드라이브 뮤직', trackCount: 33, isOnline: true },
  ]

  const navigation = [
    { name: '홈', href: '/', icon: HomeIcon },
    { name: '내 플레이리스트', href: '/playlists', icon: MusicalNoteIcon },
    { name: '공유받은 플레이리스트', href: '/shared', icon: UsersIcon },
  ]

  const NavItem = ({ item }: { item: (typeof navigation)[0] }) => (
    <NavLink
      to={item.href}
      className={({ isActive }) =>
        clsx(
          'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
          isActive
            ? 'bg-primary-100 text-primary-700'
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
        )
      }
    >
      <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
      {item.name}
    </NavLink>
  )

  const PlaylistItem = ({ playlist }: { playlist: (typeof mockPlaylists)[0] }) => (
    <NavLink
      to={`/playlist/${playlist.id}`}
      className={({ isActive }) =>
        clsx(
          'flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors',
          isActive
            ? 'bg-primary-50 text-primary-700'
            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
        )
      }
    >
      <div className="flex items-center min-w-0">
        <div
          className={clsx(
            'w-2 h-2 rounded-full mr-3 flex-shrink-0',
            playlist.isOnline ? 'bg-green-500' : 'bg-gray-300'
          )}
        />
        <span className="truncate">{playlist.title}</span>
      </div>
      <Badge variant="default" size="sm">
        {playlist.trackCount}
      </Badge>
    </NavLink>
  )

  return (
    <>
      {/* Sidebar */}
      <div
        className={clsx(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">Playlist</h1>
            <button
              type="button"
              className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              onClick={onClose}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 flex flex-col overflow-y-auto">
            {/* Main navigation */}
            <nav className="p-4 space-y-1">
              {navigation.map(item => (
                <NavItem key={item.name} item={item} />
              ))}
            </nav>

            <div className="border-t border-gray-200 pt-4">
              {/* Playlists section */}
              <div className="px-4 mb-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    내 플레이리스트
                  </h2>
                  <button
                    type="button"
                    className="p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                    title="새 플레이리스트 만들기"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <nav className="px-4 space-y-1">
                {mockPlaylists.map(playlist => (
                  <PlaylistItem key={playlist.id} playlist={playlist} />
                ))}
              </nav>
            </div>

            {/* Bottom section */}
            <div className="border-t border-gray-200 p-4 mt-auto">
              <div className="text-xs text-gray-500 space-y-1">
                <p>총 {mockPlaylists.length}개 플레이리스트</p>
                <p>{mockPlaylists.filter(p => p.isOnline).length}개 실시간 협업 중</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
