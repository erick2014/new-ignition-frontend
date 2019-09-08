'use strict';
const execBuffer = require('exec-buffer');
const isPng = require('is-png');
const optipng = require('optipng-bin');

module.exports = options => async buffer => {
	options = {
		optimizationLevel: 3,
		bitDepthReduction: true,
		colorTypeReduction: true,
		paletteReduction: true,
		...options
	};

	if (!Buffer.isBuffer(buffer)) {
		throw new TypeError('Expected a buffer');
	}

	if (!isPng(buffer)) {
		return buffer;
	}

	const arguments_ = [
		'-strip',
		'all',
		'-clobber',
		'-fix',
		'-o',
		options.optimizationLevel,
		'-out',
		execBuffer.output
	];

	if (!options.bitDepthReduction) {
		arguments_.push('-nb');
	}

	if (!options.colorTypeReduction) {
		arguments_.push('-nc');
	}

	if (!options.paletteReduction) {
		arguments_.push('-np');
    }
    
    if (options.progressive || options.interlace) {
        arguments_.push('-i')
        arguments_.push('1')
    }    

	arguments_.push(execBuffer.input);

	return execBuffer({
		input: buffer,
		bin: optipng,
		args: arguments_
	});
};
