#!/usr/bin/env node

const { strictEqual } = require('assert');
const { resolve, join } = require('path');
const typescriptPaths = require('../dist').default;

const transform = (path) => path.replace(/\.ts$/i, '.cjs.js');

const plugin = typescriptPaths({ tsConfigPath: resolve(__dirname, 'tsconfig.json') });

const pluginNonAbs = typescriptPaths({ tsConfigPath: resolve(__dirname, 'tsconfig.json'), absolute: false });

const pluginTransform = typescriptPaths({ tsConfigPath: resolve(__dirname, 'tsconfig.json'), transform });

const pluginDontPreserveExtensions = typescriptPaths({
	tsConfigPath: resolve(__dirname, 'tsconfig.json'),
	preserveExtensions: false,
});

try {
	strictEqual(plugin.resolveId('@asdf', ''), null);
	strictEqual(plugin.resolveId('\0@foobar', ''), null);
	strictEqual(plugin.resolveId('@foobar', ''), join(__dirname, 'foo', 'bar.ts'));
	strictEqual(plugin.resolveId('@foobar-react', ''), join(__dirname, 'foo', 'bar-react.tsx'));
	strictEqual(plugin.resolveId('@bar/foo', ''), join(__dirname, 'bar', 'foo.ts'));
	strictEqual(plugin.resolveId('@js', ''), join(__dirname, 'js', 'index.js'));

	strictEqual(pluginNonAbs.resolveId('@foobar', ''), join('test', 'foo', 'bar.ts'));

	strictEqual(pluginTransform.resolveId('@foobar', ''), join(__dirname, 'foo', 'bar.cjs.js'));

	strictEqual(pluginDontPreserveExtensions.resolveId('@foobar', ''), join(__dirname, 'foo', 'bar.js'));
	strictEqual(pluginDontPreserveExtensions.resolveId('@foobar-react', ''), join(__dirname, 'foo', 'bar-react.js'));

	console.log('PASSED');
} catch (error) {
	throw error;
}
