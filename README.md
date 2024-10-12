<img src="./logo.webp" alt="CCgram Logo" width="180">

# 🖼 CCgram

[![NPM Version](https://img.shields.io/npm/v/cc-gram.svg?style=for-the-badge)](https://www.npmjs.com/package/cc-gram)
[![NPM Downloads](https://img.shields.io/npm/dt/cc-gram.svg?style=for-the-badge)](https://www.npmjs.com/package/cc-gram)
![JSR Version](https://img.shields.io/jsr/v/%40eastsun5566/cc-gram?style=for-the-badge)
[![Test Status](https://img.shields.io/github/actions/workflow/status/EastSun5566/cc-gram/test.yml?style=for-the-badge)](https://github.com/EastSun5566/cc-gram/actions/workflows/test.yml)
[![License](https://img.shields.io/github/license/EastSun5566/cc-gram.svg?style=for-the-badge)](https://github.com/EastSun5566/cc-gram/blob/main/LICENSE)

[<img src="https://cdn.buymeacoffee.com/buttons/v2/default-blue.png" alt="Buy Me A Coffee" height="40">](https://www.buymeacoffee.com/eastsun5566)

> A CSS & Canvas Instagram filter inspired by CSSgram

🔗 <https://eastsun5566.github.io/cc-gram/>

![Demo GIF](./demo.gif)

## 🤔 Why

> [CSSgram](https://github.com/una/CSSgram) is an excellent CSS filter library. However, there are instances where you might need to access or download the image with filter. This is where CCgram comes into play. It enables you to preview filter using pure CSS and draw them with Canvas whenever you need to.

- On-Demand: Utilizes CSS for previewing and draws with the Canvas API as needed
- Non-Blocking: Images are drawn on a Web Worker using `OffscreenCanvas` & `ImageBitmap`

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
import { createFilter } from "cc-gram";

const filter = createFilter();
```

```js
// or you can turn off init apply
const filter = createFilter({ init: false });

// you can also specify data attribute
// i.e., <img data-my-attr="1977">
const filter = createFilter({ dataAttribute: "my-attr" });
```

---

##### Manual apply CSS filter

> `applyFilter()`

```js
// apply to All targets has `data-filter` attribute
filter.applyFilter();

// or you can just use selector for performance
filter.applyFilter("#my-image");
```

##### All available filter name list

> `filterNames`

```js
const filterNames = filter.filterNames;
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

##### Add / Set filter to the filter list

> `setFilter(name, setting)`

- name: `string` - The filter name
- setting: `object` - The filter setting

```js
filter.setFilter("my-filter", {
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

##### Remove the filter from the filter list

> `removeFilter(name)`

- name: `string` - The filter name

```js
filter.removeFilter("my-filter");
```

---

### Access image with filter

```js
const image = document.querySelector('img[data-filter="1977"]');
```

#### Data URL

> `getDataURL(image[, options = {}])`

```js
const dataUrl = await filter.getDataURL(image);
```

#### Blob

> `getBlob(image[, options = {}])`

```js
const blob = await filter.getBlob(image, {
  type: "image/jpeg",
  quality: 0.8,
});
```

- Options

  - type: `string` - MIME types, defaults to `image/png`,
  - quality: `number`- [0 - 1], defaults to `0.92`

## 🔧 Development

```sh
# install deps
pnpm i

# fix style
pnpm run lint

# run test
pnpm test

# build for prod
pnpm run build
```
