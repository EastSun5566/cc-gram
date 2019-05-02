# CCgram

> 🖼 A CSS & Canvas Instagram filters based on CSSgram

---

[![Build Status](https://travis-ci.org/EastSun5566/cc-gram.svg?branch=master)](https://travis-ci.org/EastSun5566/cc-gram)

## ✨ Install

```sh
npm i cc-gram

# or yarn add cc-gram
```

## 🚀 Usage

### Apply filter

- HTML

```html
<!-- 
  An image tag with data-filter attribute,
  whitch is Filter name
  -->
<img src="./my-picture.png" data-filter="1977" />
```

- JavaScript

```js
import Ccgram from "cc-gram";

// Initalize to apply CSS filter to All targets whitch has data-filter attribute
const ccgram = new Ccgram();
```

### Access Filter image

```js
const target = document.querySelector('img[data-filter="1977"]');

// Get the data url of target
const dataUrl = await ccgram.getDataUrl(target);

// Get the blob of target
const blob = await ccgram.getBlob(target);

// download the target
ccgram.download(target);
```

### Else

```js
// get all available filter name list
const { filterNameList } = ccgram;

// Manual apply CSS filter
ccgram.applyFilter();
```

## 🔧 Develop

```sh
# Install dependencies
yarn

# Fix style
yarn lint

# Run test
yarn test

# Build for production
yarn build
```
