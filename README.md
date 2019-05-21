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

An image tag with `data-filter` attribute is filter name.

```html
<img src="./my-picture.png" data-filter="1977" />
```

#### JavaScript

Initalize to apply CSS filter to All targets has `data-filter` attribute.

```js
import Ccgram from "cc-gram";

const ccgram = new Ccgram();
```

---

Manual apply CSS filter

`applyFilter()`

```js
ccgram.applyFilter();
```

All available filter name list

`filterNameList`

```js
const { filterNameList } = ccgram;
```

Add filter to filter list

`applyFilter(filterName, filterSetting)`

```js
ccgram.applyFilter("my-filter", { saturate: 0.8 });
```

---

### Access Filter image

Get the target.

```js
const target = document.querySelector('img[data-filter="1977"]');
```

#### Data URL

`getDataUrl(elment[, option])`

```js
const dataUrl = await ccgram.getDataUrl(target);
```

#### Blob

`getBlob(elment[, option])`

```js
const blob = await ccgram.getBlob(target, {
  type: "image/jpeg",
  quality: 0.8
});
```

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
