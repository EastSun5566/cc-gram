# CCgram

> 🖼 A CSS & Canvas Instagram filters based on CSSgram

## ✨ Install

```sh
npm i cc-gram

# or yarn add cc-gram
```

## 🚀 Usage

```html
<!-- 
  An image tag with data-filter attribute
-->
<img src="./my-picture.png" id="my-picture" data-filter="1977" />
```

```js
import Ccgram from "cc-gram";

// Initalize to apply CSS filter to All targets with data-filter attribute
const ccgram = new Ccgram();

// get all filter name list
const { filterNameList } = ccgram;

// Manual apply CSS filter
ccgram.applyFilter();
```

```js
const target = document.querySelector('img[data-filter="1977"]');

// Get the data url of target
const dataUrl = await ccgram.getDataUrl(target);

// Get the blob of target
const blob = await ccgram.getBlob(target);

// download the target
ccgram.download(target);
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
