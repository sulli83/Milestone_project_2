  /*template for beginning of d3 graph block*/
    
    queue()
        .defer(d3.json, "/housing_data/esb_connections.json")
        .await(makeGraphs, );
    function makeGraphs(error, esb_connectionsData) {
        var ndx = crossfilter(esb_connectionsData);
        
        var parseDate = d3.time.format("%Y").parse;
        esb_connectionsData.forEach(function(d){
            d.date = parseDate(d.date);
        });
        
        var date_dim = ndx.dimension(dc.pluck('date'));
        var minDate = date_dim.bottom(1)[0].date;
        var maxDate = date_dim.top(1)[0].date;
        function units_by_owner(owner) {
            return function(d) {
                if (d.owner === owner) {
                    return +d.units;
                } else {
                    return 0;
                }
            }
        }
        var PrivateUnitsByDate = date_dim.group().reduceSum(units_by_owner('Private'));
        var SocialUnitsByDate = date_dim.group().reduceSum(units_by_owner('Social'));
        
       
        var compositeChart = dc.compositeChart('#esb-composite-chart');
        compositeChart
            .width(990)
            .height(200)
            .dimension(date_dim)
            .x(d3.time.scale().domain([minDate, maxDate]))
            .yAxisLabel("units")
            .xAxisLabel("date")
            .legend(dc.legend().x(80).y(20).itemHeight(13).gap(5))
            .renderHorizontalGridLines(true)
            .compose([
                dc.lineChart(compositeChart)
                    .colors('green')
                    .group(PrivateUnitsByDate, 'Private'),
                dc.lineChart(compositeChart)
                    .colors('red')
                    .group(SocialUnitsByDate, 'Social')
               ])
            .brushOn(false)
            .render();
            
        /*functions and variables for private and social houses*/
        
        
        var date_dim = ndx.dimension(dc.pluck('date'));
        var minDate = date_dim.bottom(1)[0].date;
        var maxDate = date_dim.top(1)[0].date;
        function units_by_name(name) {
            return function(d) {
                if (d.name === name) {
                    return +d.units;
                } else {
                    return 0;
                }
            }
        }
        var LAunitsByDate = date_dim.group().reduceSum(units_by_name('LA'));
        var SocunitsByDate = date_dim.group().reduceSum(units_by_name('Soc'));
        
        var PrivunitsByDate = date_dim.group().reduceSum(units_by_name('Priv'));
        var compositeChart = dc.compositeChart('#composite-chart-1');
        compositeChart
            .width(990)
            .height(200)
            .dimension(date_dim)
            .x(d3.time.scale().domain([minDate, maxDate]))
            .yAxisLabel("units")
            .xAxisLabel("date")
            .legend(dc.legend().x(80).y(20).itemHeight(13).gap(5))
            .renderHorizontalGridLines(true)
            .compose([
                dc.lineChart(compositeChart)
                    .colors('green')
                    .group(LAunitsByDate, 'SocialHousing - Local Authority'),
                dc.lineChart(compositeChart)
                    .colors('red')
                    .group(SocunitsByDate, 'Social Housing - Voluntary & Co-operative Housing'),
                dc.lineChart(compositeChart)
                    .colors('blue')
                    .group(PrivunitsByDate, 'Private Ownership')
            ])
            .brushOn(false)
            .render();
   
        
        dc.renderAll();
    }