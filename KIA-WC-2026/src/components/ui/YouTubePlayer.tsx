import { useState } from 'react'

type YouTubePlayerProps = {
  videoId: string
  thumbnail?: string
  title: string
  className?: string
  thumbnailClassName?: string
  playButtonSize?: 'sm' | 'lg'
  showPlayButton?: boolean
  disableTransition?: boolean
}

// TODO: replace `videoId` props across the app with the client's real YouTube video IDs.
export default function YouTubePlayer({
  videoId,
  thumbnail,
  title,
  className = '',
  thumbnailClassName = '',
  playButtonSize = 'lg',
  showPlayButton = true,
  disableTransition = false,
}: YouTubePlayerProps) {
  const [playing, setPlaying] = useState(false)

  if (playing) {
    return (
      <iframe
        className={`size-full ${className}`}
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    )
  }

  const buttonSizeClass = playButtonSize === 'lg' ? 'size-[72px] p-3' : 'size-12 p-[14px]'
  const iconSizeClass = playButtonSize === 'lg' ? 'size-6' : 'size-5'

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play ${title}`}
      disabled={!showPlayButton}
      className={`group relative block size-full overflow-hidden ${className}`}
    >
      {thumbnail ? (
        <img
          src={thumbnail}
          alt={title}
          className={`size-full object-cover ${disableTransition ? '' : 'transition-[filter,transform] duration-700 ease-out'} ${thumbnailClassName}`}
          draggable={false}
        />
      ) : (
        // Chưa upload ảnh thumbnail trong CMS -- hiện khối màu trung tính thay vì
        // <img src=""> (browser cảnh báo và có thể tải lại cả trang khi src rỗng).
        <div className={`size-full bg-[#1c1f21] ${thumbnailClassName}`} />
      )}
      {showPlayButton && (
        <span
          className={`absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#636d74] bg-[rgba(5,20,31,0.6)] ${buttonSizeClass}`}
        >
          <img src="/icons/ic-play-24.svg" alt="" className={iconSizeClass} />
        </span>
      )}
    </button>
  )
}
