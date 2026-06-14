/**
 * @nalet/design-system — react component library.
 *
 * dark canvas, monospace voice, blue chevron, square frames. every component
 * is styled with co-located css that reads the css-var tokens. importing this
 * entry also pulls in the token stylesheet (css vars + @font-face + base).
 */

// foundation: css variables, fonts, base — owned by the tokens build.
import './styles/tokens.css';

// re-export the typed tokens (color/type/space) from the tokens module.
export * from './tokens';

// shared utilities
export { cx } from './lib/cx';
export type { ClassValue } from './lib/cx';
export { space } from './lib/space';
export type { SpaceToken } from './lib/space';

// brand
export { Chevron } from './brand/Chevron/Chevron';
export type { ChevronProps } from './brand/Chevron/Chevron';
export { Lockup } from './brand/Lockup/Lockup';
export type { LockupProps } from './brand/Lockup/Lockup';
export { Icon } from './brand/Icon/Icon';
export type { IconProps } from './brand/Icon/Icon';

// layout
export { Box } from './components/Box/Box';
export type { BoxProps } from './components/Box/Box';
export { Stack } from './components/Stack/Stack';
export type { StackProps } from './components/Stack/Stack';
export { Divider } from './components/Divider/Divider';
export type { DividerProps } from './components/Divider/Divider';

// type
export { Text } from './components/Text/Text';
export type { TextProps, TextVariant } from './components/Text/Text';
export { Heading } from './components/Heading/Heading';
export type { HeadingProps } from './components/Heading/Heading';
export { Kbd } from './components/Kbd/Kbd';
export type { KbdProps } from './components/Kbd/Kbd';
export { Code } from './components/Code/Code';
export type { CodeProps } from './components/Code/Code';

// controls
export { Button } from './components/Button/Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './components/Button/Button';
export { IconButton } from './components/IconButton/IconButton';
export type { IconButtonProps, IconButtonVariant, IconButtonSize } from './components/IconButton/IconButton';
export { Input } from './components/Input/Input';
export type { InputProps } from './components/Input/Input';
export { Textarea } from './components/Textarea/Textarea';
export type { TextareaProps } from './components/Textarea/Textarea';
export { Select } from './components/Select/Select';
export type { SelectProps, SelectOption } from './components/Select/Select';
export { Checkbox } from './components/Checkbox/Checkbox';
export type { CheckboxProps } from './components/Checkbox/Checkbox';
export { Switch } from './components/Switch/Switch';
export type { SwitchProps } from './components/Switch/Switch';
export { Field } from './components/Field/Field';
export type { FieldProps } from './components/Field/Field';

// surfaces
export { Card } from './components/Card/Card';
export type { CardProps } from './components/Card/Card';
export { Badge } from './components/Badge/Badge';
export type { BadgeProps, BadgeTone } from './components/Badge/Badge';
export { Table, Thead, Tbody, Tr, Th, Td } from './components/Table/Table';
export type { TableProps, TableColumn } from './components/Table/Table';
export { Tabs } from './components/Tabs/Tabs';
export type { TabsProps, TabItem } from './components/Tabs/Tabs';
export { Tooltip } from './components/Tooltip/Tooltip';
export type { TooltipProps, TooltipSide } from './components/Tooltip/Tooltip';
export { Modal } from './components/Modal/Modal';
export type { ModalProps } from './components/Modal/Modal';
export { Spinner } from './components/Spinner/Spinner';
export type { SpinnerProps } from './components/Spinner/Spinner';

// patterns — the portal / launchpad
export { Tile } from './components/Tile/Tile';
export type {
  TileProps,
  TileVariant,
  TileSize,
  TileBadgeTone,
  TileStatus,
  TileDelta,
} from './components/Tile/Tile';
export { TileGroup } from './components/TileGroup/TileGroup';
export type { TileGroupProps, TileGroupGap } from './components/TileGroup/TileGroup';
export { Portal } from './components/Portal/Portal';
export type { PortalProps } from './components/Portal/Portal';
export { useRovingGrid } from './lib/useRovingGrid';
export type { RovingGrid } from './lib/useRovingGrid';
