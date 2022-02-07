# gml2geojson
wfs gml to geojson

```html
<script src="https://cdn.jsdelivr.net/npm/gml2geojson/dist/gml2geojson.js"></script>

<script>

    fetch('./data').then(res=>res.text()).then(xml=>{
        const geojson=gml2geojson.parseGML(xml);
    })
</script>

```

```js
import {parseGML} from 'gml2geojson';

const geojson=parseGML(xml);

```