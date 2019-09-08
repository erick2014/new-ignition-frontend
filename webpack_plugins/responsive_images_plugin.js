const imagemin = require('imagemin');
const jimp = require('jimp')
const merge = require('webpack-merge')
const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')

class ResponsiveImagesPlugin {
    constructor(options = {}) {

      this.mimeTypes = {
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
      }

      const defaults = {
        bypassOnDebug: false,
        disable:  false,
        defaultDimensions: [360, 700, 1600]
      }
      this.options = merge(defaults, options)

      //imagemin optimizers
      this.imageminPlugins = [];
      if (options.gifsicle) {
        this.imageminPlugins.push(require('imagemin-gifsicle')(this.options.gifsicle))
      }
      if (this.options.mozjpeg) {
        this.imageminPlugins.push(require('imagemin-mozjpeg')(this.options.mozjpeg))
      }
      if (this.options.svgo) {
        this.imageminPlugins.push(require('imagemin-svgo')(this.options.svgo))
      } 
      if (this.options.pngquant) {
        this.imageminPlugins.push(require('imagemin-pngquant')(this.options.pngquant))
      }
      if (this.options.optipng) {
        this.imageminPlugins.push(require('./imagemin-optipng')(this.options.optipng))
      }
      // optional optimizers
      if (this.options.webp) {
        this.imageminPlugins.push(require('imagemin-webp')(this.options.webp))
      }

    }

    apply(compiler) {
      compiler.hooks.emit.tapAsync('ResponsiveImagesPlugin', (compilation, callback) => {
        const entries = Array.from(compilation.entrypoints.entries())
        const images = []
        entries.forEach(([entry, v], i, _entries) => {
          // console.log(k)
          v.chunks.forEach((chunk, j, _chunks) => {

            const path = chunk.entryModule.resource
            if ( (/\.(png|jpe?g)$/i).test(path)) {
              images.push({
                entry,
                resource: chunk.entryModule.resource,
              })
            }
          })
        })

        images.forEach((o, index) => {
          let parsed = this.parseEntry(o.entry)
          let dimensions = parsed.dimensions
          if (dimensions.length === 0) {
            dimensions = this.options.defaultDimensions
          }
          jimp.read(o.resource, (err, img) => {
            if (err) {
              console.log('***ERROR READING IMAGE', o.resource, err)
            }
            dimensions.forEach((width, k) => {
              const scale = width / img.bitmap.width
              const finished = index === images.length - 1

              // if extension is specified like image.jpg@width1,width2 then force conversion otherwise keep origina
              let fileext = path.extname(o.resource)
              let _output = parsed.output
              if ((/\.(gif|png|jpe?g|svg)$/i).test(parsed.output)) {
                fileext = path.extname(parsed.output)
                _output = parsed.output.replace(/\.[^/.]+$/, "")
              }
              this.transform(
                img.clone(),
                scale,
                path.join(compiler.outputPath, `${_output}-${width}${fileext}`),
                callback,
                finished)
            })
          })
        })
      });
    }

    parseEntry(s) {
      let dimensions = s.split('@')
      if (dimensions.length === 1) {
        return []
      }
      try {
        return {
          dimensions: dimensions[dimensions.length - 1].split(',').map(x => parseInt(x)),
          output: dimensions[0]
        }
      } catch (err) {
        return []
      }
    }

    getMimeType (name) {
      const result = this.mimeTypes[path.extname(name)] || 'image/jpeg'
      console.log(name, result)
      return result
    }

    transform(img, scale, name, callback, finished) {
      img.scale(scale, (err, scaled) => {
        scaled.getBuffer(this.getMimeType(name), (err, buffer) => {
          imagemin.buffer(buffer, {
            plugins: this.imageminPlugins
          })
          .then(data => {
            if (!fs.existsSync(path.dirname(name))) {
              console.log('** mkdirp', path.dirname(name))
              mkdirp(path.dirname(name))
            }
            fs.writeFileSync(name, data)
            if (finished) {
              callback(null, data)
            }
          })
          .catch(err => {
            console.log('IMAGEMIN ERR', err)
            if (finished) {
              callback(err);
            }
          });
        } )
      })
    }
  }
  
  module.exports = ResponsiveImagesPlugin;