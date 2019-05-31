// @TODO: YOUR CODE HERE!
/*setup all the items that don't require data*/
// svg container
const height = 600;
const width = 1000;
let XAxis = 'poverty'
// let test = parseFloat(d[XAxis])


// max with and max height

// margins
const margin = {
    top: 50,
    right: 50,
    bottom: 100,
    left: 100
};

// chart area minus margins
const chartHeight = height - margin.top - margin.bottom;
const chartWidth = width - margin.left - margin.right;

// create svg container
const svg = d3.select('#scatter').append('svg')
    .attr('height', height)
    .attr('width', width)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)
    .attr('id', 'bar_chart');

const labelsGroup = svg.append('g')
    .attr('transform', `translate(${width / 2}, ${chartHeight + 20})`);


// Add Y axis label grouping
svg.append('g')
    .attr('transform', `translate(-25, ${chartHeight / 2}) rotate(-90)`)
    .append('text')
    .attr('x', 0)
    .attr('y', 0)
    .attr('value', 'healthcare')
    .text('Healthcare');


// X axis label grouping
labelsGroup.append('text')
    .attr('x', 0)
    .attr('y', 20)
    .attr('value', 'poverty') // value to grab for event listener
    .text('Poverty');

// Define update functions that will be called when user selection is made
function xScale_update(data, XAxis) {
    /* Generate yScale based on selected value */

    const xLinearScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d[XAxis])])
        .range([0, chartWidth]);

    return xLinearScale
}

function renderAxes(newXScale, xAxis_g) {
    /*Update xAxis with new scale value */

    const bottomAxis = d3.axisBottom(newXScale);

    xAxis_g.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis_g;
}

function UpdateBars(circleGroup, newXScale) {
    /* function used for updating circles group by clicking on event listener */
    circleGroup
        .transition()
        .duration(1000)
        .attr('cx', d => newXScale(d[XAxis]));

    return;
}

// Tooltip HTML declaration
const toolTip = d3.select('body').append('div')
  .attr('class', 'd3-tip');

d3.csv('/assets/data/data.csv')
    .then(function (health_poverty_data) {
        console.log(health_poverty_data)
        // Y axis: Testing to see if there is a string vs integer
        let ymin = d3.min(health_poverty_data.map(d => parseFloat(d['healthcare'])));
        let ymax = d3.max(health_poverty_data.map(d => parseFloat(d['healthcare'])));

        console.log(`YAxis max info ${ymax}`)
        console.log(typeof (ymax));
        console.log(`YAxis min info ${ymin}`)
        console.log(typeof (ymin)); //End test


        const yScale = d3.scaleLinear()
            // .domain([0, d3.max(health_poverty_data.map(d => parseFloat(d['healthcare'])))])
            .domain([ymin, ymax])
            .range([chartHeight, 0]);

        // X axis: Testing to see if there is a string vs integer

        let xmin = d3.min(health_poverty_data, d => parseFloat(d[XAxis]))
        let xmax = d3.max(health_poverty_data, d => parseFloat(d[XAxis]))

        console.log(`XAxis max${xmax}`)
        console.log(typeof (xmax));
        console.log(`YAxis min info ${xmin}`)
        console.log(typeof (xmin)); //End test


        const xScale = d3.scaleLinear()
            // .domain([0, d3.max(health_poverty_data, d => parseFloat(d[XAxis]))])
            // .domain([0, d3.max(health_poverty_data, d => d[XAxis])])
            .domain([xmin, xmax])
            .range([0, chartWidth])

        // Create axes for Svg
        const yAxis_func = d3.axisLeft(yScale);
        const xAxis_func = d3.axisBottom(xScale);

        // set x to the bottom of the chart
        let xAxis_g = svg.append('g')
            .attr('id', 'xaxis')
            .attr('transform', `translate(0, ${chartHeight})`)
            .call(xAxis_func);

        // Assign YAxis to variable so we can update it later
        svg.append('g')
            .attr('id', 'yaxis')
            .call(yAxis_func);

        let checkP = health_poverty_data[0].poverty
        console.log(checkP)
        console.log(typeof (checkP))



        const circleGroup = svg.selectAll('circle')
            .data(health_poverty_data)
            .enter()
            .append('circle')
            // .attr('cx', d => d['poverty'])
            .attr('cx', d => xScale(parseFloat(d['poverty'])))
            // .attr('cy', d => d['healthcare'])
            .attr('cy', d => yScale(d['healthcare']))
            .attr('r', 8)
            .classed('moreInfo', true)
            // .attr('fill', d => [d['abbr']]);
            .attr('fill', 'green')

            // const toolTip = d3.select('body').append('div')
            // .attr('class', 'tooltip');
        
            circleGroup.on('mouseover', function(d, i){
                d3.select(this)
                .transition()
                .duration(300) 
                .attr('r', 10)
                .attr('fill', 'orange')
                .attr('text', d => d['abbr'])
                toolTip.style('display', 'block');

                toolTip.html(
                  `State abrv: <strong> ${d['abbr']}</strong>`
                )
                  .style('left', d3.event.pageX + 'px')
                  .style('top', d3.event.pageY + 'px');

            })

            circleGroup.on('mouseout', function(){
                d3.select(this)
                .transition()
                .attr('r', 8)
                .attr('fill', 'green')
                toolTip.style('display', 'none');

            })

           
               
             

    })