"use client";

interface ImageWithCacheBustingProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  cacheBust?: boolean;
}

/**
 * キャッシュバスター付き画像表示コンポーネント
 *
 * @component
 * @param {Object} props
 * @param {string} props.src - 画像URL
 * @param {string} [props.alt] - 代替テキスト
 * @param {string} [props.className] - 追加クラス名
 * @param {React.CSSProperties} [props.style] - スタイル指定
 * @param {boolean} [props.cacheBust] - キャッシュバスターを付加するか（デフォルト: false）
 * @param {function} [props.onClick] - クリックイベント
 * @returns {JSX.Element} img要素
 * @description
 * 画像のURL末尾にキャッシュバスター（タイムスタンプクエリ）を付加することで、リロード時や画像アップロード後の反映遅延を防ぐ。
 * blob:URLの場合はキャッシュバスターを付けない。
 */
const ImageWithCacheBusting: React.FC<ImageWithCacheBustingProps> = ({
  src,
  alt = "",
  className = "",
  style,
  cacheBust = false,
  onClick,
}) => {
  const isBlobUrl = src?.startsWith("blob:");
  const url = cacheBust && src && !isBlobUrl ? `${src}?v=${Date.now()}` : src;

  return (
    <img
      src={url}
      alt={alt}
      className={className}
      style={style}
      onClick={onClick}
    />
  );
};

export default ImageWithCacheBusting;
