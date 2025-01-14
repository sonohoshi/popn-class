# popn-class

팝클래스에 포함되는 곡 목록을 보여주는 스크립트입니다.  
코나미 베이직 코스에 가입되어있지 않으면 곡 데이터를 가져올 수 없어 사용이 불가능합니다.
![example](https://user-images.githubusercontent.com/48484989/192114398-5cca3b43-75c2-49a1-8d09-57966b8f37a8.png)


# 사용 방법

1. 다음의 스크립트를 북마크에 추가해주세요.

```
javascript: void !function(e){var t=e.createElement("script");t.type="text/javascript",t.src="///cdn.jsdelivr.net/gh/sonohoshi/popn-class@v0.2/dist/bundle.js",e.head.appendChild(t)}(document);
```

![add script to bookmark](readme_1.png)

2. [팝픈 웹페이지](https://p.eagate.573.jp/game/popn/unilab/playdata/index.html)에서 로그인 뒤, 북마크를 클릭합니다.

# Contribute

Issue 혹은 Pull Request로 부탁드려요.

## Dependencies

1. yarn
2. webpack
3. webpack-cli

## Build

```
yarn build // or yarn build:watch
```

## Test

유닛테스트가 없습니다... 수동으로 테스트 해주셔야 합니다.

## PR때 주의점

github상의 파일을 호스트하는 CDN [jsdelivr](https://cdn.jsdelivr.net/)를 사용해 배포하고 있으므로, 'dist/bundle.js'도 함께 커밋해 주세요.
