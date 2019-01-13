  queue()
            .defer(d3.csv, "/housing_data/Social Housing Construction Status Report Q1 2018.csv")
            .defer(d3.json, "/housing_data/esb_connections.json")
            .await(makeGraphs, makeGraphs_2);
        
        function makeGraphs(error, housingData) {
            var ndx = crossfilter(housingData);
            
            
          
            
            var LA_dim = ndx.dimension(dc.pluck('LA'));
            var total_number_of_units = LA_dim.group().reduceSum(dc.pluck('Units'));
            dc.pieChart('#number_of_units_per_LA')
                .height(400)
                .radius(300)
                .transitionDuration(1500)
                .dimension(LA_dim)
                .group(total_number_of_units);
            
            var funding_programme_dim = ndx.dimension(dc.pluck('Funding Programme'));
            var total_number_of_units_per_funding_programme = funding_programme_dim.group().reduceSum(dc.pluck('Units'));
            dc.pieChart('#number_of_units_per_funding_programme')
                .height(400)
                .radius(300)
                .transitionDuration(1500)
                .dimension(funding_programme_dim)
                .group(total_number_of_units_per_funding_programme);
                
           
     
                
          var size_dimension = ndx.dimension(function (d) {
            if (d.Units > 100)
                return "Large development";
            else if (d.Units > 50)
                return "Large/Medium development";
            else if (d.Units > 25)
                return "Medium development";
            else if (d.Units > 10)
                return "Small development";
            else
                return "Very small development";
        });
        
        var devSizeColors = d3.scale.ordinal()
        .domain(["Large Development","Medium Development","Small Development"])
        .range(["red", "orange", "blue"]);
        
        var size_group = size_dimension.group();
        dc.pieChart('#pie-chart')
            .height(650)
             .transitionDuration(500)
            .radius(600)
            .colors(devSizeColors)
            .dimension(size_dimension)
            .group(size_group);
            
             var size_dimension = ndx.dimension(function (d) {
            if (d.Units > 50)
                return "Large and medium development";
            else
                return "Small development"
        });
        var size_group = size_dimension.group();
        dc.pieChart('#pie-chart-2')
            .height(400)
            .radius(300)
            .dimension(size_dimension)
            .group(size_group);
   
            
        var name_dim = ndx.dimension(dc.pluck('LA'));
        var total_spend_per_person = name_dim.group().reduceSum(dc.pluck('Units'));
        dc.rowChart("#LA_rowChart")
            .width(800)
            .height(2000)
            .margins({top: 10, right: 50, bottom: 30, left: 50})
            .dimension(name_dim)
            .group(total_spend_per_person)
            .transitionDuration(500)
            .x(d3.scale.ordinal())
            /*.xUnits(dc.units.ordinal)*/
            /*.xAxisLabel("Units")*/
            .elasticX(true)
            .xAxis().ticks(10);
            
         
          var name_dim = ndx.dimension(dc.pluck('Approved Housing Body'));
        var total_spend_per_person = name_dim.group().reduceSum(dc.pluck('Units'));
        dc.rowChart("#AHB_rowChart")
            .width(800)
            .height(2000)
            .margins({top: 10, right: 50, bottom: 30, left: 50})
            .dimension(name_dim)
            .group(total_spend_per_person)
            .transitionDuration(500)
            .x(d3.scale.ordinal())
            /*.xUnits(dc.units.ordinal)*/
            /*.xAxisLabel("Units")*/
            .elasticX(true)
            .xAxis().ticks(10);
            
            
         
        var completion_date = ndx.dimension(dc.pluck('Completed'));
        var total_units = name_dim.group().reduceSum(dc.pluck('Units'));
        dc.rowChart('#completed_rowChart')
            .width(800)
            .height(2000)
            .margins({top: 10, right: 50, bottom: 30, left: 50})
            .dimension(completion_date)
            .group(total_units)
            .transitionDuration(500)
            .x(d3.scale.ordinal())
            /*.xUnits(dc.units.ordinal)*/
            /*.xAxisLabel("Units")*/
            .elasticX(true)
            .xAxis().ticks(10);
            
        function makeGraphs_2(error, esb_connectionsData) {
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