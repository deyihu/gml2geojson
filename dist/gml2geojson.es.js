/*!
 * gml2geojson v0.0.1
 * LICENSE : MIT
 * */
const parser = new DOMParser();
const GEONODENAMES = ['geometryproperty', 'shape'];

function parseGML(str) {
    const geojson = {
        type: 'FeatureCollection',
        features: []
    };
    const xmlDoc = parser.parseFromString(str, 'text/xml');
    const featureCollectionEle = xmlDoc.children[0];
    if (!featureCollectionEle || !featureCollectionEle.nodeName || getNodeName(featureCollectionEle).indexOf('featurecollection') === -1) {
        return geojson;
    }
    let i = 0;
    const features = [];
    while (featureCollectionEle.children.item(i)) {
        const featureEle = featureCollectionEle.children.item(i);
        const nodeName = getNodeName(featureEle);
        if (nodeName.indexOf('featuremember') > -1 && featureEle.children[0]) {
            features.push(featureEle.children[0]);
        }
        i++;
    }
    for (let i = 0, len = features.length; i < len; i++) {
        const f = features[i];
        const properties = getFeatureEleProperties(f);
        const geometry = getFeatureEleGeometry(f, properties.isShape);
        if (!geometry || !properties) {
            continue;
        }
        const feature = {
            type: 'Feature',
            geometry,
            properties
        };
        geojson.features.push(feature);

    }
    return geojson;
}

function getFeatureEleGeometry(featureEle, isShape) {
    const children = featureEle.children || [];
    let type;
    let coordinates = [];
    for (let i = 0, len = children.length; i < len; i++) {
        const node = children[i];
        const nodeName = getNodeName(node);
        if (!isGeoAttribute(nodeName)) {
            continue;
        }
        if (node.children[0]) {
            type = node.children[0].nodeName.split('gml:')[1] || '';
            if (!type) {
                return;
            }
        }
        if (node.children[0].children[0]) {
            const nodeName = getNodeName(node.children[0].children[0]);
            let geoNodes = node.children;
            if (isMulti(nodeName)) {
                geoNodes = flatMultiGeoNodes(geoNodes);
            }
            if (!geoNodes.length) {
                return;
            }
            for (let j = 0, len1 = geoNodes.length; j < len1; j++) {
                const geoNode = geoNodes[j];
                let coords = parseGeoCoordinates(geoNode.children, isShape);
                if (!geoIsPolygon(type)) {
                    coords = coords[0];
                }
                coordinates.push(coords);
            }
            if (coordinates.length === 1) {
                coordinates = coordinates[0];
            }
        }
    }
    if (!type || !coordinates.length) {
        return;
    }
    return {
        type,
        coordinates
    };
}

function getFeatureEleProperties(featureEle) {
    const children = featureEle.children || [];
    const properties = {};
    let isShape = false;
    for (let i = 0, len = children.length; i < len; i++) {
        const node = children[i];
        const nodeName = getNodeName(node);
        if (isGeoAttribute(nodeName)) {
            if (nodeName.indexOf('shape') > -1) {
                isShape = true;
            }
            continue;
        }
        const key = nodeName.split(':')[1];
        if (!key) {
            continue;
        }
        const value = node.textContent || '';
        properties[key] = value;
    }
    properties.isShape = isShape;
    return properties;
}

function flatMultiGeoNodes(nodes) {
    const geoNodes = [];
    for (let i = 0, len = nodes.length; i < len; i++) {
        const children = nodes[i].children;
        for (let j = 0, len1 = children.length; j < len1; j++) {
            geoNodes.push(children[j].children[0]);
        }
    }
    return geoNodes;
}

function isMulti(nodeName) {
    return nodeName.indexOf('member') > -1;
}

function isGeoAttribute(nodeName) {
    for (let i = 0, len = GEONODENAMES.length; i < len; i++) {
        if (nodeName.indexOf(GEONODENAMES[i]) > -1) {
            return true;
        }
    }
    return false;
}

function parseGeoCoordinates(coordNodes, isShape) {
    const coordiantes = [];
    for (let i = 0, len = coordNodes.length; i < len; i++) {
        const coordNode = findCoordsNode(coordNodes[i]);
        coordiantes.push(parseCoordiantes(coordNode.textContent, isShape));
    }
    return coordiantes;
}

function parseCoordiantes(text, isShape) {
    if (!text) {
        return;
    }
    const split = ' ';
    const coords = text.split(split);
    let [c1, c2] = coords;
    if (c1.indexOf(',') > -1) {
        const coordinates = [];
        for (let i = 0, len = coords.length; i < len; i++) {
            const c = coords[i];
            let [lng, lat] = c.split(',');
            lng = trim(lng);
            lat = trim(lat);
            coordinates.push([lng, lat]);
        }
        return coordinates.length > 1 ? coordinates : coordinates[0];
    } else {
        c1 = trim(c1);
        c2 = trim(c2);
        if (isShape) {
            return [c2, c1];
        }
        return [c1, c2];
    }
}

function trim(str) {
    const BLANK = ' ';
    while (str.indexOf(BLANK) > -1) {
        str = str.replace(BLANK, '');
    }
    return parseFloat(str);
}

function findCoordsNode(node) {
    let nodeName = getNodeName(node);
    while (nodeName.indexOf(':coordinates') === -1 && nodeName.indexOf(':pos') === -1) {
        node = node.children[0];
        nodeName = getNodeName(node);
    }
    return node;
}

function getNodeName(node) {
    return (node.nodeName || '').toLocaleLowerCase();
}

function geoIsPolygon(type) {
    return type.indexOf('Polygon') > -1;
}

export { parseGML };

typeof console !== 'undefined' && console.log('gml2geojson v0.0.1');
