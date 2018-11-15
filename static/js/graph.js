queue()
    .defer(d3.csv, "data/champions.csv")
    .await(makeGraphs);
    
function makeGraphs(error, championsData) {
    var ndx = crossfilter(championsData);
    
    prefered_style(ndx);
    champions_nationality(ndx);
    
    
    dc.renderAll();
}

function prefered_style(ndx) {
    var dim = ndx.dimension(dc.pluck('style'));
    var group = dim.group();
    
    dc.barChart("#champions_style")
        .width(700)
        .height(300)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(dim)
        .group(group)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .xAxisLabel("Prefered Style")
        .yAxis().ticks(20);
}

function champions_nationality(ndx) {
    var dim = ndx.dimension(dc.pluck('nationality'));
    var group = dim.group();
    
    dc.barChart("#nationality_of_champions")
        .width(700)
        .height(300)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(dim)
        .group(group)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .xAxisLabel("Fighters Nationality")
        .yAxis().ticks(20);
}

