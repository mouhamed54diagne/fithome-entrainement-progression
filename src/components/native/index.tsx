import React, { useState } from 'react';

export interface ViewProps extends React.HTMLAttributes<HTMLDivElement> {
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
}

export const View: React.FC<ViewProps> = ({ style, className = '', children, ...props }) => {
  return (
    <div style={style} className={`flex flex-col box-border ${className}`} {...props}>
      {children}
    </div>
  );
};

export interface TextProps extends React.HTMLAttributes<HTMLSpanElement> {
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
  numberOfLines?: number;
  onPress?: () => void;
}

export const Text: React.FC<TextProps> = ({
  style,
  className = '',
  children,
  numberOfLines,
  onPress,
  ...props
}) => {
  const lineClampClass = numberOfLines
    ? numberOfLines === 1
      ? 'truncate'
      : `line-clamp-${numberOfLines}`
    : '';

  return (
    <span
      style={style}
      className={`font-sans antialiased ${lineClampClass} ${className} ${onPress ? 'cursor-pointer select-none' : ''}`}
      onClick={onPress}
      {...props}
    >
      {children}
    </span>
  );
};

export interface TouchableOpacityProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onPress?: (e?: React.MouseEvent) => void;
  activeOpacity?: number;
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const TouchableOpacity: React.FC<TouchableOpacityProps> = ({
  onPress,
  activeOpacity = 0.7,
  style,
  className = '',
  children,
  disabled,
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <button
      type="button"
      onClick={onPress}
      disabled={disabled}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      style={{
        opacity: isPressed && !disabled ? activeOpacity : 1,
        transition: 'opacity 0.15s ease',
        ...style,
      }}
      className={`flex items-center justify-center border-none bg-transparent p-0 cursor-pointer disabled:cursor-not-allowed select-none ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const Pressable = TouchableOpacity;

export interface ScrollViewProps extends React.HTMLAttributes<HTMLDivElement> {
  horizontal?: boolean;
  showsVerticalScrollIndicator?: boolean;
  showsHorizontalScrollIndicator?: boolean;
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
}

export const ScrollView: React.FC<ScrollViewProps> = ({
  horizontal = false,
  showsVerticalScrollIndicator = false,
  showsHorizontalScrollIndicator = false,
  style,
  className = '',
  children,
  ...props
}) => {
  const scrollbarClass =
    !showsVerticalScrollIndicator && !showsHorizontalScrollIndicator ? 'scrollbar-none' : '';

  return (
    <div
      style={style}
      className={`flex ${horizontal ? 'flex-row overflow-x-auto overflow-y-hidden' : 'flex-col overflow-y-auto overflow-x-hidden'} ${scrollbarClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  source: { uri: string } | string;
  alt?: string;
  style?: React.CSSProperties;
  className?: string;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
}

export const Image: React.FC<ImageProps> = ({
  source,
  alt = '',
  style,
  className = '',
  resizeMode = 'cover',
  ...props
}) => {
  const src = typeof source === 'string' ? source : source?.uri;
  const objectFitClass =
    resizeMode === 'contain'
      ? 'object-contain'
      : resizeMode === 'stretch'
      ? 'object-fill'
      : resizeMode === 'center'
      ? 'object-none'
      : 'object-cover';

  return (
    <img
      src={src}
      alt={alt}
      style={style}
      className={`${objectFitClass} ${className}`}
      {...props}
    />
  );
};

export interface TextInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  placeholderTextColor?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad' | string;
  style?: React.CSSProperties;
  className?: string;
}

export const TextInput: React.FC<TextInputProps> = ({
  value,
  onChangeText,
  placeholder,
  placeholderTextColor,
  secureTextEntry,
  keyboardType,
  style,
  className = '',
  ...props
}) => {
  const inputMode = keyboardType === 'numeric' ? 'decimal' : undefined;

  return (
    <input
      type={secureTextEntry ? 'password' : 'text'}
      inputMode={inputMode}
      value={value}
      onChange={(e) => onChangeText?.(e.target.value)}
      placeholder={placeholder}
      style={{
        ...style,
      }}
      className={`bg-transparent outline-none border-none text-slate-100 placeholder:text-slate-400 ${className}`}
      {...props}
    />
  );
};

export const SafeAreaView: React.FC<ViewProps> = ({ style, className = '', children, ...props }) => {
  return (
    <div
      style={style}
      className={`flex flex-col flex-1 w-full min-h-screen pt-safe pb-safe ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export interface ActivityIndicatorProps {
  size?: 'small' | 'large' | number;
  color?: string;
  className?: string;
}

export const ActivityIndicator: React.FC<ActivityIndicatorProps> = ({
  size = 'small',
  color = 'currentColor',
  className = '',
}) => {
  const dimension = size === 'large' ? 'w-8 h-8' : size === 'small' ? 'w-4 h-4' : `w-[${size}px] h-[${size}px]`;

  return (
    <svg
      className={`animate-spin ${dimension} ${className}`}
      style={{ color }}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

export const StyleSheet = {
  create: <T extends Record<string, React.CSSProperties>>(styles: T): T => styles,
};
