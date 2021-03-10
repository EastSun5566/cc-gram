# CCgram

[![NPM Version](https://img.shields.io/npm/v/cc-gram.svg?style=for-the-badge)](https://www.npmjs.com/package/cc-gram)
[![NPM Downloads](https://img.shields.io/npm/dt/cc-gram.svg?style=for-the-badge)](https://www.npmjs.com/package/cc-gram)
[![Build Status](https://img.shields.io/github/workflow/status/EastSun5566/cc-gram/Test/master.svg?style=for-the-badge)](https://github.com/EastSun5566/cc-gram/actions?query=workflow%3ATest)
[![License](https://img.shields.io/github/license/EastSun5566/cc-gram.svg?style=for-the-badge)](https://github.com/EastSun5566/cc-gram/blob/master/LICENSE)

> 🖼 A CSS & Canvas Instagram filters based on CSSgram

🔗 <https://eastsun5566.github.io/cc-gram/>

![Demo GIF](./demo/demo.gif)

## 🤔 The Why

> [CSSgram](https://github.com/una/CSSgram) is a great CSS filters library, but sometimes you want to access/download the filter image. Then CCgram comes into the play. It uses CSS to preview filters and draw filter images with canvas filter API when you need it.

## ✨ Installation

```sh
npm i cc-gram
```

## 🚀 Usage

### Apply CSS filter

#### HTML

> An image tag with `data-filter` attribute is filter name

```html
<img src="./my-picture.png" data-filter="1977" />
```

#### JavaScript

> Initialize to apply CSS filter to All targets has `data-filter` attribute

```js
import CCGram from "cc-gram";

const cg = new CCGram();
```

```js
// or you can turn off init apply
const cg = new CCGram({ init: false });

// you can also specify data attribute
// i.e., <img data-my-attr="1977">
const cg = new CCGram({ dataAttribute: "my-attr" });
```

---

##### Manual apply CSS filter

> `applyFilter()`

```js
// apply to All targets has `data-filter` attribute
cg.applyFilter();

// or you can just use selector for performance
cg.applyFilter("#my-image");
```

##### All available filter name list

> `filterNames`

```js
const { filterNames } = cg;
```

- Default filter Name list:

  - `aden`
  - `inkwell`
  - `reyes`
  - `gingham`
  - `toaster`
  - `walden`
  - `hudson`
  - `earlybird`
  - `mayfair`
  - `lofi`
  - `1977`
  - `brooklyn`
  - `xpro2`
  - `nashville`
  - `lark`
  - `moon`
  - `clarendon`
  - `willow`
  - `rise`
  - `slumber`
  - `brannan`
  - `valencia`
  - `maven`
  - `stinson`
  - `amaro`

##### Add / Set filter to filter list

> `setFilter(name, setting)`

- name: `string` - The filter name
- setting: `object` - The filter setting

```js
cg.setFilter("my-filter", {
  saturate: 0.8,
  contrast: 1.2,
});
```

- Available setting key (all value is number):

  - `blur`
  - `brightness`
  - `contrast`
  - `grayscale`
  - `hue-rotate`
  - `invert`
  - `saturate`
  - `sepia`

##### Remove filter from filter list

> `removeFilter(name)`

- name: `string` - The filter name

```js
cg.removeFilter("my-filter");
```

---

### Access Filter image

```js
const image = document.querySelector('img[data-filter="1977"]');
```

#### Data URL

> `getDataURL(image[, options = {}])`

```js
const dataUrl = await cg.getDataURL(image);
```

#### Blob

> `getBlob(image[, options = {}])`

```js
const blob = await cg.getBlob(image, {
  type: "image/jpeg",
  quality: 0.8,
});
```

- Options

  - type: `string` - MIME types, default is `image/png`,
  - quality: `number`- [0 - 1], default is `0.92`

## 🔧 Development

```sh
# install dep
npm i

# fix style
npm run lint

# run test
npm test

# build for prod
npm run build
```
