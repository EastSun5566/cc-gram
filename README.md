# CCgram

> 🖼 A CSS & Canvas Instagram filters based on CSSgram

## ✨ Install

```sh
npm i cc-gram

# or yarn add cc-gram
```

## 🚀 Usage

```html
<img src="./my-picture.png" id="my-picture" data-filter="1977" />
```

Apply CSS filter to All targets

```js
import Ccgram from "cc-gram";

const ccgram = new Ccgram();
```

Get the data url of target

```js
const target = document.getElementById("my-picture");

const dataUrl = await ccgram.getDataUrl(target);
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
