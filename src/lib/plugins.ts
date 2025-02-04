import type { Snippet } from 'svelte';
import type { Edytor } from './edytor.svelte.js';
import type { Block } from './block/block.svelte.js';
import type { Text } from './text/text.svelte.js';
import type { SerializableContent } from './utils/json.js';
import type { HotKey, HotKeyCombination } from './hotkeys.js';
import type { TextOperations } from './text/text.utils.js';
import type { BlockOperations } from './block/block.utils.js';

export type MarkSnippetPayload<D extends SerializableContent = SerializableContent> = {
	content: Snippet;
	mark: D;
	text: Text;
};

type Prevent = (cb?: () => void) => void;

export type BlockSnippetPayload<D extends SerializableContent = SerializableContent> = {
	block: Block;
	content: Snippet;
	children: Snippet | null;
};

type ChangePayload = {
	block: Block;
	text: Text;
	edytor: Edytor;
	prevent: Prevent;
} & (
	| {
			[K in keyof TextOperations]: {
				operation: K;
				payload: TextOperations[K];
			};
	  }[keyof TextOperations]
	| {
			[K in keyof BlockOperations]: {
				operation: K;
				payload: BlockOperations[K];
			};
	  }[keyof BlockOperations]
);

export type Plugin = (editor: Edytor) => {
	marks?: Record<string, Snippet<[MarkSnippetPayload<any>]>>;
	blocks?: Record<string, Snippet<[BlockSnippetPayload<any>]>>;
	hotkeys?: Partial<Record<HotKeyCombination, HotKey>>;
	onBeforeChange?: (payload: ChangePayload) => void;
	placeholder?: Snippet<[{ block: Block; text: Text }]>;
	onEnter?: (paylaod: { prevent: Prevent; e: InputEvent }) => void;
	onTab?: (paylaod: { prevent: Prevent; e: KeyboardEvent }) => void;
};

export type InitializedPlugin = ReturnType<Plugin>;

export type Rules = {
	headingBlock?: string;
	trailingBlock?: string;
	defaultBlock?: string | ((payload: ChangePayload) => string);
	maximumNesting?: number | ((payload: ChangePayload) => number);
	blockRules?: Record<string, BlockRules>;
};

export type BlockRules = {
	headingBlock?: string;
	trailingBlock?: string;
	defaultBlock?: string | ((payload: ChangePayload) => string);
	allowedBlockTypes?: string[];
	minBlocks?: number;
	maxBlocks?: number;
	maxLength?: number;
};
