# CCgram

[![Build Status](https://travis-ci.org/EastSun5566/cc-gram.svg?branch=master)](https://travis-ci.org/EastSun5566/cc-gram)

> 🖼 A CSS & Canvas Instagram filters based on CSSgram

## ✨ Install

```sh
npm i cc-gram
```

or

```sh
yarn add cc-gram
```

## 🚀 Usage

### Apply CSS filter

#### HTML

##### An image tag with `data-filter` attribute is filter name

```html
<img src="./my-picture.png" data-filter="1977" />
```

#### JavaScript

##### Initalize to apply CSS filter to All targets has `data-filter` attribute

```js
import Ccgram from "cc-gram";

const ccgram = new Ccgram();
```

---

##### Manual apply CSS filter

`applyFilter()`

```js
ccgram.applyFilter();
```

##### All available filter name list

`filterNames`

```js
const { filterNames } = ccgram;
```

##### Add / Set filter to filter list

`setFilter(name, setting)`

- name: `string` - The filter name
- setting: `object` - The filter setting

```js
ccgram.setFilter("my-filter", {
  saturate: 0.8,
  contrast: 1.2
});
```

Available setting key (all value is number):

- blur
- brightness
- contrast
- grayscale
- hue-rotate
- invert
- saturate
- sepia

##### Remove filter from filter list

`removeFilter(name)`

- name: `string` - The filter name

```js
ccgram.removeFilter("my-filter");
```

---

### Access Filter image

```js
const target = document.querySelector('img[data-filter="1977"]');
```

#### Data URL

`getDataUrl(elment[, options = {}])`

```js
const dataUrl = await ccgram.getDataUrl(target);
```

#### Blob

`getBlob(elment[, options = {}])`

```js
const blob = await ccgram.getBlob(target, {
  type: "image/jpeg",
  quality: 0.8
});
```

##### Options

- type: `string` - MIME types, default is `image/png`,
- quality: `number`- [0 - 1], default is `0.92`

## 🔧 Develop

### Install dependencies

```sh
yarn
```

### Fix style

```sh
yarn lint
```

### Run test

```sh
yarn test
```

### Build for production

```sh
yarn build
```
