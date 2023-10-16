import React, { useEffect, useRef } from 'react';
import * as d3 from "d3";

// Renders a simple force directed graph
// Quite hard to get this right, with transitions etc and make it performant
// I think it's OK currently but has some bugs.
// https://observablehq.com/@d3/modifying-a-force-directed-graph

const colorScheme = [
    '#ffe081', // yellow
    '#f89767', // orange
    '#c890c0', // purple
    '#57C7E3', // blue
    '#F16667', // red
    '#D9C8AE', // tan
    '#8DCC93', // green
    '#ECB5C9', // pink
    '#4C8EDA', // dark blue
    '#FFC454', // light orange
    '#DA7194', // light pink
    '#569480', // dark green
    '#848484', // grey
    '#D9D9D9', // light grey
]


const renderChart = (svgRef, data) => {
    if (!svgRef || !data) return 
    
    const width = document.getElementById('graph').clientWidth - 30;
    const height = window.innerHeight - (document.getElementById('navbar').clientHeight + 30);
    let color = d3.scaleOrdinal(colorScheme)
    let links = data.links.map(d => Object.create(d));
    let zoomLevel = 1;
    let nodes = data.nodes.map(d => ({ ...d })); //.map(d => Object.create(d));
    
    const svg = d3.select(svgRef)
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [-width / 2, -height / 2, width, height]);
    const lineColor = "#848484"

    // Define an arrowhead in the SVG
    const markerBoxWidth = 30;
    const markerBoxHeight = 30;
    const refX = 25;
    const refY = 5;
    const arrowPoints = [[0, 0], [0, 10], [10, 5]];
    svg
        .append('defs')
        .append('marker')
        .attr('id', 'arrow')
        .attr('viewBox', [0, 0, markerBoxWidth, markerBoxHeight])
        .attr('refX', refX)
        .attr('refY', refY)
        .attr('markerWidth', markerBoxWidth)
        .attr('markerHeight', markerBoxHeight)
        .attr('markerUnits', 'userSpaceOnUse')
        .attr('orient', 'auto-start-reverse')
        .append('path')
        .attr('d', d3.line()(arrowPoints))
        .style("fill", lineColor)
        .attr('stroke', lineColor);

    // console.log(links)
    const simulation = d3.forceSimulation(nodes)
        .force("charge", d3.forceManyBody().strength(-400))
        .force("link", d3.forceLink(links).id(d => d.id).distance(100))
        .force("x", d3.forceX())
        .force("y", d3.forceY())
        // .force("center", d3.forceCenter(0, 0))
        .on("tick", ticked)

    let link = svg.select('g.links').selectAll(".link-group");

    let node = svg.select('g.nodes').selectAll(".node");

    function ticked() {
        node
            .selectAll('circle')
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)

        node.selectAll('text')
            .attr("x", d => d.x)
            .attr("y", d => d.y)
            .style('font-size', d => computeFontSize(d));

        link.selectAll('line')
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y)
            .attr('marker-end', 'url(#arrow)')
        
        link.selectAll('circle')
            .attr('cx', d => {
                // console.log(d)
                return (d.source.x + d.target.x) / 2
            })
            .attr('cy', d => {
                return (d.source.y + d.target.y) / 2
            })
            // .attr('tranform', (d) => {
            //     var len = link.selectAll('line').node().getTotalLength();
            //     var offset = 0;
            //     var p = link.selectAll('line').node().getPointAtLength(len-offset)
            //     return "translate("+[p.x,p.y]+")";
            // })



        // handle zoom
        // var t = d3.zoomTransform(svg.node());

        // link.attr("transform", t);
        // node.attr("transform", t);
        // node.selectAll('circle').attr("transform", t);
        // node.selectAll('text').attr("transform", t)

    }

    // Zoom
    function zoomed({ transform }) {
        node.selectAll('circle').attr("transform", transform)
        node.select('text').attr("transform", transform)
            .style('font-size', d => computeFontSize(d));
        link.selectAll('line')
            .attr("transform", transform)
            .attr("x1", d => d.source.x)
            .attr("x2", d => d.target.x)
            .attr("y1", d => d.source.y)
            .attr("y2", d => d.target.y)
        link.selectAll('circle')
            .attr("transform", transform)
            // .attr('cx', d => (d.source.x + d.target.x) / 2)
            // .attr('cy', d => (d.source.y + d.target.y) / 2)
        zoomLevel = parseFloat(transform.k).toFixed(2);
    }
    svg.call(d3.zoom()
        .extent([[0, 0], [width, height]])
        .scaleExtent([0.5, 1.5])
        .on("zoom", zoomed));

    // Reheat the simulation when drag starts, and fix the subject position.
    function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
    }

    // Update the subject (dragged node) position during drag.
    function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
    }

    // Restore the target alpha so the simulation cools after dragging ends.
    // Unfix the subject position now that it’s no longer being dragged.
    function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
    }

    const computeFontSize = (d) => {
        if (zoomLevel < 0.9) {
            return '0'
        } else {
            return 'calc(1px + 1vmin)'
        }
    }

    Object.assign(svg.node(), {
        emitParticles({ x, y, dx = 0, dy = 0, count = 100 }) {
            // const g = svg.append("g")
            //     .attr("transform", `translate(${x},${y})`)
            //     .attr("fill", color(Math.random() * 360));

            // return d3.range(count).map(() => {

            //     const v = [dx + (Math.random() - 0.5) * 10, dy + (Math.random() - 0.5) * 10];
            //     const r = 4 + Math.random() * 6;
            //     const p = [0, 0];
            //     const circle = g.append("circle");

            //     return d3.timer((elapsed) => {
            //         p[0] += v[0];
            //         p[1] += v[1];
            //         circle.attr("cx", p[0]).attr("cy", p[1]).attr("r", r);
            //         if (p[0] < -r || p[0] > width + r || p[1] < -r || p[1] > height + r) {
            //             circle.remove();
            //             return true;
            //         }
            //     }
            //     );
            // });
        },
        update({nodes, links}) {
        const old = new Map(node.data().map(d => [d.id, d]));
        nodes = nodes.map(d => Object.assign(old.get(d.id) || {}, d));
        links = links.map(d => Object.assign({}, d));

        simulation.nodes(nodes, d => d.id);
        simulation.force("link").links(links, d => `${d.source.id}\t${d.target.id}`);
        simulation.alpha(1).restart();

        node = node
        .data(nodes, d => d.id)
        .join(
            enter => {
                let group = enter
                    .append("g")
                    .attr('class', 'cursor-pointer')
                    .attr('style', 'cursor: pointer')
                    .on('click', (event, d) => {
                        window.open(`/migrations/products/${d.id}`, '_blank')
                    })
                group
                    .call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended))

                group
                    .append("circle")
                    .attr("fill", d => color(d.group))
                    .attr("stroke", "#fff")
                    .attr("stroke-width", 1.5)              
                    .attr('class', d => `${d.id}`)
                    .transition()
                    .duration(100)
                    .attr("r", 15)
                    
                    // .attr("transform", d => `translate(${d.x},${d.y}) scale(${zoomLevel})`);

                
                group
                    .append("text")
                    .text(d => d.id)
                    .attr("text-anchor", "middle")
                    .attr("dy", ".35em")
                    .style("stroke", "black")
                    .style("stroke-width", "0.1px")
                    .style('font-size', d => computeFontSize(d))
                    .attr("fill", d => 'black')
                    .attr('x', d => d.x)
                    .attr('y', d => d.y)
                    // .attr("transform", d => `translate(${d.x},${d.y}) scale(${zoomLevel})`);

                // console.log('entering this', group)

                return group
            },
            update => {
                update.select('text')
                    .attr("x", d => d.x)
                    .attr("y", d => d.y)
                    .style('font-size', d => computeFontSize(d))
                    // .attr("transform", d => `translate(${d.x},${d.y}) scale(${zoomLevel})`);

                update.selectAll('circle')
                .attr("cx", d => d.x)
                .attr("cy", d => d.y)
                .attr("r", 15)
                // .attr("transform", d => `translate(${d.x},${d.y}) scale(${zoomLevel})`);

                return update
            },
            exit => {
                exit.selectAll('text').remove()
                exit.selectAll('circle')
                    .transition()
                    .duration(130)
                    .attr("r", 0)
                    .remove()
                exit.transition().duration(130).remove()
                return exit
            },
            )
            .attr('class', d => `node ${d.id} ${d.group}`)

        link = link
        .data(links, d => `${d.source.id}\t${d.target.id}`)
        .join(
            enter => {
                const lineGroup = enter.append('g')
                    .attr('class', d => `link-group ${d.source.id}-${d.target.id}`)
                    
                lineGroup.append('line')
                    .attr('class', d => `link ${d.source.id}-${d.target.id}`)
                    .attr('stroke', lineColor)
                    .attr('stroke-width', 1.5)
                    .attr('stroke-dasharray', '10 2')
                    .attr("opacity", 0.75)
                    .attr("x1", d => d.source.x)
                    .attr("x2", d => d.target.x)
                    .attr("y1", d => d.source.y)
                    .attr("y2", d => d.target.y)
                    .attr('marker-end', 'url(#arrow)')
                
                // lineGroup
                //     // Add a <circle> element to the <g> for each migration
                //     // the speed at which the circle moves down the line is determined by the number of migrations
                //     // (d.fromCount). The more migrations, the faster the circle moves down the line.
                //     .append('circle')
                //     .attr('class', d => `particle ${d.source.id}-${d.target.id} speed=${d.fromCount}`)
                //     .attr('cx', d => (d.source.x + d.target.x) / 2)
                //     .attr('cy', d => (d.source.y + d.target.y) / 2)
                //     .attr('r', 2)
                //     .attr('fill', lineColor)
                //     .attr('stroke', lineColor)
                //     .attr('stroke-width', 1)
                //     .attr('opacity', 0.5)


                // Add a <circle> element to the <g> for each particle (representing a single migration)
                // half way down the line
                // lineGroup
                //     .selectAll('circle')
                //     .data(d => {
                //         let key = `${d.source.id},${d.target.id}`;
                        
                //     })                
                return lineGroup
            },
            update => {
                update.selectAll('line')
                    .attr("x1", d => d.source.x)
                    .attr("x2", d => d.target.x)
                    .attr("y1", d => d.source.y)
                    .attr("y2", d => d.target.y)
                update.selectAll('circle')
                    .attr('cx', d => (d.source.x + d.target.x) / 2)
                    .attr('cy', d => (d.source.y + d.target.y) / 2)
                    .attr('r', 2)
                    .attr('fill', lineColor)
                    .attr('stroke', lineColor)

                    // .attr("transform", d => `translate(${d.x},${d.y}) scale(${zoomLevel})`);
                return update
            },
            exit => {
                return exit.remove()
                
                exit
                .selectAll('line')
                // .transition()
                // .duration(100)
                .attr("stroke-opacity", 0)
                // .attrTween("x1", function(d) { return function() { return d.source.x; }; })
                // .attrTween("x2", function(d) { return function() { return d.target.x; }; })
                // .attrTween("y1", function(d) { return function() { return d.source.y; }; })
                // .attrTween("y2", function(d) { return function() { return d.target.y; }; })
                .remove()
                // console.log('exited')
                exit.remove()
                return exit
            }
        )

        d3.selectAll("line")
        .each(animate);

    }

    
    })

    function animate(){
        d3.select(this)
          .transition()
          .ease(d3.easeLinear)
          .duration(1000)
          .styleTween("stroke-dashoffset", d => {
            return d3.interpolate(d.fromCount * 12, 0);
          })
          .on("end", animate);
      }
  
      

    return svg.node();

}
const Simple = ({ data }) => {
    document.title = "Migrations | Graph"
    // removing duplicate links
    let visitedLinks = new Set();
    data.links = data.links.filter(d => {
        if (visitedLinks.has(`${d.source}-${d.target}`)) {
            return false;
        } else {
            visitedLinks.add(`${d.source}-${d.target}`);
            return true;
        }
    })
    const svgRef = useRef();
    // useEffect is called on every render, the SVG is not recreated, so D3 can manage the contents
    let navbarHeight = 0
    if (document.getElementById('navbar')) {
        navbarHeight = document.getElementById('navbar').clientHeight
    } else {
        navbarHeight = 62
    }
    
    const height = window.innerHeight // - (navbarHeight);

    useEffect(() => {
        let node = renderChart(svgRef.current, data)
        node.update(data)
        node.emitParticles({ x: 0, y: 0, dx: 0, dy: 0, count: 100 })
    }, [data])
    return (
        <div><svg height={height} ref={svgRef}>
            <g className="links"></g>    
            <g className="nodes"></g>
        </svg></div>
    );
};

export default Simple;
