# gml2geojson
wfs gml to geojson

## CDN
```html
<script src="https://cdn.jsdelivr.net/npm/gml2geojson/dist/gml2geojson.js"></script>

<script>

    fetch('./data').then(res=>res.text()).then(xml=>{
        const geojson=gml2geojson.parseGML(xml);
    })
</script>

```

## NPM

```shell
npm i gml2geojson
# or
yarn add gml2geojson

```


```js

import {parseGML} from 'gml2geojson';

const geojson=parseGML(xml);

```