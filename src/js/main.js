import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import '../css/style.css';
import * as d3 from 'd3';

(async () => {
    const mapElm = document.getElementById('map');
    const updateTimestamp = document.getElementById('update-timestamp');
    const endemicAreaRes = await fetch('./data/endemic-area.json');
    const endemicArea = await endemicAreaRes.json();

    updateTimestamp.innerText = `最終更新日時: ${endemicArea.timestamp}`;

    mapElm.style.height = `${mapElm.offsetWidth}px`;
    const width = mapElm.offsetWidth;
    const height = mapElm.offsetWidth;
    const centerPos = [137.0, 38.2];
    const scale = mapElm.offsetHeight * 2.5;

    const projection = d3
        .geoMercator()
        .center(centerPos)
        .translate([width / 2, height / 2])
        .scale(scale);

    const path = d3.geoPath().projection(projection);

    const svg = d3
        .select('#map')
        .append('svg')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('width', '100%')
        .attr('height', '100%');

    const geoJson = await d3.json('./data/japan.geo.json');

    svg
        .selectAll('path')
        .data(geoJson.features)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('stroke', '#666')
        .attr('stroke-width', 0.25)
        .attr('fill', '#AD232F')
        .attr('fill-opacity', item => {
            if (endemicArea.area.includes(item.properties.name_ja)) {
                return 1.0;
            } else {
                return 0.0;
            }
        });
})();